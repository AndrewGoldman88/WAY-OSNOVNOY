/* =========================================================
   i18n — локализация RU / EN
   ========================================================= */

const TRANSLATIONS = {
    ru: {
        /* ── Топбар ── */
        brand: '⟡ ПУТЬ',
        settings_aria: 'Настройки',

        /* ── Home ── */
        aura_label: 'Твоя аура сейчас',
        task_label: 'Задание дня',
        tasks_title: 'Задания дня',
        tasks_stats_title: 'Задания',
        task_spirit: 'Дух',
        task_mind: 'Разум',
        task_body: 'Тело',
        task_day: 'День',
        task_completed: 'Выполнено',
        task_completion: 'Общая доля',
        task_recent: 'Последние дни',
        task_no_history: 'История заданий появится после первых отметок.',
        task_none_done: 'ничего',
        challenge_label: 'ВЫЗОВ ДНЯ',
        task_done_btn: 'Выполнил',
        mood_label: 'Настроение / энергия сегодня',
        quote_refresh: 'ДРУГАЯ ЦИТАТА ↻',
        btn_panic: 'Мне тяжело',
        btn_journal: 'Дневник',
        btn_sex: 'Был секс (не сбрасывает стрик)',
        day_unit: 'день',

        /* ── Journal ── */
        journal_title: 'Дневник пути',
        journal_placeholder: 'Что происходит сегодня? Мысли, состояние, победы...',
        journal_save: 'Сохранить запись',

        /* ── Calendar ── */
        calendar_title: 'Календарь пути',
        cal_days: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
        cal_legend_clean: 'чистый день',
        cal_legend_hard: 'сложный день',
        cal_legend_relapse: 'срыв',
        cal_legend_rank: 'новый ранг',
        cal_day_abbr: 'д.',
        cal_detail_day_path: 'День пути',
        cal_detail_new_rank: 'Новый ранг',
        cal_detail_mood: 'Настроение',
        cal_detail_not_logged: 'не отмечено',
        cal_detail_energy: 'Энергия',
        cal_detail_energy_na: 'пока не отслеживается в этой версии',
        cal_detail_relapse: 'Срыв',
        cal_detail_relapse_logged: 'зафиксирован',
        cal_detail_task: 'Задание',
        cal_detail_tasks: 'Задания',
        cal_detail_done: 'выполнено',
        cal_detail_not_done: 'не выполнено',
        cal_detail_journal: 'Дневник',
        cal_detail_no_entries: 'записей нет',
        cal_detail_nothing: 'В этот день пока ничего не отмечено.',

        /* ── Stats ── */
        stats_title: 'Статистика',
        stat_current_unit: 'день',
        stat_started: 'Путь начат',
        stat_loading: 'Собираем данные…',
        stat_best: 'Рекорд',
        stat_attempts: 'Попыток',
        stat_total: 'Дней всего практики',
        stat_avg: 'Средний стрик',
        stat_streak_history: 'История стриков',
        stat_mood: 'Настроение и энергия',
        stat_relapses: 'Срывы и причины',
        stat_sex: 'Секс без срыва',
        stat_triggers: 'Карта триггеров',
        stat_all_ranks: 'Все ранги пути пройдены.',
        stat_days_left: (name, n) => `До ранга «${name}» осталось ${n} ${declOfDays(n)}`,
        stat_no_relapses: 'Срывов ещё не было. Пусть так и остаётся как можно дольше.',
        stat_no_sex: 'Пока ничего не отмечено.',
        stat_no_mood: 'Отмечай настроение каждый день — через несколько дней здесь появится график.',
        stat_no_triggers: 'Нужно минимум 3 срыва в истории, чтобы увидеть паттерн. Пусть их будет как можно меньше.',
        stat_streak_held: 'держался',
        stat_streak_days: 'дн.',
        stat_reason_none: 'причина не указана',
        stat_streak_day: 'день',
        stat_sex_no_reset: 'стрик не сброшен',
        stat_by_reasons: 'По причинам',
        stat_corr_positive: r => `Похоже на закономерность: чем дольше держится стрик, тем выше настроение (корреляция ${r}).`,
        stat_corr_negative: r => `Пока обратная картина: с ростом стрика настроение немного снижается (корреляция ${r}). Стоит последить, с чем это связано.`,
        stat_corr_none: r => `Явной связи между стриком и настроением пока не видно (корреляция ${r}).`,
        stat_corr_need_more: 'Собери больше отметок настроения, чтобы увидеть, есть ли связь со стриком.',
        stat_trigger_sentence: (time, day, reason) => `Чаще всего срывы случаются ${time}, по ${day}${reason ? `, чаще всего по причине «${reason}»` : ''}.`,

        /* ── Ranks ── */
        ranks_achievements: 'Достижения',
        ranks_rewards: 'Награды пути',
        ranks_sparks: 'Искры',
        ranks_bg: 'Свечение фона',
        ranks_mystic: 'Мистика',
        ranks_ladder: 'Лестница рангов',
        badge_first_entry: 'Первая запись',
        badge_7_entries: '7 записей в дневнике',
        badge_week: 'Неделя',
        badge_month: 'Месяц',
        badge_legend: 'Легенда · 100 дней',
        badge_goal: 'Цель определена',
        swatch_off: 'Выкл',

        /* ── Navbar ── */
        nav_home: 'ГЛАВНАЯ',
        nav_journal: 'ДНЕВНИК',
        nav_calendar: 'КАЛЕНДАРЬ',
        nav_stats: 'СТАТИСТИКА',
        nav_ranks: 'РАНГИ',

        /* ── Panic modal ── */
        panic_title: 'Момент слабости',
        panic_sub: 'Это пройдёт. Дай себе 60 секунд, прежде чем решать что-то.',
        panic_why_label: 'Зачем ты это начал',
        panic_survived: 'Я справился, возвращаюсь к пути',
        panic_relapsed: 'Всё же сорвался',

        /* ── Relapse modal ── */
        relapse_title: 'Прежде чем всё обнулить',
        relapse_sub: 'Посмотри, что именно ты сейчас теряешь:',
        relapse_reason_label: 'Что стало причиной?',
        relapse_cancel: 'Отмена, я остаюсь на пути',
        relapse_confirm: 'Подтвердить срыв и начать заново',
        relapse_custom_placeholder: 'Опиши своими словами, что произошло...',

        /* ── Sex modal ── */
        sex_title: 'Отметить, что был секс',
        sex_sub: 'Стрик не сбросится. Это просто отметка для статистики — как ты себя чувствуешь после?',
        sex_cancel: 'Отмена',
        sex_save: 'Сохранить отметку',

        /* ── Settings modal ── */
        settings_title: 'Настройки пути',
        settings_sub: 'Это хранится только в этом браузере, на этом устройстве.',
        settings_theme: 'Тема оформления',
        theme_dark: 'Тёмная',
        theme_matrix: 'Матрица',
        theme_blue: 'Синяя',
        settings_mode: 'Режим пути',
        mode_full: 'Полное воздержание',
        mode_nofap: 'NoFap',
        mode_note: 'В режиме NoFap секс с партнёром не считается срывом — для него есть отдельная кнопка на главном экране. Срывом остаются соло-разрядка и порно.',
        settings_why: 'Твоя причина ("зачем")',
        why_placeholder: 'Например: хочу больше энергии, ясности и уважения к себе',
        settings_start: 'Начало текущего стрика',
        settings_save: 'Сохранить',
        settings_language: 'Язык / Language',
        lang_ru: 'Русский',
        lang_en: 'English',
        settings_notifications: '🔔 Уведомления',
        notify_master_title: 'Уведомления',
        notify_master_desc: 'Разрешить приложению напоминать о пути.',
        notify_morning_title: 'Утреннее',
        notify_morning_desc: 'Напоминание о сегодняшнем дне.',
        notify_evening_title: 'Вечернее',
        notify_evening_desc: '«Как прошёл сегодняшний день?»',
        notify_ranks_title: 'Ранги',
        notify_ranks_desc: 'За день до новой ступени и при её достижении.',
        notify_task_title: 'Задание дня',
        notify_task_desc: 'Напомнить о задании, если оно ещё не выполнено.',
        notify_quotes_title: 'Цитаты',
        notify_quotes_desc: 'Одна короткая мысль для пути каждый день.',
        notify_status_checking: 'Проверка разрешения браузера…',
        notify_status_granted: 'Разрешение браузера получено',
        notify_status_denied: 'Уведомления заблокированы браузером',
        notify_status_unsupported: 'Уведомления не поддерживаются',
        notify_status_pending: 'Разрешение ещё не выдано',
        notify_allow_btn: 'Разрешить уведомления',
        notify_test_btn: 'Проверить уведомление',
        settings_retake: 'Пройти анкету заново',
        settings_backup: 'Резервная копия · перенос на новый телефон',
        settings_export: 'Скачать файл резервной копии',
        settings_import: 'Восстановить из файла',
        settings_test_wheel: '🎰 Тест колеса фортуны',
        settings_reset: 'Сбросить все данные приложения',

        /* ── Wheel ── */
        wheel_title: 'Колесо Фортуны',
        wheel_sub: 'Крути колесо и получи вызов на сегодня. Новый спин доступен после полуночи.',
        wheel_spin: 'КРУТИТЬ',
        wheel_claim: 'Забрать вызов',
        wheel_result_type: 'ТИП',

        /* ── Onboarding ── */
        ob_step: (i, total) => `Шаг ${i} из ${total}`,
        ob_guidance: 'Наставление',
        ob_before_start: 'Прежде чем начать',
        ob_start_btn: 'Начать путь',
        ob_back: '← Назад',
        ob_skip: 'Пропустить',
        ob_next: 'Далее →',

        /* ── Rank ascension overlay ── */
        rank_ascension_eyebrow: 'ВОЗВЫШЕНИЕ',
        rank_ascension_prefix: 'РАНГ',
        rank_continue: 'Продолжить',

        /* ── Toasts ── */
        toast_saved: 'Сохранено.',
        sex_saved_toast: 'Отмечено. Стрик не сброшен — путь продолжается.',
        journal_empty: 'Пока пусто. Первая запись — тоже часть пути.',
        journal_delete: 'удалить',
        journal_day: 'День',
        wheel_task_do: 'Выполнил',
        wheel_task_done: 'Выполнено ✓',
        wheel_complete_toast: 'Вызов выполнен! Ты сильнее, чем вчера.',
        relapse_describe_toast: 'Опиши коротко, что произошло.',
        relapse_new_count_toast: 'Новый отсчёт начался. Ты не проиграл — ты учишься держать удар.',
        toast_onboarding_done: 'Анкета сохранена. Путь начался.',
        toast_reset_done: 'Всё сброшено. Чистый лист.',
        toast_no_notifications: 'Этот браузер не поддерживает уведомления',
        toast_notifications_on: 'Уведомления включены',
        toast_notifications_denied: 'Браузер запретил уведомления. Разреши их в настройках сайта.',
        toast_notifications_error: 'Не удалось запросить разрешение на уведомления',
        toast_storage_error: 'Не удалось сохранить данные на устройстве',
        reset_confirm: 'Точно стереть весь прогресс, дневник и историю без возможности отмены?',

        /* ── Notifications engine ── */
        notif_morning_body: d => `Сегодня у тебя день ${d}.\nНе нужно проходить весь путь. Нужно пройти сегодняшний день.`,
        notif_morning_title: 'ПУТЬ',
        notif_evening_title: 'Перед сном',
        notif_evening_body: 'Как прошёл сегодняшний день?',
        notif_rank_before_title: 'ПУТЬ',
        notif_rank_before_body: name => `Через 1 день тебя ждёт новая ступень — «${name}».`,
        notif_rank_up_title: 'Новый ранг',
        notif_rank_up_body: name => `Ты достиг ступени «${name}».`,
        notif_task_title: 'Задание дня',
        notif_task_body: 'Сегодняшнее задание ещё ждёт тебя.',
        notif_test_title: 'ПУТЬ',
        notif_test_body: 'Это тестовое уведомление. Система работает.',
        notif_quote_title: 'Мысль на сегодня',

        /* ── Time labels for trigger map ── */
        time_morning: 'утром',
        time_day: 'днём',
        time_evening: 'вечером',
        time_night: 'ночью',
        day_names_plural: { 0:'воскресеньям',1:'понедельникам',2:'вторникам',3:'средам',4:'четвергам',5:'пятницам',6:'субботам' },

        /* ── Language picker screen ── */
        lang_pick_title: 'Выберите язык',
        lang_pick_sub: 'Choose your language',

        /* ── First-launch account choice ── */
        account_intro_title: 'Сохрани свой путь',
        account_intro_sub: 'Ты можешь создать аккаунт и синхронизировать прогресс или продолжить без регистрации.',
        account_intro_signin: 'Войти в аккаунт',
        account_intro_signup: 'Зарегистрироваться',
        account_intro_guest: 'Продолжить без входа',
        account_intro_note: 'Аккаунт нужен только для облачной синхронизации. Можно пользоваться приложением и без него.',

        /* ── Account & cloud ── */
        account_section_title: '☁️ Аккаунт и облако',
        account_checking: 'Проверяю аккаунт...',
        account_open_btn: 'Войти или создать аккаунт',
        account_signout_btn: 'Выйти из аккаунта',
        account_cloud_status: email => `В облаке: ${email || 'аккаунт подключён'}`,
        account_no_account: 'Нет аккаунта — данные пока только на этом устройстве.',
        account_modal_title: 'Аккаунт пути',
        account_modal_sub: 'Войди, чтобы твой прогресс не потерялся при смене телефона.',
        account_email_label: 'Почта',
        account_password_label: 'Пароль',
        account_password_placeholder: 'Минимум 6 символов',
        account_signin_btn: 'Войти',
        account_signup_btn: 'Создать аккаунт',
        account_google_note: 'Вход через Google добавим, когда приложение будет опубликовано на сайте.',
        account_fill_fields: 'Введи почту и пароль минимум из 6 символов.',
        account_creating: 'Создаю аккаунт...',
        account_check_email: 'Аккаунт создан. Проверь почту и подтверди адрес.',
        account_created_toast: 'Аккаунт создан — прогресс сохранён в облако',
        account_fill_email_pass: 'Введи почту и пароль.',
        account_signing_in: 'Вхожу...',
        account_signin_failed: msg => `Не вышло: ${msg}`,
        account_signout_confirm: 'Выйти из аккаунта на этом устройстве? Локальная копия прогресса останется.',
        account_signed_out_toast: 'Ты вышел из аккаунта',
        account_cloud_load_failed: 'Не удалось загрузить облачные данные',
        account_cloud_loaded_toast: 'Прогресс загружен из облака',
        account_cloud_saved_toast: 'Текущий прогресс сохранён в облако',

        /* ── Auth error messages (Supabase) ── */
        auth_err_invalid_credentials: 'Неверная почта или пароль.',
        auth_err_user_exists: 'Этот email уже зарегистрирован.',
        auth_err_weak_password: 'Пароль должен быть не менее 6 символов.',
        auth_err_invalid_email: 'Некорректный формат почты.',
        auth_err_rate_limit: 'Слишком много попыток. Подожди немного.',
        auth_err_generic: 'Что-то пошло не так. Попробуй ещё раз.',

        /* ── App lock ── */
        lock_section_title: '🔒 Замок приложения',
        lock_checking: 'Проверяю настройки замка...',
        lock_set_pin_btn: 'Задать или поменять PIN-код',
        lock_biometric_btn: 'Включить отпечаток / Face ID',
        lock_disable_btn: 'Выключить замок',
        lock_off_status: 'Замок выключен.',
        lock_pin_bio_status: 'PIN + отпечаток / Face ID включены на этом устройстве.',
        lock_pin_only_status: 'PIN-код включён на этом устройстве.',
        lock_disable_confirm: 'Выключить PIN и вход по отпечатку на этом устройстве?',
        lock_disabled_toast: 'Замок выключен',
        lock_need_pin_first_toast: 'Сначала задай PIN-код',
        lock_biometric_needs_https_toast: 'Отпечаток заработает после публикации приложения на HTTPS-сайте',
        lock_biometric_enabled_toast: 'Отпечаток / Face ID включён',
        lock_biometric_failed_toast: 'Не удалось включить отпечаток на этом устройстве',

        pin_setup_title: 'PIN-код',
        pin_setup_sub: 'Это замок только для этого устройства. Не забудь код, браток.',
        pin_new_label: 'Новый PIN',
        pin_new_placeholder: '4 цифры',
        pin_repeat_label: 'Ещё раз',
        pin_repeat_placeholder: 'Повтори PIN',
        pin_enable_btn: 'Включить PIN',
        pin_need_4_digits: 'Нужно ровно 4 цифры.',
        pin_mismatch: 'Коды не совпадают.',
        pin_enabled_toast: 'PIN-код включён',

        app_lock_title: 'Путь закрыт',
        app_lock_sub: 'Введи PIN, чтобы продолжить.',
        app_lock_placeholder: '••••',
        app_lock_open_btn: 'Открыть',
        app_lock_biometric_btn: 'Войти по отпечатку / Face ID',
        app_lock_need_4_digits: 'Введи 4 цифры.',
        app_lock_wrong_pin: 'Не тот код. Попробуй ещё раз.',
        app_lock_biometric_failed: 'Отпечаток не сработал — можно ввести PIN.',
    },

    en: {
        /* ── Topbar ── */
        brand: '⟡ THE PATH',
        settings_aria: 'Settings',

        /* ── Home ── */
        aura_label: 'Your aura right now',
        task_label: 'Daily task',
        tasks_title: 'Daily tasks',
        tasks_stats_title: 'Tasks',
        task_spirit: 'Spirit',
        task_mind: 'Mind',
        task_body: 'Body',
        task_day: 'Day',
        task_completed: 'Completed',
        task_completion: 'Completion',
        task_recent: 'Recent days',
        task_no_history: 'Task history will appear after your first check-ins.',
        task_none_done: 'none',
        challenge_label: 'DAILY CHALLENGE',
        task_done_btn: 'Done',
        mood_label: 'Mood / energy today',
        quote_refresh: 'NEW QUOTE ↻',
        btn_panic: 'I\'m struggling',
        btn_journal: 'Journal',
        btn_sex: 'Had sex (streak stays)',
        day_unit: 'day',

        /* ── Journal ── */
        journal_title: 'Path Journal',
        journal_placeholder: 'What\'s happening today? Thoughts, feelings, wins...',
        journal_save: 'Save entry',

        /* ── Calendar ── */
        calendar_title: 'Path Calendar',
        cal_days: ['Mo','Tu','We','Th','Fr','Sa','Su'],
        cal_legend_clean: 'clean day',
        cal_legend_hard: 'hard day',
        cal_legend_relapse: 'relapse',
        cal_legend_rank: 'new rank',
        cal_day_abbr: 'd.',
        cal_detail_day_path: 'Path day',
        cal_detail_new_rank: 'New rank',
        cal_detail_mood: 'Mood',
        cal_detail_not_logged: 'not logged',
        cal_detail_energy: 'Energy',
        cal_detail_energy_na: 'not tracked in this version',
        cal_detail_relapse: 'Relapse',
        cal_detail_relapse_logged: 'logged',
        cal_detail_task: 'Task',
        cal_detail_tasks: 'Tasks',
        cal_detail_done: 'done',
        cal_detail_not_done: 'not done',
        cal_detail_journal: 'Journal',
        cal_detail_no_entries: 'no entries',
        cal_detail_nothing: 'Nothing logged for this day yet.',

        /* ── Stats ── */
        stats_title: 'Statistics',
        stat_current_unit: 'day',
        stat_started: 'Path begun',
        stat_loading: 'Gathering data…',
        stat_best: 'Best',
        stat_attempts: 'Attempts',
        stat_total: 'Total days',
        stat_avg: 'Avg streak',
        stat_streak_history: 'Streak history',
        stat_mood: 'Mood & energy',
        stat_relapses: 'Relapses & reasons',
        stat_sex: 'Sex without reset',
        stat_triggers: 'Trigger map',
        stat_all_ranks: 'All ranks on the path completed.',
        stat_days_left: (name, n) => `${n} day${n===1?'':'s'} left until rank «${name}»`,
        stat_no_relapses: 'No relapses yet. May it stay that way as long as possible.',
        stat_no_sex: 'Nothing logged yet.',
        stat_no_mood: 'Log your mood every day — a chart will appear in a few days.',
        stat_no_triggers: 'Need at least 3 relapses in history to see a pattern. Keep them as few as possible.',
        stat_streak_held: 'held for',
        stat_streak_days: 'd.',
        stat_reason_none: 'no reason given',
        stat_streak_day: 'day',
        stat_sex_no_reset: 'streak intact',
        stat_by_reasons: 'By reason',
        stat_corr_positive: r => `Looks like a pattern: the longer the streak, the better the mood (correlation ${r}).`,
        stat_corr_negative: r => `Reverse pattern so far: mood dips slightly as streak grows (correlation ${r}). Worth watching.`,
        stat_corr_none: r => `No clear link between streak and mood yet (correlation ${r}).`,
        stat_corr_need_more: 'Log more mood entries to see whether they correlate with your streak.',
        stat_trigger_sentence: (time, day, reason) => `Relapses most often happen ${time}, on ${day}${reason ? `, most often due to "${reason}"` : ''}.`,

        /* ── Ranks ── */
        ranks_achievements: 'Achievements',
        ranks_rewards: 'Path rewards',
        ranks_sparks: 'Sparks',
        ranks_bg: 'Background glow',
        ranks_mystic: 'Mystic',
        ranks_ladder: 'Rank ladder',
        badge_first_entry: 'First entry',
        badge_7_entries: '7 journal entries',
        badge_week: 'One week',
        badge_month: 'One month',
        badge_legend: 'Legend · 100 days',
        badge_goal: 'Goal defined',
        swatch_off: 'Off',

        /* ── Navbar ── */
        nav_home: 'HOME',
        nav_journal: 'JOURNAL',
        nav_calendar: 'CALENDAR',
        nav_stats: 'STATS',
        nav_ranks: 'RANKS',

        /* ── Panic modal ── */
        panic_title: 'Moment of weakness',
        panic_sub: 'This will pass. Give yourself 60 seconds before making any decision.',
        panic_why_label: 'Why you started',
        panic_survived: 'I held on — back on the path',
        panic_relapsed: 'I relapsed',

        /* ── Relapse modal ── */
        relapse_title: 'Before you reset everything',
        relapse_sub: 'Look at what you\'re about to give up:',
        relapse_reason_label: 'What was the reason?',
        relapse_cancel: 'Cancel — I\'m staying on the path',
        relapse_confirm: 'Confirm relapse and start over',
        relapse_custom_placeholder: 'Describe in your own words what happened...',

        /* ── Sex modal ── */
        sex_title: 'Log sex',
        sex_sub: 'Your streak won\'t reset. This is just a stat entry — how do you feel after?',
        sex_cancel: 'Cancel',
        sex_save: 'Save entry',

        /* ── Settings modal ── */
        settings_title: 'Path settings',
        settings_sub: 'Stored locally in this browser on this device only.',
        settings_theme: 'Theme',
        theme_dark: 'Dark',
        theme_matrix: 'Matrix',
        theme_blue: 'Blue',
        settings_mode: 'Path mode',
        mode_full: 'Full abstinence',
        mode_nofap: 'NoFap',
        mode_note: 'In NoFap mode, sex with a partner doesn\'t count as a relapse — there\'s a separate button on the home screen. Solo release and porn still count.',
        settings_why: 'Your reason ("why")',
        why_placeholder: 'E.g.: I want more energy, clarity and self-respect',
        settings_start: 'Current streak start',
        settings_save: 'Save',
        settings_language: 'Language / Язык',
        lang_ru: 'Русский',
        lang_en: 'English',
        settings_notifications: '🔔 Notifications',
        notify_master_title: 'Notifications',
        notify_master_desc: 'Allow the app to send path reminders.',
        notify_morning_title: 'Morning',
        notify_morning_desc: 'Daily reminder about today\'s path.',
        notify_evening_title: 'Evening',
        notify_evening_desc: '"How did today go?"',
        notify_ranks_title: 'Ranks',
        notify_ranks_desc: 'One day before a new rank and when you reach it.',
        notify_task_title: 'Daily task',
        notify_task_desc: 'Remind if the daily task isn\'t done yet.',
        notify_quotes_title: 'Quotes',
        notify_quotes_desc: 'One short thought for the path each day.',
        notify_status_checking: 'Checking browser permission…',
        notify_status_granted: 'Browser permission granted',
        notify_status_denied: 'Notifications blocked by browser',
        notify_status_unsupported: 'Notifications not supported',
        notify_status_pending: 'Permission not yet granted',
        notify_allow_btn: 'Allow notifications',
        notify_test_btn: 'Send test notification',
        settings_retake: 'Retake the questionnaire',
        settings_backup: 'Backup · transfer to a new phone',
        settings_export: 'Download backup file',
        settings_import: 'Restore from file',
        settings_test_wheel: '🎰 Test the fortune wheel',
        settings_reset: 'Reset all app data',

        /* ── Wheel ── */
        wheel_title: 'Fortune Wheel',
        wheel_sub: 'Spin to get today\'s challenge. A new spin is available after midnight.',
        wheel_spin: 'SPIN',
        wheel_claim: 'Claim challenge',
        wheel_result_type: 'TYPE',

        /* ── Onboarding ── */
        ob_step: (i, total) => `Step ${i} of ${total}`,
        ob_guidance: 'Guidance',
        ob_before_start: 'Before you begin',
        ob_start_btn: 'Begin the path',
        ob_back: '← Back',
        ob_skip: 'Skip',
        toast_saved: 'Saved.',
        sex_saved_toast: 'Logged. Streak intact — the path continues.',
        journal_empty: 'Nothing yet. Your first entry is part of the path too.',
        journal_delete: 'delete',
        journal_day: 'Day',
        wheel_task_do: 'Done',
        wheel_task_done: 'Completed ✓',
        wheel_complete_toast: 'Challenge complete! You are stronger than yesterday.',
        relapse_describe_toast: 'Briefly describe what happened.',
        relapse_new_count_toast: 'New count has begun. You did not lose — you are learning to hold the line.',

        /* ── Rank ascension overlay ── */
        rank_ascension_eyebrow: 'ASCENSION',
        rank_ascension_prefix: 'RANK',
        rank_continue: 'Continue',

        /* ── Toasts ── */
        toast_saved: 'Saved.',
        toast_onboarding_done: 'Profile saved. The path has begun.',
        toast_reset_done: 'Everything reset. Clean slate.',
        toast_no_notifications: 'This browser does not support notifications',
        toast_notifications_on: 'Notifications enabled',
        toast_notifications_denied: 'Browser blocked notifications. Allow them in site settings.',
        toast_notifications_error: 'Could not request notification permission',
        toast_storage_error: 'Could not save data on this device',
        reset_confirm: 'Are you sure you want to erase all progress, journal and history? This cannot be undone.',

        /* ── Notifications engine ── */
        notif_morning_body: d => `Today is day ${d}.\nYou don\'t have to walk the whole path. Just walk today.`,
        notif_morning_title: 'THE PATH',
        notif_evening_title: 'Before sleep',
        notif_evening_body: 'How did today go?',
        notif_rank_before_title: 'THE PATH',
        notif_rank_before_body: name => `In 1 day a new rank awaits you — «${name}».`,
        notif_rank_up_title: 'New rank',
        notif_rank_up_body: name => `You have reached the rank «${name}».`,
        notif_task_title: 'Daily task',
        notif_task_body: 'Your daily task is still waiting for you.',
        notif_test_title: 'THE PATH',
        notif_test_body: 'This is a test notification. Everything works.',
        notif_quote_title: 'Thought for today',

        /* ── Time labels for trigger map ── */
        time_morning: 'in the morning',
        time_day: 'in the afternoon',
        time_evening: 'in the evening',
        time_night: 'at night',
        day_names_plural: { 0:'Sundays',1:'Mondays',2:'Tuesdays',3:'Wednesdays',4:'Thursdays',5:'Fridays',6:'Saturdays' },

        /* ── Language picker screen ── */
        lang_pick_title: 'Choose your language',
        lang_pick_sub: 'Выберите язык',

        /* ── First-launch account choice ── */
        account_intro_title: 'Сохрани свой путь',
        account_intro_sub: 'Ты можешь создать аккаунт и синхронизировать прогресс или продолжить без регистрации.',
        account_intro_signin: 'Войти в аккаунт',
        account_intro_signup: 'Зарегистрироваться',
        account_intro_guest: 'Продолжить без входа',
        account_intro_note: 'Аккаунт нужен только для облачной синхронизации. Можно пользоваться приложением и без него.',

        /* ── First-launch account choice ── */
        account_intro_title: 'Keep your path with you',
        account_intro_sub: 'Create an account to sync your progress, or continue without signing in.',
        account_intro_signin: 'Sign in',
        account_intro_signup: 'Create an account',
        account_intro_guest: 'Continue without an account',
        account_intro_note: 'An account is only needed for cloud sync. You can use the app without one.',

        /* ── Account & cloud ── */
        account_section_title: '☁️ Account & Cloud',
        account_checking: 'Checking account...',
        account_open_btn: 'Sign in or create account',
        account_signout_btn: 'Sign out',
        account_cloud_status: email => `In the cloud: ${email || 'account connected'}`,
        account_no_account: 'No account yet — data is only on this device for now.',
        account_modal_title: 'Path Account',
        account_modal_sub: 'Sign in so your progress isn\'t lost when you switch phones.',
        account_email_label: 'Email',
        account_password_label: 'Password',
        account_password_placeholder: 'At least 6 characters',
        account_signin_btn: 'Sign in',
        account_signup_btn: 'Create account',
        account_google_note: 'Google sign-in will be added once the app is published on a site.',
        account_fill_fields: 'Enter an email and a password of at least 6 characters.',
        account_creating: 'Creating account...',
        account_check_email: 'Account created. Check your email to confirm the address.',
        account_created_toast: 'Account created — progress saved to the cloud',
        account_fill_email_pass: 'Enter your email and password.',
        account_signing_in: 'Signing in...',
        account_signin_failed: msg => `Didn't work: ${msg}`,
        account_signout_confirm: 'Sign out of the account on this device? The local copy of your progress will stay.',
        account_signed_out_toast: 'You have signed out',
        account_cloud_load_failed: 'Could not load cloud data',
        account_cloud_loaded_toast: 'Progress loaded from the cloud',
        account_cloud_saved_toast: 'Current progress saved to the cloud',

        /* ── Auth error messages (Supabase) ── */
        auth_err_invalid_credentials: 'Wrong email or password.',
        auth_err_user_exists: 'This email is already registered.',
        auth_err_weak_password: 'Password should be at least 6 characters.',
        auth_err_invalid_email: 'Invalid email format.',
        auth_err_rate_limit: 'Too many attempts. Please wait a bit.',
        auth_err_generic: 'Something went wrong. Please try again.',

        /* ── App lock ── */
        lock_section_title: '🔒 App Lock',
        lock_checking: 'Checking lock settings...',
        lock_set_pin_btn: 'Set or change PIN code',
        lock_biometric_btn: 'Enable fingerprint / Face ID',
        lock_disable_btn: 'Turn off lock',
        lock_off_status: 'Lock is off.',
        lock_pin_bio_status: 'PIN + fingerprint / Face ID are enabled on this device.',
        lock_pin_only_status: 'PIN code is enabled on this device.',
        lock_disable_confirm: 'Turn off PIN and fingerprint sign-in on this device?',
        lock_disabled_toast: 'Lock turned off',
        lock_need_pin_first_toast: 'Set a PIN code first',
        lock_biometric_needs_https_toast: 'Fingerprint will work once the app is published on an HTTPS site',
        lock_biometric_enabled_toast: 'Fingerprint / Face ID enabled',
        lock_biometric_failed_toast: 'Could not enable fingerprint on this device',

        pin_setup_title: 'PIN code',
        pin_setup_sub: 'This lock only applies to this device. Don\'t forget the code.',
        pin_new_label: 'New PIN',
        pin_new_placeholder: '4 digits',
        pin_repeat_label: 'Repeat',
        pin_repeat_placeholder: 'Repeat PIN',
        pin_enable_btn: 'Enable PIN',
        pin_need_4_digits: 'Needs to be exactly 4 digits.',
        pin_mismatch: 'Codes don\'t match.',
        pin_enabled_toast: 'PIN code enabled',

        app_lock_title: 'Path locked',
        app_lock_sub: 'Enter your PIN to continue.',
        app_lock_placeholder: '••••',
        app_lock_open_btn: 'Unlock',
        app_lock_biometric_btn: 'Unlock with fingerprint / Face ID',
        app_lock_need_4_digits: 'Enter 4 digits.',
        app_lock_wrong_pin: 'Wrong code. Try again.',
        app_lock_biometric_failed: 'Fingerprint failed — you can enter your PIN instead.',
    }
};

/* ── Геттер ─────────────────────────────────────────────── */
function t(key) {
    const lang = (typeof state !== 'undefined' && state.lang) ? state.lang : 'ru';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['ru'];
    return dict[key] !== undefined ? dict[key] : (TRANSLATIONS['ru'][key] || key);
}

/* ── Смена языка ─────────────────────────────────────────── */
function setLang(lang) {
    state.lang = lang;
    save();
    applyLang();
}

/* ── Применить язык ко всему статичному HTML ─────────────── */
function applyLang() {
    const L = t;

    /* Топбар */
    const brand = document.querySelector('.brand');
    if (brand) brand.textContent = L('brand');

    /* Навбар */
    const navLabels = {
        home: L('nav_home'), journal: L('nav_journal'),
        calendar: L('nav_calendar'), stats: L('nav_stats'), ranks: L('nav_ranks')
    };
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const v = btn.dataset.v;
        const span = btn.querySelector('span');
        if (span && navLabels[v]) span.textContent = navLabels[v];
    });

    /* Home */
    const auraLabel = document.querySelector('.aura-card .aura-label');
    if (auraLabel) auraLabel.textContent = L('aura_label');
    const taskLabel = document.querySelector('.task-card .aura-label');
    if (taskLabel) taskLabel.textContent = L('task_label');
    const moodLabel = document.querySelector('.mood-card .aura-label');
    if (moodLabel) moodLabel.textContent = L('mood_label');
    const panicBtn = document.querySelector('.btn-panic[onclick*="panic"]');
    if (panicBtn) panicBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 9v4M12 17h.01M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L14.7 3.86a2 2 0 00-3.4 0z"/></svg>${L('btn_panic')}`;
    const journalBtn = document.querySelector('.btn-ghost[onclick*="journal"]');
    if (journalBtn) journalBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>${L('btn_journal')}`;
    const sexBtn = document.getElementById('sexBtn');
    if (sexBtn) sexBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-6.7-4.3-9.3-8.2C1 10 1.6 6.4 4.6 4.9c2.4-1.2 4.9-.3 6.4 1.6 1.5-1.9 4-2.8 6.4-1.6 3 1.5 3.6 5.1 1.9 7.9C18.7 16.7 12 21 12 21z"/></svg>${L('btn_sex')}`;

    /* Journal */
    const jTitle = document.querySelector('#view-journal .section-title');
    if (jTitle) jTitle.innerHTML = `<div class="dash"></div>${L('journal_title')}`;
    const jInput = document.getElementById('journalInput');
    if (jInput) jInput.placeholder = L('journal_placeholder');
    const jSaveBtn = document.querySelector('#view-journal button[onclick*="addJournal"]');
    if (jSaveBtn) jSaveBtn.textContent = L('journal_save');

    /* Calendar */
    const calTitle = document.querySelector('#view-calendar .section-title');
    if (calTitle) calTitle.innerHTML = `<div class="dash"></div>${L('calendar_title')}`;
    const calDays = document.querySelectorAll('.calendar-week div');
    const days = L('cal_days');
    calDays.forEach((el, i) => { if (days[i]) el.textContent = days[i]; });
    const calLegend = document.querySelectorAll('.calendar-legend span');
    const legends = [L('cal_legend_clean'), L('cal_legend_hard'), L('cal_legend_relapse'), L('cal_legend_rank')];
    calLegend.forEach((el, i) => {
        const icon = el.querySelector('i');
        if (icon && legends[i]) el.innerHTML = `${icon.outerHTML}${legends[i]}`;
    });

    /* Stats */
    const statsTitle = document.querySelector('#view-stats > .section-title');
    if (statsTitle) statsTitle.innerHTML = `<div class="dash"></div>${L('stats_title')}`;
    const statUnit = document.querySelector('.stat-hero-num .u');
    if (statUnit) statUnit.textContent = L('stat_current_unit');

    /* Stat boxes */
    const statBoxes = {
        statBoxBest: L('stat_best'), statBoxAttempts: L('stat_attempts'),
        statBoxTotal: L('stat_total'), statBoxAvg: L('stat_avg')
    };
    Object.entries(statBoxes).forEach(([id, label]) => {
        const el = document.querySelector(`#${id} .lab`);
        if (el) el.textContent = label;
    });

    /* Stats section titles */
    document.querySelectorAll('#view-stats .section-title').forEach((el, i) => {
        // Порядок: Statistics, Streak history, Tasks, Mood, Relapses, Sex, Trigger map
        const titles = [
            L('stats_title'), L('stat_streak_history'), L('tasks_stats_title'), L('stat_mood'),
            L('stat_relapses'), L('stat_sex'), L('stat_triggers')
        ];
        if (titles[i]) el.innerHTML = `<div class="dash"></div>${titles[i]}`;
    });

    /* Ranks */
    document.querySelectorAll('#view-ranks .section-title').forEach((el, i) => {
        const titles = [L('ranks_achievements'), L('ranks_rewards'), L('ranks_ladder')];
        if (titles[i] !== undefined) el.innerHTML = `<div class="dash"></div>${titles[i]}`;
    });
    document.querySelectorAll('#view-ranks .cosmetic-group-label').forEach((el, i) => {
        const labels = [L('ranks_sparks'), L('ranks_bg'), L('ranks_mystic')];
        if (labels[i] !== undefined) el.textContent = labels[i];
    });

    /* Panic modal */
    const panicH = document.querySelector('#modal-panic h2');
    if (panicH) panicH.textContent = L('panic_title');
    const panicSub = document.querySelector('#modal-panic .sub');
    if (panicSub) panicSub.textContent = L('panic_sub');
    const panicSurvived = document.querySelector('#modal-panic .btn-ghost');
    if (panicSurvived) panicSurvived.textContent = L('panic_survived');
    const panicRelapsed = document.querySelector('#modal-panic .btn-panic');
    if (panicRelapsed) panicRelapsed.textContent = L('panic_relapsed');

    /* Relapse modal */
    const relH = document.querySelector('#modal-relapse h2');
    if (relH) relH.textContent = L('relapse_title');
    const relSub = document.querySelector('#modal-relapse .sub');
    if (relSub) relSub.textContent = L('relapse_sub');
    const relCancel = document.querySelector('#modal-relapse .btn-ghost');
    if (relCancel) relCancel.textContent = L('relapse_cancel');
    const relConfirm = document.getElementById('relapseConfirmBtn');
    if (relConfirm) relConfirm.textContent = L('relapse_confirm');
    const relInput = document.getElementById('reasonInput');
    if (relInput) relInput.placeholder = L('relapse_custom_placeholder');

    /* Sex modal */
    const sexH = document.querySelector('#modal-sex h2');
    if (sexH) sexH.textContent = L('sex_title');
    const sexSub = document.querySelector('#modal-sex .sub');
    if (sexSub) sexSub.textContent = L('sex_sub');
    const sexCancel = document.querySelector('#modal-sex .btn-ghost');
    if (sexCancel) sexCancel.textContent = L('sex_cancel');
    const sexSave = document.getElementById('sexSaveBtn');
    if (sexSave) sexSave.textContent = L('sex_save');

    /* Settings modal */
    const setH = document.querySelector('#modal-settings h2');
    if (setH) setH.textContent = L('settings_title');
    const setSub = document.querySelector('#modal-settings .sub');
    if (setSub) setSub.textContent = L('settings_sub');

    /* Theme pills */
    const pDark = document.getElementById('themePillDark');
    if (pDark) pDark.textContent = L('theme_dark');
    const pMatrix = document.getElementById('themePillMatrix');
    if (pMatrix) pMatrix.textContent = L('theme_matrix');
    const pBlue = document.getElementById('themePillBlue');
    if (pBlue) pBlue.textContent = L('theme_blue');

    /* Mode pills */
    const pFull = document.getElementById('modePillFull');
    if (pFull) pFull.textContent = L('mode_full');
    const pNofap = document.getElementById('modePillNofap');
    if (pNofap) pNofap.textContent = L('mode_nofap');
    const modeNote = document.querySelector('.mode-note');
    if (modeNote) modeNote.textContent = L('mode_note');

    /* Settings fields */
    const whyLabel = document.querySelector('#modal-settings label[for="whyInput"], #modal-settings .settings-field label:nth-of-type(1)');
    document.querySelectorAll('#modal-settings .settings-field label').forEach(el => {
        const txt = el.textContent.trim();
        if (txt.includes('причин') || txt.includes('reason') || txt.includes('why') || txt.includes('зачем'))
            el.textContent = L('settings_why');
        if (txt.includes('Начало') || txt.includes('streak start') || txt.includes('Current'))
            el.textContent = L('settings_start');
        if (txt.includes('Тема') || txt.includes('Theme'))
            el.textContent = L('settings_theme');
        if (txt.includes('Режим') || txt.includes('mode') || txt.includes('Mode'))
            el.textContent = L('settings_mode');
        if (txt.includes('Уведомл') || txt.includes('Notification'))
            el.textContent = L('settings_notifications');
        if (txt.includes('Резерв') || txt.includes('Backup'))
            el.textContent = L('settings_backup');
        if (txt.includes('Язык') || txt.includes('Language'))
            el.textContent = L('settings_language');
        if (txt.includes('Аккаунт') || txt.includes('Account'))
            el.textContent = L('account_section_title');
        if (txt.includes('Замок') || txt.includes('App Lock') || txt.includes('Lock'))
            el.textContent = L('lock_section_title');
    });
    const whyInput = document.getElementById('whyInput');
    if (whyInput) whyInput.placeholder = L('why_placeholder');
    const saveBtn = document.querySelector('#modal-settings .btn-ghost[onclick*="saveSettings"]');
    if (saveBtn) saveBtn.textContent = L('settings_save');

    /* Lang pills */
    const pRu = document.getElementById('langPillRu');
    if (pRu) pRu.textContent = L('lang_ru');
    const pEn = document.getElementById('langPillEn');
    if (pEn) pEn.textContent = L('lang_en');

    /* Notification labels */
    [
        ['notifyMaster', 'notify_master_title', 'notify_master_desc'],
        ['notifyMorning', 'notify_morning_title', 'notify_morning_desc'],
        ['notifyEvening', 'notify_evening_title', 'notify_evening_desc'],
        ['notifyRanks', 'notify_ranks_title', 'notify_ranks_desc'],
        ['notifyTask', 'notify_task_title', 'notify_task_desc'],
        ['notifyQuotes', 'notify_quotes_title', 'notify_quotes_desc'],
    ].forEach(([id, titleKey, descKey]) => {
        const row = document.getElementById(id)?.closest('.notification-row');
        if (!row) return;
        const title = row.querySelector('.notification-title');
        const desc  = row.querySelector('.notification-desc');
        if (title) title.textContent = L(titleKey);
        if (desc)  desc.textContent  = L(descKey);
    });

    const allowBtn = document.querySelector('[onclick*="requestNotificationPermission"]');
    if (allowBtn) allowBtn.textContent = L('notify_allow_btn');
    const testNotifBtn = document.querySelector('[onclick*="sendTestNotification"]');
    if (testNotifBtn) testNotifBtn.textContent = L('notify_test_btn');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const value = L(key);
        if (typeof value === 'string') el.textContent = value;
    });

    ['spirit','mind','body'].forEach(cat => {
        const el = document.getElementById(`taskLabel-${cat}`);
        if (el) el.textContent = L(`task_${cat}`);
    });

    /* Settings link buttons */
    document.querySelectorAll('.settings-link-btn').forEach(btn => {
        const fn = btn.getAttribute('onclick') || '';
        if (fn.includes('startOnboarding'))  btn.textContent = L('settings_retake');
        if (fn.includes('exportBackup'))     btn.textContent = L('settings_export');
        if (fn.includes('importFile'))       btn.textContent = L('settings_import');
        if (fn.includes('testWheel'))        btn.textContent = L('settings_test_wheel');
    });
    const dangerBtn = document.querySelector('.danger-btn');
    if (dangerBtn) dangerBtn.textContent = L('settings_reset');

    /* Wheel */
    const wheelTitle = document.querySelector('.wheel-title');
    if (wheelTitle) wheelTitle.textContent = L('wheel_title');
    const wheelSub = document.querySelector('.wheel-sub');
    if (wheelSub) wheelSub.textContent = L('wheel_sub');
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) spinBtn.textContent = L('wheel_spin');
    const claimBtn = document.querySelector('.wheel-claim-btn');
    if (claimBtn) claimBtn.textContent = L('wheel_claim');

    /* First-launch account choice */
    const accountIntro = document.getElementById('account-intro-overlay');
    if (accountIntro) {
        const title = accountIntro.querySelector('[data-i18n="account_intro_title"]');
        const sub = accountIntro.querySelector('[data-i18n="account_intro_sub"]');
        const signIn = accountIntro.querySelector('[data-i18n="account_intro_signin"]');
        const signUp = accountIntro.querySelector('[data-i18n="account_intro_signup"]');
        const guest = accountIntro.querySelector('[data-i18n="account_intro_guest"]');
        const note = accountIntro.querySelector('[data-i18n="account_intro_note"]');
        if (title) title.textContent = L('account_intro_title');
        if (sub) sub.textContent = L('account_intro_sub');
        if (signIn) signIn.textContent = L('account_intro_signin');
        if (signUp) signUp.textContent = L('account_intro_signup');
        if (guest) guest.textContent = L('account_intro_guest');
        if (note) note.textContent = L('account_intro_note');
    }

    /* Account modal */
    const accH = document.querySelector('#modal-account h2');
    if (accH) accH.textContent = L('account_modal_title');
    const accSub = document.querySelector('#modal-account .sub');
    if (accSub) accSub.textContent = L('account_modal_sub');
    const accEmailLabel = document.querySelector('#accountEmail')?.closest('.settings-field')?.querySelector('label');
    if (accEmailLabel) accEmailLabel.textContent = L('account_email_label');
    const accPassLabel = document.querySelector('#accountPassword')?.closest('.settings-field')?.querySelector('label');
    if (accPassLabel) accPassLabel.textContent = L('account_password_label');
    const accPassInput = document.getElementById('accountPassword');
    if (accPassInput) accPassInput.placeholder = L('account_password_placeholder');
    const accSignInBtn = document.querySelector('#modal-account .btn-ghost');
    if (accSignInBtn) accSignInBtn.textContent = L('account_signin_btn');
    const accSignUpBtn = document.querySelector('#modal-account .btn-violet');
    if (accSignUpBtn) accSignUpBtn.textContent = L('account_signup_btn');
    const accGoogleNote = document.querySelector('#modal-account .mode-note');
    if (accGoogleNote) accGoogleNote.textContent = L('account_google_note');
    const accOpenBtn = document.getElementById('accountOpenBtn');
    if (accOpenBtn) accOpenBtn.textContent = L('account_open_btn');
    const accSignOutBtn = document.getElementById('accountSignOutBtn');
    if (accSignOutBtn) accSignOutBtn.textContent = L('account_signout_btn');
    const biometricBtn = document.getElementById('biometricSetupBtn');
    if (biometricBtn) biometricBtn.textContent = L('lock_biometric_btn');
    const lockSetPinBtn = document.querySelector('[onclick*="openPinSetup"]');
    if (lockSetPinBtn) lockSetPinBtn.textContent = L('lock_set_pin_btn');
    const lockDisableBtn = document.getElementById('lockDisableBtn');
    if (lockDisableBtn) lockDisableBtn.textContent = L('lock_disable_btn');

    /* PIN setup modal */
    const pinH = document.querySelector('#modal-pin-setup h2');
    if (pinH) pinH.textContent = L('pin_setup_title');
    const pinSub = document.querySelector('#modal-pin-setup .sub');
    if (pinSub) pinSub.textContent = L('pin_setup_sub');
    const pinFirstLabel = document.querySelector('#pinSetupFirst')?.closest('.settings-field')?.querySelector('label');
    if (pinFirstLabel) pinFirstLabel.textContent = L('pin_new_label');
    const pinFirstInput = document.getElementById('pinSetupFirst');
    if (pinFirstInput) pinFirstInput.placeholder = L('pin_new_placeholder');
    const pinRepeatLabel = document.querySelector('#pinSetupRepeat')?.closest('.settings-field')?.querySelector('label');
    if (pinRepeatLabel) pinRepeatLabel.textContent = L('pin_repeat_label');
    const pinRepeatInput = document.getElementById('pinSetupRepeat');
    if (pinRepeatInput) pinRepeatInput.placeholder = L('pin_repeat_placeholder');
    const pinEnableBtn = document.querySelector('#modal-pin-setup .btn-violet');
    if (pinEnableBtn) pinEnableBtn.textContent = L('pin_enable_btn');

    /* App lock overlay */
    const lockTitle = document.querySelector('#appLockOverlay .lang-picker-title');
    if (lockTitle) lockTitle.textContent = L('app_lock_title');
    const lockSub = document.querySelector('#appLockOverlay .lang-picker-sub');
    if (lockSub) lockSub.textContent = L('app_lock_sub');
    const lockPinInput = document.getElementById('lockPinInput');
    if (lockPinInput) lockPinInput.placeholder = L('app_lock_placeholder');
    const lockOpenBtn = document.querySelector('#appLockOverlay .btn-violet');
    if (lockOpenBtn) lockOpenBtn.textContent = L('app_lock_open_btn');
    const lockBiometricBtn = document.getElementById('lockBiometricBtn');
    if (lockBiometricBtn) lockBiometricBtn.textContent = L('app_lock_biometric_btn');

    /* Обновляем динамические статусы аккаунта/замка на текущий язык */
    if (typeof updateAccountUI === 'function') updateAccountUI();
    if (typeof updateLockUI === 'function') updateLockUI();

    /* Onboarding nav */
    const obBack = document.getElementById('obBackBtn');
    if (obBack) obBack.textContent = L('ob_back');
    const obSkip = document.getElementById('obSkipBtn');
    if (obSkip) obSkip.textContent = L('ob_skip');
    const obNext = document.getElementById('obNextBtn');
    if (obNext) obNext.textContent = L('ob_next');

    /* html lang attr */
    document.documentElement.lang = (typeof state !== 'undefined' && state.lang) ? state.lang : 'ru';

    /* Re-render dynamic sections if they're visible */
    if (typeof renderHome === 'function') renderHome();
    if (typeof renderRanks === 'function') renderRanks();
    if (typeof renderStats === 'function') renderStats();
    updateNotificationUI();
    // Обновляем цитату на текущий язык
    if (typeof initQuote === 'function') initQuote();
}
