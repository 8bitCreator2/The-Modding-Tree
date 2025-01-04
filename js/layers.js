addLayer("l", {
    name: "Levels",
    symbol: "L",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            level: new Decimal(0),
            essence: new Decimal(0),
            essenceBaseMultiplier: new Decimal(1), // Track the base multiplier for Level Essence
        }
    },
    color: "#008CFF",
    resource: "level points",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "none",
    row: 1,
    layerShown() { return true },

    tabStyle: {
        background: "#008CFF",
        borderRadius: "50%",
        color: "white",
    },

    upgrades: {
        11: {
            title: "Level Boost",
            description: "Increase level points gained based on current level.",
            cost: new Decimal(1),
            effect() {
                let baseBoost = player[this.layer].level.add(1).pow(0.75);
                if (hasUpgrade("l", 13)) {
                    let levelBoost = player[this.layer].level.add(1);
                    baseBoost = baseBoost.mul(levelBoost);
                }
                return baseBoost;
            },
            effectDisplay() { 
                return "x" + format(this.effect());
            },
        },
        12: {
            title: "Point Synergy",
            description: "Boost level points based on your total points.",
            cost: new Decimal(5),
            unlocked() {
                return player.l.level.gte(2);
            },
            effect() {
                return player.points.add(1).log10().add(1).pow(1.2);
            },
            effectDisplay() { 
                return "x" + format(this.effect());
            },
        },
        13: {
            title: "Level Synergy",
            description: "Boost the effect of the first upgrade based on your level.",
            cost: new Decimal(10),
            unlocked() {
                return player.l.level.gte(3);
            },
            effect() {
                return player.l.level.add(1);
            },
            effectDisplay() {
                return "x" + format(this.effect()) + " to Upgrade 11 effect";
            },
        },
        21: {
            title: "Level Point Power",
            description: "Boost player points based on your total level points (at a reduced rate).",
            cost: new Decimal(15),
            unlocked() {
                return player.l.level.gte(6); // Unlocked at level 6
            },
            effect() {
                return player.l.points.add(1).log10().add(1); // Direct logarithmic scaling
            },
            effectDisplay() {
                return "x" + format(this.effect());
            },
        },
        22: {
            title: "Essence Efficiency",
            description: "Reduce the level requirement based on your Level Essence (at a reduced rate).",
            cost: new Decimal(20),
            unlocked() {
                return player.l.level.gte(7); // Unlocked at level 7
            },
            effect() {
                return player.l.essence.add(1).log10().add(1).pow(0.5); // Scales with the square root of log essence
            },
            effectDisplay() {
                return "÷" + format(this.effect());
            },
        },
        23: {
            title: "Level Synergized Points",
            description: "Upgrade 12 (Point Synergy) is now based on level^0.8.",
            cost: new Decimal(25),
            unlocked() {
                return player.l.level.gte(8); // Unlocked at level 8
            },
            effect() {
                return player.l.level.add(1).pow(0.8); // Scales with level^0.8
            },
            effectDisplay() {
                return "^" + format(this.effect());
            },
        },
    },

    buyables: {
        11: {
            title: "Base Level Essence Boost",
            description: "Increase the base Level Essence gain multiplier.",
            cost() {
                return new Decimal(100).pow(player.l.buyables[11].add(1)); // Increasing cost each time
            },
            effect() {
                return new Decimal(1.5).pow(player.l.buyables[11]); // Multiplies the base Level Essence by 1.5 per buyable level
            },
            effectDisplay() {
                return "x" + format(this.effect()) + " to Level Essence Base";
            },
            unlocked() {
                return player.l.level.gte(11); // Unlocks at level 11
            },
            canAfford() {
                return player.l.points.gte(this.cost());
            },
            buy() {
                player.l.points = player.l.points.sub(this.cost());
                setBuyableAmount("l", 11, getBuyableAmount("l", 11).add(1));
            },
        },
    },

    // Update Level Essence and Player Point Boosts
    update(diff) {
        // Apply level multipliers
        let levelBoost = hasUpgrade("l", 11) ? upgradeEffect("l", 11) : new Decimal(1);
        let pointBoost = hasUpgrade("l", 12) ? upgradeEffect("l", 12) : new Decimal(1);
        let essenceBoost = player.l.level.gte(5) 
            ? player.l.essence.add(1).log10().add(1) 
            : new Decimal(1);

        // Gain level points passively
        player.l.points = player.l.points.add(diff * levelBoost * pointBoost * essenceBoost);

        // Check if the player can level up
        let levelReduction = hasUpgrade("l", 22) ? upgradeEffect("l", 22) : new Decimal(1);
        let levelReq = new Decimal(5).pow(player.l.level.add(1)).div(levelReduction);
        if (player.l.points.gte(levelReq)) {
            player.l.points = player.l.points.sub(levelReq);
            player.l.level = player.l.level.add(1);
        }

        // Gain Level Essence (unlocks at level 5)
        if (player.l.level.gte(5)) {
            let essenceGain = player.l.level.mul(player.l.points).pow(0.5);
            essenceGain = essenceGain.mul(player.l.essenceBaseMultiplier); // Apply base multiplier to essence gain
            player.l.essence = player.l.essence.add(essenceGain.mul(diff));
        }

        // Apply Buyable 11 effect to increase base Level Essence multiplier
        if (player.l.buyables[11] > 0) {
            player.l.essenceBaseMultiplier = player.l.buyables[11].effect();
        }

        // At level 9, Level Essence boosts row 2 upgrades
        if (player.l.level.gte(9)) {
            let essenceBoost2 = player.l.essence.add(1).log10().add(1).pow(0.5); // Boost factor based on essence
            for (let i = 21; i <= 23; i++) {
                if (hasUpgrade("l", i)) {
                    let upgradeEffectVal = upgradeEffect("l", i);
                    upgradeEffect("l", i).mul(essenceBoost2);
                }
            }
        }

        // New feature at level 10
        if (player.l.level.gte(10)) {
            // Increase Level Essence gain based on total points
            let bonusEssence = player.points.add(1).log10().add(1).pow(0.2); // Small boost based on total points
            player.l.essence = player.l.essence.add(bonusEssence.mul(diff));
        }
    },

    // Display Level Essence and Level Point Boost
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "resource-display",
                "upgrades",
                "buyables", // Include buyables in the tab format
                ["display-text", function() {
                    let levelReduction = hasUpgrade("l", 22) ? upgradeEffect("l", 22) : new Decimal(1);
                    let levelReq = new Decimal(5).pow(player.l.level.add(1)).div(levelReduction);
                    let progress = player.l.points.div(levelReq).mul(100);
                    let essenceBoost = player.l.level.gte(5) 
                        ? player.l.essence.add(1).log10().add(1) 
                        : new Decimal(1);
                    return `
                        <h3>Level: ${format(player.l.level)}</h3>
                        <p>Level Points: ${format(player.l.points)} / ${format(levelReq)}</p>
                        <div style="width: 100%; height: 20px; background-color: lightgray; border: 1px solid black;">
                            <div style="width: ${progress.toFixed(2)}%; height: 100%; background-color: green;"></div>
                        </div>
                        <br>
                        <h4>Level Essence: ${format(player.l.essence)}</h4>
                        <p>Level Essence Boost: x${format(essenceBoost)}</p>
                        <h4>Base Level Essence Multiplier: x${format(player.l.essenceBaseMultiplier)}</h4>
                    `;
                }],
            ],
        },
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer]?.row > this.row) {
            layerDataReset("l", ["level", "essence"]);
        }
    },
});
