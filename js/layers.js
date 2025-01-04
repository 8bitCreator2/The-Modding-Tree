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
            levelRebirth: new Decimal(0),  // Track level rebirth count
            rebirthUnlocked: false, // Track if rebirth is unlocked
        }
    },
    color: "#8A2BE2", // Purple color for the layer (Level Rebirth)
    resource: "level points",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "none",
    row: 1,
    layerShown() { return true },

    tabStyle: {
        background: "#8A2BE2", // Purple background for the tab
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
                let baseEffect = player.points.add(1).log10().add(1).pow(1.2);
                if (hasUpgrade("l", 23)) {
                    let levelBoost = player.l.level.add(1).pow(0.8); // Effect from Upgrade 23
                    baseEffect = baseEffect.mul(levelBoost);
                }
                return baseEffect;
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
                return "x" + format(this.effect());
            },
        },
        31: {
            title: "Upgrade Booster",
            description: "Boost the first upgrade's effect by a factor of 2 per Upgrade Booster.",
            cost: new Decimal(30),
            unlocked() {
                return player.l.level.gte(9); // Unlocked at level 9
            },
            effect() {
                return new Decimal(2).pow(player.l.levelRebirth);
            },
            effectDisplay() {
                return "x" + format(this.effect()) + " to Upgrade 11 effect";
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

        // Check if the player can level up (level cap enforced at 10)
        let levelReduction = hasUpgrade("l", 22) ? upgradeEffect("l", 22) : new Decimal(1);
        let levelReq = new Decimal(5).pow(player.l.level.add(1)).div(levelReduction);

        if (player.l.level.gte(10 + player.l.levelRebirth)) {  // Hard cap at Level 10 + rebirths
            levelReq = new Decimal(5).pow(10 + player.l.levelRebirth);  // Set the level requirement for cap
            player.l.level = new Decimal(10 + player.l.levelRebirth);  // Set cap at 10 + rebirths
        }

        if (player.l.points.gte(levelReq) && player.l.level.lt(10 + player.l.levelRebirth)) {
            player.l.points = player.l.points.sub(levelReq);
            player.l.level = player.l.level.add(1);
        }

        // Gain Level Essence (unlocks at level 5)
        if (player.l.level.gte(5)) {
            let essenceGain = player.l.level.mul(player.l.points).pow(0.5);
            player.l.essence = player.l.essence.add(essenceGain.mul(diff));
        }
    },

    // Display Level Essence and Level Point Boost
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
                    let rebirthProgress = player.l.level.gte(10 + player.l.levelRebirth) ? `Level Cap Reached! Rebirth to progress further.` : '';
                    return `
                        <h3>Level: ${format(player.l.level)}</h3>
                        <p>Level Points: ${format(player.l.points)} / ${format(levelReq)}</p>
                        <div style="width: 100%; height: 20px; background-color: lightgray; border: 1px solid black;">
                            <div style="width: ${progress.toFixed(2)}%; height: 100%; background-color: green;"></div>
                        </div>
                        <br>
                        <h4>Level Essence: ${format(player.l.essence)}</h4>
                        <p>Level Essence Boost: x${format(essenceBoost)}</p>
                        <h4>Player Points Boost (Upgrade 21): ${hasUpgrade("l", 21) ? "x" + format(upgradeEffect("l", 21)) : "N/A"}</h4>
                        <br>
                        <h4>Rebirth Progress: ${rebirthProgress}</h4>
                        ${player.l.rebirthUnlocked ? `<button onclick="performRebirth()">Rebirth for Power</button>` : ''}
                    `;
                }],
            ],
        },
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer]?.row > this.row) {
            layerDataReset("l", ["level", "essence", "levelRebirth"]);
        }
    },

    performRebirth() {
        if (player.l.level.gte(10 + player.l.levelRebirth)) {
            player.l.levelRebirth = player.l.levelRebirth.add(1);
            player.l.level = new Decimal(1); // Reset level to 1 after rebirth
            player.l.points = new Decimal(0); // Reset points after rebirth
            player.l.essence = new Decimal(0); // Reset essence after rebirth
            player.l.rebirthUnlocked = true; // Unlock rebirth button after performing a rebirth
        }
    },
});
