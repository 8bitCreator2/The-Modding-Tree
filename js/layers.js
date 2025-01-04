addLayer("l", {
    name: "Levels",                        // Name of the layer
    symbol: "L",                           // Symbol for the layer
    position: 0,                           // Position of the layer in the tree
    startData() {
        return {
            unlocked: true,                // Starts unlocked
            points: new Decimal(0),        // Level points
            level: new Decimal(0),         // Starting at level 0
        }
    },
    color: "#008CFF",                      // Blue color for the layer
    resource: "level points",               // Level points are the resource of this layer
    baseResource: "points",                 // Resource required to advance in this layer
    baseAmount() { return player.points },  // Base amount of points required for this layer
    type: "static",                         // Static layer
    requires: new Decimal(5),               // First level requires 5 level points
    exponent: 1.2,                          // Exponent for scaling level progression
    row: 1,                                 // Position in the tree (can move it down in future layers)
    layerShown() { return true },           // This layer is always visible

    upgrades: {
        11: {
            title: "Level Boost",
            description: "Increase level points gained based on current level.",
            cost: new Decimal(1),           // Cost for this upgrade
            effect() {
                return player[this.layer].level.add(1).pow(0.75);
            },
            effectDisplay() { 
                return "x" + format(this.effect()) + " to level points"; 
            }
        },
    },

    gainMult() {
        let mult = new Decimal(1);            // Base multiplier
        if (hasUpgrade("l", 11)) mult = mult.mul(upgradeEffect("l", 11));  // Apply Level Boost upgrade
        return mult;
    },

    gainExp() {
        return new Decimal(1);                // No additional scaling for experience
    },

    // Display level bar and level points requirements
    display() {
        let levelReq = new Decimal(5).pow(player.l.level);  // Level requirements are 5^level
        let progress = player.l.points.div(levelReq).mul(100);  // Progress bar percentage
        return `
            <h3>Level: ${format(player.l.level)}</h3>
            <p>Level Points: ${format(player.l.points)} / ${format(levelReq)} required for next level.</p>
            <div style="width: 100%; height: 20px; background-color: lightgray; border: 1px solid #000;">
                <div style="width: ${progress}%; height: 100%; background-color: green;"></div>
            </div>
            <br>
            <h4>Level Multiplier: x${format(Decimal.pow(2, player.l.level))}</h4>
        `;
    },

    update(diff) {
        // Increase level points over time or through actions
        player.l.points = player.l.points.add(diff);
        // Check if the player has enough level points to level up
        let levelReq = new Decimal(5).pow(player.l.level);
        if (player.l.points.gte(levelReq)) {
            player.l.level = player.l.level.add(1);  // Level up
            player.l.points = new Decimal(0);  // Reset level points after leveling up
        }
    },

    doReset(resettingLayer) {
        if (resettingLayer >= this.row) {
            // Reset only level points, keep the level
            layerDataReset("l", ["points"]);
        }
    },

    tabFormat: {
        "Main Tab": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "upgrades",  // Show the available upgrades
            ],
        },
    },
});
