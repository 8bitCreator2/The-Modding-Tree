addLayer("e", { // "e" for Energy
    name: "Energy", 
    symbol: "⚡",
    position: 0, 
    startData() { return { unlocked: true, points: new Decimal(0) }},
    color: "#FFD700",
    resource: "Energy",
    type: "none", // No prestige reset, Energy is generated passively
    row: 0, 

    // Energy Generation: Now affected by buyable effect
    update(diff) {
        let energyGain = this.passiveGeneration(); // Get base generation
        player[this.layer].points = player[this.layer].points.add(energyGain.times(diff));
    },

    passiveGeneration() { 
        let baseGain = new Decimal(1); // Base Energy gain = 1/sec
        let buyableBoost = tmp.e.buyables[11].effect; // Get the buyable effect
        return baseGain.times(buyableBoost); // Apply buyable boost
    },

    // Buyable: Increases Energy Gain
    buyables: {
        11: {
            cost(x) { return new Decimal(10).times(Decimal.pow(2, x)) }, // Costs double per level
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
