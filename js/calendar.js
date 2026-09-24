/* =========================================================
           CALENDAR — PATH + DAILY TASK HISTORY
           ========================================================= */
let calendarCursor = new Date();

function dateKeyLocal(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getTaskHistoryForDate(date) {
    const key = dateKeyLocal(date);
    const dayNo = taskDayForDate(date);
    const saved = state.taskLog && state.taskLog[key];

    if (dayNo < 0) {
        // If the current start date moved forward, preserve access to an
        // older saved version for this calendar date when one exists.
        if (saved?.tasks) {
            const set = getTaskSetForDay(saved.dayNo);
            return { key, dayNo:saved.dayNo, rankDay:saved.rankDay, index:saved.index, tasks:saved.tasks, set };
        }
        return null;
    }

    const set = getTaskSetForDay(dayNo);
    const startKey = dateKeyLocal(new Date(state.startDate));
    const identity = `${startKey}|${dayNo}|${set.rankDay}|${set.index}`;

    if (saved?.versions?.[identity]) {
        const version = saved.versions[identity];
        return { key, dayNo:version.dayNo, rankDay:version.rankDay, index:version.index, tasks:version.tasks, set };
    }

    // Legacy/current top-level record is valid only when it belongs to the
    // currently calculated task identity. Otherwise show the newly derived
    // tasks as not completed instead of carrying completion over to another set.
    if (saved?.tasks && saved._taskIdentity === identity) {
        return { key, dayNo:saved.dayNo, rankDay:saved.rankDay, index:saved.index, tasks:saved.tasks, set };
    }

    return {
        key, dayNo, rankDay:set.rankDay, index:set.index,
        tasks:{ spirit:{done:false,completedAt:null}, mind:{done:false,completedAt:null}, body:{done:false,completedAt:null} },
        set
    };
}

function calendarDayData(date) {
    const key = dateKeyLocal(date);
    const today = new Date();
    const cellDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isFuture = cellDay > todayDay;
    const start = new Date(state.startDate);
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const relapse = state.relapses.find(r => dateKeyLocal(r.date) === key);
    const mood = state.moodLog.find(m => dateKeyLocal(m.date) === key);
    const journal = state.journal.filter(j => dateKeyLocal(j.date) === key);
    const taskHistory = getTaskHistoryForDate(date);
    const isPath = !isFuture && (cellDay >= startDay || state.relapses.some(r => new Date(r.date).setHours(0,0,0,0) >= cellDay.getTime()));
    const path = isPath && !isFuture;
    let dayNo = null;
    if (taskHistory && Number.isFinite(taskHistory.dayNo)) dayNo = taskHistory.dayNo;
    else if (path && cellDay >= startDay) dayNo = Math.floor((cellDay - startDay) / DAY_MS);
    const hard = !relapse && !!mood && Number(mood.value) <= 4;
    const status = relapse ? 'relapse' : (hard ? 'hard' : (path ? 'clean' : 'none'));
    const rank = dayNo !== null ? rankForDay(dayNo) : null;
    const isNewRank = !!rank && rank.day > 0 && dayNo === rank.day;
    return { key, isFuture, path, taskHistory, mood, journal, relapse, dayNo, hard, status, rank, isNewRank };
}

function calendarMove(delta) {
    calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + delta, 1);
    renderCalendar();
}

function calendarLocale() { return (typeof state !== 'undefined' && state.lang === 'en') ? 'en-GB' : 'ru-RU'; }
function calendarStatusLabel(status) {
    if (status === 'relapse') return t('cal_legend_relapse');
    if (status === 'hard') return t('cal_legend_hard');
    if (status === 'clean') return t('cal_legend_clean');
    return '—';
}

function calendarTaskDoneLabel(done) {
    const L = k => typeof t === 'function' ? t(k) : k;
    return done ? `✓ ${L('cal_detail_done')}` : `— ${L('cal_detail_not_done')}`;
}

function calendarSelect(date) {
    const data = calendarDayData(date);
    const box = document.getElementById('calendarDetail');
    if (!box) return;
    const locale = calendarLocale();
    const dateLabel = date.toLocaleDateString(locale, { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const rows = [];
    const statusClass = data.status === 'none' ? '' : data.status;
    const statusDot = data.status === 'relapse' ? '🔴' : data.status === 'hard' ? '🟡' : data.status === 'clean' ? '🟣' : '·';
    if (data.status !== 'none') rows.push(`<div class="calendar-detail-status ${statusClass}">${statusDot} ${calendarStatusLabel(data.status)}</div>`);

    const L = k => typeof t === 'function' ? t(k) : k;
    if (data.dayNo !== null) rows.push(`<div class="calendar-detail-row"><strong>${L('cal_detail_day_path')}:</strong> ${data.dayNo}</div>`);
    if (data.isNewRank) rows.push(`<div class="calendar-detail-row"><strong>⭐ ${L('cal_detail_new_rank')}:</strong> ${escapeHtml(data.rank.name)}</div>`);
    if (data.mood) rows.push(`<div class="calendar-detail-row"><strong>${L('cal_detail_mood')}:</strong> ${data.mood.value}/10</div>`);
    else rows.push(`<div class="calendar-detail-row"><strong>${L('cal_detail_mood')}:</strong> ${L('cal_detail_not_logged')}</div>`);
    rows.push(`<div class="calendar-detail-row"><strong>${L('cal_detail_energy')}:</strong> ${L('cal_detail_energy_na')}</div>`);
    if (data.relapse) rows.push(`<div class="calendar-detail-row"><strong>${L('cal_detail_relapse')}:</strong> ${escapeHtml(data.relapse.reason || L('cal_detail_relapse_logged'))}</div>`);

    if (data.taskHistory && data.dayNo !== null) {
        const taskLabels = { spirit:L('task_spirit'), mind:L('task_mind'), body:L('task_body') };
        const taskRows = ['spirit','mind','body'].map(cat => {
            const item = data.taskHistory.tasks[cat] || {done:false};
            const text = data.taskHistory.set[cat] || '';
            return `<div class="task-history-row ${item.done ? 'done' : ''}"><span class="task-history-category">${taskLabels[cat]}</span><span class="task-history-text">${escapeHtml(text)}</span><span class="task-history-status">${calendarTaskDoneLabel(!!item.done)}</span></div>`;
        }).join('');
        const doneCount = ['spirit','mind','body'].filter(cat => data.taskHistory.tasks[cat]?.done).length;
        rows.push(`<div class="calendar-detail-row"><strong>${L('cal_detail_tasks')}:</strong> ${doneCount}/3</div><div class="calendar-task-history">${taskRows}</div>`);
    }

    if (data.journal.length) rows.push(`<div class="calendar-detail-row"><strong>${L('cal_detail_journal')}:</strong>${data.journal.map(j => `<div class="calendar-journal">${escapeHtml(j.text)}</div>`).join('')}</div>`);
    else rows.push(`<div class="calendar-detail-row"><strong>${L('cal_detail_journal')}:</strong> ${L('cal_detail_no_entries')}</div>`);
    if (!rows.length) rows.push(`<div class="calendar-detail-row">${L('cal_detail_nothing')}</div>`);
    box.innerHTML = `<div class="calendar-detail-title">${dateLabel}</div>${rows.join('')}`;
    box.classList.add('show');
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const title = document.getElementById('calendarMonth');
    if (!grid || !title) return;
    const y = calendarCursor.getFullYear(), m = calendarCursor.getMonth();
    const locale = calendarLocale();
    title.textContent = new Date(y, m, 1).toLocaleDateString(locale, { month:'long', year:'numeric' });
    const first = new Date(y, m, 1);
    const days = new Date(y, m + 1, 0).getDate();
    let offset = first.getDay(); offset = offset === 0 ? 6 : offset - 1;
    const todayKey = dateKeyLocal(new Date());
    let html = '';
    for (let i=0; i<offset; i++) html += '<div class="cal-day empty"></div>';
    for (let d=1; d<=days; d++) {
        const date = new Date(y,m,d);
        const data = calendarDayData(date);
        const classes = ['cal-day'];
        if (data.isFuture) classes.push('future');
        if (data.path) classes.push('path');
        if (data.status === 'clean') classes.push('clean');
        if (data.status === 'hard') classes.push('hard');
        if (data.status === 'relapse') classes.push('relapse');
        if (data.taskHistory) classes.push('has-tasks');
        if (data.taskHistory && Object.values(data.taskHistory.tasks).filter(x => x.done).length === 3) classes.push('tasks-complete');
        if (data.key === todayKey) classes.push('today');
        const status = data.status !== 'none' ? `<span class="cal-status"></span>` : '';
        const taskMark = data.taskHistory ? `<span class="cal-task-mark">${Object.values(data.taskHistory.tasks).filter(x => x.done).length}</span>` : '';
        const star = data.isNewRank ? '<span class="cal-rank-star">★</span>' : '';
        const dayLabel = typeof t === 'function' ? t('cal_day_abbr') : 'д.';
        const dayNo = data.dayNo !== null ? `<div class="day-no">${dayLabel}${data.dayNo}</div>` : '';
        const click = data.isFuture ? '' : `onclick="calendarSelect(new Date(${y},${m},${d}))"`;
        html += `<div class="${classes.join(' ')}" ${click}>${status}${star}${taskMark}<div class="num">${d}</div>${dayNo}</div>`;
    }
    grid.innerHTML = html;
    const detail = document.getElementById('calendarDetail');
    if (detail) detail.classList.remove('show');
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
