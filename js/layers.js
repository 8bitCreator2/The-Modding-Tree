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

        // Buyable 12: Adds +0.1 to base Energy gain per level
        12: {
            cost(x) { return new Decimal(50).times(Decimal.pow(2, x)) },
            effect(x) { return x }, 
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

        // Buyable 13: Multiplies Energy gain by (Points^0.75) per level
        13: {
            cost(x) { return new Decimal(250).times(Decimal.pow(7, x)) }, // More expensive
            effect(x) { return Decimal.pow(player.points.plus(1), new Decimal(0.75).times(x)) }, // (points+1)^0.75 per level
            display() {
                return `Multiply Energy gain by (Points^0.75) per level.<br>
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
