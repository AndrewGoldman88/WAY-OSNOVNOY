/* =========================================================
           STATE
           ========================================================= */
        // ВАЖНО: эта функция также объявлена в onboarding.js.
        // Дублируем её здесь, потому что state.js загружается раньше
        // onboarding.js, а loadState() ниже вызывает её сразу же —
        // без этого дубликата будет ошибка "defaultNotificationSettings is not defined"
        // и вся переменная state вообще не создастся.
        function defaultNotificationSettings() {
            return { enabled:false, morning:true, evening:true, ranks:true, task:true, quotes:false, morningTime:'09:00', eveningTime:'21:00', sent:{} };
        }

        function loadState() {
            let s = null;
            try { s = localStorage.getItem('retention_state_v1'); } catch (e) { s = null; }
            if (s) {
                let parsed;
                try { parsed = JSON.parse(s); } catch (e) { parsed = null; }
                if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) parsed = null;
                if (parsed) {
                if (parsed.theme === undefined) parsed.theme = 'dark';
                if (parsed.mode === undefined) parsed.mode = 'full';
                if (parsed.sexLog === undefined) parsed.sexLog = [];
                if (parsed.cosmetics === undefined) parsed.cosmetics = { particles: null, bg: null };
                if (parsed.moodLog === undefined) parsed.moodLog = [];
                if (parsed.wheel === undefined) parsed.wheel = { lastSpinDate: null, currentTask: null, completed: false, rotation: 0 };
                if (parsed.activeMatrixRain === undefined) parsed.activeMatrixRain = null;
                if (parsed.lastSeenRankDay === undefined) parsed.lastSeenRankDay = 0;
                if (parsed.notifications === undefined) parsed.notifications = defaultNotificationSettings();
                    if (parsed.lang === undefined) parsed.lang = null; // null = not picked yet
                    // New users get the account choice after onboarding.
                    // Existing users are not interrupted by this new first-launch screen.
                    if (parsed.accountChoiceDone === undefined) parsed.accountChoiceDone = !!parsed.onboardingDone;
                return parsed;
                }
            }
            return {
                startDate: new Date().toISOString(),
                bestStreak: 0,
                relapses: [],
                journal: [],
                why: "",
                onboardingDone: false,
                onboarding: {},
                taskDone: {},
                taskLog: {},
                theme: "dark",
                mode: "full",
                lang: null,
                accountChoiceDone: false,
                sexLog: [],
                cosmetics: { particles: null, bg: null },
                lastSeenRankDay: 0,
                moodLog: [],
                wheel: { lastSpinDate: null, currentTask: null, completed: false, rotation: 0 },
                activeMatrixRain: null,
                notifications: defaultNotificationSettings()
            };
        }
        let state = loadState();

        function save() {
            try {
                localStorage.setItem('retention_state_v1', JSON.stringify(state));
            } catch (e) {
                if (typeof showToast === 'function') showToast('Не удалось сохранить данные на устройстве');
            }
            // Если пользователь вошёл в аккаунт, эта же версия состояния
            // тихо уходит в его личное облачное хранилище.
            if (typeof queueCloudSave === 'function') queueCloudSave();
        }

        function currentDayPrecise() {
            const diff = Date.now() - new Date(state.startDate).getTime();
            return Math.max(0, diff / DAY_MS);
        }

        function currentDay() { return Math.floor(currentDayPrecise()); }

        function elapsedParts() {
            const totalMs = Math.max(0, Date.now() - new Date(state.startDate).getTime());
            const totalSec = Math.floor(totalMs / 1000);
            const days = Math.floor(totalSec / 86400);
            const hours = Math.floor((totalSec % 86400) / 3600);
            const minutes = Math.floor((totalSec % 3600) / 60);
            const seconds = totalSec % 60;
            const pad = n => String(n).padStart(2, '0');
            return { days, hours, minutes, seconds, clock: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` };
        }

        function rankForDay(d) {
            let r = RANKS[0];
            for (const item of RANKS) { if (d >= item.day) r = item; else break; }
            return r;
        }

        function nextRank(d) {
            for (const item of RANKS) { if (item.day > d) return item; }
            return null;
        }

        function declOfDays(n) {
            const n10 = n % 10, n100 = n % 100;
            if (n100 >= 11 && n100 <= 14) return 'дней';
            if (n10 === 1) return 'день';
            if (n10 >= 2 && n10 <= 4) return 'дня';
            return 'дней';
        }

        function bestStreakEver() { return Math.max(state.bestStreak, currentDay()); }

        function dailyTaskIndex() {
            const set = typeof getTaskSetForDay === 'function' ? getTaskSetForDay(currentDay()) : null;
            return set ? set.index : 0;
        }

        function todayKey() { return new Date().toDateString(); }

        function pearson(xs, ys) {
            const n = xs.length;
            if (n < 2) return null;
            const mx = xs.reduce((a, b) => a + b, 0) / n;
            const my = ys.reduce((a, b) => a + b, 0) / n;
            let num = 0,
                dx2 = 0,
                dy2 = 0;
            for (let i = 0; i < n; i++) {
                const dx = xs[i] - mx,
                    dy = ys[i] - my;
                num += dx * dy;
                dx2 += dx * dx;
                dy2 += dy * dy;
            }
            if (dx2 === 0 || dy2 === 0) return null;
            return num / Math.sqrt(dx2 * dy2);
        }

        function timeBucket(hour) {
            if (hour >= 6 && hour < 12) return { id: 'morning', label: 'утром' };
            if (hour >= 12 && hour < 18) return { id: 'day', label: 'днём' };
            if (hour >= 18 && hour < 24) return { id: 'evening', label: 'вечером' };
            return { id: 'night', label: 'ночью' };
        }
        const DAY_NAMES_PLURAL = { 0: 'воскресеньям', 1: 'понедельникам', 2: 'вторникам', 3: 'средам', 4: 'четвергам',
            5: 'пятницам', 6: 'субботам' };

        function getDayNamePlural(dow) {
            if (typeof t === 'function') return t('day_names_plural')[dow] || DAY_NAMES_PLURAL[dow];
            return DAY_NAMES_PLURAL[dow];
        }
