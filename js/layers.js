addLayer("s", { // "s" for Stone
    name: "Stone", 
    symbol: "🪨",
    position: 0, 
    startData() { return { unlocked: true, points: new Decimal(0) }},
    color: "#808080", // Gray color for Stone
    resource: "Stone",
    type: "none", // No prestige reset, Stone is generated passively
    row: 0, 

    // Stone Generation: Passive generation of stone
    update(diff) {
        player[this.layer].points = player[this.layer].points.add(this.passiveGeneration().times(diff));
    },

    passiveGeneration() { 
        return new Decimal(1); // Start with 1 Stone per second
    },

    // Buyables & Upgrades
    buyables: {
        11: {
            cost(x) { return new Decimal(10).times(Decimal.pow(2, x)) }, // Costs double per level
            effect(x) { return Decimal.pow(1.5, x) }, // Multiplies Stone generation rate
            display() {
                return `Increase Stone generation by x1.5 per level.<br>
                        Level: ${getBuyableAmount(this.layer, this.id)}<br>
                        Cost: ${format(this.cost())} Stone`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost());
                addBuyables(this.layer, this.id, 1);
            }
        },
    },

    // Display Stone Generation Rate and Other Info
    tabFormat: [
        "main-display",
        ["display-text", function() {
            return "Generating " + format(tmp.s.passiveGeneration) + " Stone per second.";
        }],
        "blank",
        "buyables"
    ]
});
