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
            rank: new Decimal(0), // Rank tracking
        };
    },
    color: "#008CFF",
    resource: "level points",
    baseResource: "points",
    baseAmount() { return player.points; },
    type: "none",
    row: 1,
    layerShown() { return true },

    tabStyle: {
        background: "#008CFF",
        borderRadius: "50%",
        color: "white",
    },

    milestones: {
        0: {
            requirementDescription: "Rank 1",
            effectDescription: "Multiply level points by 10x.",
            done() { return player.l.rank.gte(1); },
        },
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
            cost: new Decimal(10),
            unlocked() {
                return player.l.level.gte(2);
            },
            effect() {
                let boost = player.points.add(1).log10().add(1).pow(1.2);
                if (hasUpgrade("l", 23)) {
                    boost = boost.mul(upgradeEffect("l", 23));
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
    },

    update(diff) {
        let levelBoost = hasUpgrade("l", 11) ? upgradeEffect("l", 11) : new Decimal(1);
        let pointBoost = hasUpgrade("l", 12) ? upgradeEffect("l", 12) : new Decimal(1);

        if (player.l.rank.gte(1)) {
            levelBoost = levelBoost.mul(10); // Apply rank milestone boost
        }

        player.l.points = player.l.points.add(diff * levelBoost * pointBoost);

        let levelReq = new Decimal(5).pow(player.l.level.add(1));
        if (player.l.points.gte(levelReq)) {
            player.l.points = player.l.points.sub(levelReq);
            player.l.level = player.l.level.add(1);
        }
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "resource-display",
                "upgrades",
                ["display-text", function() {
                    let levelReq = new Decimal(5).pow(player.l.level.add(1));
                    let progress = player.l.points.div(levelReq).mul(100);
                    return `
                        <h3>Level: ${format(player.l.level)}</h3>
                        <p>Level Points: ${format(player.l.points)} / ${format(levelReq)}</p>
                        <div style="width: 100%; height: 20px; background-color: lightgray; border: 1px solid black;">
                            <div style="width: ${progress.toFixed(2)}%; height: 100%; background-color: green;"></div>
                        </div>
                    `;
                }],
            ],
        },
        "Rank": {
            unlocked() { return player.l.level.gte(10); },
            content: [
                ["display-text", function() {
                    let rankCost = new Decimal(10).mul(player.l.rank.add(1));
                    return `
                        <h3>Rank: ${format(player.l.rank)}</h3>
                        <p>Ranks reset all progress but provide significant boosts to level points.</p>
                        <p>Next Rank Cost: ${format(rankCost)} level points</p>
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
                    player.l.rank = player.l.rank.add(1); // Increase rank
                    player.l.points = new Decimal(0);
                    player.l.level = new Decimal(0);
                    player.l.essence = new Decimal(0);
                    // Reset all upgrades
                    player.l.upgrades = [];
                } else {
                    console.warn("Player attempted to rank up without meeting the requirements.");
                }
            },
            style() {
                let rankCost = new Decimal(10).mul(player.l.rank.add(1));
                return {
                    "background-color": player.l.points.gte(rankCost) ? "green" : "gray",
                    "color": "white",
                    "border": "1px solid black",
                    "border-radius": "10px",
                    "padding": "5px",
                    "cursor": player.l.points.gte(rankCost) ? "pointer" : "not-allowed",
                };
            },
        },
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer]?.row > this.row) {
            layerDataReset("l", ["rank"]);
        }
    },
});
