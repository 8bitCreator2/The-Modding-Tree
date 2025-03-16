addLayer("s", {
    name: "Stellar Matter", // Full name of the layer
    symbol: "S", // Symbol displayed in the tree node
    position: 0, // Position in the row
    startData() { return {
        unlocked: true,
        points: new Decimal(0), // Stellar Matter currency
    }},
    color: "#FFD700", // Gold color for a "stellar" feel
    requires: new Decimal(10), // 10 points needed to prestige
    resource: "stellar matter", // Name of the prestige currency
    baseResource: "points", // What this layer is based on
    baseAmount() { return player.points }, // How many points you have

    type: "normal", // Standard prestige mechanics
    exponent: 0.5, // sqrt(points) formula

    gainMult() { 
        let mult = new Decimal(1);
        if (hasUpgrade("s", 12)) mult = mult.times(upgradeEffect("s", 12)); // Apply Upgrade 12 effect
        return mult;
    },
    gainExp() { 
        return new Decimal(1);
    },

    row: 0, // First row layer
    hotkeys: [
        {key: "s", description: "S: Reset for Stellar Matter", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){ return true },

    upgrades: {
        11: {
            title: "Celestial Amplification", 
            description: "Triple your point generation.",
            cost: new Decimal(1), // Costs 1 Stellar Matter
            effect() {
                return new Decimal(3); // Multiplier effect
            },
            effectDisplay() { return "x" + format(this.effect()) }, // Show effect as x3
        },
        12: {
            title: "Matter Expansion", 
            description: "Multiply your Stellar Matter gain by 1.5x.",
            cost: new Decimal(3), // Costs 3 Stellar Matter
            effect() {
                return new Decimal(1.5); // Multiplier effect
            },
            effectDisplay() { return "x" + format(this.effect()) }, // Show effect as x1.5
        },
    },
})
