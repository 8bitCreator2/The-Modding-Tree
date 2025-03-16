addLayer("s", {
    name: "Stardust",  
    symbol: "✨",      
    position: 0,      

    startData() {
        return {
            unlocked: true,          
            points: new Decimal(0), 
            condensatedPoints: new Decimal(0), 
        };
    },

    color: "#7A4B96", 

    requires: new Decimal(10),  
    resource: "Stardust",     
    baseResource: "points",    
    baseAmount() { return player.points }, 

    type: "normal",  
    exponent: 0.5,  

    gainMult() {
        let mult = new Decimal(1);

        if (hasUpgrade("s", 11)) mult = mult.times(upgradeEffect("s", 11)); 
        if (hasUpgrade("s", 12)) mult = mult.times(player.points.pow(0.35)); 
        if (hasUpgrade("s", 13)) mult = mult.times(upgradeEffect("s", 13).stardust); 
        if (hasUpgrade("s", 15)) mult = mult.times(upgradeEffect("s", 15).stardust); 
        if (hasUpgrade("s", 21)) mult = mult.times(upgradeEffect("s", 21)); 

        // Apply Condensated Stardust Effect
        mult = mult.times(tmp.s.effect);

        return mult;
    },

    gainExp() {
        return new Decimal(1);  
    },

    row: 0,  
    
    hotkeys: [
        {key: "s", description: "S: Reset for Stardust points", onPress() {
            if (canReset(this.layer)) doReset(this.layer);
        }},
    ],

    layerShown() {
        return true;  
    },

    tabFormat: {
        "Main Stardust": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text", "Harness the power of Stardust!"],
                "upgrades",
            ],
        },
        "Galactic Research": {
            unlocked() { return player.s.points.gte(1000) },  
            content: [
                "blank",
                ["display-text", "<h3>Welcome to Galactic Research!</h3>"],
                ["display-text", "More upgrades and mechanics will be available here in the future."],
                ["display-text", `Condensated Stardust formula: +1 per 100 Stardust.`],
                "blank",
                ["display-text", function() {
                    return "Condensated Stardust " + layerText("h2", "s", format(tmp.s.effect)) + "× boosts Stardust gain.";
                }],
                "blank",
                ["resource-display", "condensatedPoints"], 
            ],
        },
    },

    // --- UPGRADES ---
    upgrades: {
        11: {
            title: "Stardust Multiplier",  
            description: "Multiply your Matter by 3.",  
            cost: new Decimal(1),  

            effect() {
                return new Decimal(3);  
            },

            effectDisplay() {
                return "x" + format(this.effect());  
            },
        },

        12: {
            title: "Cosmic Expansion",  
            description: "Multiply Stardust gain by Matter.",  
            cost: new Decimal(3),  
            
            unlocked() { return hasUpgrade("s", 11) },  

            effect() {
                return player.points.pow(0.3).max(1);
            },

            effectDisplay() {
                return "x" + format(this.effect());  
            },
        },

        13: {
            title: "Celestial Amplification",  
            description: "Multiply Stardust gain by 1.5 and Matter gain by 2.",  
            cost: new Decimal(15),  
            
            unlocked() { return hasUpgrade("s", 12) },  

            effect() {
                return { stardust: new Decimal(1.5), points: new Decimal(2) };
            },

            effectDisplay() {
                return "x" + format(this.effect().stardust) + " Stardust, x" + format(this.effect().points) + " Matter";  
            },
        },

        14: {
            title: "Interstellar Influence",  
            description: "Multiply Matter gain by Stardust.",  
            cost: new Decimal(40),  
            
            unlocked() { return hasUpgrade("s", 13) },  

            effect() {
                return player.s.points.pow(0.35).max(1);  
            },

            effectDisplay() {
                return "x" + format(this.effect()) + " Matter";  
            },
        },

        15: {
            title: "Galactic Resonance",  
            description: "Multiply Stardust gain by 1.75 and Matter gain by 2.",  
            cost: new Decimal(75),  
            
            unlocked() { return hasUpgrade("s", 14) },  

            effect() {
                return { stardust: new Decimal(1.75), points: new Decimal(2) };
            },

            effectDisplay() {
                return "x" + format(this.effect().stardust) + " Stardust, x" + format(this.effect().points) + " Matter";  
            },
        },

        21: {
            title: "Self-Sustaining Stardust",  
            description: "Multiply Stardust gain by Stardust.",  
            cost: new Decimal(300),  
            
            unlocked() { return hasUpgrade("s", 15) },  

            effect() {
                return player.s.points.pow(0.2).max(1);  
            },

            effectDisplay() {
                return "x" + format(this.effect()) + " Stardust";  
            },
        },
    },

    // --- CONDENSATED STARDUST MECHANIC ---
    effect() {
        return player.s.condensatedPoints.plus(1).pow(0.25); 
    },

    update(diff) {
        if (player.s.points.gte(1000)) {
            player.s.condensatedPoints = player.s.points.div(100).floor();  
        }
    },
});
