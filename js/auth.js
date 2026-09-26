/* =========================================================
   ACCOUNT + CLOUD SYNC
   Public Supabase credentials are safe to keep in a web app.
   Database access is protected by Row Level Security policies.
   ========================================================= */
const SUPABASE_URL = 'https://gibzdydxpavidqmzivsr.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_lAGIDjSjiC-4x5d12w7CpQ_0qwo0Dbb';
const PASSWORD_RESET_URL = 'https://andrewgoldman88.github.io/put-app-pages/reset-password.html';

let cloudClient = null;
let cloudUser = null;
let cloudHydrating = false;
let cloudSaveTimer = null;
let initialCloudSyncDone = false;

function authRequestError(error) {
    const raw = String(error?.message || error || '');
    const low = raw.toLowerCase();

    if (low.includes('failed to fetch') || low.includes('networkerror') || low.includes('network request failed')) {
        return t('auth_err_network');
    }
    if (low.includes('supabase client is not initialized')) {
        return t('auth_err_not_ready');
    }
    return translateAuthError(raw);
}

function setAuthBusy(busy) {
    const modal = document.getElementById('modal-account');
    if (!modal) return;
    modal.querySelectorAll('button[onclick="authSignIn()"], button[onclick="authSignUp()"]')
        .forEach(button => {
            button.disabled = !!busy;
            button.style.opacity = busy ? '0.6' : '';
            button.style.pointerEvents = busy ? 'none' : '';
        });
}

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
    const deleteBtn = document.getElementById('accountDeleteBtn');
    if (!status || !openBtn || !signOutBtn) return;

    if (cloudUser) {
        status.textContent = t('account_cloud_status')(cloudUser.email);
        openBtn.style.display = 'none';
        signOutBtn.style.display = 'block';
        if (deleteBtn) deleteBtn.style.display = 'block';
    } else {
        status.textContent = t('account_no_account');
        openBtn.style.display = 'block';
        signOutBtn.style.display = 'none';
        if (deleteBtn) deleteBtn.style.display = 'none';
    }
}

function openAccountModal() {
    accountMessage('');
    document.getElementById('modal-account').classList.add('show');
}

function closeAccountModal() {
    document.getElementById('modal-account').classList.remove('show');
}

function setPasswordResetMessage(message, isError) {
    const el = document.getElementById('resetPasswordMessage');
    if (!el) return;
    el.textContent = message || '';
    el.classList.toggle('error', !!isError);
}

function openPasswordResetModal(prefillEmail = '') {
    const sourceEmail = prefillEmail || document.getElementById('accountEmail')?.value.trim() || '';
    const input = document.getElementById('resetEmail');
    if (input) input.value = sourceEmail;
    setPasswordResetMessage('');
    document.getElementById('modal-password-reset')?.classList.add('show');
}

function closePasswordResetModal() {
    document.getElementById('modal-password-reset')?.classList.remove('show');
}

async function sendPasswordReset() {
    const email = document.getElementById('resetEmail')?.value.trim() || '';
    if (!email) {
        setPasswordResetMessage(t('password_reset_enter_email'), true);
        return;
    }
    if (!cloudClient) {
        const ready = await loadSupabaseLibrary();
        if (ready) await initAuth();
    }
    if (!cloudClient) {
        setPasswordResetMessage(t('auth_err_not_ready'), true);
        return;
    }

    const btn = document.getElementById('resetPasswordSendBtn');
    if (btn) btn.disabled = true;
    setPasswordResetMessage(t('password_reset_sending'));

    try {
        const { error } = await cloudClient.auth.resetPasswordForEmail(email, {
            redirectTo: PASSWORD_RESET_URL
        });
        if (error) throw error;
        setPasswordResetMessage(t('password_reset_sent'));
    } catch (error) {
        console.error('Supabase password reset error:', error);
        setPasswordResetMessage(translateAuthError(error?.message || error), true);
    } finally {
        if (btn) btn.disabled = false;
    }
}

function openPasswordResetFromPinRecovery() {
    const email = document.getElementById('pinRecoveryEmail')?.value.trim() || '';
    closePinRecoveryModal();
    openPasswordResetModal(email);
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
    const emailEl = document.getElementById('accountEmail');
    const passwordEl = document.getElementById('accountPassword');
    const email = emailEl?.value.trim() || '';
    const password = passwordEl?.value || '';

    if (!email || password.length < 6) {
        accountMessage(t('account_fill_fields'), true);
        return;
    }
    if (!cloudClient) {
        const ready = await loadSupabaseLibrary();
        if (ready) await initAuth();
    }
    if (!cloudClient) {
        accountMessage(t('auth_err_not_ready'), true);
        return;
    }

    setAuthBusy(true);
    accountMessage(t('account_creating'));

    try {
        const { data, error } = await cloudClient.auth.signUp({ email, password });
        if (error) {
            accountMessage(translateAuthError(error.message), true);
            return;
        }
        if (!data.session) {
            accountMessage(t('account_check_email'));
            return;
        }
        closeAccountModal();
        if (typeof showToast === 'function') showToast(t('account_created_toast'));
    } catch (error) {
        console.error('Supabase sign-up error:', error);
        accountMessage(authRequestError(error), true);
    } finally {
        setAuthBusy(false);
    }
}

async function authSignIn() {
    const emailEl = document.getElementById('accountEmail');
    const passwordEl = document.getElementById('accountPassword');
    const email = emailEl?.value.trim() || '';
    const password = passwordEl?.value || '';

    if (!email || !password) {
        accountMessage(t('account_fill_email_pass'), true);
        return;
    }
    if (!cloudClient) {
        const ready = await loadSupabaseLibrary();
        if (ready) await initAuth();
    }
    if (!cloudClient) {
        accountMessage(t('auth_err_not_ready'), true);
        return;
    }

    setAuthBusy(true);
    accountMessage(t('account_signing_in'));

    try {
        const { data, error } = await cloudClient.auth.signInWithPassword({ email, password });
        if (error) {
            accountMessage(t('account_signin_failed')(translateAuthError(error.message)), true);
            return;
        }

        // SIGNED_IN запускает синхронизацию через onAuthStateChange.
        // Закрываем окно только после успешного ответа Supabase.
        closeAccountModal();
        if (data?.user && typeof showToast === 'function') {
            showToast(t('account_signed_in_toast'));
        }
    } catch (error) {
        console.error('Supabase sign-in error:', error);
        accountMessage(t('account_signin_failed')(authRequestError(error)), true);
    } finally {
        setAuthBusy(false);
    }
}

async function authSignOut() {
    if (!cloudClient || !confirm(t('account_signout_confirm'))) return;
    await cloudClient.auth.signOut();
    if (typeof showToast === 'function') showToast(t('account_signed_out_toast'));
}

function openDeleteAccountModal() {
    if (!cloudUser) {
        if (typeof showToast === 'function') showToast(t('account_no_account'));
        return;
    }
    const message = document.getElementById('deleteAccountMessage');
    const confirmBtn = document.getElementById('deleteAccountConfirmBtn');
    if (message) {
        message.textContent = '';
        message.classList.remove('error');
    }
    if (confirmBtn) confirmBtn.disabled = false;
    document.getElementById('modal-delete-account')?.classList.add('show');
}

function closeDeleteAccountModal() {
    document.getElementById('modal-delete-account')?.classList.remove('show');
}

function setDeleteAccountMessage(message, isError) {
    const el = document.getElementById('deleteAccountMessage');
    if (!el) return;
    el.textContent = message || '';
    el.classList.toggle('error', !!isError);
}

function clearLocalAppData() {
    try {
        localStorage.removeItem('retention_state_v1');
        localStorage.removeItem('retention_app_lock_v1');
    } catch (error) {
        console.warn('Could not clear local app data:', error);
    }
}

async function deleteAccountAndData() {
    if (!cloudClient || !cloudUser) return;

    const confirmBtn = document.getElementById('deleteAccountConfirmBtn');
    if (confirmBtn) confirmBtn.disabled = true;
    setDeleteAccountMessage(t('account_deleting'));

    clearTimeout(cloudSaveTimer);
    cloudSaveTimer = null;

    try {
        // The SECURITY DEFINER RPC deletes both user_states and auth.users.
        const { error } = await cloudClient.rpc('delete_my_account');
        if (error) throw error;

        // The account is already gone, so the local session is cleaned afterwards.
        try { await cloudClient.auth.signOut({ scope: 'local' }); } catch (_) {}

        cloudUser = null;
        initialCloudSyncDone = false;
        cloudHydrating = false;
        clearLocalAppData();

        closeDeleteAccountModal();
        if (typeof showToast === 'function') showToast(t('account_deleted_toast'));

        // Start the app from a completely clean local state.
        setTimeout(() => location.reload(), 250);
    } catch (error) {
        console.error('Account deletion failed:', error);
        if (confirmBtn) confirmBtn.disabled = false;
        setDeleteAccountMessage(
            t('account_delete_failed')(translateAuthError(error?.message || error)),
            true
        );
    }
}

async function loadSupabaseLibrary() {
    if (window.supabase?.createClient) return true;

    const sources = [
        'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
        'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js'
    ];

    for (const src of sources) {
        try {
            await new Promise((resolve, reject) => {
                const existing = document.querySelector(`script[data-supabase-loader="${src}"]`);
                if (existing) {
                    existing.addEventListener('load', resolve, { once: true });
                    existing.addEventListener('error', reject, { once: true });
                    return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.dataset.supabaseLoader = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });

            if (window.supabase?.createClient) return true;
        } catch (error) {
            console.warn('Supabase CDN failed:', src, error);
        }
    }

    return false;
}

async function initAuth() {
    const ready = await loadSupabaseLibrary();

    if (!ready) {
        console.error('Supabase client library could not be loaded from available CDNs.');
        updateAccountUI();
        return;
    }

    try {
        // ВАЖНО: здесь специально используем обычный createClient без
        // нашего кастомного fetch. Так авторизация работает так же,
        // как в исходной рабочей версии приложения.
        cloudClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            }
        );

        cloudClient.auth.onAuthStateChange((event, session) => {
            cloudUser = session ? session.user : null;
            updateAccountUI();

            if (event === 'SIGNED_IN') {
                initialCloudSyncDone = false;
                setTimeout(() => {
                    hydrateFromCloud().catch(error => {
                        console.error('Cloud hydration failed after sign-in:', error);
                    });
                }, 0);
            }

            if (event === 'SIGNED_OUT') {
                initialCloudSyncDone = false;
            }
        });

        const { data, error } = await cloudClient.auth.getSession();

        if (error) {
            console.error('Supabase getSession error:', error);
            updateAccountUI();
            return;
        }

        cloudUser = data.session ? data.session.user : null;
        updateAccountUI();

        if (cloudUser) {
            await hydrateFromCloud();
        }
    } catch (error) {
        console.error('Supabase initialization failed:', error);
        cloudClient = null;
        cloudUser = null;
        updateAccountUI();
    }
}
