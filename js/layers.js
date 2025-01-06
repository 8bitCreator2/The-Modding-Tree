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
            essenceRank: new Decimal(0),
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
                let boost = player[this.layer].level.add(1).pow(0.75);
                if (hasUpgrade("l", 13)) {
                    boost = boost.mul(player[this.layer].level.add(1));
                }
                if (player.l.rank.gte(1)) {
                    boost = boost.mul(10); // Rank multiplier
                }
                return boost;
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        12: {
            title: "Point Synergy",
            description: "Boost level points based on your total points.",
            cost: new Decimal(25),
            unlocked() { return player.l.level.gte(2); },
            effect() {
                let boost = player.points.add(1).log10().add(1).pow(1.2);
                if (hasUpgrade("l", 23)) {
                    boost = boost.mul(upgradeEffect("l", 23));
                }
                return boost;
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        13: {
            title: "Level Synergy",
            description: "Boost the effect of Upgrade 11 based on your level.",
            cost: new Decimal(75),
            unlocked() { return player.l.level.gte(3); },
            effect() {
                return player.l.level.add(1);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        21: {
            title: "Level Point Power",
            description: "Boost points based on total level points (reduced rate).",
            cost: new Decimal(2000),
            unlocked() { return player.l.level.gte(6); },
            effect() { let boost = player.l.points.add(1).log10().add(1.5);
                if (player.l.level.gte(17)) {
let boost = boost.mul(player.l.essenceRank.add(1).pow(2)); 

}
                return boost
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        22: {
            title: "Essence Efficiency",
            description: "Reduce the level requirement based on Level Essence.",
            cost: new Decimal(10000),
            unlocked() { return player.l.level.gte(7); },
            effect() {
                return player.l.essence.add(1).log10().add(1).pow(0.85);
            },
            effectDisplay() { return "÷" + format(this.effect()); },
        },
        23: {
            title: "Level Synergized Points",
            description: "Upgrade 12 is multiplied by level^1.5.",
            cost: new Decimal(25000),
            unlocked() { return player.l.level.gte(8); },
            effect() {
                return player.l.level.add(1).pow(1.5);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        31: {
            title: "Level Divide Points",
            description: "Reduce level requirement scaling based on points.",
            cost: new Decimal(2e7),
            unlocked() { return player.l.rank.gte(1); },
            effect() {
                return player.points.add(1).log10().add(1).pow(0.25);
            },
            effectDisplay() { return "÷" + format(this.effect()); },
        },
    },

    milestones: {
        1: {
            requirementDescription: "1 Rank",
            effectDescription: "Boost point gain by ^2 and unlock a new upgrade.",
            done() { return player.l.rank.gte(1); },
        },
        2: {
            requirementDescription: "2 Ranks",
            effectDescription: "Change Level Essence formula to include points^0.3.",
            done() { return player.l.rank.gte(2); },
        },
    },

    update(diff) {
        // Essence Rank scaling logic
        if (player.l.level.gte(13)) {
            let essenceRankReq = Decimal.pow(1e6, player.l.essenceRank.add(1).pow(1.01));
            if (player.l.essence.gte(essenceRankReq)) {
                player.l.essence = player.l.essence.sub(essenceRankReq);
                player.l.essenceRank = player.l.essenceRank.add(1);
            }
        }
 if (player.l.level.gte(15)) {
     let essenceRankReq = essenceRankReq.div(1000) }
        // Calculate Essence Rank Effect (e.g., boosts essence gain)
        let essenceRankEffect = player.l.essenceRank.add(1).pow(3);

        // Existing level and essence updates
        let levelBoost = hasUpgrade("l", 11) ? upgradeEffect("l", 11) : new Decimal(1);
        let pointBoost = hasUpgrade("l", 12) ? upgradeEffect("l", 12) : new Decimal(1);
        let essenceBoost = player.l.level.gte(5)
            ? player.l.essence.add(1).log10().add(1).mul(essenceRankEffect)
            : new Decimal(1);
        if (player.l.rank.gte(1)) essenceBoost = essenceBoost.mul(10);

        player.l.points = player.l.points.add(diff * levelBoost * pointBoost * essenceBoost);

        let levelReduction = new Decimal(1);
        if (hasUpgrade("l", 22)) levelReduction = levelReduction.mul(upgradeEffect("l", 22));
        if (hasUpgrade("l", 31)) levelReduction = levelReduction.mul(upgradeEffect("l", 31));
        let levelReq = Decimal.pow(5, player.l.level.add(1)).div(levelReduction);

        if (player.l.points.gte(levelReq)) {
            player.l.points = player.l.points.sub(levelReq);
            player.l.level = player.l.level.add(1);
        }

        if (player.l.level.gte(5)) {
            let baseEssence = player.l.level.mul(player.l.points).pow(0.5);
            if (player.l.rank.gte(2)) {
                baseEssence = baseEssence.mul(player.points.add(1).pow(0.3));
            };
            if (player.l.essenceRank.gte(1)) { 
                baseEssence = baseEssence.mul(essenceRankEffect)  };
            player.l.essence = player.l.essence.add(baseEssence.mul(diff));
        }
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "resource-display",
                "upgrades",
                ["display-text", function() {
                    let levelReduction = new Decimal(1);
                    if (hasUpgrade("l", 22)) levelReduction = levelReduction.mul(upgradeEffect("l", 22));
                    if (hasUpgrade("l", 31)) levelReduction = levelReduction.mul(upgradeEffect("l", 31));

                    let levelReq = Decimal.pow(5, player.l.level.add(1)).div(levelReduction);
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
              ["display-text", function() { 
    if (player.l.level.gte(13)) {
        // Corrected essenceRankReq with easier scaling
        let essenceRankReq = Decimal.pow(1e6, player.l.essenceRank.add(1).pow(1.01));
        let progress = player.l.essence.div(essenceRankReq).mul(100).min(100); // Cap at 100%
        let essenceRankEffect = player.l.essenceRank.add(1).pow(3); // Essence Rank Effect

        return `
            <h3>Level Essence Rank: ${format(player.l.essenceRank)}</h3>
            <p>Essence Progress: ${format(player.l.essence)} / ${format(essenceRankReq)}</p>
            <div style="width: 100%; height: 20px; background-color: lightgray; border: 1px solid black;">
                <div style="width: ${progress.toFixed(2)}%; height: 100%; background-color: blue;"></div>
            </div>
            <br>
            <p>Effect: ${format(essenceRankEffect)}x boost to Level Essence gain</p>
        `;
    }
    return ""; // Return empty if Level < 13
}],
            ],
        },
        "Rank": {
            unlocked() { return player.l.level.gte(10); },
            content: [
                ["display-text", function() {
                    return `
                        <h3>Rank: ${format(player.l.rank)}</h3>
                        <p>Ranks reset progress but boost level points and essence.</p>
                    `;
                }],
                ["row", [["clickable", "rankUp"]]],
                "milestones",
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
                    player.l.essenceRank = new Decimal(0); // Reset Essence Rank too
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
