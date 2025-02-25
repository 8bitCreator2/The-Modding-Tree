addLayer("e", {
    name: "Energy", 
    symbol: "⚡",
    position: 0, 
    startData() { return { unlocked: true, points: new Decimal(0), overclocking: false, overclockCooldown: 0 }},
    color: "#FFD700",
    resource: "Energy",
    type: "none",
    row: 0, 

    update(diff) {
        let energyGain = this.passiveGeneration();
        player[this.layer].points = player[this.layer].points.add(energyGain.times(diff));
        
        // Handle overclocking cooldown
        if (player[this.layer].overclockCooldown > 0) {
            player[this.layer].overclockCooldown -= diff;
        }
        
        // Apply overclocking if active
        if (player[this.layer].overclocking) {
            player[this.layer].points = player[this.layer].points.add(energyGain.times(9).times(diff)); // 9x energy boost
            if (player[this.layer].overclockCooldown <= 0) {
                player[this.layer].overclocking = false; // End overclocking after the boost period
            }
        }
    },

    passiveGeneration() { 
        let baseGain = new Decimal(1);
        if (hasMilestone("e", 0)) baseGain = baseGain.times(3)
        if (hasUpgrade("e", 13)) baseGain = baseGain.times(3); // Upgrade 13: x3 base gain
        let buyableBoost = tmp.e.buyables[11].effect; 
        let upgradeBoost = hasUpgrade("e", 11) ? new Decimal(2) : new Decimal(1);
        return baseGain.times(buyableBoost).times(upgradeBoost);
    },

    upgrades: {
        11: {
            title: "Energy Boost",
            description: "Double your Energy generation.",
            cost: new Decimal(250),
            unlocked() { return player[this.layer].points.gte(500); }
        },

        12: {
            title: "Buyable Boost",
            description: "Buyable 11's effect is 20% stronger.",
            cost: new Decimal(750),
            unlocked() { return player[this.layer].points.gte(1500); }
        },

        13: {
            title: "Passive Boost",
            description: "Triple your base Energy generation.",
            cost: new Decimal(2000),
            unlocked() { return player[this.layer].points.gte(5000); }
        },

        14: {
            title: "Buyable Discount",
            description: "Buyables are 20% cheaper.",
            cost: new Decimal(10000),
            unlocked() { return player[this.layer].points.gte(20000); }
        },

        15: {
            title: "Overclocking Unlock",
            description: "Unlock the ability to overclock energy generation.",
            cost: new Decimal(10000),
            unlocked() { return player[this.layer].points.gte(20000); }
        }
    },

    buyables: {
        11: {
            cost(x) { 
                let baseCost = new Decimal(10).times(Decimal.pow(2, x));
                if (hasUpgrade("e", 14)) baseCost = baseCost.times(0.8); // Upgrade 14: Cheaper buyables
                return baseCost;
            },
            effect(x) { 
                let boost = Decimal.pow(1.5, x);
                if (hasUpgrade("e", 12)) boost = boost.times(1.2); // Upgrade 12: Stronger effect
                if (hasMilestone("e", 1)) boost = boost.times(tmp.e.buyables[12].effect);
                return boost;
            },
            display() {
                return `Increase Energy gain by x1.5 per level.<br>
                        Level: ${getBuyableAmount(this.layer, this.id)}<br>
                        Cost: ${format(this.cost())} Energy<br>
                        Current Boost: x${format(this.effect(getBuyableAmount(this.layer, this.id)))}`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },

            automate(diff) {
                // Check if Milestone 1 is reached and if Buyable 11 can be bought
                if (hasMilestone("e", 1)) { 
                    if (player[this.layer].points.gte(this.cost())) {
                        // Use the buyMax function to buy as much as possible
                        buyBuyable(this.layer, this.id); // This line buys the maximum amount the player can afford.
                    }
                }
            }
        },

        12: {
            unlocked() { return hasMilestone("e", 1) },
            cost(x) { return new Decimal(500).times(Decimal.pow(3, x)) },
            effect(x) { return Decimal.pow(1.05, x) },
            display() {
                return `Multiply Buyable 11's effect by x1.05 per level.<br>
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

    milestones: {
        0: {
            requirementDescription: "1,000 Energy",
            effectDescription: "1.5x Energy",
            done() { return player[this.layer].points.gte(1000) }
        },
        1: {
            requirementDescription: "10,000 Energy",
            effectDescription: "Unlock Buyable 12, which boosts Buyable 11.",
            done() { return player[this.layer].points.gte(10000) }
        }
    },

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
        "buyables",
        ["display-text", function() {
            if (player.e.overclocking) {
                return "Overclocking active! Energy is boosted for a limited time.";
            } else if (player.e.overclockCooldown > 0) {
                return "Overclocking on cooldown. Time remaining: " + format(player.e.overclockCooldown) + "s";
            } else {
                return "Ready to overclock! Cost: 500 Energy";
            }
        }],
        ["button", "Overclock", function() {
            if (player.e.points.gte(500) && player.e.overclockCooldown <= 0) {
                player.e.points = player.e.points.sub(500); // Subtract cost
                player.e.overclocking = true;
                player.e.overclockCooldown = 60; // Set cooldown to 60 seconds
            }
        }]
    ]
});
