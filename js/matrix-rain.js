/* =========================================================
           MATRIX RAIN
           ========================================================= */
        let matrixRainCtx = null,
            matrixRainCols = [],
            matrixRainActive = false,
            matrixRainRAF = null;
        const MATRIX_CHARS =
            'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя';

        function initMatrixRain() {
            const c = document.getElementById('matrixRainCanvas');
            if (!c) return;
            matrixRainCtx = c.getContext('2d');
            resizeMatrixRain();
            window.addEventListener('resize', resizeMatrixRain);
        }

        function resizeMatrixRain() {
            const c = document.getElementById('matrixRainCanvas');
            if (!c) return;
            c.width = window.innerWidth;
            c.height = window.innerHeight;
            const fontSize = 14;
            const cols = Math.floor(c.width / fontSize);
            matrixRainCols = [];
            for (let i = 0; i < cols; i++) matrixRainCols.push(Math.random() * -100);
        }

        function drawMatrixRain() {
            if (!matrixRainActive || !matrixRainCtx) return;
            const c = document.getElementById('matrixRainCanvas');
            const ctx = matrixRainCtx;
            const w = c.width,
                h = c.height;
            ctx.fillStyle = 'rgba(10, 11, 15, 0.05)';
            ctx.fillRect(0, 0, w, h);
            const fontSize = 14;
            ctx.font = fontSize + 'px JetBrains Mono';
            for (let i = 0; i < matrixRainCols.length; i++) {
                const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
                const x = i * fontSize;
                const y = matrixRainCols[i] * fontSize;
                const isHead = Math.random() > 0.95;
                ctx.fillStyle = isHead ? '#ffffff' : (state.theme === 'matrix' ? '#00ff41' : 'var(--violet)');
                ctx.globalAlpha = isHead ? 1 : 0.7;
                ctx.fillText(char, x, y);
                ctx.globalAlpha = 1;
                if (y > h && Math.random() > 0.975) matrixRainCols[i] = 0;
                else matrixRainCols[i]++;
            }
            matrixRainRAF = requestAnimationFrame(drawMatrixRain);
        }

        function startMatrixRain() {
            const c = document.getElementById('matrixRainCanvas');
            if (!c) return;
            matrixRainActive = true;
            c.classList.add('active');
            if (!matrixRainCtx) initMatrixRain();
            if (matrixRainRAF) cancelAnimationFrame(matrixRainRAF);
            drawMatrixRain();
        }

        function stopMatrixRain() {
            matrixRainActive = false;
            const c = document.getElementById('matrixRainCanvas');
            if (c) c.classList.remove('active');
            if (matrixRainRAF) cancelAnimationFrame(matrixRainRAF);
            if (matrixRainCtx) {
                const canv = document.getElementById('matrixRainCanvas');
                if (canv) matrixRainCtx.clearRect(0, 0, canv.width, canv.height);
            }
        }
