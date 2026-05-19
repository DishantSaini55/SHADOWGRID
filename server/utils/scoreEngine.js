function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function hasExternalUrl(commands = []) {
  return commands.some((command) => /https?:\/\//i.test(command));
}

export function calculateScore(sessionData = {}) {
  const behavior = sessionData.behavior || {};
  const geo = sessionData.geo || {};
  const credentialsAttempted = normalizeArray(sessionData.credentialsAttempted);
  const specialCharsDetected = normalizeArray(sessionData.specialCharsDetected);
  const terminalCommands = normalizeArray(sessionData.terminalCommands);
  const pagesVisited = normalizeArray(behavior.pagesVisited || sessionData.pagesVisited);
  const interactions = normalizeArray(sessionData.interactions);

  const scoreBreakdown = [];
  let score = 0;

  const addRule = (signal, points, reason) => {
    score += points;
    scoreBreakdown.push({ signal, points, reason });
  };

  if (behavior.mouseMovementDetected === false) {
    addRule('mouse_movement', 25, 'No mouse movement was detected during the session');
  }

  if (typeof behavior.avgKeystrokeSpeed === 'number' && behavior.avgKeystrokeSpeed > 0 && behavior.avgKeystrokeSpeed < 50) {
    addRule('keystroke_speed', 20, 'Keystroke timing suggests automated or highly scripted input');
  }

  if (specialCharsDetected.length > 0) {
    addRule('special_chars', 20, 'Special characters were entered into monitored inputs');
  }

  if (behavior.pasteDetected) {
    addRule('paste_detected', 10, 'Paste activity was detected in a credential field');
  }

  if (behavior.rightClickAttempted) {
    addRule('right_click', 5, 'Right-click interaction was attempted');
  }

  if (credentialsAttempted.length > 3) {
    addRule('multiple_credentials', 15, 'Multiple credential submissions were observed');
  }

  if (geo.torDetected) {
    addRule('tor', 30, 'Traffic was associated with a Tor exit node');
  }

  if (geo.vpnDetected) {
    addRule('vpn', 10, 'Traffic was associated with a VPN provider');
  }

  if (geo.datacenterIP) {
    addRule('datacenter', 15, 'Source IP appears to come from a datacenter or hosting provider');
  }

  if (terminalCommands.length > 0) {
    addRule('terminal_usage', 20, 'Terminal interaction indicates deeper probing');
  }

  if (terminalCommands.some((command) => /\bsudo\b/i.test(command))) {
    addRule('sudo_usage', 25, 'sudo usage was observed in terminal commands');
  }

  if (terminalCommands.some((command) => /wget|curl|bash -i|\bnc\s|python/i.test(command)) || hasExternalUrl(terminalCommands)) {
    addRule('remote_execution', 30, 'Commands suggest external fetch or remote execution behavior');
  }

  score = Math.min(score, 100);

  const uniqueUsernames = new Set(credentialsAttempted.map((item) => item.username).filter(Boolean));
  const uniquePasswords = new Set(credentialsAttempted.map((item) => item.password).filter(Boolean));
  const hasMouse = behavior.mouseMovementDetected === true;
  const humanSpeed = typeof behavior.avgKeystrokeSpeed === 'number' && behavior.avgKeystrokeSpeed >= 50;
  const hasFormSubmissions = credentialsAttempted.length > 0 || interactions.some((item) => item.type && String(item.type).includes('submit'));
  const multipleUniqueCreds = uniqueUsernames.size > 1 || uniquePasswords.size > 1;
  const sameUsernameManyPasswords = uniqueUsernames.size === 1 && uniquePasswords.size > 3;
  const advancedIndicators = terminalCommands.length > 0 && (terminalCommands.some((command) => /\bsudo\b/i.test(command)) || terminalCommands.some((command) => /wget|curl|bash -i|\bnc\s|python/i.test(command)) || hasExternalUrl(terminalCommands));
  const manyPagesVisited = pagesVisited.length >= 4;

  let attackerType = 'Unknown';

  if (!hasMouse && typeof behavior.avgKeystrokeSpeed === 'number' && behavior.avgKeystrokeSpeed < 50 && interactions.length <= 1) {
    attackerType = 'Bot';
  } else if (specialCharsDetected.length > 0) {
    attackerType = 'SQL Injection';
  } else if (behavior.pasteDetected && multipleUniqueCreds) {
    attackerType = 'Credential Stuffer';
  } else if (sameUsernameManyPasswords) {
    attackerType = 'Brute Force';
  } else if (manyPagesVisited && !hasFormSubmissions) {
    attackerType = 'Recon';
  } else if (hasMouse && humanSpeed && hasFormSubmissions) {
    attackerType = 'Human Attacker';
  } else if (advancedIndicators) {
    attackerType = 'Advanced';
  }

  return {
    score,
    breakdown: scoreBreakdown,
    attackerType
  };
}
