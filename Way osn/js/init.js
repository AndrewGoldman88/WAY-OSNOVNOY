/* =========================================================
           INIT
           ========================================================= */
        let liveTimer = null;

        function startLiveTimer() {
            if (liveTimer) clearInterval(liveTimer);
            liveTimer = setInterval(() => {
                if (!document.hidden && document.getElementById('view-home').classList.contains('active')) {
                    buildSigil();
                    checkRankUp();
                }
            }, 1000);
        }

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) { buildSigil();
                checkRankUp();
                notificationEngineTick(); }
        });

        // Init
        applyTheme();
        if (typeof applyLang === 'function') applyLang();
        if (state.lastSeenRankDay === undefined) {
            state.lastSeenRankDay = rankForDay(currentDay()).day;
            save();
        }
        resizeParticleCanvas();
        window.addEventListener('resize', resizeParticleCanvas);
        requestAnimationFrame(tickParticles);
        applyCosmetics();
        if (state.activeMatrixRain) startMatrixRain();
        else stopMatrixRain();
        if (typeof initQuote === "function") initQuote(); else newQuote();
        populateRankTestSelect();
        renderHome();
        updateDayProgress();
        setInterval(updateDayProgress, 30000);
        checkWheelDaily();
        checkRankUp();
        updateNotificationUI();
        notificationEngineTick();
        setInterval(notificationEngineTick, 30000);
        startLiveTimer();
        initParallax();

        if (!state.lang) {
            // Первый запуск — показываем выбор языка
            // pickLang() запустит onboarding после выбора
            if (typeof initLangPicker === 'function') initLangPicker();
        } else {
            // Язык уже выбран — скрываем пикер
            const lpo = document.getElementById('lang-picker-overlay');
            if (lpo) lpo.style.display = 'none';
            if (!state.onboardingDone) {
                startOnboarding(false);
            }
        }

        // Expose to global
        window.switchView = switchView;
        window.openModal = openModal;
        window.closeModal = closeModal;
        window.setTheme = setTheme;
        window.setMode = setMode;
        window.saveSettings = saveSettings;
        window.resetAll = resetAll;
        window.openRelapseFlow = openRelapseFlow;
        window.selectRelapseReason = selectRelapseReason;
        window.confirmRelapse = confirmRelapse;
        window.selectSexFeeling = selectSexFeeling;
        window.saveSexLog = saveSexLog;
        window.toggleTask = toggleTask;
        window.setMoodToday = setMoodToday;
        window.addJournal = addJournal;
        window.delJournal = delJournal;
        window.newQuote = newQuote;
        window.setParticles = setParticles;
        window.setBgTint = setBgTint;
        window.toggleMatrixRain = toggleMatrixRain;
        window.exportBackup = exportBackup;
        window.importBackup = importBackup;
        window.testWheel = testWheel;
        window.updateNotificationSetting = updateNotificationSetting;
        window.requestNotificationPermission = requestNotificationPermission;
        window.sendTestNotification = sendTestNotification;
        window.spinWheel = spinWheel;
        window.claimWheelTask = claimWheelTask;
        window.completeWheelTask = completeWheelTask;
        window.closeWheel = closeWheel;
        window.closeRankAscension = closeRankAscension;
        window.setLang = setLang;
        window.pickLang = pickLang;
        window.updateLangPillsUI = updateLangPillsUI;
        window.startOnboarding = startOnboarding;
        window.obBack = obBack;
        window.obNext = obNext;
        window.selectOption = selectOption;
        window.skipOnboarding = skipOnboarding;
        window.finishOnboarding = finishOnboarding;
        window.showAccountIntro = showAccountIntro;
        window.continueAsGuest = continueAsGuest;
        window.openAccountModal = openAccountModal;
        window.closeAccountModal = closeAccountModal;
        window.authSignUp = authSignUp;
        window.authSignIn = authSignIn;
        window.authSignOut = authSignOut;
        window.openPinSetup = openPinSetup;
        window.closePinSetup = closePinSetup;
        window.savePinSetup = savePinSetup;
        window.disableAppLock = disableAppLock;
        window.setupBiometrics = setupBiometrics;
        window.unlockWithPin = unlockWithPin;
        window.unlockWithBiometrics = unlockWithBiometrics;
        initAuth();
        initAppLock();
