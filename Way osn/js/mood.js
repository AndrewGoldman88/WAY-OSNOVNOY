/* =========================================================
           MOOD
           ========================================================= */
        function todayMoodEntry() {
            const key = todayKey();
            return state.moodLog.find(m => new Date(m.date).toDateString() === key);
        }

        function setMoodToday(value) {
            const key = todayKey();
            const existing = state.moodLog.find(m => new Date(m.date).toDateString() === key);
            if (existing) { existing.value = value;
                existing.day = currentDay(); } else { state.moodLog.push({ date: new Date().toISOString(), day: currentDay(),
                    value }); }
            save();
            vibrate(12);
            renderMoodScale();
            if (document.getElementById('view-stats').classList.contains('active')) renderMoodStats();
        }

        function renderMoodScale() {
            const today = todayMoodEntry();
            const wrap = document.getElementById('moodScale');
            let html = '';
            for (let i = 1; i <= 10; i++) {
                const active = today && today.value === i;
                html += `<div class="mood-dot ${active?'active':''}" onclick="setMoodToday(${i})">${i}</div>`;
            }
            wrap.innerHTML = html;
        }
