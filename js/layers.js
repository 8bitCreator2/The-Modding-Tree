addLayer("e", { // "e" for Energy
    name: "Energy", 
    symbol: "⚡",
    position: 0, 
    startData() { return { unlocked: true, points: new Decimal(0) }},
    color: "#FFD700",
    resource: "Energy",
    type: "none", // No prestige reset, Energy is generated passively
    row: 0, 

    // Energy Generation: Now affected by all buyables
    update(diff) {
        let energyGain = this.passiveGeneration(); // Get base generation
        player[this.layer].points = player[this.layer].points.add(energyGain.times(diff));
    },

    passiveGeneration() { 
        let baseGain = new Decimal(1); // Base Energy gain = 1/sec

        // Buyable 12 effect (adds +0.1 per level)
        if (player[this.layer].buyables[12] > 0) {
            baseGain = baseGain.plus(0.1 * player[this.layer].buyables[12]); 
        }

        // Buyable 11 effect (x1.5 per level)
        let buyableBoost = tmp.e.buyables[11].effect; 
        
        // Buyable 13 effect (multiplies by points^0.75 per level)
        let buyable13Boost = tmp.e.buyables[13].effect;

        return baseGain.times(buyableBoost).times(buyable13Boost); // Apply all boosts
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

    },

    buyables: {
        // Buyable 11: x1.5 per level
        11: {
            cost(x) { return new Decimal(10).times(Decimal.pow(2, x)) },
            effect(x) { return Decimal.pow(1.5, x) }, 
            display() {
                return `Increase Energy gain by x1.5 per level.<br>
                        Level: ${getBuyableAmount(this.layer, this.id)}<br>
                        Cost: ${format(this.cost())} Energy<br>
                        Current Boost: x${format(this.effect(getBuyableAmount(this.layer, this.id)))}`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost());
                addBuyables(this.layer, this.id, 1);
            }
        },

        12: {
            cost(x) { return new Decimal(50).times(Decimal.pow(2, x)) },
            effect(x) { 
                let baseEffect = new Decimal(0.1); // Default is +0.1 per level

                // Apply Upgrade 11 Effect
                if (hasUpgrade("e", 11)) {
                    baseEffect = baseEffect.plus(upgradeEffect("e", 11));
                }

                return baseEffect.times(x); // Multiplied by buyable level
            }, 
            display() {
                let baseEffect = new Decimal(0.1);
                if (hasUpgrade("e", 11)) baseEffect = baseEffect.plus(upgradeEffect("e", 11));

                return `Increase Base Energy gain by ${format(baseEffect)} per level.<br>
                        Level: ${getBuyableAmount(this.layer, this.id)}<br>
                        Cost: ${format(this.cost())} Energy<br>
                        Current Boost: +${format(this.effect(getBuyableAmount(this.layer, this.id)))}`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost());
                addBuyables(this.layer, this.id, 1);
            }
        },

        // Buyable 13: Multiplies Energy gain by (Points^0.75) per level
        13: {
        cost(x) { return new Decimal(250).times(Decimal.pow(12, x)) },
        effect(x) { 
            let baseExponent = new Decimal(0.75); 

            // Apply Upgrade 12 Effect
            if (hasUpgrade("e", 12)) {
                baseExponent = baseExponent.plus(upgradeEffect("e", 12));
            }

            return Decimal.pow(player.points.plus(1), baseExponent.times(x));
        }, 
        display() {
            let baseExponent = new Decimal(0.75);
            if (hasUpgrade("e", 12)) baseExponent = baseExponent.plus(upgradeEffect("e", 12));

            return `Multiply Energy gain by (Points^${format(baseExponent)}) per level.<br>
                    Level: ${getBuyableAmount(this.layer, this.id)}<br>
                    Cost: ${format(this.cost())} Energy<br>
                    Current Boost: x${format(this.effect(getBuyableAmount(this.layer, this.id)))}`;
        },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost());
            addBuyables(this.layer, this.id, 1);
        }
    },

         14: {
            cost(x) { return new Decimal(500).times(Decimal.pow(4, x)) }, // More expensive
            effect(x) { return Decimal.pow(1.2, x) }, // x1.2 per level
            display() {
                return `Multiply Point generation by x1.2 per level.<br>
                        Level: ${getBuyableAmount(this.layer, this.id)}<br>
                        Cost: ${format(this.cost())} Energy<br>
                        Current Boost: x${format(this.effect(getBuyableAmount(this.layer, this.id)))}`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost());
                addBuyables(this.layer, this.id, 1);
            }
        },
    },

    // Display Energy Gain Rate and Other Info
    tabFormat: [
        "main-display",
        ["display-text", function() {
            return "Generating " + format(tmp.e.passiveGeneration) + " Energy per second.";
        }],
        "blank",
        "buyables"
    ]
});
