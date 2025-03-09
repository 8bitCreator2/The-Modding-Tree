addLayer("s", {
    name: "Stone", 
    symbol: "S",
    position: 0,
    startData() { 
        return { unlocked: true, points: new Decimal(0) } 
    }, // Points start at 0
    color: "#888888",
    requires: new Decimal(10), 
    resource: "Stone", 
    baseResource: "points", 
    baseAmount() { return player.points }, 
    type: "normal", 
    exponent: 0.5, 

    // 🔹 Stone Generation Multiplier (Fix for Buyable 12)
    gainMult() { 
        let mult = new Decimal(1);
        if (hasUpgrade("s", 11)) mult = mult.times(2); // Upgrade 11: Double Stone gain
        if (getBuyableAmount("s", 12).gte(1)) mult = mult.times(Decimal.pow(2, getBuyableAmount("s", 12))); // Fix Drill Effect
        return mult;
    },
    
    gainExp() { return new Decimal(1) }, 

    row: 1, 
    hotkeys: [{ key: "s", description: "Press S to Prestige for Stone", onPress() { if (canReset("s")) doReset("s") } }],
    layerShown() { return true }, 

    // ⛏️ Upgrades
    upgrades: {
        11: {
            title: "Bigger Pickaxe",
            description: "Double Stone Gain.",
            cost: new Decimal(5),
        },
        12: {
            title: "Stronger Tools",
            description: "Boost Point Gain based on Stone.",
            cost: new Decimal(10),
            effect() { return player.s.points.add(1).log2().add(1) }, 
            effectDisplay() { return "x" + format(this.effect()) },
        },
    },

    // 🔨 Buyables
    buyables: {
        11: {
            title: "Pickaxe",
            cost(x) { return new Decimal(5).times(Decimal.pow(1.5, x)) },
            display() { return "Increase Point Gen by 20%.\nCost: " + format(this.cost()) + " Stone" },
            canAfford() { return player.s.points.gte(this.cost()) },
            buy() {
                player.s.points = player.s.points.sub(this.cost());
                setBuyableAmount("s", 11, getBuyableAmount("s", 11).add(1));
            },
            effect(x) { return new Decimal(1.2).pow(x) },
        },

        12: {
            title: "Drill",
            cost(x) { return new Decimal(25).times(Decimal.pow(2, x)) },
            display() { return "Doubles Stone gain.\nCost: " + format(this.cost()) + " Stone" },
            unlocked() { return getBuyableAmount("s", 11).gte(5) }, // Unlock at 5 Pickaxes
            canAfford() { return player.s.points.gte(this.cost()) },
            buy() {
                player.s.points = player.s.points.sub(this.cost());
                setBuyableAmount("s", 12, getBuyableAmount("s", 12).add(1));
            },
            effect(x) { return new Decimal(2).pow(x) }, // Now correctly applied in `gainMult()`
        },

        13: {
            title: "Quarry",
            cost(x) { return new Decimal(100).times(Decimal.pow(3, x)) },
            display() { return "Generates +0.5% of Stone/sec.\nCost: " + format(this.cost()) + " Stone" },
            unlocked() { return getBuyableAmount("s", 11).gte(10) }, 
            canAfford() { return player.s.points.gte(this.cost()) },
            buy() {
                player.s.points = player.s.points.sub(this.cost());
                setBuyableAmount("s", 13, getBuyableAmount("s", 13).add(1));
            },
            effect(x) { return new Decimal(0.005).times(x) },
        },
    },

    // 🔋 Passive Generation for Stone
    passiveGeneration() { 
        return getBuyableAmount("s", 13).times(0.005); // Quarry effect
    },
});
