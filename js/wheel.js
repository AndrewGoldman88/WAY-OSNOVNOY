/* =========================================================
   WHEEL OF FORTUNE — Casino-grade redesign
   =========================================================
   КЛЮЧЕВОЙ ФИКС: математика вращения была неверной (терялся
   знак при вычислении offset). Формула проверена численно:
   для сектора с видимым углом центра segCenter (0 = верх,
   по часовой), требуемый угол поворота колеса:
       R ≡ (360 - segCenter) mod 360
   Раньше было R ≡ segCenter — отсюда "случайный" сектор.
   ========================================================= */

/* ── Геометрия ──────────────────────────────────────────── */
const WF_CX = 50, WF_CY = 50, WF_R = 45, WF_HUB_R = 10.5;

/* Точка на окружности по "визуальному" углу (0 = верх, по часовой) */
function wfPolar(r, visualDeg) {
    const rad = (visualDeg - 90) * Math.PI / 180;
    return { x: WF_CX + r * Math.cos(rad), y: WF_CY + r * Math.sin(rad) };
}

function wfSeg(i, count) {
    const angle = 360 / count;
    const startDeg = i * angle;
    const endDeg   = startDeg + angle;
    const midDeg   = startDeg + angle / 2;
    const p1 = wfPolar(WF_R, startDeg);
    const p2 = wfPolar(WF_R, endDeg);
    const large = angle > 180 ? 1 : 0;
    return { startDeg, endDeg, midDeg, p1, p2, large };
}

/* ── Палитра по теме ────────────────────────────────────── */
function getWheelColors() {
    const th = state.theme || 'dark';
    if (th === 'blue')   return { a: ['#15275C', '#1E3A8A'], b: ['#1B3F82', '#2A56B8'], accent: '#38BDF8', accent2: '#93C5FD' };
    if (th === 'matrix') return { a: ['#031A08', '#04280C'], b: ['#062E0E', '#0A4415'], accent: '#00ff41', accent2: '#00cc36' };
    return { a: ['#241650', '#150C33'], b: ['#3A2470', '#241355'], accent: '#D4AF37', accent2: '#8B5CF6' };
}

/* ── SVG helper ─────────────────────────────────────────── */
function wfEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}

/* ── Текст сектора: авто-масштаб, перенос, без вылезаний ── */
function wfSectorText(parent, label, midDeg, count) {
    const rTxt = WF_R * 0.62;
    const p = wfPolar(rTxt, midDeg);
    const arcWidth = 2 * rTxt * Math.sin(Math.PI / count) * 0.86;

    const words = label.split(' ');
    let lines;
    if (words.length === 1 || label.length <= 7) lines = [label];
    else if (words.length === 2) lines = words;
    else {
        const mid = Math.ceil(words.length / 2);
        lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    }

    const maxChars = Math.max(...lines.map(l => l.length));
    let fs = Math.min(5.4, arcWidth / (maxChars * 0.58));
    fs = Math.max(3.1, fs);
    const lineH = fs * 1.26;
    const startOff = -((lines.length - 1) * lineH) / 2;

    const g = wfEl('g', {
        transform: `translate(${p.x.toFixed(3)},${p.y.toFixed(3)}) rotate(${(midDeg).toFixed(3)})`
    });

    lines.forEach((line, li) => {
        const y = (startOff + li * lineH).toFixed(3);
        const shadow = wfEl('text', {
            x: '0', y, 'text-anchor': 'middle', 'dominant-baseline': 'middle',
            'font-size': fs.toFixed(2), 'font-weight': '700',
            'font-family': "var(--font-display, 'Cinzel', serif)",
            'letter-spacing': '.03em', fill: 'rgba(0,0,0,.55)'
        });
        shadow.setAttribute('transform', 'translate(0.25,0.35)');
        shadow.textContent = line;
        g.appendChild(shadow);

        const txt = wfEl('text', {
            x: '0', y, 'text-anchor': 'middle', 'dominant-baseline': 'middle',
            'font-size': fs.toFixed(2), 'font-weight': '700',
            'font-family': "var(--font-display, 'Cinzel', serif)",
            'letter-spacing': '.03em', fill: 'rgba(255,255,255,.96)'
        });
        txt.textContent = line;
        g.appendChild(txt);
    });
    parent.appendChild(g);
}

/* ── Рендер колеса ──────────────────────────────────────── */
function renderWheel() {
    const svg = document.getElementById('wheelSvg');
    if (!svg) return;
    const tasks = getWheelTasks();
    const count = tasks.length;
    const pal = getWheelColors();

    svg.innerHTML = '';

    /* defs */
    const defs = wfEl('defs', {});
    const gA = wfEl('linearGradient', { id: 'wf-grad-a', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
    gA.appendChild(wfEl('stop', { offset: '0%',   'stop-color': pal.a[0] }));
    gA.appendChild(wfEl('stop', { offset: '100%', 'stop-color': pal.a[1] }));
    const gB = wfEl('linearGradient', { id: 'wf-grad-b', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
    gB.appendChild(wfEl('stop', { offset: '0%',   'stop-color': pal.b[0] }));
    gB.appendChild(wfEl('stop', { offset: '100%', 'stop-color': pal.b[1] }));
    const hubGrad = wfEl('radialGradient', { id: 'wf-hub-grad', cx: '38%', cy: '32%', r: '70%' });
    hubGrad.appendChild(wfEl('stop', { offset: '0%',   'stop-color': pal.b[1] }));
    hubGrad.appendChild(wfEl('stop', { offset: '55%',  'stop-color': pal.a[1] }));
    hubGrad.appendChild(wfEl('stop', { offset: '100%', 'stop-color': '#08050F' }));
    const rimFade = wfEl('radialGradient', { id: 'wf-rim-fade', cx: '50%', cy: '50%', r: '50%' });
    rimFade.appendChild(wfEl('stop', { offset: '0%',   'stop-color': 'rgba(0,0,0,0)' }));
    rimFade.appendChild(wfEl('stop', { offset: '72%',  'stop-color': 'rgba(0,0,0,0)' }));
    rimFade.appendChild(wfEl('stop', { offset: '100%', 'stop-color': 'rgba(0,0,0,0.30)' }));
    [gA, gB, hubGrad, rimFade].forEach(g => defs.appendChild(g));
    svg.appendChild(defs);

    /* outer shadow ring */
    svg.appendChild(wfEl('circle', { cx: WF_CX, cy: WF_CY, r: WF_R + 2, fill: 'none', stroke: 'rgba(0,0,0,.5)', 'stroke-width': '3' }));

    const sectorsG = wfEl('g', { id: 'wf-sectors' });
    const pinsG    = wfEl('g', { id: 'wf-pins' });
    const labelsG  = wfEl('g', { id: 'wf-labels' });

    for (let i = 0; i < count; i++) {
        const s = wfSeg(i, count);
        const fillId = (i % 2 === 0) ? 'url(#wf-grad-a)' : 'url(#wf-grad-b)';

        sectorsG.appendChild(wfEl('path', {
            d: `M ${WF_CX} ${WF_CY} L ${s.p1.x.toFixed(3)} ${s.p1.y.toFixed(3)} A ${WF_R} ${WF_R} 0 ${s.large} 1 ${s.p2.x.toFixed(3)} ${s.p2.y.toFixed(3)} Z`,
            fill: fillId, stroke: 'rgba(0,0,0,.4)', 'stroke-width': '.35', 'data-idx': i
        }));

        // Divider line
        sectorsG.appendChild(wfEl('line', {
            x1: WF_CX, y1: WF_CY, x2: s.p1.x.toFixed(3), y2: s.p1.y.toFixed(3),
            stroke: 'rgba(255,255,255,.08)', 'stroke-width': '.4'
        }));

        // Pin/stud at each divider on the rim (casino wheel detail)
        const pinPt = wfPolar(WF_R - 1.2, s.startDeg);
        pinsG.appendChild(wfEl('circle', {
            cx: pinPt.x.toFixed(3), cy: pinPt.y.toFixed(3), r: '0.9',
            fill: pal.accent, opacity: '0.55'
        }));

        wfSectorText(labelsG, tasks[i].label, s.midDeg, count);
    }

    svg.appendChild(sectorsG);
    svg.appendChild(pinsG);
    // Subtle vignette overlay on top of sectors for depth
    svg.appendChild(wfEl('circle', { cx: WF_CX, cy: WF_CY, r: WF_R, fill: 'url(#wf-rim-fade)', 'pointer-events': 'none' }));
    svg.appendChild(labelsG);

    // Outer rim rings
    svg.appendChild(wfEl('circle', { cx: WF_CX, cy: WF_CY, r: WF_R, fill: 'none', stroke: pal.accent, 'stroke-width': '1.1', opacity: '.55' }));
    svg.appendChild(wfEl('circle', { cx: WF_CX, cy: WF_CY, r: WF_R - 0.9, fill: 'none', stroke: 'rgba(255,255,255,.06)', 'stroke-width': '.5' }));

    // Hub
    svg.appendChild(wfEl('circle', { cx: WF_CX, cy: WF_CY + 0.6, r: WF_HUB_R + 1.6, fill: 'rgba(0,0,0,.5)' }));
    svg.appendChild(wfEl('circle', { cx: WF_CX, cy: WF_CY, r: WF_HUB_R, fill: 'url(#wf-hub-grad)', stroke: pal.accent, 'stroke-width': '.9' }));
    svg.appendChild(wfEl('circle', { cx: WF_CX - 2.2, cy: WF_CY - 3, r: WF_HUB_R * 0.5, fill: 'rgba(255,255,255,.05)', 'pointer-events': 'none' }));
    const sym = wfEl('text', {
        x: WF_CX, y: WF_CY, 'text-anchor': 'middle', 'dominant-baseline': 'middle',
        'font-size': '7.5', fill: pal.accent, 'font-family': 'serif', opacity: '.75', 'pointer-events': 'none'
    });
    sym.textContent = '✦';
    svg.appendChild(sym);
}

/* ── Огни по периметру (казино-марквиза) ─────────────────── */
let _wfLightsBuilt = 0;
function buildWheelLights() {
    const frame = document.getElementById('wheelFrame');
    const wrap  = document.getElementById('wheelLights');
    if (!frame || !wrap) return;
    const size = frame.clientWidth || 320;
    const N = 22;
    if (_wfLightsBuilt === N && wrap.dataset.size === String(size)) return; // не пересоздаём без нужды
    wrap.innerHTML = '';
    wrap.dataset.size = String(size);
    const radius = size / 2 - 3;
    for (let i = 0; i < N; i++) {
        const ang = (360 / N) * i;
        const dot = document.createElement('div');
        dot.className = 'wf-light';
        dot.style.setProperty('--ang', ang + 'deg');
        dot.style.setProperty('--r', radius + 'px');
        dot.style.animationDelay = (-(i / N) * 2.4).toFixed(3) + 's';
        wrap.appendChild(dot);
    }
    _wfLightsBuilt = N;
}

function setWheelLightsMode(mode) {
    const wrap = document.getElementById('wheelLights');
    if (!wrap) return;
    wrap.classList.remove('spinning', 'win');
    if (mode) wrap.classList.add(mode);
}

/* ── Звук (Web Audio, без файлов) ─────────────────────────── */
let _wfAudioCtx = null;
function wfAudio() {
    try {
        if (!_wfAudioCtx) _wfAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (_wfAudioCtx.state === 'suspended') _wfAudioCtx.resume();
        return _wfAudioCtx;
    } catch (e) { return null; }
}

function wfPlayTick() {
    const ctx = wfAudio();
    if (!ctx) return;
    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
}

function wfPlayWin() {
    const ctx = wfAudio();
    if (!ctx) return;
    try {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
        notes.forEach((freq, i) => {
            const t0 = ctx.currentTime + i * 0.09;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t0);
            gain.gain.setValueAtTime(0, t0);
            gain.gain.linearRampToValueAtTime(0.09, t0 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(t0); osc.stop(t0 + 0.55);
        });
    } catch (e) {}
}

/* ── Easing (совпадает с CSS cubic-bezier колеса) ─────────── */
function wfEase(t, x1, y1, x2, y2) {
    let s = t;
    for (let i = 0; i < 6; i++) {
        const bt = 3*s*(1-s)*(1-s)*x1 + 3*s*s*(1-s)*x2 + s*s*s;
        const ds = 3*(1-s)*(1-s)*x1 + 6*s*(1-s)*(x2-x1) + 3*s*s*(1-x2);
        if (Math.abs(ds) < 1e-6) break;
        s -= (bt - t) / ds;
    }
    return 3*s*(1-s)*(1-s)*y1 + 3*s*s*(1-s)*y2 + s*s*s;
}

/* ── Состояние вращения ───────────────────────────────────── */
let _wfSpinning = false;
let _wfTickRaf = null;
let _wfLastSector = -1;
const WF_SPIN_MS = 5200;
const WF_EASE = [0.11, 0.94, 0.20, 1.0]; // тяжёлый физичный ход

function wfStartTickLoop(startRot, endRot) {
    const count = getWheelTasks().length;
    const segAngle = 360 / count;
    const t0 = performance.now();
    const pointer = document.getElementById('wheelPointer');

    function frame(now) {
        if (!_wfSpinning) return;
        const p = Math.min(1, (now - t0) / WF_SPIN_MS);
        const eased = wfEase(p, ...WF_EASE);
        const curRot = startRot + (endRot - startRot) * eased;
        const visualTop = ((0 - curRot) % 360 + 360) % 360; // какой "видимый" угол сейчас под указателем
        const sector = Math.floor(visualTop / segAngle) % count;

        if (sector !== _wfLastSector) {
            _wfLastSector = sector;
            if (pointer) {
                pointer.classList.remove('wf-tick');
                void pointer.offsetWidth;
                pointer.classList.add('wf-tick');
            }
            if (navigator.vibrate) navigator.vibrate(7);
            // Тик реже к концу вращения не спамит — звук лёгкий, безопасно
            wfPlayTick();
        }

        // Анticipация в последние 18%
        const box = document.getElementById('wheelFrame');
        if (box) box.classList.toggle('wf-anticipation', p > 0.82 && p < 1);

        if (p < 1) _wfTickRaf = requestAnimationFrame(frame);
    }
    _wfTickRaf = requestAnimationFrame(frame);
}

/* ── open/close ────────────────────────────────────────────── */
function openWheel() {
    renderWheel();
    buildWheelLights();
    setWheelLightsMode(null);
    const overlay = document.getElementById('wheelOverlay');
    const result  = document.getElementById('wheelResult');
    const spinBtn = document.getElementById('spinBtn');
    const wheelEl = document.getElementById('wheelSvg');
    const box     = document.getElementById('wheelFrame');
    if (overlay) overlay.classList.add('show');
    if (result)  result.style.display = 'none';
    if (spinBtn) {
        spinBtn.style.display = 'flex';
        spinBtn.disabled = false;
        spinBtn.textContent = typeof t === 'function' ? t('wheel_spin') : 'SPIN';
    }
    if (wheelEl) {
        wheelEl.style.transition = 'none';
        wheelEl.style.transform = `rotate(${state.wheel.rotation}deg)`;
    }
    if (box) box.classList.remove('wf-anticipation');
    _wfSpinning = false;
    _wfLastSector = -1;

    // Пересчитать огни при ресайзе, пока колесо открыто
    if (!window._wfResizeHooked) {
        window._wfResizeHooked = true;
        let rTimer;
        window.addEventListener('resize', () => {
            clearTimeout(rTimer);
            rTimer = setTimeout(() => {
                if (document.getElementById('wheelOverlay')?.classList.contains('show')) buildWheelLights();
            }, 150);
        });
    }
}

function closeWheel() {
    const overlay = document.getElementById('wheelOverlay');
    if (overlay) overlay.classList.remove('show');
    _wfSpinning = false;
    if (_wfTickRaf) cancelAnimationFrame(_wfTickRaf);
    setWheelLightsMode(null);
}

/* ── spin ──────────────────────────────────────────────────── */
function spinWheel() {
    const btn = document.getElementById('spinBtn');
    if (!btn || btn.disabled || _wfSpinning) return;
    btn.disabled = true;
    _wfSpinning = true;
    _wfLastSector = -1;
    setWheelLightsMode('spinning');

    const tasks = getWheelTasks();
    const count = tasks.length;
    const angle = 360 / count;
    const targetIndex = Math.floor(Math.random() * count);

    // Видимый угол центра выигрышного сектора (0 = верх, по часовой)
    const segCenter = targetIndex * angle + angle / 2;
    // Требуемый угол поворота (mod 360) — см. комментарий вверху файла
    const stopAt = (360 - segCenter + 360) % 360;

    const spins   = 6 + Math.floor(Math.random() * 3); // 6–8 полных оборотов
    const prevRot = state.wheel.rotation;
    const cur     = prevRot % 360;
    const offset  = ((stopAt - cur) % 360 + 360) % 360;
    const newRot  = prevRot + spins * 360 + offset;

    state.wheel.rotation = newRot;

    const wheelEl = document.getElementById('wheelSvg');
    if (wheelEl) {
        wheelEl.style.transition = `transform ${WF_SPIN_MS}ms cubic-bezier(${WF_EASE.join(',')})`;
        wheelEl.style.transform  = `rotate(${newRot}deg)`;
    }

    wfStartTickLoop(prevRot, newRot);

    setTimeout(() => {
        _wfSpinning = false;
        if (_wfTickRaf) cancelAnimationFrame(_wfTickRaf);
        const box = document.getElementById('wheelFrame');
        if (box) box.classList.remove('wf-anticipation');

        const pointer = document.getElementById('wheelPointer');
        if (pointer) {
            pointer.classList.add('wf-win');
            setTimeout(() => pointer.classList.remove('wf-win'), 750);
        }
        setWheelLightsMode('win');
        flashWinningSector(targetIndex, count);
        wfPlayWin();
        if (navigator.vibrate) navigator.vibrate([16, 40, 16, 40, 30]);

        setTimeout(() => showWheelResult(targetIndex), 650);
    }, WF_SPIN_MS + 60);
}

/* ── Победная подсветка + дуга-трейл ─────────────────────────── */
function flashWinningSector(idx, count) {
    const svg = document.getElementById('wheelSvg');
    if (!svg) return;
    const path = svg.querySelector(`#wf-sectors path[data-idx="${idx}"]`);
    if (path) {
        path.style.transition = 'filter .25s ease';
        path.style.filter = 'brightness(1.9) saturate(1.3) drop-shadow(0 0 4px rgba(212,175,55,.9))';
        setTimeout(() => { path.style.filter = ''; }, 1000);
    }
    // Дуга-обводка ровно по выигрышному сектору
    const s = wfSeg(idx, count);
    const rOuter = WF_R + 1.6;
    const p1 = wfPolar(rOuter, s.startDeg);
    const p2 = wfPolar(rOuter, s.endDeg);
    const arc = wfEl('path', {
        d: `M ${p1.x.toFixed(3)} ${p1.y.toFixed(3)} A ${rOuter} ${rOuter} 0 ${s.large} 1 ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`,
        fill: 'none', stroke: 'var(--gold, #D4AF37)', 'stroke-width': '2.2',
        'stroke-linecap': 'round', class: 'wf-victory-arc'
    });
    svg.appendChild(arc);
    setTimeout(() => { if (arc.parentNode) arc.parentNode.removeChild(arc); }, 1200);
}

/* ── Результат / карточка задания (бизнес-логика без изменений) ── */
function showWheelResult(index) {
    const task    = getWheelTasks()[index];
    const spinBtn = document.getElementById('spinBtn');
    const res     = document.getElementById('wheelResult');
    if (spinBtn) spinBtn.style.display = 'none';
    if (res) res.style.display = 'block';
    const rt   = document.getElementById('wheelResultType');
    const rtxt = document.getElementById('wheelResultText');
    const rd   = document.getElementById('wheelResultDesc');
    if (rt)   rt.textContent   = task.label;
    if (rtxt) rtxt.textContent = task.text;
    if (rd)   rd.textContent   = task.desc;
    state.wheel.currentTask  = { ...task, index: index, date: new Date().toDateString() };
    state.wheel.completed    = false;
    state.wheel.lastSpinDate = new Date().toDateString();
    save();
}

function claimWheelTask() {
    closeWheel();
    renderWheelTaskCard();
}

function renderWheelTaskCard() {
    const card  = document.getElementById('wheelTaskCard');
    const saved = state.wheel.currentTask;
    const today = new Date().toDateString();
    if (!card) return;
    if (!saved || saved.date !== today) { card.classList.remove('show'); return; }
    const idx  = typeof saved.index === 'number' ? saved.index : 0;
    const task = getWheelTasks()[idx] || saved;
    card.classList.add('show');
    const wt   = document.getElementById('wheelTaskType');
    const wtxt = document.getElementById('wheelTaskText');
    const wd   = document.getElementById('wheelTaskDesc');
    const btn  = document.getElementById('wheelTaskBtn');
    if (wt)   wt.textContent   = task.label;
    if (wtxt) wtxt.textContent = task.text;
    if (wd)   wd.textContent   = task.desc;
    if (state.wheel.completed) {
        card.classList.add('done');
        if (btn) { btn.textContent = t('wheel_task_done'); btn.classList.remove('do'); btn.classList.add('done'); btn.disabled = true; }
    } else {
        card.classList.remove('done');
        if (btn) { btn.textContent = t('wheel_task_do'); btn.classList.remove('done'); btn.classList.add('do'); btn.disabled = false; }
    }
}

function completeWheelTask() {
    if (!state.wheel.currentTask || state.wheel.completed) return;
    state.wheel.completed = true;
    save();
    renderWheelTaskCard();
    if (typeof confetti === 'function') {
        confetti({ particleCount: 90, spread: 65, origin: { y: 0.65 }, colors: ['#D4AF37', '#8B5CF6', '#C0392B', '#ffffff'] });
    }
    showToast(t('wheel_complete_toast'));
}

function checkWheelDaily() {
    const today = new Date().toDateString();
    if (state.wheel.lastSpinDate !== today) {
        state.wheel.currentTask = null;
        state.wheel.completed   = false;
        openWheel();
    } else {
        renderWheelTaskCard();
    }
}

function testWheel() {
    state.wheel.lastSpinDate = null;
    state.wheel.currentTask  = null;
    state.wheel.completed    = false;
    openWheel();
}
