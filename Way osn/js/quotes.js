/* =========================================================
   QUOTE
   ========================================================= */
let quoteIdx = Math.floor(Math.random() * QUOTES.length);

function newQuote() {
    const el = document.getElementById('quoteText');
    el.classList.add('fade');
    setTimeout(() => {
        const quotes = getQuotes();
        quoteIdx = (quoteIdx + 1) % quotes.length;
        el.textContent = quotes[quoteIdx];
        el.classList.remove('fade');
    }, 300);
}

// Инициализация первой цитаты с учётом языка
function initQuote() {
    const el = document.getElementById('quoteText');
    if (!el) return;
    const quotes = getQuotes();
    quoteIdx = Math.floor(Math.random() * quotes.length);
    el.textContent = quotes[quoteIdx];
}
