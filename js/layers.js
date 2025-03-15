addLayer("s", {  
    name: "Stardust",  
    symbol: "☄️",  // Stardust symbol  
    color: "#FFD700",  
    row: 1,  // Appears in row 1 (above points)  

    startData() { return {  
        unlocked: true,  // Always unlocked  
        points: new Decimal(0),  // Stardust currency  
        total: new Decimal(0),  // Total Stardust collected  
        best: new Decimal(0),  // Highest Stardust count ever  
    }},  

    resource: "stardust",  
    baseResource: "points",  // Resets points to gain Stardust  
    baseAmount() { return player.points },  // The amount of points the player has  

    requires: new Decimal(10),  // Unlocks at 10 points  
    type: "normal",  
    exponent: 0.5,  // Slightly stronger scaling  

    gainMult() {  // Stardust gain multiplier  
        let mult = new Decimal(1);  
        if (hasUpgrade('s', 11)) mult = mult.times(1.5); // Upgrade 11 boost  
        if (hasUpgrade('s', 12)) mult = mult.times(2);   // Upgrade 12 boost  
        return mult;  
    },  

    gainExp() { return new Decimal(1); },  

    layerShown() { return true },  // Always visible  

    upgrades: {  
        11: {  
            title: "Cosmic Boost",  
            description: "Multiply Stardust gain by 1.5x.",  
            cost: new Decimal(2),  
            effect() { return new Decimal(1.5); },  
            effectDisplay() { return "x" + format(this.effect()); }  
        },  
        12: {  
            title: "Galactic Energy",  
            description: "Multiply Stardust gain by 2x.",  
            cost: new Decimal(5),  
            effect() { return new Decimal(2); },  
            effectDisplay() { return "x" + format(this.effect()); },  
        },  
        13: {  
            title: "Stardust Synergy",  
            description: "Stardust boosts point generation.",  
            cost: new Decimal(10),  
            effect() { return player.s.points.add(1).log10().add(1); },  
            effectDisplay() { return "x" + format(this.effect()); },  
        },  
    },  
});  
