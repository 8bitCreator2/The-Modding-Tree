addLayer("e", { 
    name: "Energy", 
    symbol: "⚡",
    position: 0, 
    startData() { 
        return { 
            unlocked: true, 
            points: new Decimal(0),
            total: new Decimal(0), // Track total energy earned
            overcharge: new Decimal(0), 
            overchargeActive: false,
            upgrade11Bought: false,
            autoOvercharge: false, // For Autobuyer
        }
    },
    color: "#FFD700",
    resource: "Energy",
    type: "none", 
    row: 0, 

    update(diff) {
        let energyGain = this.passiveGeneration();
        if (player[this.layer].overchargeActive) energyGain = energyGain.times(this.getOverchargeBoost());

        player[this.layer].points = player[this.layer].points.add(energyGain.times(diff));
        player[this.layer].total = player[this.layer].total.add(energyGain.times(diff)); // Track total energy

        // Overcharge Storage Regeneration
        let maxOvercharge = new Decimal(1000);
        let regenRate = energyGain.div(10);
        if (hasUpgrade("e", 15)) regenRate = regenRate.times(2);
        if (!player[this.layer].overchargeActive) { 
            player[this.layer].overcharge = player[this.layer].overcharge.add(regenRate.times(diff)).min(maxOvercharge);
        } else { 
            let drainRate = 50;
            if (hasUpgrade("e", 16)) drainRate = drainRate / 2;
            player[this.layer].overcharge = player[this.layer].overcharge.sub(diff * drainRate).max(0);
            if (player[this.layer].overcharge.lte(0)) player[this.layer].overchargeActive = false;
        }

        // Autobuyer for Overcharge
        if (player[this.layer].autoOvercharge && player[this.layer].overcharge.gt(0) && !player[this.layer].overchargeActive) {
            player[this.layer].overchargeActive = true;
        }
    },

    passiveGeneration() { 
        let baseGain = new Decimal(1);
        if (hasUpgrade("e", 13)) baseGain = baseGain.times(3);
        let buyableBoost = tmp.e.buyables[11].effect;
        let upgradeBoost = hasUpgrade("e", 11) ? new Decimal(2) : new Decimal(1);
        return baseGain.times(buyableBoost).times(upgradeBoost);
    },

    getOverchargeBoost() {
        let boost = new Decimal(3);
        if (hasUpgrade("e", 17)) boost = boost.times(1.5);
        return boost;
    },

    // Clickable: Activate Overcharge
    clickables: {
        11: {
            title: "Activate Overcharge",
            display() { 
                return player[this.layer].overchargeActive ? 
                    `Overcharge is ACTIVE! (${format(this.getOverchargeBoost())}x Energy Gain)` : 
                    `Activate Overcharge for a boost to Energy Gain!<br>
                     Stored Overcharge: ${format(player[this.layer].overcharge)}/1000`;
            },
            canClick() { return player[this.layer].overcharge.gt(0) && !player[this.layer].overchargeActive },
            onClick() { player[this.layer].overchargeActive = true; }
        }
    },

    // Milestones
    milestones: {
        0: {
            requirementDescription: "Reach 5,000 total Energy",
            effectDescription: "Unlock Auto-Overcharge!",
            done() { return player[this.layer].total.gte(5000); },
            onComplete() { player[this.layer].autoOvercharge = true; }
        }
    },

    tabFormat: [
        "main-display",
        ["display-text", function() {
            return "Generating " + format(tmp.e.passiveGeneration) + " Energy per second.";
        }],
        "blank",
        ["display-text", function() {
            return `Stored Overcharge: ${format(player.e.overcharge)}/1000`;
        }],
        "clickables",
        "blank",
        "milestones",
        "blank",
        "upgrades",
        "blank",
        "buyables"
    ]
});
