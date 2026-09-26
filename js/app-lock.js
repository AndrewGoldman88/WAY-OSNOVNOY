/* =========================================================
   LOCAL APP LOCK
   PIN and biometric prompt are device-local by design: they
   do not go to Supabase and never sync to another device.
   ========================================================= */
const APP_LOCK_KEY = 'retention_app_lock_v1';
let appLock = loadAppLock();
let appUnlocked = false;
let pinRecoveryOpen = false;

function loadAppLock() {
    try {
        const saved = JSON.parse(localStorage.getItem(APP_LOCK_KEY));
        return saved && typeof saved === 'object' ? saved : { pinHash: null, salt: null, biometricId: null };
    } catch (_) {
        return { pinHash: null, salt: null, biometricId: null };
    }
}

function saveAppLock() {
    localStorage.setItem(APP_LOCK_KEY, JSON.stringify(appLock));
}

function clearAppLockData() {
    appLock = { pinHash: null, salt: null, biometricId: null };
    appUnlocked = false;
    try { localStorage.removeItem(APP_LOCK_KEY); } catch (_) {}
}

function randomText(length) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

async function pinHash(pin, salt) {
    const text = new TextEncoder().encode(`${salt}:${pin}:put-local-lock`);
    if (crypto.subtle) {
        const result = await crypto.subtle.digest('SHA-256', text);
        return Array.from(new Uint8Array(result), b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback only for browsers that do not expose Web Crypto. The PIN is a
    // convenience lock, not a replacement for the phone's system lock.
    let hash = 2166136261;
    for (const byte of text) { hash ^= byte; hash = Math.imul(hash, 16777619); }
    return String(hash >>> 0);
}

function updateLockUI() {
    const status = document.getElementById('lockStatus');
    const biometric = document.getElementById('biometricSetupBtn');
    const disable = document.getElementById('lockDisableBtn');
    if (!status) return;
    if (!appLock.pinHash) {
        status.textContent = t('lock_off_status');
        if (disable) disable.style.display = 'none';
    } else if (appLock.biometricId) {
        status.textContent = t('lock_pin_bio_status');
        if (disable) disable.style.display = 'block';
    } else {
        status.textContent = t('lock_pin_only_status');
        if (disable) disable.style.display = 'block';
    }
    if (biometric) biometric.disabled = !appLock.pinHash || !canUseBiometrics();
}

function canUseBiometrics() {
    return !!(window.isSecureContext && window.PublicKeyCredential && navigator.credentials);
}

function openPinSetup() {
    document.getElementById('pinSetupFirst').value = '';
    document.getElementById('pinSetupRepeat').value = '';
    document.getElementById('pinSetupMessage').textContent = '';
    document.getElementById('modal-pin-setup').classList.add('show');
}

function closePinSetup() {
    document.getElementById('modal-pin-setup').classList.remove('show');
}

async function savePinSetup() {
    const first = document.getElementById('pinSetupFirst').value;
    const repeat = document.getElementById('pinSetupRepeat').value;
    const message = document.getElementById('pinSetupMessage');
    if (!/^\d{4}$/.test(first)) { message.textContent = t('pin_need_4_digits'); return; }
    if (first !== repeat) { message.textContent = t('pin_mismatch'); return; }
    const salt = randomText(16);
    appLock = { pinHash: await pinHash(first, salt), salt, biometricId: null };
    saveAppLock();
    updateLockUI();
    closePinSetup();
    if (typeof showToast === 'function') showToast(t('pin_enabled_toast'));
}

function disableAppLock() {
    if (!confirm(t('lock_disable_confirm'))) return;
    appLock = { pinHash: null, salt: null, biometricId: null };
    saveAppLock();
    updateLockUI();
    if (typeof showToast === 'function') showToast(t('lock_disabled_toast'));
}

function bytesToB64(bytes) {
    let binary = '';
    new Uint8Array(bytes).forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary);
}

function b64ToBytes(value) {
    const binary = atob(value);
    return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function setupBiometrics() {
    if (!appLock.pinHash) { if (typeof showToast === 'function') showToast(t('lock_need_pin_first_toast')); return; }
    if (!canUseBiometrics()) {
        if (typeof showToast === 'function') showToast(t('lock_biometric_needs_https_toast'));
        return;
    }
    try {
        const credential = await navigator.credentials.create({ publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            rp: { name: t('brand').replace(/^[^\wА-Яа-яЁё]+/, '').trim() },
            user: {
                id: crypto.getRandomValues(new Uint8Array(16)),
                name: 'put-local-lock',
                displayName: `${t('brand').replace(/^[^\wА-Яа-яЁё]+/, '').trim()} — ${t('lock_section_title').replace(/^[^\wА-Яа-яЁё]+/, '').trim()}`
            },
            pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                residentKey: 'required',
                userVerification: 'required'
            },
            timeout: 60000,
            attestation: 'none'
        }});
        if (!credential) return;
        appLock.biometricId = bytesToB64(credential.rawId);
        saveAppLock();
        updateLockUI();
        if (typeof showToast === 'function') showToast(t('lock_biometric_enabled_toast'));
    } catch (error) {
        console.warn('Biometric setup cancelled or unavailable:', error);
        if (typeof showToast === 'function') showToast(t('lock_biometric_failed_toast'));
    }
}

function showAppLock() {
    if (!appLock.pinHash || pinRecoveryOpen) return;

    const overlay = document.getElementById('appLockOverlay');
    const input = document.getElementById('lockPinInput');
    if (!overlay || !input) return;

    appUnlocked = false;
    overlay.hidden = false;
    overlay.removeAttribute('hidden');
    overlay.setAttribute('aria-hidden', 'false');

    input.value = '';
    const message = document.getElementById('lockMessage');
    if (message) {
        message.textContent = '';
        message.classList.remove('error');
    }

    const bio = document.getElementById('lockBiometricBtn');
    if (bio) bio.style.display = appLock.biometricId ? 'block' : 'none';

    const forgotBtn = document.getElementById('lockForgotPinBtn');
    if (forgotBtn) forgotBtn.style.display = 'block';

    setTimeout(() => {
        if (!appUnlocked && !overlay.hidden) {
            try { input.focus(); } catch (_) {}
        }
    }, 80);
}

function hideAppLock() {
    appUnlocked = true;
    const overlay = document.getElementById('appLockOverlay');
    if (!overlay) return;

    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
}

async function unlockWithPin() {
    const input = document.getElementById('lockPinInput');
    const message = document.getElementById('lockMessage');
    const value = input.value;
    if (!/^\d{4}$/.test(value)) { message.textContent = t('app_lock_need_4_digits'); return; }
    if (await pinHash(value, appLock.salt) !== appLock.pinHash) {
        message.textContent = t('app_lock_wrong_pin');
        input.value = '';
        input.focus();
        return;
    }
    hideAppLock();
}

async function unlockWithBiometrics() {
    if (!appLock.biometricId || !canUseBiometrics()) return;
    try {
        const assertion = await navigator.credentials.get({ publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            allowCredentials: [{ type: 'public-key', id: b64ToBytes(appLock.biometricId), transports: ['internal'] }],
            userVerification: 'required',
            timeout: 60000
        }});
        if (assertion) hideAppLock();
    } catch (error) {
        console.warn('Biometric unlock cancelled or failed:', error);
        document.getElementById('lockMessage').textContent = t('app_lock_biometric_failed');
    }
}

function setPinRecoveryMessage(message, isError) {
    const el = document.getElementById('pinRecoveryMessage');
    if (!el) return;
    el.textContent = message || '';
    el.classList.toggle('error', !!isError);
}

function setPinRecoveryNewMessage(message, isError) {
    const el = document.getElementById('pinRecoveryNewMessage');
    if (!el) return;
    el.textContent = message || '';
    el.classList.toggle('error', !!isError);
}

function openPinRecoveryModal() {
    // Recovery is an alternative to unlocking with PIN. The lock overlay
    // must disappear immediately so the recovery modal is actually usable.
    pinRecoveryOpen = true;
    appUnlocked = false;

    const lockOverlay = document.getElementById('appLockOverlay');
    if (lockOverlay) {
        lockOverlay.hidden = true;
        lockOverlay.setAttribute('aria-hidden', 'true');
    }

    // On a first launch the language picker/onboarding can be underneath the
    // lock. Temporarily hide them so recovery is the only visible flow.
    const langPicker = document.getElementById('lang-picker-overlay');
    const onboarding = document.getElementById('onboarding-overlay');
    if (langPicker) langPicker.dataset.hiddenForPinRecovery = langPicker.style.display || '';
    if (onboarding) onboarding.dataset.hiddenForPinRecovery = onboarding.style.display || '';
    if (langPicker) langPicker.style.display = 'none';
    if (onboarding) onboarding.style.display = 'none';

    const emailInput = document.getElementById('pinRecoveryEmail');
    if (emailInput) emailInput.value = (typeof cloudUser !== 'undefined' && cloudUser?.email) ? cloudUser.email : '';
    const passInput = document.getElementById('pinRecoveryPassword');
    if (passInput) passInput.value = '';
    setPinRecoveryMessage('');

    const modal = document.getElementById('modal-pin-recovery');
    if (modal) {
        modal.classList.add('show');
        // Make absolutely sure it is above every other overlay.
        modal.style.zIndex = '1000001';
    }
    setTimeout(() => emailInput?.focus(), 50);
}

function closePinRecoveryModal() {
    document.getElementById('modal-pin-recovery')?.classList.remove('show');
    pinRecoveryOpen = false;

    // Restore the normal locked state. We intentionally do not unlock the app.
    const langPicker = document.getElementById('lang-picker-overlay');
    const onboarding = document.getElementById('onboarding-overlay');
    if (langPicker) {
        const previous = langPicker.dataset.hiddenForPinRecovery;
        if (previous !== undefined) {
            langPicker.style.display = previous;
            delete langPicker.dataset.hiddenForPinRecovery;
        }
    }
    if (onboarding) {
        const previous = onboarding.dataset.hiddenForPinRecovery;
        if (previous !== undefined) {
            onboarding.style.display = previous;
            delete onboarding.dataset.hiddenForPinRecovery;
        }
    }

    if (appLock.pinHash && !appUnlocked) showAppLock();
}

function openPinRecoveryNewModal() {
    document.getElementById('pinRecoveryNewFirst').value = '';
    document.getElementById('pinRecoveryNewRepeat').value = '';
    setPinRecoveryNewMessage('');
    const modal = document.getElementById('modal-pin-recovery-new');
    if (modal) {
        modal.classList.add('show');
        modal.style.zIndex = '1000001';
    }
    setTimeout(() => document.getElementById('pinRecoveryNewFirst')?.focus(), 50);
}

function closePinRecoveryNewModal() {
    document.getElementById('modal-pin-recovery-new')?.classList.remove('show');
}

async function authorizePinRecovery() {
    const email = document.getElementById('pinRecoveryEmail')?.value.trim() || '';
    const password = document.getElementById('pinRecoveryPassword')?.value || '';
    if (!email || !password) {
        setPinRecoveryMessage(t('pin_recovery_fill_fields'), true);
        return;
    }
    if (typeof cloudClient === 'undefined' || !cloudClient) {
        const ready = await loadSupabaseLibrary();
        if (ready) await initAuth();
    }
    if (typeof cloudClient === 'undefined' || !cloudClient) {
        setPinRecoveryMessage(t('auth_err_not_ready'), true);
        return;
    }

    setPinRecoveryMessage(t('pin_recovery_checking'));
    try {
        const { data, error } = await cloudClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data?.user) throw new Error('No authenticated user');

        // Password authentication is the recovery authorization. We never read
        // or transmit the old PIN; only the local hash is replaced.
        closePinRecoveryModal();
        openPinRecoveryNewModal();
    } catch (error) {
        console.error('PIN recovery authorization failed:', error);
        setPinRecoveryMessage(t('pin_recovery_failed')(translateAuthError(error?.message || error)), true);
    }
}

async function saveRecoveredPin() {
    const first = document.getElementById('pinRecoveryNewFirst')?.value || '';
    const repeat = document.getElementById('pinRecoveryNewRepeat')?.value || '';
    if (!/^\d{4}$/.test(first)) {
        setPinRecoveryNewMessage(t('pin_need_4_digits'), true);
        return;
    }
    if (first !== repeat) {
        setPinRecoveryNewMessage(t('pin_mismatch'), true);
        return;
    }

    const salt = randomText(16);
    appLock = { pinHash: await pinHash(first, salt), salt, biometricId: null };
    saveAppLock();
    appUnlocked = true;
    pinRecoveryOpen = false;
    updateLockUI();
    closePinRecoveryNewModal();

    // Restore any first-launch overlay that was temporarily hidden for recovery.
    const langPicker = document.getElementById('lang-picker-overlay');
    const onboarding = document.getElementById('onboarding-overlay');
    if (langPicker) {
        const previous = langPicker.dataset.hiddenForPinRecovery;
        if (previous !== undefined) {
            langPicker.style.display = previous;
            delete langPicker.dataset.hiddenForPinRecovery;
        }
    }
    if (onboarding) {
        const previous = onboarding.dataset.hiddenForPinRecovery;
        if (previous !== undefined) {
            onboarding.style.display = previous;
            delete onboarding.dataset.hiddenForPinRecovery;
        }
    }

    hideAppLock();
    if (typeof showToast === 'function') showToast(t('pin_recovered_toast'));
}

let appLockInitialized = false;
let appLockVisibilityHandlerInstalled = false;

function initAppLock() {
    // Идемпотентная инициализация: init.js может вызвать её повторно,
    // а сам app-lock.js дополнительно страхует запуск.
    if (appLockInitialized) {
        updateLockUI();
        if (appLock.pinHash && !appUnlocked) showAppLock();
        return;
    }

    const overlay = document.getElementById('appLockOverlay');
    const pinInput = document.getElementById('lockPinInput');

    if (!overlay || !pinInput) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAppLock, { once: true });
        } else {
            setTimeout(initAppLock, 0);
        }
        return;
    }

    appLockInitialized = true;
    appLock = loadAppLock();
    updateLockUI();

    pinInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') unlockWithPin();
    });

    if (!appLockVisibilityHandlerInstalled) {
        appLockVisibilityHandlerInstalled = true;

        document.addEventListener('visibilitychange', () => {
            if (!appLock.pinHash) return;

            if (document.hidden) {
                appUnlocked = false;
                return;
            }

            if (!appUnlocked) showAppLock();
        });

        window.addEventListener('pageshow', () => {
            if (appLock.pinHash && !appUnlocked) showAppLock();
        });

        window.addEventListener('pagehide', () => {
            if (appLock.pinHash) appUnlocked = false;
        });
    }

    // Если PIN уже установлен, приложение всегда стартует закрытым.
    if (appLock.pinHash) {
        appUnlocked = false;
        showAppLock();
    } else {
        appUnlocked = true;
        hideAppLock();
    }
}

// Страховка: замок работает даже если init.js не успел вызвать initAppLock.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppLock, { once: true });
} else {
    initAppLock();
}
