addLayer("s", {
    name: "stellar", // Layer name
    symbol: "S", // Display symbol for the layer
    position: 1, // Position in the tree
    startData() { return {
        unlocked: true,
        points: new Decimal(0), // Stellar Matter points
    }},
    color: "#FFD700", // Color for the layer
    requires: new Decimal(10), // Requirement for unlocking this layer
    resource: "stellar matter", // Name of the resource
    baseResource: "points", // Resource based on points
    baseAmount() { return player.points }, // Base amount of points
    type: "normal", // Normal type, scaling as more points are gained
    exponent: 0.5, // Exponent for stellar matter gain
    gainMult() { return new Decimal(1) }, // Gain multiplier for stellar matter
    gainExp() { return new Decimal(1) }, // Exponent for stellar matter gain
    row: 1, // Row on the tree
    hotkeys: [
        {key: "s", description: "S: Reset for stellar matter", onPress(){ if (canReset(this.layer)) doReset(this.layer) }},
    ],
    layerShown() { return true },
    upgrades: {
        11: {
            title: "Core Fusion",
            description: "Boosts Points & Stellar Matter by x1.2",
            cost: new Decimal(10),
            effect() { return Decimal.pow(1.2, getBuyableAmount("s", 11)); },
            effectDisplay() { return "x" + format(this.effect()) },
            unlocked() { return true },
        },
        12: {
            title: "White Dwarf",
            description: "Increases Base Points Gain by +1 for each purchase",
            cost: new Decimal(100),
            effect(x) { return new Decimal(1); },
            display() {
                return "Increases Base Points Gain by +1 for each purchase" + 
                       "<br>Cost: " + format(this.cost()) + " Stellar Matter" + 
                       "<br>Bought: " + format(getBuyableAmount("s", 12));
            },
            canAfford() { return player.s.points.gte(this.cost()); },
            buy() {
                player.s.points = player.s.points.sub(this.cost());
                addBuyables("s", 12, 1);
                // Add +1 base points gain for each purchase
                player.pointsBaseGain = player.pointsBaseGain.add(1);  
            },
            unlocked() { return getBuyableAmount("s", 11).gte(3); }, // Unlocks after buying Buyable 11, 3 times
        },
    },
    buyables: {
        11: {
            title: "Core Fusion",
            cost(x) { return new Decimal(10).times(Decimal.pow(2, x)); },
            effect(x) { return Decimal.pow(1.2, x); },
            display() { 
                return "Boosts Points & Stellar Matter by x" + format(this.effect()) + 
                       "<br>Cost: " + format(this.cost()) + " Stellar Matter" +
                       "<br>Bought: " + format(getBuyableAmount("s", 11));
            },
            canAfford() { return player.s.points.gte(this.cost()); },
            buy() {
                player.s.points = player.s.points.sub(this.cost());
                addBuyables("s", 11, 1);
            },
            unlocked() { return true },
        },
        12: {
            title: "Star Fragment",
            cost(x) { return new Decimal(100).times(Decimal.pow(2, x)); },
            effect(x) { return Decimal.pow(1.5, x); },
            display() { 
                return "Boosts Points by x" + format(this.effect()) +
                       "<br>Cost: " + format(this.cost()) + " Stellar Matter" +
                       "<br>Bought: " + format(getBuyableAmount("s", 12));
            },
            canAfford() { return player.s.points.gte(this.cost()); },
            buy() {
                player.s.points = player.s.points.sub(this.cost());
                addBuyables("s", 12, 1);
            },
            unlocked() { return getBuyableAmount("s", 11).gte(3); }, // Unlock after buying Buyable 11 three times
        },
    },
});
