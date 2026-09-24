/* =========================================================
           JOURNAL
           ========================================================= */
        function renderJournal() {
            const list = document.getElementById('journalList');
            if (state.journal.length === 0) {
                list.innerHTML = `<div class="empty-note">${t('journal_empty')}</div>`;
                return;
            }
            const locale = (state.lang === 'en') ? 'en-GB' : 'ru-RU';
            list.innerHTML = [...state.journal].reverse().map(e => {
                const dt = new Date(e.date);
                const dateStr = dt.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
                return `<div class="j-entry">
              <button class="j-del" onclick="delJournal(${e.id})">${t('journal_delete')}</button>
              <div class="j-meta">${t('journal_day')} ${e.day} · ${dateStr}</div>
              <div class="j-text">${escapeHtml(e.text)}</div>
            </div>`;
            }).join('');
        }

        function addJournal() {
            const inp = document.getElementById('journalInput');
            const text = inp.value.trim();
            if (!text) return;
            state.journal.push({ id: Date.now(), date: new Date().toISOString(), day: currentDay(), text });
            save();
            inp.value = '';
            renderJournal();
            renderRanks();
        }

        function delJournal(id) {
            state.journal = state.journal.filter(e => e.id !== id);
            save();
            renderJournal();
        }
