/* =========================================================
   LOCAL APP LOCK
   PIN and biometric prompt are device-local by design: they
   do not go to Supabase and never sync to another device.
   ========================================================= */
const APP_LOCK_KEY = 'retention_app_lock_v1';
let appLock = loadAppLock();
let appUnlocked = false;

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
    if (!appLock.pinHash) return;
    appUnlocked = false;
    const overlay = document.getElementById('appLockOverlay');
    overlay.hidden = false;
    document.getElementById('lockPinInput').value = '';
    document.getElementById('lockMessage').textContent = '';
    document.getElementById('lockBiometricBtn').style.display = appLock.biometricId ? 'block' : 'none';
    setTimeout(() => document.getElementById('lockPinInput').focus(), 50);
}

function hideAppLock() {
    appUnlocked = true;
    document.getElementById('appLockOverlay').hidden = true;
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

function initAppLock() {
    updateLockUI();
    if (appLock.pinHash) showAppLock();
    document.getElementById('lockPinInput').addEventListener('keydown', event => {
        if (event.key === 'Enter') unlockWithPin();
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && appLock.pinHash && appUnlocked) appUnlocked = false;
        if (!document.hidden && appLock.pinHash && !appUnlocked) showAppLock();
    });
}
