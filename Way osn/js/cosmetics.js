/* =========================================================
   COSMETICS
   ========================================================= */
function applyCosmetics() {
    const pReward = state.cosmetics.particles
        ? COSMETIC_REWARDS.find(r => r.id === state.cosmetics.particles)
        : null;

    if (pReward) {
        // Передаём style (sparks / flame / stars / logos)
        spawnParticles(pReward.color, pReward.direction, pReward.style || 'sparks');
    } else {
        activeParticleColor = null;
        activeParticleStyle = 'sparks';
        particleList = [];
    }

    const bReward = state.cosmetics.bg
        ? COSMETIC_REWARDS.find(r => r.id === state.cosmetics.bg)
        : null;

    if (bReward) {
        document.documentElement.style.setProperty('--glow1', bReward.glow1);
        document.documentElement.style.setProperty('--glow2', bReward.glow2);
    } else {
        document.documentElement.style.removeProperty('--glow1');
        document.documentElement.style.removeProperty('--glow2');
    }
}

function setParticles(id) {
    if (id) {
        // Принимаем type === 'particles' ИЛИ 'mystic' (логос — единственная mystic-частица)
        const reward = COSMETIC_REWARDS.find(r => r.id === id && (r.type === 'particles' || r.type === 'mystic'));
        if (!reward || bestStreakEver() < reward.day) return;
    }
    state.cosmetics.particles = id;
    save();
    applyCosmetics();
    renderRanks();
}

function setBgTint(id) {
    if (id) {
        const reward = COSMETIC_REWARDS.find(r => r.id === id && r.type === 'bg');
        if (!reward || bestStreakEver() < reward.day) return;
    }
    state.cosmetics.bg = id;
    save();
    applyCosmetics();
    renderRanks();
}
