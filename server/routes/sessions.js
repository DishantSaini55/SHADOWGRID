import express from 'express';
import Session from '../models/Session.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', async (req, res) => {
  try {
    const totalSessions = await Session.countDocuments();
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [todaySessions, uniqueIPs, criticalThreats, vpnDetected, avgScoreAgg, attackerTypesAgg, topCountriesAgg, hourlyAgg] = await Promise.all([
      Session.countDocuments({ createdAt: { $gte: cutoff } }),
      Session.distinct('ipAddress'),
      Session.countDocuments({ threatScore: { $gte: 60 } }),
      Session.countDocuments({ 'geo.vpnDetected': true }),
      Session.aggregate([{ $group: { _id: null, avgThreatScore: { $avg: '$threatScore' } } }]),
      Session.aggregate([{ $group: { _id: '$attackerType', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Session.aggregate([
        { $group: { _id: '$geo.country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Session.aggregate([
        { $match: { createdAt: { $gte: cutoff } } },
        { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } }
      ])
    ]);

    const hourlyAttacks = new Array(24).fill(0);
    hourlyAgg.forEach((item) => {
      if (typeof item._id === 'number') {
        hourlyAttacks[item._id] = item.count;
      }
    });

    return res.json({
      totalSessions,
      todaySessions,
      uniqueIPs: uniqueIPs.length,
      criticalThreats,
      vpnDetected,
      attackerTypes: attackerTypesAgg.map((item) => ({ attackerType: item._id || 'Unknown', count: item.count })),
      topCountries: topCountriesAgg.map((item) => ({ country: item._id || 'Unknown', count: item.count })),
      avgThreatScore: avgScoreAgg[0]?.avgThreatScore || 0,
      hourlyAttacks
    });
  } catch (error) {
    console.error('Stats route error:', error);
    return res.status(500).json({ error: 'Failed to load stats' });
  }
});

router.get('/export', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 }).lean();
    res.setHeader('Content-Disposition', `attachment; filename=shadowgrid-sessions-${Date.now()}.json`);
    return res.json(sessions);
  } catch (error) {
    console.error('Export route error:', error);
    return res.status(500).json({ error: 'Failed to export sessions' });
  }
});

router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const { type, country, minScore, maxScore, vpn } = req.query;

    const filter = {};

    if (type) filter.attackerType = type;
    if (country) filter['geo.country'] = country;
    if (minScore || maxScore) {
      filter.threatScore = {};
      if (minScore) filter.threatScore.$gte = Number(minScore);
      if (maxScore) filter.threatScore.$lte = Number(maxScore);
    }
    if (vpn === 'yes') filter['geo.vpnDetected'] = true;
    if (vpn === 'no') filter['geo.vpnDetected'] = false;

    const total = await Session.countDocuments(filter);
    const sessions = await Session.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({
      sessions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Sessions list route error:', error);
    return res.status(500).json({ error: 'Failed to load sessions' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.id }).lean();

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    return res.json(session);
  } catch (error) {
    console.error('Session detail route error:', error);
    return res.status(500).json({ error: 'Failed to load session' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Session.findOneAndDelete({ sessionId: req.params.id });

    if (!deleted) {
      return res.status(404).json({ error: 'Session not found' });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Session delete route error:', error);
    return res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;
