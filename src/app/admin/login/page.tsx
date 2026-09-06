'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'credentials' | 'otp' | 'setup';

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep]         = useState<Step>('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp]           = useState(['', '', '', '', '', '']);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  // "I'm not a robot" checkbox
  const [notRobot, setNotRobot] = useState(false);

  // Visitor IP shown as deterrent on the login page
  const [visitorIp, setVisitorIp] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/admin/my-ip')
      .then((r) => r.json())
      .then((d) => setVisitorIp(d.ip))
      .catch(() => {});
  }, []);

  // QR setup state
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [secretCopied, setSecretCopied] = useState(false);

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { usernameRef.current?.focus(); }, []);

  // ─── Step 1: username + password ──────────────────────────────
  async function submitCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!notRobot) {
      setError('Please confirm you are not a robot.');
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Login failed.');
        if (data.remaining !== undefined) setRemaining(data.remaining);
        setLoading(false);
        return;
      }
      if (!data.totpReady) {
        // TOTP not configured yet — show setup
        const qrRes  = await fetch('/api/admin/setup-qr');
        const qrData = await qrRes.json();
        setQrDataUrl(qrData.qrDataUrl);
        setTotpSecret(qrData.secret);
        setStep('setup');
      } else {
        setStep('otp');
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }

  // ─── OTP input handling ────────────────────────────────────────
  function handleOtpChange(i: number, val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 1);
    const next   = [...otp];
    next[i]      = digits;
    setOtp(next);
    if (digits && i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every((d) => d !== '')) submitOtp(next.join(''));
  }

  function handleOtpKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 6) {
      setOtp(digits);
      submitOtp(digits.join(''));
    }
  }

  // ─── Step 2: TOTP ─────────────────────────────────────────────
  async function submitOtp(code: string) {
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Invalid code.');
        if (data.remaining !== undefined) setRemaining(data.remaining);
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => otpRefs.current[0]?.focus(), 50);
        setLoading(false);
        return;
      }
      router.push('/admin/blog');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  function copySecret() {
    navigator.clipboard.writeText(totpSecret);
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2000);
  }

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080c10] flex">

      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, #00C46A0f 0%, transparent 70%), radial-gradient(ellipse at 80% 20%, #00507820 0%, transparent 60%), #080c10' }}>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(circle, #00C46A, transparent)' }} />

        {/* Top logo mark */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00C46A]/15 border border-[#00C46A]/25 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#00C46A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <span className="text-white/50 text-sm font-medium tracking-wide">Akamco Technologies</span>
        </div>

        {/* Centre content */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <p className="text-[#00C46A] text-xs font-semibold uppercase tracking-[0.2em]">Secure Access Portal</p>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Management<br />Console
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Protected area. All sessions are encrypted, monitored, and logged in real time.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['End-to-end encrypted', 'IP restricted', '2FA required', 'Session logged'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-gray-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C46A] flex-shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom notice */}
        <div className="relative z-10">
          <p className="text-gray-600 text-xs">© 2026 Akamco Technologies. Unauthorized access is prohibited.</p>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative">

        {/* Subtle top border accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00C46A]/30 to-transparent" />

        <div className="w-full max-w-[380px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-[#00C46A]/15 border border-[#00C46A]/25 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#00C46A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-white/50 text-sm font-medium">Akamco Technologies</span>
          </div>

          {/* Progress bar */}
          {step !== 'setup' && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] text-gray-500 uppercase tracking-widest">
                  {step === 'credentials' ? 'Step 1 of 2' : 'Step 2 of 2'}
                </span>
                <span className="text-[11px] text-gray-500">
                  {step === 'credentials' ? 'Credentials' : 'Verification'}
                </span>
              </div>
              <div className="h-0.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00C46A] rounded-full transition-all duration-500"
                  style={{ width: step === 'credentials' ? '50%' : '100%' }}
                />
              </div>
            </div>
          )}

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              {step === 'credentials' && 'Welcome back'}
              {step === 'otp'         && 'Verify your identity'}
              {step === 'setup'       && 'Set up 2FA'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {step === 'credentials' && 'Enter your credentials to continue'}
              {step === 'otp'         && 'Enter the 6-digit code from your authenticator app'}
              {step === 'setup'       && 'Scan the QR code to configure your authenticator'}
            </p>
          </div>

          {/* ─── Error banner ─── */}
          {error && (
            <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                {error}
                {remaining !== null && remaining <= 2 && remaining > 0 && (
                  <p className="text-red-400/60 text-xs mt-0.5">{remaining} attempt{remaining !== 1 ? 's' : ''} remaining</p>
                )}
              </div>
            </div>
          )}

          {/* ─── STEP 1: Credentials ─── */}
          {step === 'credentials' && (
            <form onSubmit={submitCredentials} className="space-y-5">

              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-xs text-gray-400 font-medium">Username</label>
                <input
                  ref={usernameRef}
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  required
                  placeholder="Enter username"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-[#00C46A]/50 focus:bg-white/[0.06] transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs text-gray-400 font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    required
                    placeholder="Enter password"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-[#00C46A]/50 focus:bg-white/[0.06] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPw ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* IP warning */}
              {visitorIp && (
                <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-amber-500/[0.06] border border-amber-500/15">
                  <svg className="w-3.5 h-3.5 mt-0.5 text-amber-500/70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className="text-[11px] text-amber-400/70 leading-snug">
                    Connecting from <span className="font-mono font-semibold text-amber-400/90">{visitorIp}</span> — all login attempts are logged.
                  </p>
                </div>
              )}

              {/* Not a robot */}
              <label className="flex items-center gap-3 cursor-pointer select-none group py-1">
                <div
                  onClick={() => { setNotRobot((v) => !v); setError(''); }}
                  className={`relative flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded border transition-all ${
                    notRobot ? 'border-[#00C46A] bg-[#00C46A]' : 'border-gray-600 bg-transparent group-hover:border-gray-500'
                  }`}
                >
                  {notRobot && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-400">I&apos;m not a robot</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 mt-1"
                style={{ background: 'linear-gradient(135deg, #00C46A, #00a055)', boxShadow: '0 0 30px #00C46A25' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span className="text-white">Verifying…</span>
                  </>
                ) : (
                  <>
                    <span className="text-white">Continue</span>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ─── STEP 2: OTP ─── */}
          {step === 'otp' && (
            <div>
              <div className="flex gap-2.5 justify-center mb-7" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    disabled={loading}
                    className="w-12 h-14 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-center text-2xl font-bold focus:outline-none focus:border-[#00C46A]/60 focus:bg-white/[0.07] disabled:opacity-40 transition-all tracking-widest"
                  />
                ))}
              </div>

              {loading && (
                <div className="flex justify-center mb-5">
                  <div className="w-5 h-5 rounded-full border-2 border-[#00C46A]/20 border-t-[#00C46A] animate-spin" />
                </div>
              )}

              <button
                onClick={() => { setStep('credentials'); setOtp(['','','','','','']); setError(''); }}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors py-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to credentials
              </button>
            </div>
          )}

          {/* ─── SETUP: QR Code ─── */}
          {step === 'setup' && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6 text-center space-y-4">
                <p className="text-sm text-gray-300 font-medium">Scan with Google Authenticator or Authy</p>
                {qrDataUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrDataUrl} alt="TOTP QR Code" className="mx-auto rounded-xl w-52 h-52 bg-white p-2" />
                )}
                <div>
                  <p className="text-xs text-gray-600 mb-2">Or enter this key manually</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-black/40 border border-white/[0.06] rounded-lg px-3 py-2 text-[#00C46A] font-mono break-all text-center">
                      {totpSecret}
                    </code>
                    <button
                      onClick={copySecret}
                      className="flex-shrink-0 p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-white transition-colors"
                      title="Copy"
                    >
                      {secretCopied ? (
                        <svg className="w-4 h-4 text-[#00C46A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/15">
                <svg className="w-4 h-4 mt-0.5 text-amber-500/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <div className="text-xs text-amber-400/70 space-y-0.5">
                  <p className="font-semibold text-amber-400/90">Save this key</p>
                  <p>Store it securely. You will need it to recover access if you lose your device.</p>
                </div>
              </div>

              <button
                onClick={() => { setStep('otp'); setTimeout(() => otpRefs.current[0]?.focus(), 100); }}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #00C46A, #00a055)', boxShadow: '0 0 30px #00C46A25' }}
              >
                I&apos;ve scanned it — Continue
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
