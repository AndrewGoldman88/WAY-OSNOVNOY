/* =========================================================
   PARTICLES — sparks / flame / stars / logos
   ========================================================= */
let particleCtx = null;
let particleList = [];
let activeParticleColor = null;
let activeParticleDirection = 'up';
let activeParticleStyle = 'sparks';

/* ─── Греческие буквы для Логоса ─────────────────────────
   Упор на редкие и эпичные: Ψ Ξ Ω Φ Θ Λ Σ Δ Γ и т.д.
   Каждая частица берёт букву заново при respawn → всегда разные ─── */
const LOGOS_CHARS = [
    'Ψ','Ξ','Ω','Φ','Θ','Λ','Σ','Δ','Γ','Π','Υ',   // редкие/эпичные — чаще
    'Ψ','Ξ','Ω','Φ','Θ','Λ',                          // дубли для веса
    'Α','Β','Ε','Ζ','Η','Ι','Κ','Μ','Ν','Ο','Ρ','Τ','Χ'  // остальные
];

function getParticleCanvas() { return document.getElementById('particleCanvas'); }

function resizeParticleCanvas() {
    const c = getParticleCanvas();
    if (!c) return;
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
}

/* ── Фабрика одной частицы ────────────────────────────── */
function makeParticle(c, style) {
    const base = {
        x: Math.random() * c.width,
        y: Math.random() * c.height
    };

    if (style === 'flame') {
        return { ...base,
            r:         1.8 + Math.random() * 3.8,
            speed:     0.4  + Math.random() * 0.7,
            drift:     (Math.random() - 0.5) * 0.8,
            wobble:    Math.random() * Math.PI * 2,
            wobbleSpd: 0.03 + Math.random() * 0.04,
            alpha:     0.18 + Math.random() * 0.5,
            life:      Math.floor(Math.random() * 80),  // старт в разных фазах
            maxLife:   60  + Math.random() * 70
        };
    }

    if (style === 'stars') {
        return { ...base,
            r:          0.8 + Math.random() * 2.4,
            speed:      0.06 + Math.random() * 0.18,
            drift:      (Math.random() - 0.5) * 0.12,
            twinkle:    Math.random() * Math.PI * 2,
            twinkleSpd: 0.022 + Math.random() * 0.04,
            alpha:      0.25 + Math.random() * 0.6,
            tail:       Math.random() < 0.25
        };
    }

    if (style === 'logos') {
        return { ...base,
            // Буква выбирается здесь — при каждом respawn новая
            char:     LOGOS_CHARS[Math.floor(Math.random() * LOGOS_CHARS.length)],
            size:     16 + Math.random() * 26,
            speed:    0.07 + Math.random() * 0.16,
            drift:    (Math.random() - 0.5) * 0.18,
            angle:    (Math.random() - 0.5) * Math.PI,        // случайный наклон
            angleSpd: (Math.random() - 0.5) * 0.0025,         // медленное вращение
            alpha:    0.10 + Math.random() * 0.32,
            pulse:    Math.random() * Math.PI * 2,
            pulseSpd: 0.015 + Math.random() * 0.022,
            // Добавляем лёгкое боковое блуждание
            sinOffset:Math.random() * Math.PI * 2,
            sinAmp:   0.12 + Math.random() * 0.22,
            sinSpd:   0.008 + Math.random() * 0.012
        };
    }

    /* sparks — default */
    return { ...base,
        r:        2.0 + Math.random() * 3.2,
        speed:    0.18 + Math.random() * 0.38,
        drift:    (Math.random() - 0.5) * 0.3,
        pulse:    Math.random() * Math.PI * 2,
        pulseSpd: 0.03 + Math.random() * 0.05,
        alpha:    0.22 + Math.random() * 0.55
    };
}

/* ── Запуск/смена эффекта ─────────────────────────────── */
function spawnParticles(color, direction, style) {
    activeParticleColor     = color;
    activeParticleDirection = direction || 'up';
    activeParticleStyle     = style     || 'sparks';

    const c = getParticleCanvas();
    if (!c) return;

    const counts = { flame: 36, stars: 44, logos: 22, sparks: 30 };
    const count  = counts[activeParticleStyle] || 30;

    particleList = [];
    for (let i = 0; i < count; i++) {
        particleList.push(makeParticle(c, activeParticleStyle));
    }
}

/* ── Утилиты ──────────────────────────────────────────── */
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3), 16),
          g = parseInt(hex.slice(3,5), 16),
          b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
}

/* ── Главный тик ──────────────────────────────────────── */
function tickParticles() {
    const c = getParticleCanvas();
    if (!c) return;
    if (!particleCtx) particleCtx = c.getContext('2d');

    particleCtx.clearRect(0, 0, c.width, c.height);
    if (!activeParticleColor || !particleList.length) {
        requestAnimationFrame(tickParticles);
        return;
    }

    const dir   = activeParticleDirection;
    const style = activeParticleStyle;

    particleList.forEach((p, idx) => {

        /* ── FLAME ────────────────────────────────────── */
        if (style === 'flame') {
            p.life++;
            p.wobble += p.wobbleSpd;
            p.y -= p.speed;
            p.x += Math.sin(p.wobble) * 0.65 + p.drift;
            p.r -= 0.015;

            const t = p.life / p.maxLife;
            const a = p.alpha * Math.sin(t * Math.PI);

            if (p.life >= p.maxLife || p.r <= 0.15) {
                const np = makeParticle(c, 'flame');
                np.y = c.height + 10;
                particleList[idx] = np;
                return;
            }

            const grad = particleCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.8);
            grad.addColorStop(0,   `rgba(255,255,200,${(a * 0.95).toFixed(3)})`);
            grad.addColorStop(0.4, hexToRgba(activeParticleColor, a * 0.8));
            grad.addColorStop(1,   hexToRgba(activeParticleColor, 0));

            particleCtx.beginPath();
            particleCtx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
            particleCtx.fillStyle = grad;
            particleCtx.fill();
            return;
        }

        /* ── STARS ────────────────────────────────────── */
        if (style === 'stars') {
            p.y -= p.speed;
            p.x += p.drift;
            p.twinkle += p.twinkleSpd;

            if (p.y < -20) {
                const np = makeParticle(c, 'stars');
                np.y = c.height + 10;
                particleList[idx] = np;
                return;
            }

            const a = p.alpha * (0.5 + 0.5 * Math.sin(p.twinkle));

            if (p.tail) {
                particleCtx.save();
                particleCtx.strokeStyle = hexToRgba(activeParticleColor, a * 0.45);
                particleCtx.lineWidth   = p.r * 0.5;
                particleCtx.beginPath();
                particleCtx.moveTo(p.x, p.y);
                particleCtx.lineTo(p.x + p.drift * 9, p.y + p.speed * 9);
                particleCtx.stroke();
                particleCtx.restore();
            }

            const grad = particleCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.2);
            grad.addColorStop(0,   `rgba(255,255,255,${(a * 0.95).toFixed(3)})`);
            grad.addColorStop(0.3, hexToRgba(activeParticleColor, a * 0.7));
            grad.addColorStop(1,   hexToRgba(activeParticleColor, 0));

            particleCtx.beginPath();
            particleCtx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
            particleCtx.fillStyle = grad;
            particleCtx.fill();
            return;
        }

        /* ── LOGOS ────────────────────────────────────── */
        if (style === 'logos') {
            p.y       -= p.speed;
            p.sinOffset += p.sinSpd;
            p.x       += Math.sin(p.sinOffset) * p.sinAmp + p.drift;
            p.angle   += p.angleSpd;
            p.pulse   += p.pulseSpd;

            if (p.y < -80) {
                // При respawn — новая буква в случайном месте внизу
                const np = makeParticle(c, 'logos');
                np.y = c.height + 40 + Math.random() * 80;
                np.x = Math.random() * c.width;
                particleList[idx] = np;
                return;
            }

            const a = p.alpha * (0.55 + 0.45 * Math.sin(p.pulse));

            particleCtx.save();
            particleCtx.translate(p.x, p.y);
            particleCtx.rotate(p.angle);

            // Свечение-halo под буквой
            particleCtx.shadowColor = hexToRgba(activeParticleColor, a * 0.5);
            particleCtx.shadowBlur  = 14;

            particleCtx.font         = `300 ${p.size.toFixed(0)}px 'Cinzel', serif`;
            particleCtx.fillStyle    = hexToRgba(activeParticleColor, a);
            particleCtx.textAlign    = 'center';
            particleCtx.textBaseline = 'middle';
            particleCtx.fillText(p.char, 0, 0);
            particleCtx.restore();
            return;
        }

        /* ── SPARKS (default) ─────────────────────────── */
        p.y    += dir === 'up' ? -p.speed : p.speed;
        p.x    += p.drift;
        p.pulse += p.pulseSpd;

        if (dir === 'up'   && p.y < -10) {
            const np = makeParticle(c, 'sparks');
            np.y = c.height + 10;
            particleList[idx] = np;
            return;
        }
        if (dir === 'down' && p.y > c.height + 10) {
            const np = makeParticle(c, 'sparks');
            np.y = -10;
            particleList[idx] = np;
            return;
        }

        const a = p.alpha * (0.62 + 0.38 * Math.sin(p.pulse));

        const grad = particleCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0,    `rgba(255,255,255,${(a * 0.9).toFixed(3)})`);
        grad.addColorStop(0.25, hexToRgba(activeParticleColor, a));
        grad.addColorStop(1,    hexToRgba(activeParticleColor, 0));

        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        particleCtx.fillStyle = grad;
        particleCtx.fill();
    });

    requestAnimationFrame(tickParticles);
}
