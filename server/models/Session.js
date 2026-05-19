import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true, required: true, index: true },
  ipAddress: String,
  geo: {
    country: String,
    city: String,
    isp: String,
    lat: Number,
    lon: Number,
    vpnDetected: { type: Boolean, default: false },
    torDetected: { type: Boolean, default: false },
    vpnProvider: String,
    datacenterIP: { type: Boolean, default: false }
  },
  fingerprint: {
    hash: String,
    userAgent: String,
    platform: String,
    language: String,
    timezone: String,
    screen: String,
    cookiesEnabled: Boolean
  },
  behavior: {
    mouseMovementDetected: { type: Boolean, default: false },
    avgKeystrokeSpeed: { type: Number, default: 0 },
    pasteDetected: { type: Boolean, default: false },
    rightClickAttempted: { type: Boolean, default: false },
    timeOnSite: { type: Number, default: 0 },
    pagesVisited: [String],
    scrollDepth: mongoose.Schema.Types.Mixed
  },
  specialCharsDetected: [
    {
      field: String,
      char: String,
      timestamp: Number
    }
  ],
  credentialsAttempted: [
    {
      username: String,
      password: String,
      timestamp: Number
    }
  ],
  mfaAttempted: { type: Boolean, default: false },
  emailAttempted: String,
  terminalCommands: [String],
  threatScore: { type: Number, default: 0 },
  attackerType: { type: String, default: 'Unknown' },
  scoreBreakdown: [
    {
      signal: String,
      points: Number,
      reason: String
    }
  ],
  stageReached: { type: Number, default: 1 },
  interactions: [mongoose.Schema.Types.Mixed],
  hiddenPathsVisited: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

sessionSchema.index({ createdAt: -1 });
sessionSchema.index({ threatScore: -1 });
sessionSchema.index({ sessionId: 1 });

sessionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Session', sessionSchema);
