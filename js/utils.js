/* =========================================================
           UTILITY
           ========================================================= */
        function showToast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            clearTimeout(window.__toastT);
            window.__toastT = setTimeout(() => t.classList.remove('show'), 3200);
        }

        function vibrate(pattern) {
            if (navigator.vibrate) { navigator.vibrate(pattern); }
        }

        function fireConfetti() {
            if (typeof confetti !== 'function') return;
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.4 }, colors: ['#8B5CF6', '#D4AF37', '#F97316',
                    '#EDEBE6'
                ] });
            setTimeout(() => confetti({ particleCount: 45, spread: 100, origin: { y: 0.3 }, colors: ['#8B5CF6',
                    '#D4AF37'
                ] }), 200);
        }

        function spawnRankSparks() {
            const overlay = document.getElementById('rankAscension');
            if (!overlay) return;
            overlay.querySelectorAll('.rank-spark').forEach(e => e.remove());
            for (let i = 0; i < 34; i++) {
                const p = document.createElement('span');
                p.className = 'rank-spark';
                const angle = Math.random() * Math.PI * 2;
                const dist = 90 + Math.random() * 280;
                p.style.left = (50 + Math.cos(angle) * (8 + Math.random()*18)) + '%';
                p.style.top = (47 + Math.sin(angle) * (8 + Math.random()*18)) + '%';
                p.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
                p.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
                p.style.animationDelay = (1.05 + Math.random() * .9) + 's';
                overlay.appendChild(p);
            }
        }

        function showRankAscension(rank) {
            const overlay = document.getElementById('rankAscension');
            if (!overlay) return;
            const img = rankImageForDay(rank.day);
            document.getElementById('rankAscensionImage').src = img;
            document.getElementById('rankAscensionNumber').textContent = `ДЕНЬ ${rank.day}`;
            document.getElementById('rankAscensionTitle').textContent = rank.name;
            document.getElementById('rankAscensionAura').textContent = rank.aura;
            overlay.dataset.rankDay = rank.day;
            overlay.classList.add('show');
            overlay.setAttribute('aria-hidden','false');
            document.body.style.overflow = 'hidden';
            spawnRankSparks();
            vibrate([30,50,60,70,110]);
            // Один глубокий акцент вместо обычного фейерверка.
            if (typeof confetti === 'function') {
                setTimeout(() => confetti({ particleCount: 28, spread: 48, startVelocity: 22, gravity: .75, scalar: .65, origin: {x:.5,y:.47}, colors:['#D4AF37','#EDEBE6','#8B5CF6'] }), 1250);
            }
        }

        function closeRankAscension() {
            const overlay = document.getElementById('rankAscension');
            if (!overlay) return;
            overlay.classList.remove('show');
            overlay.setAttribute('aria-hidden','true');
            document.body.style.overflow = '';
        }

        function checkRankUp() {
            const d = currentDay();
            const rank = rankForDay(d);
            if (state.lastSeenRankDay !== undefined && rank.day > state.lastSeenRankDay) {
                state.lastSeenRankDay = rank.day;
                save();
                renderHome();
                showRankAscension(rank);
            }
        }
