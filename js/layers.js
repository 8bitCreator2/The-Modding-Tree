addLayer("s", {
    name: "Stone", // Display Name
    symbol: "🪨", // Symbol on the layer tab
    position: 0, // Row 1, left-most
    startData() { return { unlocked: true, points: new Decimal(0) }},
    color: "#888888",
    requires: new Decimal(10), // Requirement to unlock (10 points)
    resource: "Stone", // Prestige Currency Name
    baseResource: "points", // What you reset from
    baseAmount() { return player.points }, // How much of base currency you have
    type: "normal", // Normal prestige type
    exponent: 0.5, // Square root gain formula
    gainMult() { 
        let mult = new Decimal(1)
        if (hasUpgrade("s", 11)) mult = mult.times(2) // Upgrade 11: Double Stone gain
        return mult
    },
    gainExp() { return new Decimal(1) }, // No extra exponent

    row: 1, // Row 1 (resets Row 0)
    hotkeys: [{ key: "s", description: "Press S to Prestige for Stone", onPress() { if (canReset("s")) doReset("s") } }],
    layerShown() { return true }, // Always visible

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
            effect() { return player.s.points.add(1).log2().add(1) }, // Logarithmic effect
            effectDisplay() { return "x" + format(this.effect()) }, // Display Effect
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
                player.s.points = player.s.points.sub(this.cost())
                setBuyableAmount("s", 11, getBuyableAmount("s", 11).add(1))
            },
            effect(x) { return new Decimal(1.2).pow(x) },
        },
    },
});
