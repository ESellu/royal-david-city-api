/* ── Inject RDCDF reset-password styles ── */
(function () {
    const style = document.createElement('style');
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Josefin+Sans:wght@300;400;500;600&display=swap');

    :root {
      --rp-gold: #C9A035; --rp-gl: #E8C870; --rp-gd: #A07820;
      --rp-dark: #0D0800; --rp-dark2: #160F00;
      --rp-card: #1A1200; --rp-border: rgba(201,160,53,0.2);
      --rp-text: #F5E6B8; --rp-muted: rgba(245,230,184,0.55);
      --rp-red: #E05252; --rp-green: #52C97A;
    }

    html, body {
      background:
        radial-gradient(ellipse at 50% 0%, rgba(201,160,53,0.09) 0%, transparent 60%),
        linear-gradient(160deg, #0D0800, #1A0E00 60%, #0D0800);
      min-height: 100vh;
      color: var(--rp-text);
      font-family: 'Josefin Sans', sans-serif;
    }

    #root {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem 1rem;
    }

    .rp-wrap { width: 100%; max-width: 420px; }

    .rp-logo { text-align: center; margin-bottom: 2.2rem; }
    .rp-logo .rp-logo-img {
      width: 78px; height: 78px;
      border-radius: 50%;
      object-fit: cover;
      border: 2.5px solid var(--rp-gold);
      box-shadow: 0 0 22px rgba(201,160,53,0.45);
      display: block;
      margin: 0 auto 0.75rem;
    }
    .rp-logo h1 {
      font-family: 'Cinzel', serif; font-size: 1.3rem; font-weight: 700;
      color: var(--rp-gl); letter-spacing: 0.04em;
    }
    .rp-logo p {
      font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
      color: var(--rp-muted); margin-top: 0.3rem;
    }

    .rp-card {
      background: var(--rp-card);
      border: 1px solid var(--rp-border);
      border-radius: 10px;
      padding: 2rem 1.8rem 1.8rem;
      box-shadow: 0 24px 64px rgba(0,0,0,0.65);
    }

    .rp-card-title {
      font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 600;
      color: var(--rp-gl); margin-bottom: 0.35rem;
    }
    .rp-card-sub {
      font-size: 0.68rem; color: var(--rp-muted); margin-bottom: 0.25rem; line-height: 1.5;
    }
    .rp-email {
      display: inline-block; font-size: 0.72rem; color: var(--rp-gold);
      background: rgba(201,160,53,0.1); border: 1px solid rgba(201,160,53,0.22);
      border-radius: 4px; padding: 0.22rem 0.6rem; margin-bottom: 1.4rem;
      letter-spacing: 0.04em; word-break: break-all;
    }

    .rp-divider { height: 1px; background: var(--rp-border); margin-bottom: 1.4rem; }

    .fg { margin-bottom: 1.1rem; }
    .fg label {
      display: block; font-size: 0.56rem; letter-spacing: 0.2em;
      text-transform: uppercase; color: var(--rp-gold); margin-bottom: 0.42rem;
    }
    .fg input[type="password"] {
      width: 100%;
      background: rgba(201,160,53,0.06);
      border: 1px solid var(--rp-border);
      border-radius: 5px;
      padding: 0.72rem 0.9rem;
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.82rem;
      color: var(--rp-text);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      letter-spacing: 0.06em;
    }
    .fg input[type="password"]:focus {
      border-color: var(--rp-gold);
      box-shadow: 0 0 0 3px rgba(201,160,53,0.1);
    }
    .fg input[type="password"]::placeholder { color: var(--rp-muted); }

    .admin-btn {
      display: block; width: 100%;
      background: linear-gradient(135deg, #C9A035, #A07820);
      border: none; border-radius: 5px;
      padding: 0.84rem;
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.72rem; font-weight: 600;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: #fff; cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      box-shadow: 0 4px 18px rgba(201,160,53,0.28);
      margin-top: 0.4rem;
    }
    .admin-btn:hover { opacity: 0.88; }
    .admin-btn:active { transform: scale(0.98); }
    .admin-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .admin-msg {
      font-size: 0.7rem; letter-spacing: 0.04em;
      text-align: center; min-height: 1rem;
      margin-top: 1rem; line-height: 1.5;
      color: var(--rp-muted);
    }
    .admin-msg.error  { color: var(--rp-red); }
    .admin-msg.success { color: var(--rp-green); }

    #rp-login-link .admin-btn {
      background: rgba(201,160,53,0.12);
      border: 1px solid rgba(201,160,53,0.3);
      color: var(--rp-gold);
      box-shadow: none;
      margin-top: 0;
    }
    #rp-login-link .admin-btn:hover { background: rgba(201,160,53,0.22); }

    .rp-footer {
      text-align: center; margin-top: 1.4rem;
      font-size: 0.52rem; letter-spacing: 0.14em; text-transform: uppercase;
      color: rgba(201,160,53,0.28);
    }
  `;
    document.head.appendChild(style);
})();

/* ── Logic ── */
const root = document.getElementById('root');

const LOGO_SRC = 'data:image/jpeg;base64,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';

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function renderResetPasswordPage() {
    const email = getQueryParam('email');
    const token = getQueryParam('token');

    if (!email || !token) {
        root.innerHTML = `
          <div class="rp-wrap">
            <div class="rp-logo">
              <img class="rp-logo-img" src="${LOGO_SRC}" alt="Royal David City Logo"/>
              <h1>Royal David City</h1>
              <p>Admin Panel · RDCDF-SL</p>
            </div>
            <div class="rp-card" style="text-align:center;">
              <p style="color:var(--rp-red);font-size:0.82rem;line-height:1.7;">
                ⚠️ Invalid or expired password reset link.<br/>
                <span style="color:var(--rp-muted);font-size:0.7rem;">Please request a new reset link from the admin panel.</span>
              </p>
            </div>
            <p class="rp-footer">Royal David City Development Foundation · Sierra Leone</p>
          </div>`;
        return;
    }

    console.log('Email from URL:', email);
    console.log('Token from URL:', token);

    root.innerHTML = `
      <div class="rp-wrap">

        <div class="rp-logo">
          <img class="rp-logo-img" src="${LOGO_SRC}" alt="Royal David City Logo"/>
          <h1>Royal David City</h1>
          <p>Admin Panel · RDCDF-SL</p>
        </div>

        <div class="rp-card">
          <p class="rp-card-title">Reset Password</p>
          <p class="rp-card-sub">Resetting password for</p>
          <span class="rp-email">✉ ${email}</span>

          <div class="rp-divider"></div>

          <form id="reset-password-form" autocomplete="off" novalidate>

            <div class="fg">
              <label for="rp-pass1">New Password</label>
              <input id="rp-pass1" type="password" placeholder="Enter new password"
                     required autocomplete="new-password"/>
            </div>

            <div class="fg">
              <label for="rp-pass2">Confirm New Password</label>
              <input id="rp-pass2" type="password" placeholder="Confirm new password"
                     required autocomplete="new-password"/>
            </div>

            <button type="submit" class="admin-btn" id="rp-submit-btn">
              Reset Password
            </button>

            <div class="admin-msg" id="rp-msg"></div>
            <div id="rp-login-link" style="margin-top:0.6rem;"></div>

          </form>
        </div>

        <p class="rp-footer">Royal David City Development Foundation · Sierra Leone</p>

      </div>`;

    const form = document.getElementById('reset-password-form');
    const msgEl = document.getElementById('rp-msg');
    const loginLinkEl = document.getElementById('rp-login-link');
    const submitBtn = document.getElementById('rp-submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msgEl.textContent = '';
        msgEl.className = 'admin-msg';
        loginLinkEl.innerHTML = '';

        const p1 = document.getElementById('rp-pass1').value;
        const p2 = document.getElementById('rp-pass2').value;

        if (!p1 || !p2) {
            msgEl.textContent = 'Please fill both password fields.';
            msgEl.className = 'admin-msg error';
            return;
        }
        if (p1 !== p2) {
            msgEl.textContent = 'Passwords do not match.';
            msgEl.className = 'admin-msg error';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Updating password…';
        msgEl.textContent = '';

        try {
            console.log('Sending reset request with:', {
                email,
                token,
                newPassword: p1,
                confirmPassword: p2
            });

            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    token,
                    newPassword: p1,
                    confirmPassword: p2
                })
            });

            const text = await res.text();
            console.log('Reset response status:', res.status, 'body:', text);

            if (!res.ok) {
                msgEl.textContent = text || 'Failed to reset password. The link may be expired.';
                msgEl.className = 'admin-msg error';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Reset Password';
                return;
            }

            msgEl.textContent = '✓ Password reset successful.';
            msgEl.className = 'admin-msg success';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Reset Password';

            loginLinkEl.innerHTML = `
              <button id="rp-go-login" class="admin-btn">
                Go to Login
              </button>`;

            document.getElementById('rp-go-login').addEventListener('click', () => {
                window.location.href = '/admin/index.html';
            });

        } catch (err) {
            console.error('Reset error:', err);
            msgEl.textContent = 'Error contacting server. Please try again later.';
            msgEl.className = 'admin-msg error';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Reset Password';
        }
    });
}

renderResetPasswordPage();