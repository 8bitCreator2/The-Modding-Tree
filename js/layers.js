addLayer("s", {
    name: "Stellar Matter", 
    symbol: "S", 
    position: 0, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#FFD700",
    requires: new Decimal(10),
    resource: "stellar matter",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.5,

    gainMult() { 
        let mult = new Decimal(1);
        if (hasUpgrade("s", 12)) mult = mult.times(upgradeEffect("s", 12)); // 1.5x Stellar Matter
        if (hasUpgrade("s", 21)) mult = mult.times(upgradeEffect("s", 21)); // Points boost Stellar Matter
        if (hasUpgrade("s", 22)) mult = mult.times(3); // 3x Stellar Matter (Upgrade 22)
        return mult;
    },
    gainExp() { 
        return new Decimal(1);
    },

    row: 0,
    hotkeys: [
        {key: "s", description: "S: Reset for Stellar Matter", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){ return true },

    upgrades: {
        11: {
            title: "Celestial Amplification", 
            description: "Triple your point generation.",
            cost: new Decimal(1), 
            effect() {
                return new Decimal(3);
            },
            effectDisplay() { return "x" + format(this.effect()) }, 
        },
        12: {
            title: "Matter Expansion", 
            description: "Multiply your Stellar Matter gain by 1.5x.",
            cost: new Decimal(3), 
            effect() {
                return new Decimal(1.5);
            },
            effectDisplay() { return "x" + format(this.effect()) },
            unlocked() { return hasUpgrade("s", 11); }, // Requires Upgrade 11
        },
        13: {
            title: "Cosmic Synergy", 
            description: "Points are boosted based on your Stellar Matter.",
            cost: new Decimal(5),
            effect() {
                return player.s.points.add(1).pow(0.3);
            },
            effectDisplay() { return "x" + format(this.effect()) },
            unlocked() { return hasUpgrade("s", 12); }, // Requires Upgrade 12
        },
        21: {
            title: "Galactic Feedback", 
            description: "Stellar Matter gain is boosted based on your Points.",
            cost: new Decimal(8), 
            effect() {
                return player.points.add(1).pow(0.15);
            },
            effectDisplay() { return "x" + format(this.effect()) },
            unlocked() { return hasUpgrade("s", 13); }, // Requires Upgrade 13
        },
        22: {
            title: "Interstellar Surge", 
            description: "Triple your Stellar Matter gain and multiply Points by 1.5x.",
            cost: new Decimal(15), 
            effect() {
                return { 
                    stellarBoost: new Decimal(3),  // 3x Stellar Matter
                    pointsBoost: new Decimal(1.5) // 1.5x Points
                };
            },
            effectDisplay() { return "x3 Stellar Matter, x1.5 Points" },
            unlocked() { return hasUpgrade("s", 21); }, // Requires Upgrade 21
        },
    },
})
