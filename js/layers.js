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
            rank: new Decimal(0), // Added rank
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
                if (player.l.rank.gte(1)) {
                    baseBoost = baseBoost.mul(10); // Rank boost
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
            cost: new Decimal(10),
            unlocked() {
                return player.l.level.gte(2);
            },
            effect() {
                let boost = player.points.add(1).log10().add(1).pow(1.2);
                if (hasUpgrade("l", 23)) {
                    boost = boost.mul(upgradeEffect("l", 23)); // Rank boost
                }
                if (player.l.rank.gte(1)) {
                    boost = boost.mul(10); // Rank boost
                }
                return boost;
            },
            effectDisplay() { 
                return "x" + format(this.effect());
            },
        },
        13: {
            title: "Level Synergy",
            description: "Boost the effect of the first upgrade based on your level.",
            cost: new Decimal(30),
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
            cost: new Decimal(150),
            unlocked() {
                return player.l.level.gte(6);
            },
            effect() {
                return player.l.points.add(1).log10().add(1);
            },
            effectDisplay() {
                return "x" + format(this.effect());
            },
        },
        22: {
            title: "Essence Efficiency",
            description: "Reduce the level requirement based on your Level Essence (at a reduced rate).",
            cost: new Decimal(1000),
            unlocked() {
                return player.l.level.gte(7);
            },
            effect() {
                let baseEffect = player.l.essence.add(1).log10().add(1).pow(0.76);
                if (hasUpgrade("l", 31)) {
                    baseEffect = baseEffect.pow(upgradeEffect("l", 31)); // Apply Ranked Essence Synergy boost
                }
                return baseEffect;
            },
            effectDisplay() {
                return "÷" + format(this.effect());
            },
        },
        23: {
            title: "Level Synergized Points",
            description: "Upgrade 12 (Point Synergy) is now based on level^0.8.",
            cost: new Decimal(2500),
            unlocked() {
                return player.l.level.gte(8);
            },
            effect() {
                return player.l.level.add(1).pow(0.8);
            },
            effectDisplay() {
                return "^" + format(this.effect());
            },
        },
        31: {
            title: "Ranked Essence Synergy",
            description: "Boost Upgrade 22's effect by y^(1 + x), where x = rank.",
            cost: new Decimal(5000),
            unlocked() {
                return player.l.level.gte(13);
            },
            effect() {
                return player.l.rank.add(1); // x = rank + 1 for the formula
            },
            effectDisplay() {
                return "^" + format(this.effect()) + " to Upgrade 22 effect";
            },
        },
    },

    update(diff) {
        let levelBoost = hasUpgrade("l", 11) ? upgradeEffect("l", 11) : new Decimal(1);
        let pointBoost = hasUpgrade("l", 12) ? upgradeEffect("l", 12) : new Decimal(1);
        let essenceBoost = player.l.level.gte(5) 
            ? player.l.essence.add(1).log10().add(1) 
            : new Decimal(1);
        if (player.l.rank.gte(1)) {
            essenceBoost = essenceBoost.mul(10); // Rank boost
        }

        player.l.points = player.l.points.add(diff * levelBoost * pointBoost * essenceBoost);

        let levelReduction = hasUpgrade("l", 22) ? upgradeEffect("l", 22) : new Decimal(1);
        let levelReq = new Decimal(5).pow(player.l.level.add(1)).div(levelReduction);
        if (player.l.points.gte(levelReq)) {
            player.l.points = player.l.points.sub(levelReq);
            player.l.level = player.l.level.add(1);
        }

        if (player.l.level.gte(5)) {
            let essenceGain = player.l.level.mul(player.l.points).pow(0.5);
            player.l.essence = player.l.essence.add(essenceGain.mul(diff));
        }
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "resource-display",
                "upgrades",
                ["display-text", function() {
                    let levelReduction = hasUpgrade("l", 22) ? upgradeEffect("l", 22) : new Decimal(1);
                    let levelReq = new Decimal(5).pow(player.l.level.add(1)).div(levelReduction);
                    let progress = player.l.points.div(levelReq).mul(100);
                    let essenceBoost = player.l.level.gte(5) 
                        ? player.l.essence.add(1).log10().add(1) 
                        : new Decimal(1);
                    if (player.l.rank.gte(1)) {
                        essenceBoost = essenceBoost.mul(10); // Rank boost
                    }
                    return `
                        <h3>Level: ${format(player.l.level)}</h3>
                        <p>Level Points: ${format(player.l.points)} / ${format(levelReq)}</p>
                        <div style="width: 100%; height: 20px; background-color: lightgray; border: 1px solid black;">
                            <div style="width: ${progress.toFixed(2)}%; height: 100%; background-color: green;"></div>
                        </div>
                        <br>
                        <h4>Level Essence: ${format(player.l.essence)}</h4>
                        <p>Level Essence Boost: x${format(essenceBoost)}</p>
                    `;
                }],
            ],
        },
       "Rank": {
            unlocked() {
                return player.l.level.gte(10);
            },
            content: [
                ["display-text", function() {
                    let rankCost = new Decimal(10).mul(player.l.rank.add(1));
                    return `
                        <h3>Rank: ${format(player.l.rank)}</h3>
                        <p>Ranks reset all progress but provide significant boosts to level points and essence.</p>
                        <p>Next Rank Cost: ${format(rankCost)} level points</p>
                        <p>Current Boost: x10 to level points and essence</p>
                    `;
                }],
                ["row", [["clickable", "rankUp"]]],
            ],
        },
    },

    clickables: {
        rankUp: {
            title: "Rank Up",
            display() {
                let rankCost = new Decimal(10).mul(player.l.rank.add(1));
                return `Reset everything to gain 1 rank.<br>Cost: ${format(rankCost)} level points`;
            },
            canClick() {
                let rankCost = new Decimal(10).mul(player.l.rank.add(1));
                return player.l.points.gte(rankCost);
            },
            onClick() {
                let rankCost = new Decimal(10).mul(player.l.rank.add(1));
                if (player.l.points.gte(rankCost)) {
                    player.l.rank = player.l.rank.add(1);
                    player.l.points = new Decimal(0);
                    player.l.level = new Decimal(0);
                    player.l.essence = new Decimal(0);
                }
            },
        },
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer]?.row > this.row) {
            layerDataReset("l", ["rank"]);
        }
    },
});
