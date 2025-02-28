addLayer("m", {
    name: "Matter", symbol: "M", position: 0, color: "#8888FF", row: 0,
    startData() { return { unlocked: false, points: new Decimal(0), autoBuyable1: false } },
    resource: "Matter", baseResource: "points", baseAmount() { return player.points },
    requires: new Decimal(10), type: "normal", exponent: 0.5,
    gainMult() { return hasUpgrade("m", 11) ? new Decimal(2) : new Decimal(1) },
    layerShown() { return player.points.gte(10) || player.m.unlocked },
    hotkeys: [{ key: "m", description: "Press M to generate Matter", onPress() { if (canReset("m")) doReset("m") } }],
    
    upgrades: {
        11: { title: "Matter Compression", description: "Double Matter gain.", cost: new Decimal(1) },
        12: {
            title: "Denser Matter", description: "Matter boosts Point gain.",
            cost: new Decimal(5),
            effect() { return player.m.points.add(1).log10().add(1) },
            effectDisplay() { return "x" + format(this.effect()) },
        },
    },

    buyables: {
        11: {
            title: "Matter Refinement",
            cost(x) { return new Decimal(2).pow(x).times(5) },
            effect(x) { return new Decimal(1.5).pow(x) },
            display() { return `Increase Matter gain by x1.5 per level. 
                Cost: ${format(this.cost())} Matter | Effect: x${format(this.effect())}` },
            canAfford() { return player.m.points.gte(this.cost()) },
            buy() {
                if (player.m.autoBuyable1) 
                    while (player.m.points.gte(this.cost())) this.buyOne();
                else this.buyOne();
            },
            buyOne() {
                player.m.points = player.m.points.sub(this.cost());
                player.m.buyables[11] = player.m.buyables[11].add(1);
            }
        },
    },

    milestones: {
        0: {
            requirementDescription: "Accumulate 10 Matter",
            effectDescription: "Auto-buy 'Matter Refinement' every second.",
            done() { return player.m.points.gte(10) },
            toggles: [["m", "autoBuyable1"]],
        },
    },
});
