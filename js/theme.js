/* =========================================================
           THEME
           ========================================================= */
        function applyTheme() {
            document.documentElement.setAttribute('data-theme', state.theme || 'dark');
        }

        function setTheme(theme) {
            state.theme = theme;
            applyTheme();
            ['themePillDark', 'themePillMatrix', 'themePillBlue'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.toggle('active', id === 'themePill' + theme.charAt(0).toUpperCase() + theme.slice(1));
            });
            save();
        }
