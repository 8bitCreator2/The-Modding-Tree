addLayer("e", { // "e" for Energy
    name: "Energy", 
    symbol: "⚡",
    position: 0, 
    startData() { return { unlocked: true, points: new Decimal(0) }},
    color: "#FFD700",
    resource: "Energy",
    type: "none", // No prestige reset, Energy is generated passively
    row: 0, 

    // Energy Generation: Now affected by upgrades
    update(diff) {
        let energyGain = this.passiveGeneration();
        player[this.layer].points = player[this.layer].points.add(energyGain.times(diff));
    },

    passiveGeneration() { 
        let baseGain = new Decimal(1); // Base Energy gain = 1/sec
        let buyableBoost = tmp.e.buyables[11].effect; // Get first buyable's effect
        let upgradeBoost = hasUpgrade("e", 11) ? new Decimal(2) : new Decimal(1); // Apply upgrade if bought
        return baseGain.times(buyableBoost).times(upgradeBoost);
    },

    // Upgrades
    upgrades: {
        11: {
            title: "Energy Boost",
            description: "Double your Energy generation.",
            cost: new Decimal(250),
            unlocked() { return player[this.layer].points.gte(500); } // Unlocks at 500 Energy
        },
    },

    // Buyables
    buyables: {
        11: {
            cost(x) { return new Decimal(10).times(Decimal.pow(2, x)) }, // Doubles cost per level
            effect(x) { 
                let boost = Decimal.pow(1.5, x); // x1.5 per level
                if (hasMilestone("e", 1)) boost = boost.times(tmp.e.buyables[12].effect); // Apply Buyable 12 boost
                return boost;
            },
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
            unlocked() { return hasMilestone("e", 1) }, // Unlocked at Milestone 2
            cost(x) { return new Decimal(500).times(Decimal.pow(3, x)) }, // Triples cost per level
            effect(x) { return Decimal.pow(1.25, x) }, // x1.25 per level to Buyable 11's effect
            display() {
                return `Multiply Buyable 11's effect by x1.25 per level.<br>
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

    // Milestones
    milestones: {
        0: {
            requirementDescription: "1,000 Energy",
            effectDescription: "Auto-buy Buyable 11.",
            done() { return player[this.layer].points.gte(1000) }
        },
        1: {
            requirementDescription: "10,000 Energy",
            effectDescription: "Unlock Buyable 12, which boosts Buyable 11.",
            done() { return player[this.layer].points.gte(10000) }
        }
    },

    // Display Energy Gain Rate and Other Info
    tabFormat: [
        "main-display",
        ["display-text", function() {
            return "Generating " + format(tmp.e.passiveGeneration) + " Energy per second.";
        }],
        "blank",
        "upgrades",
        "blank",
        "milestones",
        "blank",
        "buyables"
    ]
});
