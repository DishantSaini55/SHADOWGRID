import { useEffect, useState, useRef } from 'react';
import { sessionTracker } from '../utils/analytics';
import { Terminal as TerminalIcon } from 'lucide-react';

export default function Terminal() {
  const [commands, setCommands] = useState([
    { type: 'system', text: 'NexaCorp Security Terminal v2.4.1' },
    { type: 'system', text: 'Type "help" for available commands' }
  ]);
  const [input, setInput] = useState('');
  const terminalRef = useRef(null);

  useEffect(() => {
    sessionTracker.recordPageView('terminal');
    return () => {
      sessionTracker.recordPageExit();
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    sessionTracker.recordInteraction('terminal_command', 'input', { command: trimmed });

    const newCommands = [...commands, { type: 'input', text: `$ ${cmd}` }];

    if (trimmed === 'help') {
      newCommands.push(
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '  login      - Attempt login' },
        { type: 'output', text: '  whoami     - Current user' },
        { type: 'output', text: '  ls         - List directory' },
        { type: 'output', text: '  cat        - Read file' },
        { type: 'output', text: '  ssh        - Remote connection' },
        { type: 'output', text: '  exit       - Exit terminal' }
      );
    } else if (trimmed === 'whoami') {
      newCommands.push({ type: 'output', text: 'root@nexacorp:/# ' });
    } else if (trimmed === 'ls') {
      newCommands.push(
        { type: 'output', text: 'documents  logs  config  backup  security' }
      );
    } else if (trimmed === 'cat config') {
      newCommands.push(
        { type: 'output', text: '[database]' },
        { type: 'output', text: 'host = 192.168.1.100' },
        { type: 'output', text: 'port = 5432' },
        { type: 'output', text: '[credentials]' },
        { type: 'output', text: 'admin_key = ••••••••' }
      );
    } else if (trimmed === 'ssh server-01') {
      newCommands.push(
        { type: 'output', text: 'Connecting to server-01...' },
        { type: 'output', text: 'Connected. Press any key...' }
      );
      sessionTracker.recordInteraction('ssh_attempt', 'terminal');
    } else if (trimmed === 'login') {
      newCommands.push(
        { type: 'output', text: 'Username: ' }
      );
      sessionTracker.recordInteraction('login_attempt', 'terminal');
    } else if (trimmed === 'exit') {
      newCommands.push({ type: 'output', text: 'Goodbye.' });
    } else if (trimmed === '') {
      // Do nothing for empty input
    } else {
      newCommands.push({ type: 'error', text: `Command not found: ${cmd}` });
    }

    setCommands(newCommands);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    }
  };

  return (
    <div className="px-4 sm:px-6 pb-12">
      <div className="container-shell premium-card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 to-blue-950 text-white p-6 flex items-center space-x-3 border-b border-slate-800">
          <TerminalIcon size={28} />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Security Terminal</h1>
            <p className="text-blue-200 text-sm">Internal system access</p>
          </div>
        </div>

        {/* Terminal */}
        <div
          ref={terminalRef}
          className="bg-slate-950 text-green-400 font-mono text-sm p-6 overflow-y-auto max-h-96 rounded-b-xl border-t border-slate-800"
          style={{ fontFamily: 'Courier New, monospace' }}
        >
          {commands.map((cmd, idx) => (
            <div key={idx} className={`mb-2 ${
              cmd.type === 'input' ? 'text-white font-semibold' :
              cmd.type === 'error' ? 'text-red-400' :
              cmd.type === 'system' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {cmd.text}
            </div>
          ))}

          {/* Input Line */}
          <div className="flex items-center">
            <span className="text-green-400 mr-2">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              className="flex-1 bg-transparent outline-none text-white"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border-t border-slate-200 p-6">
          <p className="text-blue-900 text-sm">
            This is a demonstration terminal. Try commands like <code className="bg-blue-100 px-2 py-1 rounded text-xs font-semibold">help</code>, <code className="bg-blue-100 px-2 py-1 rounded text-xs font-semibold">ls</code>, or <code className="bg-blue-100 px-2 py-1 rounded text-xs font-semibold">whoami</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
