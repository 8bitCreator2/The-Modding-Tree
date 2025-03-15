addLayer("s", {
    name: "Stardust", // Optional, name for reference
    symbol: "✨",      // Symbol to display on the layer's node
    position: 0,      // Horizontal position in the row (first position)
    
    startData() {
        return {
            unlocked: true,          // Layer is unlocked from the start
            points: new Decimal(0),  // Starting points (Stardust points)
        };
    },

    color: "#7A4B96", // Color of the Stardust layer's node

    requires: new Decimal(10), // Requires 10 points to unlock Stardust layer
    resource: "Stardust",      // The main resource of this layer (Stardust points)
    baseResource: "Matter",    // The base resource that Stardust is calculated from
    baseAmount() { return player.points }, // Get the amount of the base resource (Points)

    type: "normal", // Normal prestige (cost based on amount gained)
    exponent: 0.5,  // Exponent for Stardust points calculation

    gainMult() {
        let mult = new Decimal(1);
        return mult;  // Default multiplier for gaining Stardust points
    },

    gainExp() {
        return new Decimal(1);  // Default exponent for Stardust points
    },

    row: 0, // Row for this layer in the prestige tree (first row)
    
    hotkeys: [
        {key: "s", description: "S: Reset for Stardust points", onPress() {
            if (canReset(this.layer)) doReset(this.layer);
        }},
    ],

    layerShown() {
        return true;  // Always show this layer (can change based on conditions)
    },

    upgrades: {
        11: {
            title: "Stardust Multiplier",  // Title of the upgrade
            description: "Multiply your matter gain",  // What the upgrade does
            cost: new Decimal(1), // Cost of the upgrade in Stardust points

            effect() {
                return new Decimal(3);  // Multiplies points by 3
            },

            effectDisplay() {
                return "x" + format(this.effect());  // Display the effect
            },
        },
    }
});
