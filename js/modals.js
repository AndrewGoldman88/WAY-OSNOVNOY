/* =========================================================
           MODALS
           ========================================================= */
        let breathInterval = null;

        function openModal(name) {
            document.getElementById('modal-' + name).classList.add('show');
            if (name === 'panic') {
                const q = getQuotes()[Math.floor(Math.random() * getQuotes().length)];
                document.getElementById('panicQuote').textContent = q;
                if (state.why.trim()) {
                    document.getElementById('whyBlock').style.display = 'block';
                    document.getElementById('whyText').textContent = state.why;
                } else {
                    document.getElementById('whyBlock').style.display = 'none';
                }
                let t = 60;
                document.getElementById('breathTimer').textContent = t;
                clearInterval(breathInterval);
                breathInterval = setInterval(() => {
                    t--;
                    if (t < 0) t = 60;
                    document.getElementById('breathTimer').textContent = t;
                }, 1000);
            }
            if (name === 'settings') {
                document.getElementById('whyInput').value = state.why;
                document.getElementById('startInput').value = new Date(state.startDate).toISOString().slice(0, 10);
                updateSettingsPillsUI();
                updateNotificationUI();
                if (typeof updateLangPillsUI === 'function') updateLangPillsUI();
            }
            if (name === 'sex') {
                sexSelectedFeeling = null;
                document.getElementById('sexFeelingOptions').innerHTML = getSexFeelings().map((f, i) =>
                    `<button class="ob-option" data-i="${i}" onclick="selectSexFeeling(${i})">${f}</button>`
                ).join('');
                const btn = document.getElementById('sexSaveBtn');
                btn.style.opacity = '.4';
                btn.style.pointerEvents = 'none';
            }
        }

        function closeModal(name) {
            document.getElementById('modal-' + name).classList.remove('show');
            if (name === 'panic') clearInterval(breathInterval);
        }

        function updateSettingsPillsUI() {
            document.getElementById('themePillDark').classList.toggle('active', state.theme === 'dark');
            document.getElementById('themePillMatrix').classList.toggle('active', state.theme === 'matrix');
            document.getElementById('themePillBlue').classList.toggle('active', state.theme === 'blue');
            document.getElementById('modePillFull').classList.toggle('active', state.mode !== 'nofap');
            document.getElementById('modePillNofap').classList.toggle('active', state.mode === 'nofap');
        }

        function setMode(m) {
            state.mode = m;
            save();
            updateSettingsPillsUI();
            renderHome();
        }

        function saveSettings() {
            state.why = document.getElementById('whyInput').value.trim();
            const newStart = document.getElementById('startInput').value;
            if (newStart) state.startDate = new Date(newStart + 'T00:00:00').toISOString();
            save();
            closeModal('settings');
            showToast(t('toast_saved'));
            switchView('home');
        }

        function resetAll() {
            if (confirm(t('reset_confirm'))) {
                localStorage.removeItem('retention_state_v1');
                state = loadState();
                closeModal('settings');
                switchView('home');
                showToast(t('toast_reset_done'));
            }
        }
