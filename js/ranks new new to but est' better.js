/* =========================================================
   RANKS – с эпичным повышением в стиле main.css
   ========================================================= */

let previousRankDay = 0;

/* =========================================================
   ЭПИЧНЫЙ ОВЕРЛЕЙ ПОВЫШЕНИЯ (использует класс rank-ascension)
   ========================================================= */
function showEpicRankUp(rank) {
    // Если уже есть оверлей – не создаём новый
    if (document.querySelector('.rank-ascension.show')) return;

    // Создаём основной контейнер
    const overlay = document.createElement('div');
    overlay.className = 'rank-ascension show';
    overlay.setAttribute('data-rank-day', rank.day);

    // Внутренняя структура по стилям из main.css
    overlay.innerHTML = `
        <div class="rank-vignette"></div>
        <div class="rank-rays"></div>
        <div class="rank-orbit"></div>
        <div class="rank-core">
            <div class="rank-eyebrow">ВОЗВЫШЕНИЕ</div>
            <div class="rank-crest">
                <span style="font-size: clamp(4rem, 12vw, 8rem); line-height:1; filter:drop-shadow(0 0 18px rgba(139,92,246,0.6));">✦</span>
            </div>
            <div class="rank-number">РАНГ ${rank.day}</div>
            <div class="rank-title">${rank.name}</div>
            <div class="rank-divider"></div>
            <div class="rank-aura">${rank.aura}</div>
            <button class="rank-continue">Продолжить</button>
        </div>
    `;

    document.body.appendChild(overlay);

    // Закрытие по кнопке "Продолжить"
    const continueBtn = overlay.querySelector('.rank-continue');
    continueBtn.addEventListener('click', () => closeRankOverlay(overlay));

    // Автоматическое закрытие через 6 секунд
    setTimeout(() => closeRankOverlay(overlay), 6000);
}

function closeRankOverlay(overlay) {
    if (!overlay || !overlay.classList.contains('show')) return;
    overlay.classList.remove('show');
    // Удаляем из DOM после завершения анимации (0.55s transition)
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
        nextRank = RANKS[0]; // или RANKS[index] чтобы показать текущий
    }
    showEpicRankUp(nextRank);
}

/* =========================================================
   СОЗДАНИЕ ТЕСТОВОЙ КНОПКИ (адаптирована под стиль)
   ========================================================= */
function initTestButton() {
    if (document.getElementById('testRankBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'testRankBtn';
    btn.textContent = '⚡';
    btn.title = 'Тест повышения ранга';
    // Стилизуем под тёмную тему (убираем золото, делаем прозрачным)
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

// === АВТОЗАПУСК КНОПКИ ===
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestButton);
} else {
    initTestButton();
}

/* =========================================================
   ОСНОВНАЯ ФУНКЦИЯ ОТРИСОВКИ РАНГОВ (с вызовом оверлея)
   ========================================================= */
function renderRanks() {
    const d = currentDay();
    const currentRank = rankForDay(d);
    const best = Math.max(state.bestStreak, d);

    // === ВЫЗОВ ЭПИЧНОГО ОВЕРЛЕЯ ПРИ ПОВЫШЕНИИ ===
    if (previousRankDay !== 0 && previousRankDay !== currentRank.day) {
        showEpicRankUp(currentRank);
    }
    previousRankDay = currentRank.day;

    const wrap = document.getElementById('ranksList');
    wrap.innerHTML = RANKS.map((r, i) => {
        const unlocked = best >= r.day;
        const isCurrent = rankForDay(d).day === r.day;
        return `<div class="rank-row ${unlocked?'unlocked':''} ${isCurrent?'current':''}">
              <div class="rank-icon">${unlocked?'✓':i+1}</div>
              <div class="rank-info">
                <div class="r-name">${r.name}</div>
                <div class="r-day">день ${r.day}+</div>
                <div class="r-aura">${r.aura}</div>
              </div>
            </div>`;
    }).join('');

    const badges = [
        { on: state.journal.length > 0, label: "Первая запись" },
        { on: state.journal.length >= 7, label: "7 записей в дневнике" },
        { on: best >= 7, label: "Неделя" },
        { on: best >= 30, label: "Месяц" },
        { on: best >= 100, label: "Легенда · 100 дней" },
        { on: state.why.trim().length > 0, label: "Цель определена" }
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

    const offParticle =
        `<div class="swatch unlocked ${!state.cosmetics.particles?'active':''}" onclick="setParticles(null)">
              <div class="swatch-dot">—</div>
              <div class="swatch-label">Выкл</div>
            </div>`;
    document.getElementById('particleSwatches').innerHTML = offParticle + particleRewards.map(r => {
        const unlocked = best >= r.day;
        const active = state.cosmetics.particles === r.id;
        const dotStyle = unlocked ? `background:${r.color};border-color:${r.color}` : '';
        return `<div class="swatch ${unlocked?'unlocked':''} ${active?'active':''}" ${unlocked?`onclick="setParticles('${r.id}')"`:''}>
              <div class="swatch-dot" style="${dotStyle}">${unlocked?'':'д.'+r.day}</div>
              <div class="swatch-label">${unlocked?r.label:'день '+r.day}</div>
            </div>`;
    }).join('');

    const offBg =
        `<div class="swatch unlocked ${!state.cosmetics.bg?'active':''}" onclick="setBgTint(null)">
              <div class="swatch-dot">—</div>
              <div class="swatch-label">Выкл</div>
            </div>`;
    document.getElementById('bgSwatches').innerHTML = offBg + bgRewards.map(r => {
        const unlocked = best >= r.day;
        const active = state.cosmetics.bg === r.id;
        const dotStyle = unlocked ? `background:${r.swatch};border-color:${r.swatch}` : '';
        return `<div class="swatch ${unlocked?'unlocked':''} ${active?'active':''}" ${unlocked?`onclick="setBgTint('${r.id}')"`:''}>
              <div class="swatch-dot" style="${dotStyle}">${unlocked?'':'д.'+r.day}</div>
              <div class="swatch-label">${unlocked?r.label:'день '+r.day}</div>
            </div>`;
    }).join('');

    const mReward = COSMETIC_REWARDS.find(r => r.id === 'matrix_rain');
    const mUnlocked = mReward && best >= mReward.day;
    const mActive = state.activeMatrixRain === true;
    const mDotStyle = mUnlocked ? `background:${mReward.color};border-color:${mReward.color}` : '';
    document.getElementById('matrixRainSwatches').innerHTML = `
            <div class="swatch ${mUnlocked?'unlocked':''} ${mActive?'active':''}" ${mUnlocked?`onclick="toggleMatrixRain()"`:''}>
              <div class="swatch-dot" style="${mDotStyle}">${mUnlocked?'':'д.15'}</div>
              <div class="swatch-label">${mUnlocked?'Матричный дождь':'день 15'}</div>
            </div>
          `;
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