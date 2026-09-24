/* =========================================================
   ACCOUNT + CLOUD SYNC
   Public Supabase credentials are safe to keep in a web app.
   Database access is protected by Row Level Security policies.
   ========================================================= */
const SUPABASE_URL = 'https://gibzdydxpavidqmzivsr.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_lAGIDjSjiC-4x5d12w7CpQ_0qwo0Dbb';

let cloudClient = null;
let cloudUser = null;
let cloudHydrating = false;
let cloudSaveTimer = null;
let initialCloudSyncDone = false;

/* Переводим типовые английские ошибки Supabase Auth на язык интерфейса.
   Если формулировка незнакомая — показываем оригинал от Supabase как есть,
   лучше показать английскую фразу, чем ничего. */
function translateAuthError(message) {
    const raw = String(message || '');
    const low = raw.toLowerCase();
    if (low.includes('invalid login credentials')) return t('auth_err_invalid_credentials');
    if (low.includes('already registered') || low.includes('already exists')) return t('auth_err_user_exists');
    if (low.includes('password') && (low.includes('at least') || low.includes('should be'))) return t('auth_err_weak_password');
    if (low.includes('invalid') && low.includes('email')) return t('auth_err_invalid_email');
    if (low.includes('rate limit') || low.includes('too many')) return t('auth_err_rate_limit');
    return raw || t('auth_err_generic');
}

function showAccountIntro() {
    const overlay = document.getElementById('account-intro-overlay');
    if (!overlay) return;

    if (state.accountChoiceDone) {
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
        return;
    }

    if (typeof applyLang === 'function') applyLang();
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
}

function finishAccountChoice() {
    state.accountChoiceDone = true;
    save();

    const overlay = document.getElementById('account-intro-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
    }

    if (typeof switchView === 'function') switchView('home');
}

function continueAsGuest() {
    finishAccountChoice();
}

function accountMessage(message, isError) {
    const el = document.getElementById('accountMessage');
    if (!el) return;
    el.textContent = message || '';
    el.classList.toggle('error', !!isError);
}

function updateAccountUI() {
    const status = document.getElementById('accountStatus');
    const openBtn = document.getElementById('accountOpenBtn');
    const signOutBtn = document.getElementById('accountSignOutBtn');
    if (!status || !openBtn || !signOutBtn) return;

    if (cloudUser) {
        status.textContent = t('account_cloud_status')(cloudUser.email);
        openBtn.style.display = 'none';
        signOutBtn.style.display = 'block';
    } else {
        status.textContent = t('account_no_account');
        openBtn.style.display = 'block';
        signOutBtn.style.display = 'none';
    }
}

function openAccountModal() {
    accountMessage('');
    document.getElementById('modal-account').classList.add('show');
}

function closeAccountModal() {
    document.getElementById('modal-account').classList.remove('show');
}

function cloudStateFrom(value) {
    const incoming = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return {
        startDate: incoming.startDate || new Date().toISOString(),
        bestStreak: Number(incoming.bestStreak) || 0,
        relapses: Array.isArray(incoming.relapses) ? incoming.relapses : [],
        journal: Array.isArray(incoming.journal) ? incoming.journal : [],
        why: typeof incoming.why === 'string' ? incoming.why : '',
        onboardingDone: !!incoming.onboardingDone,
        onboarding: incoming.onboarding && typeof incoming.onboarding === 'object' ? incoming.onboarding : {},
        taskDone: incoming.taskDone && typeof incoming.taskDone === 'object' ? incoming.taskDone : {},
        theme: incoming.theme || 'dark',
        mode: incoming.mode || 'full',
        lang: incoming.lang || null,
        accountChoiceDone: incoming.accountChoiceDone !== undefined ? !!incoming.accountChoiceDone : true,
        sexLog: Array.isArray(incoming.sexLog) ? incoming.sexLog : [],
        cosmetics: incoming.cosmetics && typeof incoming.cosmetics === 'object' ? incoming.cosmetics : { particles: null, bg: null },
        lastSeenRankDay: Number(incoming.lastSeenRankDay) || 0,
        moodLog: Array.isArray(incoming.moodLog) ? incoming.moodLog : [],
        wheel: incoming.wheel && typeof incoming.wheel === 'object' ? incoming.wheel : { lastSpinDate: null, currentTask: null, completed: false, rotation: 0 },
        activeMatrixRain: incoming.activeMatrixRain || null,
        notifications: incoming.notifications && typeof incoming.notifications === 'object' ? incoming.notifications : defaultNotificationSettings()
    };
}

function refreshAfterCloudLoad() {
    applyTheme();
    applyCosmetics();
    if (state.activeMatrixRain) startMatrixRain(); else stopMatrixRain();
    if (typeof applyLang === 'function') applyLang();
    renderHome();
    renderJournal();
    renderCalendar();
    renderStats();
    renderRanks();
    updateNotificationUI();
}

async function hydrateFromCloud() {
    if (!cloudClient || !cloudUser || cloudHydrating || initialCloudSyncDone) return;
    cloudHydrating = true;
    const { data, error } = await cloudClient
        .from('user_states')
        .select('data')
        .eq('user_id', cloudUser.id)
        .maybeSingle();

    if (error) {
        console.error('Cloud state load failed:', error);
        if (typeof showToast === 'function') showToast(t('account_cloud_load_failed'));
    } else if (data && data.data) {
        state = cloudStateFrom(data.data);
        save();
        refreshAfterCloudLoad();
        if (typeof showToast === 'function') showToast(t('account_cloud_loaded_toast'));
    } else {
        await pushCloudState(true);
        if (typeof showToast === 'function') showToast(t('account_cloud_saved_toast'));
    }
    initialCloudSyncDone = true;
    cloudHydrating = false;
}

async function pushCloudState(force) {
    if (!cloudClient || !cloudUser || (cloudHydrating && !force)) return;
    const { error } = await cloudClient.from('user_states').upsert({
        user_id: cloudUser.id,
        data: state,
        updated_at: new Date().toISOString()
    });
    if (error) console.error('Cloud state save failed:', error);
}

function queueCloudSave() {
    if (!cloudUser || cloudHydrating) return;
    clearTimeout(cloudSaveTimer);
    cloudSaveTimer = setTimeout(pushCloudState, 900);
}

async function authSignUp() {
    const email = document.getElementById('accountEmail').value.trim();
    const password = document.getElementById('accountPassword').value;
    if (!email || password.length < 6) {
        accountMessage(t('account_fill_fields'), true);
        return;
    }
    accountMessage(t('account_creating'));
    const { data, error } = await cloudClient.auth.signUp({ email, password });
    if (error) { accountMessage(translateAuthError(error.message), true); return; }
    if (!data.session) {
        accountMessage(t('account_check_email'));
        return;
    }
    closeAccountModal();
    finishAccountChoice();
    if (typeof showToast === 'function') showToast(t('account_created_toast'));
}

async function authSignIn() {
    const email = document.getElementById('accountEmail').value.trim();
    const password = document.getElementById('accountPassword').value;
    if (!email || !password) { accountMessage(t('account_fill_email_pass'), true); return; }
    accountMessage(t('account_signing_in'));
    const { error } = await cloudClient.auth.signInWithPassword({ email, password });
    if (error) { accountMessage(t('account_signin_failed')(translateAuthError(error.message)), true); return; }
    closeAccountModal();
    finishAccountChoice();
}

async function authSignOut() {
    if (!cloudClient || !confirm(t('account_signout_confirm'))) return;
    await cloudClient.auth.signOut();
    if (typeof showToast === 'function') showToast(t('account_signed_out_toast'));
}

async function initAuth() {
    if (!window.supabase) {
        console.warn('Supabase client library was not loaded');
        return;
    }
    cloudClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    const { data } = await cloudClient.auth.getSession();
    cloudUser = data.session ? data.session.user : null;
    updateAccountUI();
    if (cloudUser) await hydrateFromCloud();

    cloudClient.auth.onAuthStateChange((event, session) => {
        cloudUser = session ? session.user : null;
        updateAccountUI();
        if (event === 'SIGNED_IN') {
            initialCloudSyncDone = false;
            setTimeout(hydrateFromCloud, 0);
        }
        if (event === 'SIGNED_OUT') initialCloudSyncDone = false;
    });
}
