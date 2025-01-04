addLayer("l", {
    name: "Levels",
    symbol: "L",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            level: new Decimal(0),
            essence: new Decimal(0), // New resource: Level Essence
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
                    baseBoost = baseBoost.mul(levelBoost); // Boost effect by level
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
    },

    // Add Level Essence mechanics
    update(diff) {
        // Apply level multipliers
        let levelBoost = hasUpgrade("l", 11) ? upgradeEffect("l", 11) : new Decimal(1);
        let pointBoost = hasUpgrade("l", 12) ? upgradeEffect("l", 12) : new Decimal(1);

        // Include Level Essence boost (unlocks at level 5)
        let essenceBoost = player.l.level.gte(5) 
            ? player.l.essence.add(1).log10().add(1) 
            : new Decimal(1);

        // Gain level points passively
        player.l.points = player.l.points.add(diff * levelBoost * pointBoost * essenceBoost);

        // Check if the player can level up
        let levelReq = new Decimal(5).pow(player.l.level.add(1));
        if (player.l.points.gte(levelReq)) {
            player.l.points = player.l.points.sub(levelReq); // Subtract points required
            player.l.level = player.l.level.add(1); // Increment level
        }

        // Gain Level Essence passively (unlocks at level 5)
        if (player.l.level.gte(5)) {
            let essenceGain = player.l.level.mul(player.l.points).pow(0.5);
            player.l.essence = player.l.essence.add(essenceGain.mul(diff));
        }
    },

    // Display Level Essence in the Main Tab
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "resource-display",
                "upgrades",
                ["display-text", function() {
                    let levelReq = new Decimal(5).pow(player.l.level.add(1));
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
