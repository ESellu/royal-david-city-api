const root = document.getElementById('admin-root');

let failedAttempts = 0;

function renderLogin(message = '') {
    root.innerHTML = `
      <h1>Admin Login</h1>
      <form id="login-form">
        <div class="fg">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" required autocomplete="email">
        </div>
        <div class="fg">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" required autocomplete="current-password">
        </div>
        <button type="submit" class="admin-btn">Sign in</button>
        <div class="admin-msg" id="login-msg">${message}</div>
        <div class="forgot-link" id="forgot-link">Forgot your password?</div>
        <div class="admin-msg" style="margin-top:0.6rem;">
          Don’t have an account?
          <button type="button" id="go-register" style="background:none;border:none;color:#f5e6b8;cursor:pointer;padding:0;">Sign up</button>
        </div>
      </form>
    `;

    const form = document.getElementById('login-form');
    const msgEl = document.getElementById('login-msg');
    const forgotEl = document.getElementById('forgot-link');
    const goRegister = document.getElementById('go-register');

    // Always show "Forgot your password?" and use it to open the reset flow
    forgotEl.style.display = 'block';
    forgotEl.onclick = () => {
        renderForgotPassword();
    };

    goRegister.addEventListener('click', () => {
        renderRegister();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msgEl.textContent = 'Signing in...';

        const email = form.email.value.trim();
        const password = form.password.value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                    rememberMe: true
                })
            });

            if (res.ok) {
                failedAttempts = 0;
                msgEl.textContent = '';
                await loadDashboard();
            } else {
                failedAttempts++;
                msgEl.textContent = 'Invalid email or password.';
            }
        } catch {
            msgEl.textContent = 'Network error. Please try again.';
        }
    });
}

function renderForgotPassword() {
    root.innerHTML = `
      <h1>Forgot Password</h1>
      <p>Enter the email address associated with your admin account. If it exists, a reset link will be emailed to you.</p>
      <form id="forgot-email-form">
        <div class="fg">
          <label for="fp-email">Email</label>
          <input id="fp-email" name="fp-email" type="email" required autocomplete="email">
        </div>
        <button type="submit" class="admin-btn">Send reset link</button>
        <div class="admin-msg" id="fp-msg"></div>
        <div class="admin-msg" style="margin-top:0.6rem;">
          Remembered your password?
          <button type="button" id="fp-back" style="background:none;border:none;color:#f5e6b8;cursor:pointer;padding:0;">Back to login</button>
        </div>
      </form>
    `;

    const form = document.getElementById('forgot-email-form');
    const msgEl = document.getElementById('fp-msg');
    const backBtn = document.getElementById('fp-back');

    backBtn.addEventListener('click', () => {
        renderLogin();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msgEl.textContent = 'Sending reset link...';

        const email = document.getElementById('fp-email').value.trim();

        if (!email) {
            msgEl.textContent = 'Email is required.';
            return;
        }

        try {
            await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            // Always generic, even if email doesn't exist
            msgEl.textContent = 'A reset link has been sent.';
        } catch {
            msgEl.textContent = 'Error contacting server. Please try again.';
        }
    });
}


function renderRegister(message = '') {
    root.innerHTML = `
      <h1>Create Admin Account</h1>        <div class="fg">

      <form id="register-form">
          <label for="reg-name">Full name</label>
          <input id="reg-name" name="fullName" type="text" required autocomplete="name">
        </div>
        <div class="fg">
          <label for="reg-email">Email</label>
          <input id="reg-email" name="email" type="email" required autocomplete="email">
        </div>
        <div class="fg">
          <label for="reg-password">Password</label>
          <input id="reg-password" name="password" type="password" required autocomplete="new-password">
        </div>
        <button type="submit" class="admin-btn">Sign up</button>
        <div class="admin-msg" id="register-msg">${message}</div>
        <div class="admin-msg" style="margin-top:0.6rem;">
          Already have an account?
          <button type="button" id="go-login" style="background:none;border:none;color:#f5e6b8;cursor:pointer;padding:0;">Sign in</button>
        </div>
      </form>
    `;

    const form = document.getElementById('register-form');
    const msgEl = document.getElementById('register-msg');
    const goLogin = document.getElementById('go-login');

    goLogin.addEventListener('click', () => {
        renderLogin();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msgEl.textContent = 'Creating admin account...';

        const fullName = form['reg-name'].value.trim();
        const email = form['reg-email'].value.trim();
        const password = form['reg-password'].value;

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ fullName, email, password })
            });

            if (res.ok) {
                msgEl.textContent = 'Account created. Logging you in...';
                failedAttempts = 0;
                setTimeout(loadDashboard, 800);
            } else {
                const err = await res.json().catch(() => null);

                // If Identity returns an array of errors, join descriptions
                if (Array.isArray(err) && err.length > 0 && err[0].description) {
                    msgEl.textContent = err.map(e => e.description).join(' ');
                } else if (err?.message) {
                    msgEl.textContent = err.message;
                } else {
                    msgEl.textContent = 'Registration failed. Please check your input.';
                }
            }
        } catch {
            msgEl.textContent = 'Network error. Please try again.';
        }
    });

}

function renderPrayerRows(list) {
    if (!Array.isArray(list)) return '';

    return list.map(p => {
        const contact = [p.email, p.phone].filter(Boolean).join(' / ');
        const created = p.createdAt ? new Date(p.createdAt).toLocaleString() : '';

        return `
          <tr data-prayer-id="${p.id}">
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;">${p.name || ''}</td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;">${contact}</td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;max-width:240px;word-wrap:break-word;">${p.message || ''}</td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;">
              ${p.status || ''}
              <button class="status-btn-prayer" data-new-status="PrayedFor"
                      style="margin-left:0.4rem;font-size:0.7rem;">Mark prayed</button>
            </td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;white-space:nowrap;">${created}</td>
          </tr>
        `;
    }).join('');
}
function renderContactRows(list) {
    if (!Array.isArray(list)) return '';

    return list.map(c => {
        const created = c.createdAt ? new Date(c.createdAt).toLocaleString() : '';

        return `
          <tr data-contact-id="${c.id}">
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;">${c.name || ''}</td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;">${c.contact || ''}</td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;">${c.subjectType || ''}</td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;max-width:260px;word-wrap:break-word;">${c.message || ''}</td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;white-space:nowrap;">
              ${created}<br/>
              <span>${c.status || ''}</span>
              <button class="status-btn-contact" data-new-status="RESPONDED"
                      style="margin-left:0.4rem;font-size:0.7rem;">Mark responded</button>
            </td>
          </tr>
        `;
    }).join('');
}



function renderDonationRows(list) {
    if (!Array.isArray(list)) return '';

    return list.map(d => {
        const created = d.createdAt ? new Date(d.createdAt).toLocaleString() : '';

        return `
          <tr data-donation-id="${d.id}">
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;">${d.fullName || ''}</td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;">${d.contact || ''}</td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;">${d.amountNle} NLe</td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;">${d.purpose || ''}</td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;">
              ${d.status || ''}
              <button class="status-btn-donation" data-new-status="CONTACTED"
                      style="margin-left:0.4rem;font-size:0.7rem;">Mark contacted</button>
            </td>
            <td style="border-bottom:1px solid #222;padding:0.4rem;vertical-align:top;white-space:nowrap;">${created}</td>
          </tr>
        `;
    }).join('');
}


async function loadDashboard() {
    try {
        const res = await fetch('/api/auth/me', {
            credentials: 'include'
        });

        const data = await res.json();

        if (!data.isAuthenticated) {
            failedAttempts = 0;
            renderLogin();
            return;
        }

        // Fetch prayer requests
        const prRes = await fetch('/api/admin/prayer-requests', {
            credentials: 'include'
        });
        const prayerRequests = await prRes.json();

        // Fetch contact messages
        const cmRes = await fetch('/api/admin/contact-messages', {
            credentials: 'include'
        });
        const contactMessages = await cmRes.json();

        // Fetch donations (DonationPledges)
        const dnRes = await fetch('/api/admin/donations', {
            credentials: 'include'
        });
        const donations = await dnRes.json();

        root.innerHTML = `
          <h1>Admin Dashboard</h1>
          <p>Current Admin: <strong>${data.fullName || data.email}</strong> (${data.email})</p>
          <button id="logout-btn" class="admin-btn" style="margin-top:1rem;">Logout</button>

          <!-- Prayer Requests -->
          <div style="margin-top:1.5rem;font-size:0.9rem;">
            <h2 style="margin-bottom:0.5rem;font-size:1rem;">Prayer Requests</h2>
            <div style="margin-bottom:0.7rem;">
              <label for="status-filter" style="font-size:0.8rem;margin-right:0.4rem;">Filter by status:</label>
              <select id="status-filter" style="padding:0.2rem 0.4rem;border-radius:4px;border:1px solid #333;background:#111;color:#f5f5f5;">
                <option value="">All</option>
                <option value="New">New</option>
                <option value="InProgress">In Progress</option>
                <option value="PrayedFor">Prayed For</option>
              </select>
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:0.8rem;">
                <thead>
                  <tr>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Name</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Contact</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Message</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Status</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Date</th>
                  </tr>
                </thead>
                <tbody id="prayer-rows">
                  ${renderPrayerRows(prayerRequests)}
                </tbody>
              </table>
            </div>
            <div id="prayer-empty" style="margin-top:0.6rem;font-size:0.8rem;display:${prayerRequests.length === 0 ? 'block' : 'none'};">
              No prayer requests yet.
            </div>
          </div>

          <!-- Contact Messages -->
          <div style="margin-top:2rem;font-size:0.9rem;">
            <h2 style="margin-bottom:0.5rem;font-size:1rem;">Contact Messages</h2>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:0.8rem;">
                <thead>
                  <tr>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Name</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Contact</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Subject</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Message</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Date</th>
                  </tr>
                </thead>
                <tbody id="contact-rows">
                  ${renderContactRows(contactMessages)}
                </tbody>
              </table>
            </div>
            <div id="contact-empty" style="margin-top:0.6rem;font-size:0.8rem;display:${contactMessages.length === 0 ? 'block' : 'none'};">
              No contact messages yet.
            </div>
          </div>

          <!-- Donations (DonationPledges) -->
          <div style="margin-top:2rem;font-size:0.9rem;">
            <h2 style="margin-bottom:0.5rem;font-size:1rem;">Donations / Pledges</h2>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:0.8rem;">
                <thead>
                  <tr>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Full name</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Contact</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Amount (NLe)</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Purpose</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Status</th>
                    <th style="border-bottom:1px solid #333;padding:0.4rem;text-align:left;">Date</th>
                  </tr>
                </thead>
                <tbody id="donation-rows">
                  ${renderDonationRows(donations)}
                </tbody>
              </table>
            </div>
            <div id="donation-empty" style="margin-top:0.6rem;font-size:0.8rem;display:${donations.length === 0 ? 'block' : 'none'};">
              No donations yet.
            </div>
          </div>
        `;

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', async () => {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            failedAttempts = 0;
            renderLogin();
        });

        // Prayer status filter
        const statusFilter = document.getElementById('status-filter');
        const prayerRowsEl = document.getElementById('prayer-rows');
        const prayerEmptyEl = document.getElementById('prayer-empty');

        statusFilter.addEventListener('change', async () => {
            const status = statusFilter.value;
            const url = status
                ? `/api/admin/prayer-requests?status=${encodeURIComponent(status)}`
                : '/api/admin/prayer-requests';

            const res = await fetch(url, { credentials: 'include' });
            const filtered = await res.json();

            prayerRowsEl.innerHTML = renderPrayerRows(filtered);
            prayerEmptyEl.style.display = filtered.length === 0 ? 'block' : 'none';
        });

        // Status management click handlers (event delegation)

        // Prayer status buttons
        root.addEventListener('click', async (e) => {
            if (e.target.classList.contains('status-btn-prayer')) {
                const btn = e.target;
                const row = btn.closest('tr');
                const id = row.getAttribute('data-prayer-id');
                const newStatus = btn.getAttribute('data-new-status');

                await fetch(`/api/admin/prayer-requests/${id}/status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(newStatus)
                });

                loadDashboard();
            }
        });

        // Contact status buttons
        root.addEventListener('click', async (e) => {
            if (e.target.classList.contains('status-btn-contact')) {
                const btn = e.target;
                const row = btn.closest('tr');
                const id = row.getAttribute('data-contact-id');
                const newStatus = btn.getAttribute('data-new-status');

                await fetch(`/api/admin/contact-messages/${id}/status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(newStatus)
                });

                loadDashboard();
            }
        });

        // Donation status buttons
        root.addEventListener('click', async (e) => {
            if (e.target.classList.contains('status-btn-donation')) {
                const btn = e.target;
                const row = btn.closest('tr');
                const id = row.getAttribute('data-donation-id');
                const newStatus = btn.getAttribute('data-new-status');

                await fetch(`/api/admin/donations/${id}/status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(newStatus)
                });

                loadDashboard();
            }
        });

    } catch (err) {
        console.error(err);
        renderLogin('Error checking auth state.');
    }
}

 

// Initial load
loadDashboard();
