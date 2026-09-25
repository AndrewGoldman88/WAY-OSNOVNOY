/* =========================================================
           STATS
           ========================================================= */
        function animateNumber(el, target, duration = 900) {
            if (!el) return;
            const start = Number(el.dataset.val || 0);
            if (start === target) { el.textContent = target; return; }
            el.dataset.val = target;
            const t0 = performance.now();
            const ease = t => 1 - Math.pow(1 - t, 3);
            function step(now) {
                const p = Math.min(1, (now - t0) / duration);
                const v = Math.round(start + (target - start) * ease(p));
                el.textContent = v;
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        function renderStats() {
            const d = currentDay();
            const best = Math.max(state.bestStreak, d);
            const attempts = state.relapses.length + 1;
            const totalPast = state.relapses.reduce((s, r) => s + r.streakDays, 0);
            const total = totalPast + d;
            const avg = Math.round(total / attempts);

            animateNumber(document.getElementById('statCurrent'), d);
            animateNumber(document.getElementById('statBest'), best);
            animateNumber(document.getElementById('statAttempts'), attempts);
            animateNumber(document.getElementById('statTotal'), total);
            animateNumber(document.getElementById('statAvg'), avg);

            const nr = nextRankL(d);
            const ring = document.getElementById('statHeroRingFill');
            const CIRC = 251.2;
            if (nr) {
                const prevThreshold = rankForDayL(d).day;
                const span = Math.max(1, nr.day - prevThreshold);
                const progress = Math.min(1, (d - prevThreshold) / span);
                ring.style.stroke = 'var(--gold)';
                ring.style.strokeDashoffset = String(CIRC * (1 - progress));
                const daysLeft = nr.day - d;
                document.getElementById('statHeroSub').innerHTML = t('stat_days_left')(nr.name, daysLeft);
            } else {
                ring.style.stroke = 'var(--violet)';
                ring.style.strokeDashoffset = '0';
                document.getElementById('statHeroSub').textContent = t('stat_all_ranks');
            }
            document.getElementById('statHeroTitle').textContent = rankForDayL(d).name;

            const maxVal = Math.max(best, attempts, total, avg, 1);
            const bars = [
                ['statBarBest', best], ['statBarAttempts', attempts],
                ['statBarTotal', total], ['statBarAvg', avg]
            ];
            bars.forEach(([id, v]) => {
                const el = document.getElementById(id);
                if (el) requestAnimationFrame(() => { el.style.width = `${Math.max(4, Math.round((v / maxVal) * 100))}%`; });
            });

            const history = [...state.relapses.map(r => r.streakDays), d];
            const last = history.slice(-8);
            const max = Math.max(...last, 1);
            document.getElementById('barsWrap').innerHTML = `<div class="bars">` + last.map((v, i) => {
                const isCurrent = i === last.length - 1;
                const h = Math.max(4, Math.round((v / max) * 90));
                return `<div class="bar-col"><div class="bar-fill ${isCurrent?'current':''}" style="height:${h}px"></div><div class="bar-tag">${v}</div></div>`;
            }).join('') + `</div>`;

            const locale = state.lang === 'en' ? 'en-GB' : 'ru-RU';
            const rl = document.getElementById('relapseList');
            if (state.relapses.length === 0) {
                rl.innerHTML = `<div class="empty-note">${t('stat_no_relapses')}</div>`;
            } else {
                rl.innerHTML = [...state.relapses].reverse().map(r => {
                    const dt = new Date(r.date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
                    return `<div class="j-entry"><div class="j-meta">${dt} · ${t('stat_streak_held')} ${r.streakDays} ${t('stat_streak_days')}</div>
                <div class="j-text">${r.reason ? escapeHtml(r.reason) : t('stat_reason_none')}</div></div>`;
                }).join('');
            }

            const sexTitle = document.getElementById('sexSectionTitle');
            const sexList = document.getElementById('sexLogList');
            if (state.mode === 'nofap' || state.sexLog.length > 0) {
                sexTitle.style.display = 'flex';
                sexTitle.innerHTML = `<div class="dash"></div>${t('stat_sex')}`;
                if (state.sexLog.length === 0) {
                    sexList.innerHTML = `<div class="empty-note">${t('stat_no_sex')}</div>`;
                } else {
                    sexList.innerHTML = [...state.sexLog].reverse().map(s => {
                        const dt = new Date(s.date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
                        const feelingText = resolveSexFeeling(s);
                        return `<div class="j-entry"><div class="j-meta">${dt} · ${t('stat_streak_day')} ${s.day} · ${t('stat_sex_no_reset')}</div>
                  <div class="j-text">${escapeHtml(feelingText)}</div></div>`;
                    }).join('');
                }
            } else {
                sexTitle.style.display = 'none';
                sexList.innerHTML = '';
            }

            renderTaskStats();
            renderMoodStats();
            renderTriggerMap();
        }


function renderTaskStats() {
    const wrap = document.getElementById('taskStatsWrap');
    if (!wrap) return;

    const log = state.taskLog || {};
    const rows = [];

    Object.entries(log).forEach(([dateKey, entry]) => {
        if (!entry || typeof entry !== 'object') return;

        if (entry.versions && typeof entry.versions === 'object') {
            Object.values(entry.versions).forEach(version => {
                if (version && version.tasks) rows.push([dateKey, version]);
            });
        } else if (entry.tasks) {
            // Legacy records remain supported.
            rows.push([dateKey, entry]);
        }
    });

    rows.sort((a,b) => {
        const da = new Date(`${a[0]}T12:00:00`).getTime();
        const db = new Date(`${b[0]}T12:00:00`).getTime();
        return da - db || (Number(a[1].dayNo) - Number(b[1].dayNo));
    });

    const counts = { spirit:0, mind:0, body:0 };
    let totalAssigned = 0, totalDone = 0;
    rows.forEach(([,entry]) => {
        ['spirit','mind','body'].forEach(cat => {
            totalAssigned++;
            if (entry.tasks[cat]?.done) { counts[cat]++; totalDone++; }
        });
    });

    const labels = { spirit:t('task_spirit'), mind:t('task_mind'), body:t('task_body') };
    const cards = ['spirit','mind','body'].map(cat => `<div class="task-stat-box"><div class="task-stat-icon">${cat === 'spirit' ? '✦' : cat === 'mind' ? '◈' : '◆'}</div><div><div class="task-stat-num">${counts[cat]}</div><div class="task-stat-label">${labels[cat]}</div></div></div>`).join('');
    const recent = rows.slice(-14).reverse().map(([key,entry]) => {
        const locale = state.lang === 'en' ? 'en-GB' : 'ru-RU';
        const date = new Date(`${key}T12:00:00`).toLocaleDateString(locale, {day:'numeric',month:'short'});
        const done = ['spirit','mind','body'].filter(cat => entry.tasks[cat]?.done);
        const names = done.length ? done.map(cat => labels[cat]).join(' · ') : t('task_none_done');
        const rank = getRanks().find(r => r.day === entry.rankDay) || rankForDayL(entry.dayNo || 0);
        return `<div class="task-stat-history-row"><div><div class="task-stat-date">${date} · ${t('task_day')} ${entry.dayNo}</div><div class="task-stat-rank">${escapeHtml(rank.name)}</div></div><div class="task-stat-done ${done.length ? '' : 'empty'}">${escapeHtml(names)} <span>${done.length}/3</span></div></div>`;
    }).join('');
    wrap.innerHTML = `<div class="task-stat-grid">${cards}</div><div class="task-stat-summary"><span>${t('task_completed')}: <b>${totalDone}</b></span><span>${t('task_completion')}: <b>${totalAssigned ? Math.round(totalDone/totalAssigned*100) : 0}%</b></span></div>${recent ? `<div class="task-stat-history-title">${t('task_recent')}</div><div class="task-stat-history">${recent}</div>` : `<div class="empty-note">${t('task_no_history')}</div>`}`;
}

function renderMoodStats() {
            const entries = [...state.moodLog].sort((a, b) => new Date(a.date) - new Date(b.date));
            const wrap = document.getElementById('moodChartWrap');
            const insightEl = document.getElementById('moodInsight');
            if (entries.length < 3) {
                wrap.innerHTML = `<div class="empty-note">${t('stat_no_mood')}</div>`;
                insightEl.textContent = '';
                return;
            }
            const last = entries.slice(-14);
            const w = 300,
                h = 90,
                pad = 8;
            const stepX = last.length > 1 ? (w - 2 * pad) / (last.length - 1) : 0;
            const coords = last.map((e, i) => {
                const x = pad + i * stepX;
                const y = h - pad - ((e.value - 1) / 9) * (h - 2 * pad);
                return { x, y };
            });
            const points = coords.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
            const dots = coords.map(c =>
                `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="2.5" style="fill:var(--gold)"/>`).join('');
            wrap.innerHTML = `<div class="bars" style="height:auto;padding:14px 10px;"><svg viewBox="0 0 ${w} ${h}" style="width:100%;height:90px;">
            <polyline points="${points}" fill="none" style="stroke:var(--violet)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
            ${dots}
          </svg></div>`;

            const xs = entries.map(e => e.day);
            const ys = entries.map(e => e.value);
            const r = pearson(xs, ys);
            if (entries.length < 5 || r === null) {
                insightEl.textContent = t('stat_corr_need_more');
            } else if (r > 0.3) {
                insightEl.textContent = t('stat_corr_positive')(r.toFixed(2));
            } else if (r < -0.3) {
                insightEl.textContent = t('stat_corr_negative')(r.toFixed(2));
            } else {
                insightEl.textContent = t('stat_corr_none')(r.toFixed(2));
            }
        }

        function renderTriggerMap() {
            const wrap = document.getElementById('triggerMapWrap');
            const relapses = state.relapses;
            if (relapses.length < 3) {
                wrap.innerHTML = `<div class="empty-note">${t('stat_no_triggers')}</div>`;
                return;
            }
            const dayCounts = {},
                timeCounts = {},
                reasonCounts = {};
            relapses.forEach(r => {
                const dt = new Date(r.date);
                const dow = dt.getDay();
                dayCounts[dow] = (dayCounts[dow] || 0) + 1;
                const tb = timeBucket(dt.getHours());
                timeCounts[tb.id] = (timeCounts[tb.id] || 0) + 1;
                if (r.reasonTag) { reasonCounts[r.reasonTag] = (reasonCounts[r.reasonTag] || 0) + 1; }
            });
            const topDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
            const topTimeId = Object.entries(timeCounts).sort((a, b) => b[1] - a[1])[0][0];
            const timeLabels = {
                morning: t('time_morning'), day: t('time_day'),
                evening: t('time_evening'), night: t('time_night')
            };
            const topReasonEntry = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0];
            const topReasonLabel = topReasonEntry ? (getRelReasons().find(r => r.id === topReasonEntry[0]) || {}).label : null;
            const dayLabel = getDayNamePlural ? getDayNamePlural(topDay[0]) : DAY_NAMES_PLURAL[topDay[0]];
            const sentence = t('stat_trigger_sentence')(timeLabels[topTimeId], dayLabel, topReasonLabel);

            const reasonRows = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]).map(([id, count]) => {
                const label = (getRelReasons().find(r => r.id === id) || {}).label || id;
                return `<div class="j-entry"><div class="j-text">${escapeHtml(label)} — ${count}</div></div>`;
            }).join('');

            wrap.innerHTML = `<div class="aura-card" style="margin-top:0"><div class="aura-text">${sentence}</div></div>` +
                (reasonRows ? `<div class="cosmetic-group-label">${t('stat_by_reasons')}</div>${reasonRows}` : '');
        }

/* =========================================================
   Резолв текста ощущения после секса по текущему языку.
   Новые записи хранят feelingIdx — просто берём перевод.
   Старые записи (до фикса локализации) хранят только готовый
   русский текст — ищем совпадение среди русских SEX_FEELINGS
   и подставляем перевод на нужном индексе. Если совпадения нет
   (текст был изменён вручную/кастомный) — показываем как есть.
   ========================================================= */
function resolveSexFeeling(entry) {
    if (typeof entry.feelingIdx === 'number') {
        const list = getSexFeelings();
        if (list[entry.feelingIdx] !== undefined) return list[entry.feelingIdx];
    }
    // Легаси-запись без индекса — ищем среди русских вариантов
    if (entry.feeling && typeof SEX_FEELINGS !== 'undefined') {
        const idx = SEX_FEELINGS.indexOf(entry.feeling);
        if (idx !== -1) {
            const list = getSexFeelings();
            if (list[idx] !== undefined) return list[idx];
        }
    }
    // Ничего не нашли — показываем сохранённый текст как есть
    return entry.feeling || '';
}
