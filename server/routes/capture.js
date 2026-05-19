import express from 'express';
import Session from '../models/Session.js';
import { geoLookup } from '../utils/geoLookup.js';
import { vpnDetect } from '../utils/vpnDetect.js';
import { calculateScore } from '../utils/scoreEngine.js';
import { getIO } from '../socket.js';

const router = express.Router();

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    return String(forwardedFor).split(',')[0].trim();
  }

  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '';
}

router.post('/', async (req, res) => {
  try {
    const sessionData = req.body || {};
    const sessionId = sessionData.sessionId;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const ipAddress = getClientIp(req);
    const geoData = await geoLookup(ipAddress);
    const vpnData = vpnDetect(ipAddress, geoData.isp || '', geoData.org || '');

    const normalizedSession = {
      ...sessionData,
      ipAddress,
      geo: {
        ...(sessionData.geo || {}),
        country: geoData.country || sessionData.geo?.country || '',
        city: geoData.city || sessionData.geo?.city || '',
        isp: geoData.isp || sessionData.geo?.isp || '',
        lat: geoData.lat ?? sessionData.geo?.lat ?? null,
        lon: geoData.lon ?? sessionData.geo?.lon ?? null,
        vpnDetected: vpnData.vpnDetected,
        torDetected: vpnData.torDetected,
        vpnProvider: vpnData.vpnProvider,
        datacenterIP: vpnData.datacenterIP
      }
    };

    const scoredSession = calculateScore(normalizedSession);
    const timestamp = Date.now();

    let session = await Session.findOne({ sessionId });

    const updatePayload = {
      sessionId,
      ipAddress,
      geo: normalizedSession.geo,
      fingerprint: normalizedSession.fingerprint || {},
      behavior: normalizedSession.behavior || {},
      specialCharsDetected: normalizedSession.specialCharsDetected || [],
      credentialsAttempted: normalizedSession.credentialsAttempted || [],
      mfaAttempted: normalizedSession.mfaAttempted || false,
      emailAttempted: normalizedSession.emailAttempted || '',
      terminalCommands: normalizedSession.terminalCommands || [],
      threatScore: scoredSession.score,
      attackerType: scoredSession.attackerType,
      scoreBreakdown: scoredSession.breakdown,
      stageReached: normalizedSession.stageReached || 1,
      interactions: normalizedSession.interactions || [],
      hiddenPathsVisited: normalizedSession.hiddenPathsVisited || [],
      updatedAt: new Date()
    };

    if (session) {
      Object.assign(session, updatePayload);
      await session.save();
    } else {
      session = await Session.create({
        ...updatePayload,
        createdAt: new Date()
      });
    }

    console.log(`New session received: ${sessionId} | score: ${scoredSession.score}`);

    const io = getIO();
    if (io) {
      io.emit('new_session', {
        sessionId,
        ipAddress,
        country: normalizedSession.geo.country || '',
        threatScore: scoredSession.score,
        attackerType: scoredSession.attackerType,
        vpnDetected: normalizedSession.geo.vpnDetected,
        timestamp
      });

      if (scoredSession.score >= 60) {
        console.log(`Critical threat detected: ${sessionId} | score: ${scoredSession.score}`);
        io.emit('critical_alert', {
          sessionId,
          threatScore: scoredSession.score,
          attackerType: scoredSession.attackerType,
          timestamp
        });
      }
    }

    return res.json({ success: true, sessionId });
  } catch (error) {
    console.error('Capture route error:', error);
    return res.status(500).json({ error: 'Failed to capture session data' });
  }
});

export default router;
