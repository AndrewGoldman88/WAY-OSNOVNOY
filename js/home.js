/* =========================================================
           HOME + DAILY TASK SYSTEM
           ========================================================= */

let testRankDay = null;

function getDisplayedRankDay() { return currentDay(); }
function populateRankTestSelect() { const select = document.getElementById('rankTestSelect'); if (select) select.parentElement.style.display = 'none'; }
function setTestRank(value) { return; }
function resetTestRank() { return; }

const GLITCH_INTENSITY_BY_RANK = [
    0,0,0,0,0, 0.25,0.25,0.25,0.25,0.25,
    0.5,0.5,0.5,0.5,0.5, 0.75,0.75,0.75,0.75,0.75,
    1,1,1,1,1,1,1,1,1,1
];

function buildSigil() {
    const dPrecise = currentDayPrecise();
    const d = Math.floor(dPrecise);
    const rankDisplayDay = getDisplayedRankDay();
    const cx = 125, cy = 125, r = 100;
    const nr = nextRankL(d);
    const prevThreshold = rankForDayL(d).day;
    const nextThreshold = nr ? nr.day : prevThreshold + 30;
    const progress = nr ? Math.min(1, Math.max(0, (dPrecise - prevThreshold) / (nextThreshold - prevThreshold))) : 1;
    const circumference = 2 * Math.PI * r;
    const dash = circumference * progress;

    const svg = `<svg viewBox="0 0 250 250"><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" style="stroke:var(--line)" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--violet)" stroke-width="3" stroke-dasharray="${dash} ${circumference}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})" filter="url(#glow)"/></svg>`;

    const rank = rankForDayL(rankDisplayDay);
    const rankIndex = RANKS.findIndex(r => r.name === rank.name);
    const t = rankIndex >= 0 && rankIndex < GLITCH_INTENSITY_BY_RANK.length ? GLITCH_INTENSITY_BY_RANK[rankIndex] : Math.min(1, rankDisplayDay / 100);
    const gx = (1.5 + t * 2).toFixed(1);
    const gy = (1 + t * 1.5).toFixed(1);
    const gdur = (3 - t * 2.6).toFixed(2);
    const imgSrc = rankImageForDay(rankDisplayDay);
    const glitch = `<div class="glitch-stack"><img src="${imgSrc}" alt="" class="glitch-rgb r" style="--x:${gx}px;--y:${gy}px;animation-duration:${gdur}s"><img src="${imgSrc}" alt="" class="glitch-rgb g" style="--x:${gx}px;--y:${gy}px;animation-duration:${gdur}s;animation-delay:.08s"><img src="${imgSrc}" alt="" class="glitch-rgb b" style="--x:${gx}px;--y:${gy}px;animation-duration:${gdur}s;animation-delay:.15s"></div>`;

    const sigilWrap = document.getElementById('sigilWrap');
    if (!sigilWrap) return;
    sigilWrap.innerHTML = svg + glitch + '<img id="sigilImg" src="' + imgSrc + '" alt="sigil" class="sigil-img" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:72%;height:auto;z-index:2;pointer-events:none;filter:drop-shadow(0 0 20px var(--violet-glow));transition:filter 0.6s ease;">';
    const sigilImg = document.getElementById('sigilImg');
    if (sigilImg) sigilImg.onerror = () => { sigilImg.onerror = null; sigilImg.src = DEFAULT_SIGIL_IMG; };

    const ep = elapsedParts();
    const dayNum = document.getElementById('dayNum');
    const daySub = document.getElementById('daySub');
    if (dayNum) dayNum.textContent = d;
    if (daySub) {
        const dayWord = state.lang === 'en' ? (d === 1 ? 'day' : 'days') : (d === 1 ? 'день' : 'дней');
        daySub.textContent = `${dayWord} · ${ep.clock}`;
    }
}

function taskDateKey(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function taskDayForDate(date) {
    const d = new Date(date);
    const start = new Date(state.startDate);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    return Math.floor((day - startDay) / DAY_MS);
}

function ensureTaskLog(date = new Date()) {
    const key = taskDateKey(date);
    if (!state.taskLog) state.taskLog = {};

    const dayNo = taskDayForDate(date);
    if (dayNo < 0) return null;

    const set = getTaskSetForDay(dayNo);
    const startKey = taskDateKey(new Date(state.startDate));
    const identity = `${startKey}|${dayNo}|${set.rankDay}|${set.index}`;
    let record = state.taskLog[key];

    // New format: keep every task-set version for the calendar date.
    // This lets the user change startDate for testing without destroying
    // the completion history belonging to the previous start date.
    if (!record || typeof record !== 'object') record = {};
    if (!record.versions || typeof record.versions !== 'object') record.versions = {};

    // Migrate an old single-version entry into the versioned structure.
    if (record.tasks && !record._taskIdentity) {
        const oldIdentity = `${record.startDateKey || startKey}|${Number.isFinite(record.dayNo) ? record.dayNo : dayNo}|${record.rankDay ?? set.rankDay}|${record.index ?? set.index}`;
        record.versions[oldIdentity] = {
            dayNo: Number.isFinite(record.dayNo) ? record.dayNo : dayNo,
            rankDay: Number.isFinite(record.rankDay) ? record.rankDay : set.rankDay,
            index: Number.isFinite(record.index) ? record.index : set.index,
            startDateKey: record.startDateKey || startKey,
            tasks: record.tasks
        };
    }

    if (!record.versions[identity]) {
        record.versions[identity] = {
            dayNo,
            rankDay: set.rankDay,
            index: set.index,
            startDateKey: startKey,
            tasks: {
                spirit:{done:false,completedAt:null},
                mind:{done:false,completedAt:null},
                body:{done:false,completedAt:null}
            }
        };
    }

    const current = record.versions[identity];
    ['spirit','mind','body'].forEach(cat => {
        if (!current.tasks[cat]) current.tasks[cat] = { done:false, completedAt:null };
    });

    // Keep the old top-level shape for compatibility with existing code.
    record.dayNo = current.dayNo;
    record.rankDay = current.rankDay;
    record.index = current.index;
    record.startDateKey = current.startDateKey;
    record._taskIdentity = identity;
    record.tasks = current.tasks;
    record.__initialized = true;
    state.taskLog[key] = record;

    return { key, entry:current, set, identity };
}

function taskCategoryLabel(category) {
    const meta = TASK_CATEGORIES[category];
    return meta ? (state.lang === 'en' ? meta.labelEn : meta.label) : category;
}

function renderDailyTasks() {
    const pack = ensureTaskLog(new Date());
    if (!pack) return;
    const { entry, set } = pack;
    const categories = ['spirit','mind','body'];
    categories.forEach(cat => {
        const textEl = document.getElementById(`taskText-${cat}`);
        const checkEl = document.getElementById(`taskCheck-${cat}`);
        const card = document.getElementById(`taskCard-${cat}`);
        const labelEl = document.getElementById(`taskLabel-${cat}`);
        if (textEl) {
            textEl.textContent = set[cat];
            textEl.classList.toggle('done', !!entry.tasks[cat].done);
        }
        if (checkEl) {
            checkEl.classList.toggle('done', !!entry.tasks[cat].done);
            checkEl.textContent = entry.tasks[cat].done ? '✓' : '';
            checkEl.setAttribute('aria-label', entry.tasks[cat].done ? 'Выполнено' : 'Отметить выполнение');
        }
        if (card) card.classList.toggle('done', !!entry.tasks[cat].done);
        if (labelEl) labelEl.textContent = taskCategoryLabel(cat);
    });
    // Save only when a new day/task record was created.
    if (!state.taskLog[pack.key].__initialized) {
        state.taskLog[pack.key].__initialized = true;
        save();
    }
}

function toggleDailyTask(category) {
    if (!['spirit','mind','body'].includes(category)) return;
    const pack = ensureTaskLog(new Date());
    if (!pack) return;
    const item = pack.entry.tasks[category];
    item.done = !item.done;
    item.completedAt = item.done ? new Date().toISOString() : null;
    if (item.done) vibrate(15);
    save();
    renderDailyTasks();
    if (typeof renderStats === 'function' && document.getElementById('view-stats')?.classList.contains('active')) renderStats();
}

// Backward-compatible name for any old callers.
function toggleTask() { toggleDailyTask('body'); }

function renderHome() {
    buildSigil();
    const actualDay = currentDay();
    const d = getDisplayedRankDay();
    const rank = rankForDayL(d);
    const nr = nextRankL(d);
    const rankName = document.getElementById('rankName');
    const rankNext = document.getElementById('rankNext');
    const auraText = document.getElementById('auraText');
    if (rankName) rankName.textContent = rank.name;
    if (rankNext) rankNext.textContent = nr ? (state.lang === 'en' ? `${nr.day - actualDay} day${nr.day - actualDay === 1 ? '' : 's'} until «${nr.name}»` : `до ранга «${nr.name}» — ${nr.day - actualDay} дн.`) : (state.lang === 'en' ? 'highest rank reached' : 'высшая ступень пути');
    if (auraText) auraText.textContent = rank.aura;

    renderDailyTasks();
    const sexBtn = document.getElementById('sexBtn');
    if (sexBtn) sexBtn.style.display = state.mode === 'nofap' ? 'flex' : 'none';
    if (typeof renderMoodScale === 'function') renderMoodScale();
    if (typeof renderWheelTaskCard === 'function') renderWheelTaskCard();
}

function updateDayProgress() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start.getTime() + 86400000);
    const pct = Math.min(1, Math.max(0, (now - start) / (end - start)));
    const circumference = 2 * Math.PI * 118;
    const offset = circumference * (1 - pct);
    const ring = document.getElementById('dayProgressRing');
    if (ring) ring.style.strokeDashoffset = offset;
}
