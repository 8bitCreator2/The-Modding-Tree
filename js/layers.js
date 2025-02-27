addLayer("e", { // "e" for Energy
    name: "Energy", 
    symbol: "⚡",
    position: 0, 
    startData() { return { unlocked: true, points: new Decimal(0) }},
    color: "#FFD700",
    resource: "Energy",
    type: "none", // No prestige reset, Energy is generated passively
    row: 0, 

    update(diff) {
        let energyGain = this.passiveGeneration(); // Get base generation
        player[this.layer].points = player[this.layer].points.add(energyGain.times(diff));
    },

    passiveGeneration() { 
        let baseGain = new Decimal(1); // Base Energy gain = 1/sec

        // Buyable 12 effect (adds +0.1 per level)
       let buyable12Effect = tmp.e.buyables[12].effect;

       baseGain = baseGain.plus(buyable12Effect); 

        // Buyable 11 effect (softcapped at 10)
        let buyableBoost = new Decimal(1);
        let x = getBuyableAmount("e", 11);
        if (x.lte(10)) {
            buyableBoost = Decimal.pow(1.5, x);
        } else {
            buyableBoost = Decimal.pow(1.5, 10).times(Decimal.pow(1.15, x.sub(10)));
        }

        // Buyable 13 effect (multiplies by points^0.75 per level, scaling at level 3)
        let buyable13Boost = new Decimal(1);
        let b13Level = getBuyableAmount("e", 13);
        let exponent = new Decimal(0.75);
        if (hasUpgrade("e", 12)) exponent = exponent.plus(upgradeEffect("e", 12));
        if (b13Level.gt(0)) {
            buyable13Boost = Decimal.pow(player.points.plus(1), exponent.times(b13Level));

            // Apply softcap and scaling at level 3
            if (b13Level.gte(3)) {
                buyable13Boost = buyable13Boost.times(Decimal.pow(b13Level, 0.5)); // Boost after level 3
            }
        }

        return baseGain.times(buyableBoost).times(buyable13Boost);
    },

    upgrades: {
        11: {
            title: "Enhanced Base Gain",
            description: "Increase the base effect of Buyable 12.",
            cost: new Decimal(100),
            effect() {
                return new Decimal(0.05); // Adds +0.05 to the base per level
            },
            effectDisplay() { return "+" + format(this.effect()) + " to Buyable 12 base effect" }
        },

        12: {
            title: "Exponent Boost",
            description: "Increase the exponent of Buyable 13’s effect.",
            cost: new Decimal(250),
            effect() {
                return new Decimal(0.05); // Adds +0.05 to the exponent
            },
            effectDisplay() { return "+" + format(this.effect()) + " to Buyable 13 exponent" }
        },

        13: {
            title: "Boost Buyable 11",
            description: "Increase Buyable 11 based on every 3 levels of Buyable 12.",
            cost: new Decimal(500),
            effect() {
                let buyable12Level = getBuyableAmount("e", 12);
                return Decimal.pow(1.2, Math.floor(buyable12Level / 3)); // Boost based on levels of Buyable 12
            },
            effectDisplay() { 
                return "Boost Buyable 11 by x" + format(this.effect()) + " based on Buyable 12 levels (every 3 levels)";
            },
        },
    },

    buyables: {
        11: {
            cost(x) { return new Decimal(10).times(Decimal.pow(2, x)) },
            effect(x) { 
                if (x.lte(10)) return Decimal.pow(1.5, x);
                return Decimal.pow(1.5, 10).times(Decimal.pow(1.15, x.sub(10)));
            },
            display() {
                let x = getBuyableAmount(this.layer, this.id);
                let effect = this.effect(x);
                return `Increase Energy gain by x1.5 per level.<br>
                        Level: ${x}<br>
                        Cost: ${format(this.cost(x))} Energy<br>
                        Current Boost: x${format(effect)} (Softcap after 10 levels)`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, this.id)));
                addBuyables(this.layer, this.id, 1);
            }
        },

        12: {
            cost(x) { return new Decimal(50).times(Decimal.pow(2, x)) },
            effect(x) { 
                let baseEffect = new Decimal(0.1);
                if (hasUpgrade("e", 11)) baseEffect = baseEffect.plus(upgradeEffect("e", 11));
                return baseEffect.times(x);
            }, 
            display() {
                return `Increase Base Energy gain by +0.1 per level.<br>
                        Level: ${getBuyableAmount(this.layer, this.id)}<br>
                        Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} Energy<br>
                        Current Boost: +${format(this.effect(getBuyableAmount(this.layer, this.id)))}`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, this.id)));
                addBuyables(this.layer, this.id, 1);
            }
        },

        13: {
            cost(x) { return new Decimal(250).times(Decimal.pow(12, x)) },
            effect(x) { 
                let baseExponent = new Decimal(0.75);
                if (hasUpgrade("e", 12)) baseExponent = baseExponent.plus(upgradeEffect("e", 12));
                return Decimal.pow(player.points.plus(1), baseExponent.times(x));
            }, 
            display() {
                let baseExponent = new Decimal(0.75);
                if (hasUpgrade("e", 12)) baseExponent = baseExponent.plus(upgradeEffect("e", 12));

                return `Multiply Energy gain by (Points^${format(baseExponent)}) per level.<br>
                        Level: ${getBuyableAmount(this.layer, this.id)}<br>
                        Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} Energy<br>
                        Current Boost: x${format(this.effect(getBuyableAmount(this.layer, this.id)))}`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, this.id)));
                addBuyables(this.layer, this.id, 1);
            }
        },

        14: {
            cost(x) { return new Decimal(500).times(Decimal.pow(4, x)) },
            effect(x) { return Decimal.pow(1.2, x) },
            display() {
                return `Multiply Point generation by x1.2 per level.<br>
                        Level: ${getBuyableAmount(this.layer, this.id)}<br>
                        Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} Energy<br>
                        Current Boost: x${format(this.effect(getBuyableAmount(this.layer, this.id)))}`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, this.id)));
                addBuyables(this.layer, this.id, 1);
            }
        },
    },

   tabFormat: {
    "Main": {
        content: [
            "main-display",
            ["display-text", function() {
                return "Generating " + format(tmp.e.passiveGeneration) + " Energy per second.";
            }],
            "blank",
            "buyables" // Keep buyables in the main tab
        ]
    },
    "Upgrades": {
        content: [
            "upgrades"
        ]
    }
}

});
