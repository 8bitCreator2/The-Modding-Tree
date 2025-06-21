addLayer("n", {
    name: "Normal Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#f5d769",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Energetic Points", // Name of prestige currency
    baseResource: "Energy", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	    if (hasUpgrade("n", 13)) mult = mult.mul(1.5);
	    if (hasUpgrade("n", 22)) mult = mult.mul(upgradeEffect("n", 22));
	    if (hasUpgrade("n", 23)) mult = mult.mul(upgradeEffect("n", 23));
	    if (hasUpgrade("n", 31)) mult = mult.mul(2.5)
	    if (hasUpgrade("n", 33)) mult = mult.mul(3)
	    if (hasUpgrade("t", 11)) mult = mult.mul(3)
	    if (hasUpgrade("t", 12)) mult = mult.mul(1.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	passiveGeneration() { 
		let passive = 0 
		if (hasMilestone("n", 1)) passive = passive.add(1);
		return passive 
		 },
    layerShown(){return true},
     upgrades: {
    11: {
      title: "Energy Amplifier I",
      description: "3x Energy",
      cost: new Decimal(1),
      unlocked() {
        return true;
      },
     
    }, 
	      12: {
      title: "Energy Amplifier II",
      description: "Energy is being boosted by energetic Points ",
      cost: new Decimal(5),
      effect(){ 
	      let eff = player.n.points.add(1).pow(0.375)
	      return eff
	      },
	effectDisplay() { return "x" + format(upgradeEffect("n", 12))   },
      unlocked() {
        return hasUpgrade("n", 11);
      },
     
    },
	     13: {
      title: "More Energetic",
      description: "1.5x energetic points",
      cost: new Decimal(25),
      unlocked() {
        return hasUpgrade("n", 12);
      },
     
    },
	    21: {
      title: "Energy Amplifier III",
      description: "Energy boosts itself",
      cost: new Decimal(50),
      effect(){ 
	      let eff = player.points.add(1).pow(0.15)
	      return eff
	      },
	effectDisplay() { return "x" + format(upgradeEffect("n", 21))   },
      unlocked() {
        return hasUpgrade("n", 13);
      },
     
    },
	     22: {
      title: "Energetic Boost",
      description: "Energy boosts Energetic Points",
      cost: new Decimal(125),
      effect(){ 
	      let eff = player.points.add(1).pow(0.165)
	      return eff
	      },
	effectDisplay() { return "x" + format(upgradeEffect("n", 22))   },
      unlocked() {
        return hasUpgrade("n", 21);
      },
     
    },
	      23: {
      title: "Energetic Amplifier I",
      description: "Energetic points boosts itself",
      cost: new Decimal(300),
      effect(){ 
	      let eff = player.n.points.add(1).pow(0.185)
	      return eff
	      },
	effectDisplay() { return "x" + format(upgradeEffect("n", 23))   },
      unlocked() {
        return hasUpgrade("n", 22);
      },
     
    },
	     31: {
      title: "Energetic Amplifier II",
      description: "2.5x Energetic points",
      cost: new Decimal(1000),
      unlocked() {
        return hasUpgrade("n", 23);
      },
     
    },
	     32: {
      title: "Energy Amplifier IV",
      description: "5x Energy",
      cost: new Decimal(2500),
      unlocked() {
        return hasUpgrade("n", 31);
      },
     
    },
	     33: {
      title: "Energy Condensation",
      description: "2x Energy 3x Energetic Points (Unlock a new layer)",
      cost: new Decimal(50000),
      unlocked() {
        return hasUpgrade("n", 32);
      },
     
    },
	     41: {
      title: "Thermal Energy",
      description: "Energy Boost thermal Points",
      cost: new Decimal(1e10),
      unlocked() {
        return hasUpgrade("n", 33) && hasMilestone("t", 1);
      },
		     effect() {
			     let eff = player.points.add(1).pow(0.05)
			     return eff
			      },
		     effectDisplay() { "x" + format(upgradeEffect("n", 41)) },
     
    },
	     42: {
      title: "Energy Amplifier II 2.0 ",
      description: "Energy is boosted by energetic points but in this case way more reduced",
      cost: new Decimal(1e11),
      unlocked() {
        return hasUpgrade("n", 41) && hasMilestone("t", 1);
      },
		     effect() {
			     let eff = player.n.points.add(1).pow(0.175)
			     return eff
			      },
		     effectDisplay() { "x" + format(upgradeEffect("n", 42)) },
     
    },
	     43: {
      title: "Thermal Energy II",
      description: "Energetic Points boost thermal Energy",
      cost: new Decimal(5.5e11),
      unlocked() {
        return hasUpgrade("n", 42) && hasMilestone("t", 1);
      },
		     effect() {
			     let eff = player.n.points.add(1).pow(0.125)
			     return eff
			      },
		     effectDisplay() { "x" + format(upgradeEffect("n", 43)) },
     
    },
		},
	milestones: {
		1: {
			requirementDescription: "1e10 Energetic Points",
			effectDescription: " Unlocks passive generation",
			done() { return player.n.points.gte(1e10) 
				},
			},
		},
	})
	
		
