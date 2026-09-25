/* =========================================================
           RELAPSE
           ========================================================= */
        let selectedRelapseReason = null;

        function openRelapseFlow() {
            closeModal('panic');
            const d = currentDay();
            const rank = rankForDayL(d);
            const achieved = RANKS.filter(r => d >= r.day);
            const streakWord = state.lang === 'en'
                ? `${d} ${d === 1 ? 'day' : 'days'} of current streak will be reset`
                : `<b>${d} ${d===1?'день':'дней'}</b> текущего стрика будут обнулены`;
            const rankWord = state.lang === 'en'
                ? `Rank «<b>${rank.name}</b>» and everything it gave you`
                : `Ранг «<b>${rank.name}</b>» и всё, что он давал`;
            document.getElementById('lossList').innerHTML =
                `<li><span class="x">✕</span><span>${streakWord}</span></li>` +
                `<li><span class="x">✕</span><span>${rankWord}</span></li>` +
                achieved.slice(-3).map(r => `<li><span class="x">✕</span><span>${r.aura}</span></li>`).join('');

            selectedRelapseReason = null;
            document.getElementById('relapseReasonOptions').innerHTML = getRelReasons().map((r, i) =>
                `<button class="ob-option" data-i="${i}" onclick="selectRelapseReason(${i})">${r.label}</button>`
            ).join('');
            document.getElementById('relapseCustomWrap').style.display = 'none';
            document.getElementById('reasonInput').value = '';
            const confirmBtn = document.getElementById('relapseConfirmBtn');
            confirmBtn.style.opacity = '.4';
            confirmBtn.style.pointerEvents = 'none';

            openModal('relapse');
        }

        function selectRelapseReason(i) {
            const r = getRelReasons()[i];
            selectedRelapseReason = r;
            document.querySelectorAll('#relapseReasonOptions .ob-option').forEach(el => el.classList.remove('selected'));
            document.querySelectorAll(`#relapseReasonOptions .ob-option[data-i="${i}"]`)[0].classList.add('selected');
            document.getElementById('relapseCustomWrap').style.display = r.id === 'custom' ? 'block' : 'none';
            const confirmBtn = document.getElementById('relapseConfirmBtn');
            confirmBtn.style.opacity = '1';
            confirmBtn.style.pointerEvents = 'auto';
        }

        function confirmRelapse() {
            if (!selectedRelapseReason) return;
            const d = currentDay();
            let reasonText = selectedRelapseReason.label;
            if (selectedRelapseReason.id === 'custom') {
                const custom = document.getElementById('reasonInput').value.trim();
                if (!custom) { showToast(t('relapse_describe_toast')); return; }
                reasonText = custom;
            }
            state.relapses.push({ date: new Date().toISOString(), streakDays: d, reasonTag: selectedRelapseReason.id,
                reason: reasonText });
            state.bestStreak = Math.max(state.bestStreak, d);
            state.startDate = new Date().toISOString();
            state.lastSeenRankDay = 0;
            save();
            vibrate([70, 50, 70]);
            closeModal('relapse');
            showToast(t('relapse_new_count_toast'));
            switchView('home');
        }
