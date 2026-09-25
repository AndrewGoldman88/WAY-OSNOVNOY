/* =========================================================
           BACKUP
           ========================================================= */
        function exportBackup() {
            const payload = {
                app: "put-retention-backup",
                version: 1,
                exportedAt: new Date().toISOString(),
                data: state
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const dateTag = new Date().toISOString().slice(0, 10);
            a.href = url;
            a.download = `put-backup-${dateTag}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 2000);
            showToast("Файл сохранён. Перекинь его на новый телефон.");
        }

        function importBackup(file) {
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                let parsed;
                try { parsed = JSON.parse(e.target.result); } catch (err) { showToast("Файл повреждён или это не резервная копия.");
                    return; }
                const incoming = parsed && parsed.data ? parsed.data : parsed;
                if (!incoming || !incoming.startDate) {
                    showToast("Это не похоже на файл резервной копии Пути.");
                    return;
                }
                if (!confirm(
                        'Заменить текущий прогресс данными из файла? Текущие данные на этом телефоне будут перезаписаны.'
                        )) return;
                state = {
                    startDate: incoming.startDate,
                    bestStreak: incoming.bestStreak || 0,
                    relapses: incoming.relapses || [],
                    journal: incoming.journal || [],
                    why: incoming.why || "",
                    onboardingDone: incoming.onboardingDone !== undefined ? incoming.onboardingDone : true,
                    onboarding: incoming.onboarding || {},
                    taskDone: incoming.taskDone || {},
                    theme: incoming.theme || "dark",
                    mode: incoming.mode || "full",
                    sexLog: incoming.sexLog || [],
                    cosmetics: incoming.cosmetics || { particles: null, bg: null },
                    lastSeenRankDay: incoming.lastSeenRankDay !== undefined ? incoming.lastSeenRankDay : undefined,
                    moodLog: incoming.moodLog || [],
                    wheel: incoming.wheel || { lastSpinDate: null, currentTask: null, completed: false, rotation: 0 },
                    activeMatrixRain: incoming.activeMatrixRain || false
                };
                if (state.lastSeenRankDay === undefined) {
                    state.lastSeenRankDay = rankForDay(currentDay()).day;
                }
                save();
                applyTheme();
                applyCosmetics();
                if (state.activeMatrixRain) startMatrixRain();
                else stopMatrixRain();
                closeModal('settings');
                switchView('home');
                renderJournal();
                renderStats();
                renderRanks();
                showToast("Прогресс восстановлен из резервной копии.");
            };
            reader.readAsText(file);
            document.getElementById('importFile').value = '';
        }
