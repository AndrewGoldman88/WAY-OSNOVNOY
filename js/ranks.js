/* =========================================================
   RANKS – с эпичным повышением в стиле main.css
   ========================================================= */

let previousRankDay = 0;

/* =========================================================
   ЭПИЧНЫЙ ОВЕРЛЕЙ ПОВЫШЕНИЯ (использует класс rank-ascension)
   ========================================================= */
function showEpicRankUp(rank) {
    if (document.querySelector('.rank-ascension.show')) return;

    const overlay = document.createElement('div');
    overlay.className = 'rank-ascension show';
    overlay.setAttribute('data-rank-day', rank.day);

    overlay.innerHTML = `
        <div class="rank-vignette"></div>
        <div class="rank-rays"></div>
        <div class="rank-orbit"></div>
        <div class="rank-core">
            <div class="rank-eyebrow">${t('rank_ascension_eyebrow')}</div>
            <div class="rank-crest">
                <img src="${typeof rankImageForDay === 'function' ? rankImageForDay(rank.day) : ''}" alt="" onerror="this.style.display='none'">
            </div>
            <div class="rank-number">${t('rank_ascension_prefix')} ${rank.day}</div>
            <div class="rank-title">${rank.name}</div>
            <div class="rank-divider"></div>
            <div class="rank-aura">${rank.aura}</div>
            <button class="rank-continue">${t('rank_continue')}</button>
        </div>
    `;

    document.body.appendChild(overlay);

    const continueBtn = overlay.querySelector('.rank-continue');
    continueBtn.addEventListener('click', () => closeRankOverlay(overlay));

    setTimeout(() => closeRankOverlay(overlay), 6000);
}

function closeRankOverlay(overlay) {
    if (!overlay || !overlay.classList.contains('show')) return;
    overlay.classList.remove('show');
    setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
    }, 600);
}

/* =========================================================
   ТЕСТОВАЯ ФУНКЦИЯ: ПОКАЗАТЬ СЛЕДУЮЩИЙ РАНГ
   ========================================================= */
function testNextRank() {
    const d = currentDay();
    const currentRank = rankForDay(d);
    const index = RANKS.findIndex(r => r.day === currentRank.day);
    let nextRank;
    if (index < RANKS.length - 1) {
        nextRank = RANKS[index + 1];
    } else {
        nextRank = RANKS[0];
    }
    showEpicRankUp(nextRank);
}

/* =========================================================
   СОЗДАНИЕ ТЕСТОВОЙ КНОПКИ
   ========================================================= */
function initTestButton() {
    if (document.getElementById('testRankBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'testRankBtn';
    btn.textContent = '⚡';
    btn.title = 'Тест повышения ранга';
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9998;
        font-size: 20px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid var(--line, #2A2D38);
        background: rgba(21, 23, 30, 0.7);
        backdrop-filter: blur(4px);
        color: var(--text-muted, #8A8D97);
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        transition: all 0.25s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        opacity: 0.5;
    `;
    btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(139, 92, 246, 0.25)';
        btn.style.borderColor = 'var(--violet, #8B5CF6)';
        btn.style.transform = 'scale(1.1)';
        btn.style.opacity = '1';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(21, 23, 30, 0.7)';
        btn.style.borderColor = 'var(--line, #2A2D38)';
        btn.style.transform = 'scale(1)';
        btn.style.opacity = '0.5';
    });
    btn.addEventListener('click', testNextRank);

    document.body.appendChild(btn);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestButton);
} else {
    initTestButton();
}

/* =========================================================
   ОСНОВНАЯ ФУНКЦИЯ ОТРИСОВКИ РАНГОВ
   ========================================================= */
function renderRanks() {
    const d = currentDay();
    const currentRank = rankForDayL(d);
    const best = Math.max(state.bestStreak, d);

    if (previousRankDay !== 0 && previousRankDay !== currentRank.day) {
        showEpicRankUp(currentRank);
    }
    previousRankDay = currentRank.day;

    const ranksL = getRanks();
    const dayWord = state.lang === 'en' ? 'day' : 'день';
    const wrap = document.getElementById('ranksList');
    wrap.innerHTML = ranksL.map((r, i) => {
        const unlocked = best >= r.day;
        const isCurrent = rankForDayL(d).day === r.day;
        return `<div class="rank-row ${unlocked?'unlocked':''} ${isCurrent?'current':''}">
              <div class="rank-icon">${unlocked?'✓':i+1}</div>
              <div class="rank-info">
                <div class="r-name">${r.name}</div>
                <div class="r-day">${dayWord} ${r.day}+</div>
                <div class="r-aura">${r.aura}</div>
              </div>
            </div>`;
    }).join('');

    const badges = [
        { on: state.journal.length > 0,   label: t('badge_first_entry') },
        { on: state.journal.length >= 7,   label: t('badge_7_entries')   },
        { on: best >= 7,                   label: t('badge_week')         },
        { on: best >= 30,                  label: t('badge_month')        },
        { on: best >= 100,                 label: t('badge_legend')       },
        { on: state.why.trim().length > 0, label: t('badge_goal')         }
    ];
    document.getElementById('badgeRow').innerHTML = badges.map(b =>
        `<div class="badge ${b.on?'on':''}">${b.label}</div>`).join('');

    renderCosmetics(best);
}

/* =========================================================
   КОСМЕТИКА (БЕЗ ИЗМЕНЕНИЙ)
   ========================================================= */
function renderCosmetics(best) {
    const particleRewards = COSMETIC_REWARDS.filter(r => r.type === 'particles');
    const bgRewards = COSMETIC_REWARDS.filter(r => r.type === 'bg');

    const dayPfx = state.lang === 'en' ? 'd.' : 'д.';
    const dayLbl = state.lang === 'en' ? 'day ' : 'день ';
    const offLbl = (typeof t === 'function') ? t('swatch_off') : 'Выкл';

    const offParticle =
        `<div class="swatch unlocked ${!state.cosmetics.particles?'active':''}" onclick="setParticles(null)">
              <div class="swatch-dot">—</div>
              <div class="swatch-label">${offLbl}</div>
            </div>`;
    document.getElementById('particleSwatches').innerHTML = offParticle + particleRewards.map(r => {
        const unlocked = best >= r.day;
        const active = state.cosmetics.particles === r.id;
        const dotStyle = unlocked ? `background:${r.color};border-color:${r.color}` : '';
        const lbl = (typeof rewardLabel === 'function') ? rewardLabel(r) : r.label;
        return `<div class="swatch ${unlocked?'unlocked':''} ${active?'active':''}" ${unlocked?`onclick="setParticles('${r.id}')"`:''}>
              <div class="swatch-dot" style="${dotStyle}">${unlocked ? '' : dayPfx+r.day}</div>
              <div class="swatch-label">${unlocked ? lbl : dayLbl+r.day}</div>
            </div>`;
    }).join('');

    const offBg =
        `<div class="swatch unlocked ${!state.cosmetics.bg?'active':''}" onclick="setBgTint(null)">
              <div class="swatch-dot">—</div>
              <div class="swatch-label">${offLbl}</div>
            </div>`;
    document.getElementById('bgSwatches').innerHTML = offBg + bgRewards.map(r => {
        const unlocked = best >= r.day;
        const active = state.cosmetics.bg === r.id;
        const dotStyle = unlocked ? `background:${r.swatch};border-color:${r.swatch}` : '';
        const lbl = (typeof rewardLabel === 'function') ? rewardLabel(r) : r.label;
        return `<div class="swatch ${unlocked?'unlocked':''} ${active?'active':''}" ${unlocked?`onclick="setBgTint('${r.id}')"`:''}>
              <div class="swatch-dot" style="${dotStyle}">${unlocked ? '' : dayPfx+r.day}</div>
              <div class="swatch-label">${unlocked ? lbl : dayLbl+r.day}</div>
            </div>`;
    }).join('');

    /* ── Мистика: матричный дождь + логос ── */
    const mysticRewards = [
        COSMETIC_REWARDS.find(r => r.id === 'matrix_rain'),
        COSMETIC_REWARDS.find(r => r.id === 'particles_logos')
    ].filter(Boolean);

    document.getElementById('mysticSwatches').innerHTML = mysticRewards.map(r => {
        const unlocked = best >= r.day;
        const isMatrix = r.id === 'matrix_rain';
        const active   = isMatrix ? state.activeMatrixRain === true : state.cosmetics.particles === r.id;
        const dotStyle = unlocked ? `background:${r.color};border-color:${r.color}` : '';
        const onclick  = unlocked
            ? (isMatrix ? 'onclick="toggleMatrixRain()"' : `onclick="setParticles('${r.id}')"`)
            : '';
        const lbl = (typeof rewardLabel === 'function') ? rewardLabel(r) : r.label;
        return `<div class="swatch ${unlocked?'unlocked':''} ${active?'active':''}" ${onclick}>
              <div class="swatch-dot" style="${dotStyle}">${unlocked ? '' : dayPfx+r.day}</div>
              <div class="swatch-label">${unlocked ? lbl : dayLbl+r.day}</div>
            </div>`;
    }).join('');
}

function toggleMatrixRain() {
    const reward = COSMETIC_REWARDS.find(r => r.id === 'matrix_rain');
    if (!reward || bestStreakEver() < reward.day) return;
    if (state.activeMatrixRain) {
        state.activeMatrixRain = false;
        stopMatrixRain();
    } else {
        state.activeMatrixRain = true;
        startMatrixRain();
    }
    save();
    renderRanks();
}

// === ПРИНУДИТЕЛЬНЫЙ ЗАПУСК ПОСЛЕ ЗАГРУЗКИ ===
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof state !== 'undefined' && state.startDate) {
            renderRanks();
        }
    }, 300);
});