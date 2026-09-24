/* =========================================================
   SEX LOG
   ========================================================= */
let sexSelectedFeeling = null;
let sexSelectedFeelingIdx = null;

function selectSexFeeling(i) {
    sexSelectedFeeling = getSexFeelings()[i];
    sexSelectedFeelingIdx = i;
    document.querySelectorAll('#sexFeelingOptions .ob-option').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll(`#sexFeelingOptions .ob-option[data-i="${i}"]`)[0].classList.add('selected');
    const btn = document.getElementById('sexSaveBtn');
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
}

function saveSexLog() {
    if (sexSelectedFeelingIdx === null) return;
    // Сохраняем индекс — текст всегда резолвится по текущему языку при отображении
    state.sexLog.push({
        date: new Date().toISOString(),
        day: currentDay(),
        feelingIdx: sexSelectedFeelingIdx,
        feeling: sexSelectedFeeling // fallback для уже существующих старых записей без индекса
    });
    save();
    vibrate(15);
    closeModal('sex');
    showToast(t('sex_saved_toast'));
    renderStats();
}
