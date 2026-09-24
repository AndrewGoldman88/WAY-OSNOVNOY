/* =========================================================
           NAVIGATION
           ========================================================= */
        function switchView(v) {
            document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
            document.getElementById('view-' + v).classList.add('active');
            document.querySelectorAll('.nav-btn').forEach(el => el.classList.toggle('active', el.dataset.v === v));
            if (v === 'home') { renderHome();
                checkRankUp(); }
            if (v === 'journal') renderJournal();
            if (v === 'stats') renderStats();
            if (v === 'calendar') renderCalendar();
            if (v === 'ranks') renderRanks();
        }
