import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { sessionTracker } from '../utils/analytics';

export default function Login() {
  const [stage, setStage] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [countdownTimer, setCountdownTimer] = useState(30);

  useEffect(() => {
    sessionTracker.recordPageView('login');
    return () => sessionTracker.recordPageExit();
  }, []);

  useEffect(() => {
    if (stage === 2 && countdownTimer > 0) {
      const timer = setTimeout(() => setCountdownTimer(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, countdownTimer]);

  const handleStage1Submit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Please enter your credentials');
      return;
    }

    // Record the credential attempt
    sessionTracker.recordCredential(username, password);
    sessionTracker.recordInteraction('login_attempt', 'stage_1', {
      username,
      timestamp: Date.now()
    });

    setError('Incorrect credentials. Please try again.');
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
    setStage(2);
  };

  const handleMFASubmit = (e) => {
    e.preventDefault();
    sessionTracker.recordInteraction('mfa_attempt', 'stage_2', {
      mfaCode,
      timestamp: Date.now()
    });
    setStage(3);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    sessionTracker.recordInteraction('forgot_password_click', 'stage_1');
    setStage(4);
  };

  const handleResetEmail = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    sessionTracker.recordInteraction('password_reset_submit', 'stage_4', {
      email,
      timestamp: Date.now()
    });
    setError('');
    setStage(5);
  };

  const specialKeys = ["'", '"', '-', ';', '<', '>', '='];

  return (
    <div className="px-4 sm:px-6 pb-8">
      <div className="container-shell premium-card overflow-hidden grid lg:grid-cols-2 min-h-[72vh]">

        {/* Left Panel */}
        <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-sky-700 text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div className="mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">N</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">NexaCorp</h1>
            <p className="text-blue-100 text-lg">Enterprise Security Access</p>
          </div>
          <p className="text-blue-100 text-base sm:text-lg mb-6">
            Verified access for authorized personnel. Every login flow is monitored for suspicious behavior.
          </p>
          <div className="space-y-4 text-blue-100 text-sm sm:text-base">
            {[
              'End-to-end encrypted connections',
              'Multi-factor authentication enabled',
              '24/7 security monitoring'
            ].map((text, i) => (
              <div key={i} className="flex items-start space-x-3 bg-white/10 rounded-xl p-3 border border-white/10">
                <CheckCircle size={20} className="mt-1 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex items-center justify-center p-7 sm:p-9 lg:p-12 bg-white">
          <div className="w-full max-w-md">

            {/* Stage 1 — Login */}
            {stage === 1 && (
              <div className={`fade-in ${shaking ? 'shake-animation' : ''}`}>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Sign In</h2>
                <p className="text-slate-600 mb-8">NexaCorp Employee Portal</p>

                <form onSubmit={handleStage1Submit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        sessionTracker.recordInteraction('form_input', 'username');
                      }}
                      onKeyDown={(e) => {
                        sessionTracker.recordKeystroke('username', e.key, Date.now());
                        if (specialKeys.includes(e.key))
                          sessionTracker.recordSpecialChar('username', e.key);
                      }}
                      onPaste={() => sessionTracker.recordPaste('username')}
                      placeholder="Enter your username"
                      className="input-premium px-4 py-3"
                      autoComplete="username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        sessionTracker.recordInteraction('form_input', 'password');
                      }}
                      onKeyDown={(e) => {
                        sessionTracker.recordKeystroke('password', e.key, Date.now());
                        if (specialKeys.includes(e.key))
                          sessionTracker.recordSpecialChar('password', e.key);
                      }}
                      onPaste={() => sessionTracker.recordPaste('password')}
                      placeholder="Enter your password"
                      className="input-premium px-4 py-3"
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberDevice}
                      onChange={(e) => {
                        setRememberDevice(e.target.checked);
                        sessionTracker.recordInteraction('checkbox_toggle', 'remember_device');
                      }}
                      className="w-4 h-4 text-blue-900 rounded border-slate-300"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-slate-700">
                      Remember this device
                    </label>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                      <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-red-800">{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full py-3 font-semibold flex items-center justify-center space-x-2"
                  >
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleForgotPassword}
                    className="text-blue-900 hover:text-sky-700 text-sm font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            )}

            {/* Stage 2 — MFA */}
            {stage === 2 && (
              <div className="fade-in">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                  Two-Factor Authentication
                </h2>
                <p className="text-slate-600 mb-8">
                  Enter the 6-digit code sent to your device ending in **34
                </p>

                <form onSubmit={handleMFASubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      value={mfaCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setMfaCode(val);
                        sessionTracker.recordInteraction('form_input', 'mfa_code');
                      }}
                      onKeyDown={(e) =>
                        sessionTracker.recordKeystroke('mfa', e.key, Date.now())
                      }
                      onPaste={() => sessionTracker.recordPaste('mfa_code')}
                      placeholder="000000"
                      className="input-premium px-4 py-3 text-2xl tracking-[0.45em] text-center"
                      autoFocus
                    />
                  </div>

                  <p className="text-sm text-slate-600 text-center">
                    Code expires in:{' '}
                    <span className="font-semibold text-red-600">{countdownTimer}s</span>
                  </p>

                  <button
                    type="submit"
                    disabled={mfaCode.length !== 6}
                    className="btn-primary w-full py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <span>Verify Code</span>
                    <ArrowRight size={18} />
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() =>
                      sessionTracker.recordInteraction('resend_code_click', 'mfa')
                    }
                    className="text-blue-900 hover:text-sky-700 text-sm font-semibold"
                  >
                    Resend code
                  </button>
                </div>
              </div>
            )}

            {/* Stage 3 — Account Locked */}
            {stage === 3 && (
              <div className="fade-in">
                <div className="p-6 bg-red-50 border border-red-200 rounded-2xl mb-8">
                  <div className="flex items-start space-x-4">
                    <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h2 className="text-xl font-bold text-red-800 mb-2">
                        Too Many Failed Attempts
                      </h2>
                      <p className="text-red-700 mb-4">
                        Your account has been temporarily locked for security.
                        This is a protective measure to keep your account safe.
                      </p>
                      <p className="text-red-700 text-sm mb-3">
                        To regain access, please contact IT Support:
                      </p>
                      <div className="space-y-2 text-red-700 text-sm font-semibold">
                        <p>Email: itsupport@nexacorp.com</p>
                        <p>Phone: +1 (800) 639-2291</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStage(1);
                    setUsername('');
                    setPassword('');
                    setMfaCode('');
                    setError('');
                    setCountdownTimer(30);
                    sessionTracker.recordInteraction('reset_login_form', 'stage_3');
                  }}
                  className="btn-secondary w-full py-3 font-semibold"
                >
                  Return to Login
                </button>
              </div>
            )}

            {/* Stage 4 — Forgot Password */}
            {stage === 4 && (
              <div className="fade-in">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-slate-600 mb-8">
                  Enter your email address and we will send you a reset link
                </p>

                <form onSubmit={handleResetEmail} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        sessionTracker.recordInteraction('form_input', 'reset_email');
                      }}
                      onKeyDown={(e) =>
                        sessionTracker.recordKeystroke('email', e.key, Date.now())
                      }
                      onPaste={() => sessionTracker.recordPaste('reset_email')}
                      placeholder="your.email@nexacorp.com"
                      className="input-premium px-4 py-3"
                      autoFocus
                      autoComplete="email"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                      <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-red-800">{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full py-3 font-semibold flex items-center justify-center space-x-2"
                  >
                    <span>Send Reset Link</span>
                    <ArrowRight size={18} />
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setStage(1);
                      setEmail('');
                      sessionTracker.recordInteraction('back_to_login', 'stage_4');
                    }}
                    className="text-blue-900 hover:text-sky-700 text-sm font-semibold"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}

            {/* Stage 5 — Reset Sent */}
            {stage === 5 && (
              <div className="fade-in text-center">
                <div className="mb-6">
                  <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Email Sent</h2>
                  <p className="text-slate-600">
                    If an account exists with the email{' '}
                    <span className="font-semibold">{email}</span>, you will
                    receive a password reset link shortly.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setStage(1);
                    setEmail('');
                    setUsername('');
                    setPassword('');
                    sessionTracker.recordInteraction('reset_complete_return', 'stage_5');
                  }}
                  className="btn-primary w-full py-3 font-semibold"
                >
                  Return to Sign In
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}