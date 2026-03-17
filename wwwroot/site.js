 
        // ── PAGE NAVIGATION ──
        function go(id) {
            document.querySelectorAll('.pg').forEach(p => p.classList.remove('on'));
            document.getElementById('pg-' + id).classList.add('on');
            document.querySelectorAll('[data-p]').forEach(a => a.classList.toggle('on', a.dataset.p === id));
            closeMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // ── HAMBURGER MENU ──
        function togMenu() {
            const d = document.getElementById('drw'), b = document.getElementById('hbg');
            const open = d.classList.toggle('open');
            b.classList.toggle('open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        }
        function closeMenu() {
            document.getElementById('drw').classList.remove('open');
            document.getElementById('hbg').classList.remove('open');
            document.body.style.overflow = '';
        }
        function bdClose(e) { if (e.target === document.getElementById('drw')) closeMenu(); }

        // ── GALLERY TABS ──
        function showG(id, el) {
            document.querySelectorAll('.gsec').forEach(s => s.classList.remove('on'));
            document.querySelectorAll('.gtab').forEach(t => t.classList.remove('on'));
            document.getElementById('g-' + id).classList.add('on');
            el.classList.add('on');
        }

        // ── LIGHTBOX ──
        let lbImgs = [], lbIdx = 0;
        function openLB(img) {
            const grid = img.closest('[data-lb-group]') || img.closest('.pg-grid') || img.closest('.fs');
            lbImgs = Array.from(grid ? grid.querySelectorAll('img') : [img]);
            lbIdx = lbImgs.indexOf(img);
            showLBImg();
            document.getElementById('lb').classList.add('on');
            document.body.style.overflow = 'hidden';
        }
        function showLBImg() {
            document.getElementById('lb-img').src = lbImgs[lbIdx].src;
            document.getElementById('lb-count').textContent = (lbIdx + 1) + ' / ' + lbImgs.length;
            document.getElementById('lb-prev').style.display = lbImgs.length > 1 ? 'flex' : 'none';
            document.getElementById('lb-next').style.display = lbImgs.length > 1 ? 'flex' : 'none';
        }
        function lbNav(dir) {
            lbIdx = (lbIdx + dir + lbImgs.length) % lbImgs.length;
            showLBImg();
        }
        function closeLB() {
            document.getElementById('lb').classList.remove('on');
            document.body.style.overflow = '';
        }
        document.getElementById('lb').addEventListener('click', function (e) {
            if (e.target === this) closeLB();
        });
        // Swipe support
        let lbTX = 0;
        document.getElementById('lb').addEventListener('touchstart', e => lbTX = e.touches[0].clientX, { passive: true });
        document.getElementById('lb').addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - lbTX;
            if (Math.abs(dx) > 50) lbNav(dx < 0 ? 1 : -1);
        }, { passive: true });

        // ── BACK TO TOP ──
        window.addEventListener('scroll', function () {
            document.getElementById('top-btn').classList.toggle('show', window.scrollY > 300);
        }, { passive: true });

        // ── PRAYER FORM ──
        async function submitPrayer() {
            const name = document.getElementById('pr-name').value.trim() || 'Anonymous';
            const phone = document.getElementById('pr-phone').value.trim();
            const category = document.getElementById('pr-cat').value;
            const message = document.getElementById('pr-msg').value.trim();
            const confidential = document.getElementById('pr-anon').checked;

            if (!message) {
                alert('Please enter your prayer request.');
                return;
            }

            try {
                const res = await fetch('/api/PrayerRequests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        phone,
                        category,
                        message,
                        confidential
                    })
                });

                if (!res.ok) {
                    alert('Sorry, something went wrong. Please try again later.');
                    return;
                }

                // Show custom popup instead of alert
                document.getElementById('prayer-popup').classList.add('on');

                document.getElementById('prayer-form').style.display = 'none';
                document.getElementById('prayer-success').classList.add('on');
                window.scrollTo({ top: 0, behavior: 'smooth' });

            } catch (err) {
                console.error(err);
                alert('Network error. Please check your connection and try again.');
            }
        }



        // ── SPLASH SCREEN ──
        window.addEventListener('load', function () {
            setTimeout(function () {
                const s = document.getElementById('splash');
                s.classList.add('hide');
                setTimeout(() => s.remove(), 800);
            }, 2000);
        });

        // ── PWA INSTALL ──
        let deferredPrompt = null;
        window.addEventListener('beforeinstallprompt', function (e) {
            e.preventDefault();
            deferredPrompt = e;
            setTimeout(() => document.getElementById('pwa-banner').classList.add('show'), 3000);
        });
        function installPWA() {
            document.getElementById('pwa-banner').classList.remove('show');
            if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; }
        }
        function dismissPWA() { document.getElementById('pwa-banner').classList.remove('show'); }

        // ── SERVICE WORKER (PWA offline) ──
        if ('serviceWorker' in navigator) {
            const sw = `
                            const CACHE='rdcdf-v1';
                            self.addEventListener('install',e=>{
                              self.skipWaiting();
                            });
                            self.addEventListener('fetch',e=>{
                              e.respondWith(
                                caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>new Response('Offline',{status:503})))
                              );
                            });
                          `;
            const blob = new Blob([sw], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            navigator.serviceWorker.register(url).catch(() => { });
        }
        function closePrayerPopup() {
            document.getElementById('prayer-popup').classList.remove('on');
        }

        async function submitDonation() {
            const nameInput = document.querySelector('#pg-donate input[autocomplete="name"]');
            const contactInput = document.querySelector('#pg-donate input[autocomplete="tel"]');
            const amountInput = document.querySelector('#pg-donate input[type="number"]');
            const purposeSelect = document.querySelector('#pg-donate select');
            const messageArea = document.querySelector('#pg-donate textarea');

            const fullName = nameInput.value.trim();
            const contact = contactInput.value.trim();
            const amountNle = parseFloat(amountInput.value);
            const purpose = purposeSelect.value;
            const message = messageArea.value.trim();

            if (!fullName || !contact || !amountNle || amountNle <= 0) {
                alert('Please fill in your name, contact and a valid amount.');
                return;
            }

            try {
                const res = await fetch('/api/Donations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName,
                        contact,
                        amountNle,
                        purpose,
                        message
                    })
                });

                if (!res.ok) {
                    alert('Sorry, something went wrong. Please try again later.');
                    return;
                }

                // Show custom donation popup
                document.getElementById('donation-popup').classList.add('on');

                // optional: clear form
                nameInput.value = '';
                contactInput.value = '';
                amountInput.value = '';
                purposeSelect.selectedIndex = 0;
                messageArea.value = '';
            } catch (err) {
                console.error(err);
                alert('Network error. Please check your connection and try again.');
            }
        }
        function closeDonationPopup() {
            document.getElementById('donation-popup').classList.remove('on');
        }

        function closeContactPopup() {
            document.getElementById('contact-popup').classList.remove('on');
        }

        async function submitContact() {
            const nameInput = document.querySelector('#pg-contact input[autocomplete="name"]');
            const contactInput = document.querySelector('#pg-contact input[autocomplete="tel"]');
            const subjectSelect = document.querySelector('#pg-contact select');
            const messageArea = document.querySelector('#pg-contact textarea');

            const name = nameInput.value.trim();
            const contact = contactInput.value.trim();
            const subjectType = subjectSelect.value;
            const message = messageArea.value.trim();

            if (!name || !contact || !message) {
                alert('Please fill in your name, contact and message.');
                return;
            }

            try {
                const res = await fetch('/api/ContactMessages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        contact,
                        subjectType,
                        message
                    })
                });

                if (!res.ok) {
                    alert('Sorry, something went wrong. Please try again later.');
                    return;
                }

                document.getElementById('contact-popup').classList.add('on');

                // optional: clear form
                nameInput.value = '';
                contactInput.value = '';
                subjectSelect.selectedIndex = 0;
                messageArea.value = '';
            } catch (err) {
                console.error(err);
                alert('Network error. Please check your connection and try again.');
            }
        }

      

   