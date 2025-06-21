addLayer("t", {
    name: "Thermal Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FA661C",
    requires: new Decimal(2e6), // Can be a function that takes requirement increases into account
    resource: "Thermal Energetic Points", // Name of prestige currency
    baseResource: "Energy", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	if (hasUpgrade("t", 13)) mult = mult.mul(2);
	if (hasUpgrade("t", 41)) mult = mult.mul(upgradeEffect("n", 41);
	if (hasUpgrade("t", 43)) mult = mult.mul(upgradeEffect("n", 43);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){let shown = false
                if (hasUpgrade("n", 33) || player.t.unlocked) shown = true 
		return shown },
	upgrades: {
    11: {
      title: "THERMAL POWERR",
      description: "5x energy 3x Energetic points",
      cost: new Decimal(1),
      unlocked() {
        return player.t.unlocked;
      },
	     },
		12: {
      title: "THERMAL POWERR II",
      description: "3x energy 1.5x Energetic points",
      cost: new Decimal(2),
      unlocked() {
        return hasUpgrade("t", 11);
      },
	     },
		13: {
      title: "thermal Expansion",
      description: "2x Thermal points ",
      cost: new Decimal(4),
      unlocked() {
        return hasUpgrade("t", 12);
      },
	     },
		 },
	milestones: {
		1: {
			requirementDescription: "5 Thermal Points",
			effectDescription: " 2x Energy (unlock a row of energetic upgrades and unlock energetic milestones)",
			done() { return player.t.points.gte(5) 
				},
			},
		},
})
