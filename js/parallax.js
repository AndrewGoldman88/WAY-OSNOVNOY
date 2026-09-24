/* =========================================================
           PARALLAX
           ========================================================= */
        let parallaxActive = true;

        function initParallax() {
            const wrap = document.getElementById('sigilWrap');
            if (!wrap) return;
            document.addEventListener('mousemove', (e) => {
                if (!parallaxActive) return;
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;
                const rotX = y * 4;
                const rotY = -x * 4;
                wrap.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
            });
            document.addEventListener('mouseleave', () => {
                wrap.style.transform = 'rotateX(0) rotateY(0) scale(1)';
            });
            // touch support
            let touchX = 0,
                touchY = 0;
            document.addEventListener('touchmove', (e) => {
                const t = e.touches[0];
                if (!t) return;
                const x = (t.clientX / window.innerWidth - 0.5) * 2;
                const y = (t.clientY / window.innerHeight - 0.5) * 2;
                const rotX = y * 3;
                const rotY = -x * 3;
                wrap.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
            }, { passive: true });
            document.addEventListener('touchend', () => {
                wrap.style.transform = 'rotateX(0) rotateY(0) scale(1)';
            }, { passive: true });
        }
