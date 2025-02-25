addLayer("e", { // "e" for Energy
    name: "Energy", 
    symbol: "⚡",
    position: 0, 
    startData() { return { unlocked: true, points: new Decimal(0) }},
    color: "#FFD700",
    resource: "Energy",
    type: "none", // No prestige reset, Energy is generated passively
    row: 0, 

    // Energy Generation: Now affected by buyable effects
    update(diff) {
        let energyGain = this.passiveGeneration(); // Get base generation
        player[this.layer].points = player[this.layer].points.add(energyGain.times(diff));
    },

    passiveGeneration() { 
        let baseGain = new Decimal(1); // Base Energy gain = 1/sec
        // Apply the effect of Buyable 11 (increased by x1.5 per level) 
        let buyableBoost = tmp.e.buyables[11].effect; 
        // If there's a second buyable, apply its effect (adds +0.1)
        if (player[this.layer].buyables[12] > 0) {
            baseGain = baseGain.plus(0.1 * player[this.layer].buyables[12]); // Adds 0.1 per level of Buyable 12
        }
        return baseGain.times(buyableBoost); // Apply the base + boost
    },

    // Buyable 11: Increases Energy Gain (x1.5 per level)
    buyables: {
        11: {
            cost(x) { 
                // Apply cost reduction from Buyable 13's effect
                let scaling = Decimal.pow(2, x).minus(tmp.e.buyables[13].effect); // Reduce cost scaling by Buyable 13's effect
                return new Decimal(10).times(scaling);
            },
            effect(x) { return Decimal.pow(1.5, x) }, // Energy gain x1.5 per level
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

        // Buyable 12: Increases Base Energy Gain by +0.1 per level
        12: {
            cost(x) { return new Decimal(50).times(Decimal.pow(2, x)) }, // Costs double per level
            effect(x) { return x }, // Adds 0.1 to the base per level
            display() {
                return `Increase Base Energy gain by +0.1 per level.<br>
                        Level: ${getBuyableAmount(this.layer, this.id)}<br>
                        Cost: ${format(this.cost())} Energy<br>
                        Current Boost: +${format(this.effect(getBuyableAmount(this.layer, this.id)) * 0.1)}`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost());
                addBuyables(this.layer, this.id, 1);
            }
        },

        // Buyable 13: Reduces cost scaling of Buyable 11
        13: {
            cost(x) { return new Decimal(100).times(Decimal.pow(2, x)) }, // Costs double per level
            effect(x) { return x * 0.1 }, // Reduces cost scaling by 10% per level
            display() {
                return `Reduces cost scaling of Buyable 11 by 10% per level.<br>
                        Level: ${getBuyableAmount(this.layer, this.id)}<br>
                        Cost: ${format(this.cost())} Energy<br>
                        Current Boost: -${format(this.effect(getBuyableAmount(this.layer, this.id)) * 100)}% cost scaling for Buyable 11`;
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
