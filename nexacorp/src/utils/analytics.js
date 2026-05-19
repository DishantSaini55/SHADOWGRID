// Global session analytics - honeypot signals tracker
export const sessionTracker = {
  sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  startTime: Date.now(),
  pages: [],
  currentPage: null,
  interactions: [],
  scrollDepth: {},
  keystrokeLog: [],
  mouseMovementDetected: false,
  pasteDetected: false,
  rightClickAttempted: false,
  specialCharsDetected: [],
  credentialsAttempted: [],

  recordPageView(page) {
    this.currentPage = page;
    this.pages.push({
      page,
      enteredAt: Date.now(),
      exitedAt: null,
      timeSpent: 0,
      scrollDepth: 0,
      interactions: []
    });
  },

  recordPageExit() {
    if (this.pages.length > 0) {
      const lastPage = this.pages[this.pages.length - 1];
      lastPage.exitedAt = Date.now();
      lastPage.timeSpent = lastPage.exitedAt - lastPage.enteredAt;
    }
  },

  recordInteraction(type, element, value = null) {
    this.interactions.push({
      type,
      element,
      value,
      timestamp: Date.now(),
      page: this.currentPage
    });
  },

  recordScrollDepth(depth) {
    if (this.pages.length > 0) {
      this.pages[this.pages.length - 1].scrollDepth = Math.max(
        this.pages[this.pages.length - 1].scrollDepth,
        depth
      );
    }
  },

  recordKeystroke(field, key, timestamp) {
    const last = this.keystrokeLog[this.keystrokeLog.length - 1];
    const gap = last ? timestamp - last.timestamp : 0;
    this.keystrokeLog.push({
      field,
      key: key.length > 1 ? key : '*',
      gap,
      timestamp
    });
  },

  recordMouseMove() {
    if (!this.mouseMovementDetected) {
      this.mouseMovementDetected = true;
      this.recordInteraction('mouse_movement_detected', 'page');
    }
  },

  recordPaste(field) {
    this.pasteDetected = true;
    this.recordInteraction('paste_detected', field);
  },

  recordRightClick() {
    this.rightClickAttempted = true;
    this.recordInteraction('right_click', 'page');
  },

  recordSpecialChar(field, char) {
    this.specialCharsDetected.push({
      field,
      char,
      timestamp: Date.now()
    });
  },

  recordCredential(username, password) {
    this.credentialsAttempted.push({
      username,
      password,
      timestamp: Date.now()
    });
  },

  recordTerminalCommand(command) {
    this.recordInteraction('terminal_command', command, Date.now());
  },

  getAverageKeystrokeSpeed() {
    const gaps = this.keystrokeLog
      .map(k => k.gap)
      .filter(g => g > 0);
    if (!gaps.length) return 0;
    return Math.round(
      gaps.reduce((a, b) => a + b, 0) / gaps.length
    );
  },

  classifyAttacker() {
    const avgSpeed = this.getAverageKeystrokeSpeed();
    const hasInjection = this.specialCharsDetected.length > 0;
    const hasMouse = this.mouseMovementDetected;
    const attempts = this.credentialsAttempted.length;
    const pagesVisited = this.pages.length;
    const formSubmissions = this.interactions
      .filter(i => i.type === 'login_attempt').length;

    if (!hasMouse && avgSpeed > 0 && avgSpeed < 50)
      return 'Bot';
    if (hasInjection)
      return 'SQL / Injection Attacker';
    if (attempts > 3 && this.pasteDetected)
      return 'Credential Stuffer';
    if (pagesVisited > 3 && formSubmissions === 0)
      return 'Recon / OSINT';
    if (hasMouse && avgSpeed > 100)
      return 'Human Attacker';
    return 'Unknown';
  },

  calculateThreatScore() {
    let score = 0;
    const breakdown = [];
    const avgSpeed = this.getAverageKeystrokeSpeed();

    if (!this.mouseMovementDetected) {
      score += 25;
      breakdown.push({
        signal: 'No mouse movement',
        points: 25,
        reason: 'Likely automated tool'
      });
    }
    if (avgSpeed > 0 && avgSpeed < 50) {
      score += 20;
      breakdown.push({
        signal: 'Inhuman typing speed',
        points: 20,
        reason: `${avgSpeed}ms average gap`
      });
    }
    if (this.specialCharsDetected.length > 0) {
      score += 20;
      breakdown.push({
        signal: 'Injection characters detected',
        points: 20,
        reason: 'SQL or XSS attempt likely'
      });
    }
    if (this.pasteDetected) {
      score += 10;
      breakdown.push({
        signal: 'Paste detected',
        points: 10,
        reason: 'Content pasted into field'
      });
    }
    if (this.rightClickAttempted) {
      score += 5;
      breakdown.push({
        signal: 'Right-click attempted',
        points: 5,
        reason: 'Inspecting page source'
      });
    }
    if (this.credentialsAttempted.length > 3) {
      score += 15;
      breakdown.push({
        signal: 'High attempt count',
        points: 15,
        reason: `${this.credentialsAttempted.length} credential attempts`
      });
    }
    if (this.interactions.some(i => i.type === 'terminal_command')) {
      score += 20;
      breakdown.push({
        signal: 'Terminal accessed',
        points: 20,
        reason: 'Used hidden terminal page'
      });
    }
    if (this.interactions.some(i => i.type === 'sudo_attempt')) {
      score += 25;
      breakdown.push({
        signal: 'Privilege escalation attempt',
        points: 25,
        reason: 'Tried sudo command'
      });
    }

    return {
      score: Math.min(score, 100),
      breakdown,
      attackerType: this.classifyAttacker()
    };
  },

  getSessionData() {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      duration: Date.now() - this.startTime,
      pages: this.pages,
      totalInteractions: this.interactions.length,
      interactions: this.interactions,
      keystrokeLog: this.keystrokeLog,
      avgKeystrokeSpeed: this.getAverageKeystrokeSpeed(),
      mouseMovementDetected: this.mouseMovementDetected,
      pasteDetected: this.pasteDetected,
      rightClickAttempted: this.rightClickAttempted,
      specialCharsDetected: this.specialCharsDetected,
      credentialsAttempted: this.credentialsAttempted,
      threatAssessment: this.calculateThreatScore(),
      fingerprint: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: `${window.screen.width}x${window.screen.height}`,
        cookiesEnabled: navigator.cookieEnabled,
        hash: btoa(
          navigator.userAgent +
          navigator.language +
          window.screen.width +
          window.screen.height +
          Intl.DateTimeFormat().resolvedOptions().timeZone
        ).slice(0, 16)
      }
    };
  }
};

export const useScrollTracking = () => {
  return () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const depth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    sessionTracker.recordScrollDepth(depth);
  };
};