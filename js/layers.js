addLayer("m", {
    name: "Matter", 
    symbol: "M", 
    position: 0, 
    startData() { return {
        unlocked: true, 
        points: new Decimal(0), 
    }},
    color: "#888888",
    resource: "Matter",
    baseResource: "points",
    baseAmount() { return player.points }, 
    type: "none", 
    row: 0, 
    layerShown() { return true },

    update(diff) {
        let gain = new Decimal(1);

        // Apply Buyable 11 (Matter Generator)
        gain = gain.times(buyableEffect("m", 11));

        // Apply Upgrade 11 (Doubles Matter gain)
        if (hasUpgrade("m", 11)) gain = gain.times(2);

        // Apply Upgrade 12 (Matter boosts itself)
        let matterBoost = player.m.points.add(1).log10().add(1);
        matterBoost = matterBoost.plus(buyableEffect("m", 12)); // Buyable 12 effect

        gain = gain.times(matterBoost);

        // Apply Buyable 13 (Boosts Matter based on Points^0.5)
        gain = gain.times(buyableEffect("m", 13));

        // Apply Upgrade 13 (Raise Matter gain to 1.2 power)
        if (hasUpgrade("m", 13)) gain = gain.pow(1.2);

        player.m.points = player.m.points.add(gain.times(diff));
    },

    upgrades: {
        11: {
            title: "Matter Expansion",
            description: "Doubles Matter generation.",
            cost: new Decimal(10),
        },
        12: {
            title: "Matter Refinement",
            description: "Matter boosts its own production.",
            cost: new Decimal(100),
            effect() {
                return player.m.points.add(1).log10().add(1);
            },
            effectDisplay() { return "x" + format(upgradeEffect("m", 12)) },
        },
        13: {
            title: "Advanced Matter Growth",
            description: "Matter generation is raised to ^1.2.",
            cost: new Decimal(1000),
        },
    },

    buyables: {
        11: {
            title: "Matter Generator",
            cost(x) { return new Decimal(5).times(Decimal.pow(1.5, x)) },
            effect(x) { return Decimal.pow(2, x) },
            display() { return "Boosts Matter gain by x" + format(this.effect(getBuyableAmount("m", 11))) },
            canAfford() { return player.m.points.gte(this.cost(getBuyableAmount("m", 11))) },
            buy() {
                player.m.points = player.m.points.sub(this.cost(getBuyableAmount("m", 11)));
                setBuyableAmount("m", 11, getBuyableAmount("m", 11).add(1));
            },
        },
        12: {
            title: "Matter Condenser",
            cost(x) { return new Decimal(10).times(Decimal.pow(2, x)) },
            effect(x) { return new Decimal(0.05).times(x) },
            display() { return "Increases the base of Upgrade 12 by +" + format(this.effect(getBuyableAmount("m", 12))) },
            canAfford() { return player.m.points.gte(this.cost(getBuyableAmount("m", 12))) },
            buy() {
                player.m.points = player.m.points.sub(this.cost(getBuyableAmount("m", 12)));
                setBuyableAmount("m", 12, getBuyableAmount("m", 12).add(1));
            },
        },
        13: {
            title: "Matter Collector",
            cost(x) { return new Decimal(50).times(Decimal.pow(3, x)) },
            effect(x) { return player.points.add(1).pow(0.5).times(x.add(1)) },
            display() { return "Boosts Matter gain based on Points^0.5. Current: x" + format(this.effect(getBuyableAmount("m", 13))) },
            canAfford() { return player.m.points.gte(this.cost(getBuyableAmount("m", 13))) },
            buy() {
                player.m.points = player.m.points.sub(this.cost(getBuyableAmount("m", 13)));
                setBuyableAmount("m", 13, getBuyableAmount("m", 13).add(1));
            },
        },
        14: {
            title: "Matter Stabilizer",
            cost(x) { return new Decimal(200).times(Decimal.pow(4, x)) },
            effect(x) { return player.m.points.add(1).log10().times(x.add(1)) },
            display() { return "Matter boosts Points gain. Current: x" + format(this.effect(getBuyableAmount("m", 14))) },
            canAfford() { return player.m.points.gte(this.cost(getBuyableAmount("m", 14))) },
            buy() {
                player.m.points = player.m.points.sub(this.cost(getBuyableAmount("m", 14)));
                setBuyableAmount("m", 14, getBuyableAmount("m", 14).add(1));
            },
        },
    },
});
