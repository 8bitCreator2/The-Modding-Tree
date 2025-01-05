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
            rank: new Decimal(0),
        };
    },
    color: "#008CFF",
    resource: "level points",
    baseResource: "points",
    baseAmount() { return player.points; },
    type: "none",
    row: 1,
    layerShown() { return true; },

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
                let boost = player.l.level.add(1).pow(0.75);
                if (hasUpgrade("l", 13)) {
                    boost = boost.mul(player.l.level.add(1).pow(0.5));
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
        12: {
            title: "Point Synergy",
            description: "Boost level points based on your total points.",
            cost: new Decimal(5),
            unlocked() {
                return player.l.level.gte(2);
            },
            effect() {
                let boost = player.points.add(1).log10().add(1).pow(1.2);
                return boost;
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
                return player.l.level.add(1).pow(0.5);
            },
            effectDisplay() {
                return "x" + format(this.effect()) + " to Upgrade 11 effect";
            },
        },
    },

    update(diff) {
        // Apply level multipliers
        let levelBoost = hasUpgrade("l", 11) ? upgradeEffect("l", 11) : new Decimal(1);
        let pointBoost = hasUpgrade("l", 12) ? upgradeEffect("l", 12) : new Decimal(1);
        
        // Passive level points gain
        player.l.points = player.l.points.add(diff * levelBoost * pointBoost);

        // Calculate level requirement based on 5^x scaling
        let levelReq = Decimal.pow(5, player.l.level.add(1));
        if (player.l.points.gte(levelReq)) {
            player.l.points = player.l.points.sub(levelReq);
            player.l.level = player.l.level.add(1);
        }

        // Gain Level Essence (unlocks at level 5)
        if (player.l.level.gte(5)) {
            let essenceGain = player.l.level.pow(0.5).mul(diff);
            player.l.essence = player.l.essence.add(essenceGain);
        }
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "resource-display",
                "upgrades",
                ["display-text", function() {
                    let levelReq = Decimal.pow(5, player.l.level.add(1));
                    let progress = player.l.points.div(levelReq).mul(100);
                    return `
                        <h3>Level: ${format(player.l.level)}</h3>
                        <p>Level Points: ${format(player.l.points)} / ${format(levelReq)}</p>
                        <div style="width: 100%; height: 20px; background-color: lightgray; border: 1px solid black;">
                            <div style="width: ${progress.toFixed(2)}%; height: 100%; background-color: green;"></div>
                        </div>
                        <br>
                        <h4>Level Essence: ${format(player.l.essence)}</h4>
                    `;
                }],
            ],
        },
    },

    clickables: {
        rankUp: {
            title: "Rank Up",
            display() {
                let requiredLevel = player.l.rank.add(1).mul(10);
                return `Reset everything to gain 1 rank.<br>
                        Requires: Level ${format(requiredLevel)}`;
            },
            canClick() {
                let requiredLevel = player.l.rank.add(1).mul(10);
                return player.l.level.gte(requiredLevel);
            },
            onClick() {
                if (this.canClick()) {
                    player.l.rank = player.l.rank.add(1);
                    player.l.points = new Decimal(0);
                    player.l.level = new Decimal(0);
                    player.l.essence = new Decimal(0);
                }
            },
        },
    },

    milestones: {
        1: {
            requirementDescription: "1 Rank",
            effectDescription: "Boost point gain by ^2 and unlock a new upgrade.",
            done() { return player.l.rank.gte(1); },
        },
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer]?.row > this.row) {
            layerDataReset("l", ["rank"]);
        }
    },
});
