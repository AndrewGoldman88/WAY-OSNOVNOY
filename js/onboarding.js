/* =========================================================
   ПУТЬ — ONBOARDING
   Four cinematic intro slides. The eye is the recurring brand symbol.
   ========================================================= */

/* =========================================================
   LANGUAGE PICKER
   ========================================================= */

function initLangPicker() {
    const overlay = document.getElementById('lang-picker-overlay');
    if (!overlay) return;

    // A previously selected language means this is not the first launch.
    if (state && state.lang) {
        overlay.classList.add('hide');
        overlay.style.display = 'none';
        return;
    }

    overlay.classList.remove('hide');
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
}

function pickLang(lang, skip = false) {
    lang = (lang === 'en') ? 'en' : 'ru';
    state.lang = lang;

    // The explicit "Skip / Use English" action bypasses onboarding.
    if (skip) state.onboardingDone = true;

    save();

    const overlay = document.getElementById('lang-picker-overlay');
    if (overlay) {
        overlay.classList.add('hide');
        overlay.setAttribute('aria-hidden', 'true');
        window.setTimeout(() => {
            overlay.style.display = 'none';
        }, 420);
    }

    if (typeof applyLang === 'function') applyLang();

    if (skip) {
        if (typeof switchView === 'function') switchView('home');
        return;
    }

    // Language is saved before onboarding renders, so its text is correct.
    if (!state.onboardingDone) startOnboarding(false);
}

function updateLangPillsUI() {
    const ru = document.getElementById('langPillRu');
    const en = document.getElementById('langPillEn');
    if (ru) ru.classList.toggle('active', !!state && state.lang === 'ru');
    if (en) en.classList.toggle('active', !!state && state.lang === 'en');
}

let obIndex = 0;

const OB_SLIDES = {
    ru: [
        {
            eyebrow: 'ПУТЬ · НАЧАЛО',
            title: 'Ты здесь не ради счётчика.',
            text: '«ПУТЬ» создан, чтобы превращать самодисциплину в ежедневную практику — спокойно, последовательно и без лишнего шума.',
            visual: 'intro',
            note: 'Каждый день — ещё один шаг.'
        },
        {
            eyebrow: 'ТРИ СТОРОНЫ',
            title: 'Дух. Разум. Тело.',
            text: 'Каждый день ты получаешь три коротких задания. Они помогают тренировать волю, развивать мышление и укреплять тело.',
            visual: 'three',
            note: 'Маленькие действия складываются в характер.'
        },
        {
            eyebrow: 'ПРОГРЕСС',
            title: 'Твой путь имеет форму.',
            text: 'Дни превращаются в ранги. Выполненные задания сохраняются в истории, а календарь и статистика показывают, как меняется твой путь.',
            visual: 'ranks',
            note: 'Не гонись за идеальным днём. Продолжай следующий.'
        },
        {
            eyebrow: 'НАЧАЛО',
            title: 'Открой глаза. Начни путь.',
            text: 'Не нужно менять всю жизнь за один день. Начни с одного решения — и повторяй его завтра.',
            visual: 'start',
            note: 'Твой следующий шаг начинается сейчас.'
        }
    ],
    en: [
        {
            eyebrow: 'THE PATH · BEGIN',
            title: 'You are not here for a counter.',
            text: 'THE PATH turns self-discipline into a daily practice — calm, consistent and without unnecessary noise.',
            visual: 'intro',
            note: 'Every day is another step.'
        },
        {
            eyebrow: 'THREE SIDES',
            title: 'Spirit. Mind. Body.',
            text: 'Each day you receive three short tasks. They train willpower, sharpen your thinking and strengthen your body.',
            visual: 'three',
            note: 'Small actions become character.'
        },
        {
            eyebrow: 'PROGRESS',
            title: 'Your path takes shape.',
            text: 'Days become ranks. Completed tasks are saved, while the calendar and statistics show how your path changes over time.',
            visual: 'ranks',
            note: 'Do not chase a perfect day. Take the next one.'
        },
        {
            eyebrow: 'BEGIN',
            title: 'Open your eyes. Begin the path.',
            text: 'You do not have to change your whole life in one day. Start with one decision — then repeat it tomorrow.',
            visual: 'start',
            note: 'Your next step begins now.'
        }
    ]
};

function obLang() {
    return state && state.lang === 'en' ? 'en' : 'ru';
}

function obSlides() {
    return OB_SLIDES[obLang()];
}

function obEsc(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function eyeMarkup(extra='') {
    return `<div class="ob-eye ${extra}" aria-hidden="true">
        <div class="ob-eye-halo"></div>
        <svg viewBox="0 0 320 190" role="presentation">
            <defs>
                <linearGradient id="obEyeGold" x1="0" x2="1">
                    <stop offset="0" stop-color="var(--gold)" stop-opacity=".45"/>
                    <stop offset=".5" stop-color="var(--gold)"/>
                    <stop offset="1" stop-color="var(--gold)" stop-opacity=".45"/>
                </linearGradient>
                <filter id="obEyeGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <path class="ob-eye-line" d="M22 95 Q160 5 298 95 Q160 185 22 95Z"/>
            <path class="ob-eye-line soft" d="M44 95 Q160 35 276 95 Q160 155 44 95Z"/>
            <ellipse cx="160" cy="95" rx="48" ry="58" class="ob-eye-iris" filter="url(#obEyeGlow)"/>
            <ellipse cx="160" cy="95" rx="10" ry="43" class="ob-eye-pupil"/>
            <circle cx="147" cy="75" r="5" class="ob-eye-glint"/>
            <path d="M160 19 L160 3 M160 187 L160 171" class="ob-eye-axis"/>
        </svg>
    </div>`;
}

function visualMarkup(type) {
    if (type === 'three') {
        return `<div class="ob-three-visual">
            ${eyeMarkup('ob-eye-small')}
            <div class="ob-triad">
                <span><b>${obLang()==='en'?'S':'Д'}</b><small>${obLang()==='en'?'SPIRIT':'ДУХ'}</small></span>
                <span><b>${obLang()==='en'?'M':'Р'}</b><small>${obLang()==='en'?'MIND':'РАЗУМ'}</small></span>
                <span><b>${obLang()==='en'?'B':'Т'}</b><small>${obLang()==='en'?'BODY':'ТЕЛО'}</small></span>
            </div>
        </div>`;
    }
    if (type === 'ranks') {
        return `<div class="ob-ranks-visual">
            ${eyeMarkup('ob-eye-rank')}
            <div class="ob-rank-lines"><i></i><i></i><i></i><i></i><i></i></div>
        </div>`;
    }
    if (type === 'start') return `<div class="ob-start-visual">${eyeMarkup('ob-eye-start')}<div class="ob-start-orbit"></div></div>`;
    return `<div class="ob-intro-visual">${eyeMarkup('ob-eye-main')}<div class="ob-scanline"></div></div>`;
}

function startOnboarding(replay) {
    obIndex = 0;
    buildOnboardingProgress();
    renderOnboardingStep();
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
        overlay.classList.add('show');
        overlay.setAttribute('aria-hidden','false');
    }
}

function buildOnboardingProgress() {
    const slides = obSlides();
    const wrap = document.getElementById('obProgress');
    if (!wrap) return;
    wrap.innerHTML = slides.map((_,i) => `<div class="ob-dot ${i===0?'active':''}"></div>`).join('');
}

function updateProgressDots() {
    document.querySelectorAll('.ob-dot').forEach((d,i) => {
        d.classList.toggle('done', i < obIndex);
        d.classList.toggle('active', i === obIndex);
    });
}

function renderOnboardingStep() {
    const slides = obSlides();
    const step = slides[obIndex];
    const body = document.getElementById('obBody');
    const nextBtn = document.getElementById('obNextBtn');
    const backBtn = document.getElementById('obBackBtn');
    const skipBtn = document.getElementById('obSkipBtn');
    if (!body || !step) return;

    updateProgressDots();
    backBtn.style.visibility = obIndex > 0 ? 'visible' : 'hidden';
    skipBtn.textContent = obLang() === 'en' ? 'SKIP' : 'ПРОПУСТИТЬ';
    nextBtn.textContent = obIndex === slides.length - 1 ? (obLang()==='en' ? 'START THE PATH' : 'НАЧАТЬ ПУТЬ') : (obLang()==='en' ? 'NEXT' : 'ДАЛЕЕ');
    nextBtn.classList.add('enabled');

    body.innerHTML = `<section class="ob-step active ob-${step.visual}">
        <div class="ob-visual">${visualMarkup(step.visual)}</div>
        <div class="ob-copy">
            <div class="ob-eyebrow">${obEsc(step.eyebrow)}</div>
            <h1 class="ob-question">${obEsc(step.title)}</h1>
            <p class="ob-text">${obEsc(step.text)}</p>
            <div class="ob-note"><span class="ob-note-mark">◈</span>${obEsc(step.note)}</div>
        </div>
    </section>`;
}

function obBack() {
    if (obIndex <= 0) return;
    obIndex--;
    renderOnboardingStep();
}

function obNext() {
    const slides = obSlides();
    if (obIndex < slides.length - 1) {
        obIndex++;
        renderOnboardingStep();
    } else {
        finishOnboarding(false);
    }
}

function skipOnboarding() { finishOnboarding(true); }

function finishOnboarding(skipped) {
    state.onboardingDone = true;
    state.onboarding = state.onboarding || {};
    save();
    vibrate(20);
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden','true');
    }
    switchView('home');
    if (!skipped && typeof showToast === 'function') {
        showToast(obLang()==='en' ? 'The path has begun.' : 'Путь начался.');
    }
}
