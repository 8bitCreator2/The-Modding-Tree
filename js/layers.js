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
        if (hasUpgrade("s", 12)) {
            mult = mult.times(player.points.pow(0.35)); // Apply Upgrade 12 effect
        }

         if (hasUpgrade("s", 13)) {
            mult = mult.times(1.5); 
        }
         if (hasUpgrade("s", 15)) {
            mult = mult.times(1.75); 
        }
         if (hasUpgrade("s", 21)) {
            mult = mult.times(upgradeEffect('s', 21)); 
              }
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
                "main-display",
                "blank",
                ["display-text", "<h3>Welcome to Galactic Research!</h3>"],
                ["display-text", "Convert excess Stardust into Condensated Stardust for powerful upgrades!"],
                "blank",
                ["clickable", 11], // Condensated Stardust Prestige
                "blank",
                ["display-text", () => `You have <h2>${format(player.s.cstardust)}</h2> Condensated Stardust.`],
            ],
        },
    },
  clickables: {
        11: {
            title: "Condensate Stardust",
            display() { return `Reset Stardust to gain <b>${format(tmp.s.getCondensatedGain)}</b> Condensated Stardust.`; },
            canClick() { return player.s.points.gte(1000); },
            onClick() {
                player.s.cstardust = player.s.cstardust.add(tmp.s.getCondensatedGain);
                player.s.points = new Decimal(0); // Reset Stardust
            },
            style: { "width": "200px", "height": "80px" },
        },
    },

    // --- FORMULA: How much Condensated Stardust you get ---
    getCondensatedGain() {
        return player.s.points.div(1000).pow(0.5).floor(); 
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
                return player.points.pow(0.25);
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
                return "x" + format(this.effect().stardust) + " Stardust, x" + format(this.effect().points) + " Points";  
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
            cost: new Decimal(100),  
            
            unlocked() { return hasUpgrade("s", 14) },  

            effect() {
                return { stardust: new Decimal(1.75), points: new Decimal(2) };
            },

            effectDisplay() {
                return "x" + format(this.effect().stardust) + " Stardust, x" + format(this.effect().points) + " Points";  
            },
        },
        21: {
            title: "Self-Sustaining Stardust",  
            description: "Multiply Stardust gain by Stardust.",  
            cost: new Decimal(250),  
            
            unlocked() { return hasUpgrade("s", 15) },  

            effect() {
                return player.s.points.pow(0.25).max(1);  
            },

            effectDisplay() {
                return "x" + format(this.effect()) + " Stardust";  
            },
        },
    }
});
