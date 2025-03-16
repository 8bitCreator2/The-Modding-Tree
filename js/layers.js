addLayer("s", {
    name: "Stardust", // Optional, name for reference
    symbol: "✨",      // Symbol to display on the layer's node
    position: 0,      // Horizontal position in the row (first position)
    
    startData() {
        return {
            unlocked: true,          // Layer is unlocked from the start
            points: new Decimal(0),  // Starting points (Stardust points)
            condensed: new Decimal(0), // Condensed Stardust
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
        }}],
        
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
            unlocked() { return player.s.points.gte(1000) },  // Unlock at 1000 Stardust
            content: [
                "blank",
                ["display-text", "<h3>Welcome to Galactic Research!</h3>"],
                ["raw-html", function() {
                    if (player.tab == "s") return "You have " + 
                    layerText("h2", "s", format(player.s.condensed)) + " Condensed Stardust, which is growing by " + 
                    layerText("h2", "s", format(player.s.points.log(10).pow(0.5))) + " per second.";
                }],
                "blank",
                ["upgrades", "galacticResearch"],  // Make sure upgrades are inside Galactic Research tab
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
                return player.points.pow(0.35);
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
                return player.s.points.pow(0.4).max(1);  
            },

            effectDisplay() {
                return "x" + format(this.effect()) + " Matter";  
            },
        },
         15: {
            title: "Galactic Resonance",  
            description: "Multiply Stardust gain by 1.75 and Matter gain by 2.",  
            cost: new Decimal(200),  
            
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
            cost: new Decimal(300),  
            
            unlocked() { return hasUpgrade("s", 15) },  

            effect() {
                return player.s.points.pow(0.2).max(1);  
            },

            effectDisplay() {
                return "x" + format(this.effect()) + " Stardust";  
            },
        },

        // Galactic Research Upgrades (Upgrade 101) will go here

        101: {
            title: "Condensed Stardust Boost",
            description: "Condensed Stardust boosts Stardust gain by Stardust ^ X (X = Condensed Stardust).",
            cost() { return player.s.condensed },  // Costs Condensed Stardust
            effect() {
                return player.s.condensed;
            },
            effectDisplay() {
                return "^" + format(this.effect());
            },
            unlocked() { return player.s.points.gte(1000) },
            layerShown() { return player.tab == "s" && player.s.points.gte(1000) }, // Show only in Galactic Research tab
        },
    }
});
