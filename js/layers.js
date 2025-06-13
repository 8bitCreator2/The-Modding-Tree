// Inversion Layer - Core Mechanics
addLayer("inversion", {
  name: "Inversion",
  symbol: "INV",
  position: 0,
  row: 0,
  color: "#3399FF", // Changed to blue
  startData() {
    return {
      unlocked: true,
      points: new Decimal(0),
      inverting: true,
      invertedEnergy: new Decimal(0),
      inversionSpeed: new Decimal(1),
    }
  },
  resource: "Inverters",
  type: "none",
  layerShown() {
    return true;
  },

  tabFormat: [
    "main-display",
    "blank",
    ["display-text", () => `You have <h2 style='color:#3399FF'>${formatWhole(player.inversion.invertedEnergy)}</h2> inverted energy.`],
    ["display-text", () => `Inverters boost your inverted energy gain.`],
    "clickables",
    "upgrades",
    "milestones",
    "blank",
    ["bar", "inversionBar"],
  ],

  bars: {
    inversionBar: {
      direction: RIGHT,
      width: 300,
      height: 30,
      progress() {
        if (!player.inversion.inverting) return 0;
        const drainRate = Decimal.pow(1.05, player.inversion.points);
        return player.points.div(player.points.add(drainRate)).toNumber();
      },
      display() {
        return player.inversion.inverting ? "Inverting energy..." : "Not inverting";
      },
      fillStyle: { backgroundColor: "#66B2FF" },
      baseStyle: { backgroundColor: "#222" },
    },
    inverterLevelBar: {
        direction: RIGHT,
        width: 300,
        height: 30,
        progress() {
            const inverters = player.inversion.points.toNumber();
            const level = Math.floor(inverters / 50);
            const levelStart = level * 50;
            const nextLevelReq = (level + 1) * 50;
            return (inverters - levelStart) / (nextLevelReq - levelStart);
        },
        display() {
            const inverters = player.i.inverters;
            const level = Math.floor(inverters / 50);
            const nextLevelReq = (level + 1) * 50;
            return `Inverter Level: ${level} | ${inverters} / ${nextLevelReq} inverters`;
        },
        fillStyle: { 'background-color': '#00ffcc' },
    },
  },

  clickables: {
    11: {
      title: "25% Speed",
      display: "Set Inversion Speed to 25%",
      canClick: () => true,
      onClick() {
        player.inversion.inversionSpeed = new Decimal(0.25);
      },
    },
    12: {
      title: "50% Speed",
      display: "Set Inversion Speed to 50%",
      canClick: () => true,
      onClick() {
        player.inversion.inversionSpeed = new Decimal(0.5);
      },
    },
    13: {
      title: "100% Speed",
      display: "Set Inversion Speed to 100%",
      canClick: () => true,
      onClick() {
        player.inversion.inversionSpeed = new Decimal(1);
      },
    },
    14: {
      title: "Toggle Inversion",
      display() {
        return player.inversion.inverting ? "Stop Inverting" : "Start Inverting";
      },
      canClick: () => true,
      onClick() {
        player.inversion.inverting = !player.inversion.inverting;
      },
    },
  },

  upgrades: {
    11: {
      title: "Boost Inverted Energy I",
      description: "Boost inverted energy gain by 2x.",
      cost: new Decimal(10),
      effect() {
        return new Decimal(2);
      },
    },
    12: {
      title: "Boost Inverted Energy II",
      description: "Boost inverted energy gain by 3x (requires Upgrade 11).",
      cost: new Decimal(50),
      unlocked() {
        return hasUpgrade("inversion", 11);
      },
      effect() {
        return new Decimal(3);
      },
    },
   13: {
  title: "Reduce Drain",
  description: "Reduces drain by 90%.",
  cost: new Decimal(200),
  effect() {
    return new Decimal(0.1); // Multiplies drain by 0.1 (90% reduction)
  },
},
    21: {
    title: "Inverted Resonance",
    description: "Inverted energy boosts point gain at a ^0.2 rate.",
    cost: new Decimal(500), // or whatever cost is appropriate
    effect() {
        return player.inversion.invertedEnergy.max(1).pow(0.2);
    },
    effectDisplay() {
        return "^" + format(upgradeEffect('inversion', 21));
    },
},
  },
  milestones: {
  1: {
    requirementDescription: "Get upgrade 21",
    effectDescription: "Unlocks Inverter level.",
    done() { return hasUpgrade('inversion', 21); },
    unlocked() { return hasUpgrade('inversion', 21); }, // Makes it visible only after upgrade 21
  },
  
},

  update(diff) {
    if (player.inversion.inverting) {
     let baseDrain = Decimal.pow(1.05, player.inversion.points).mul(diff);
if (hasUpgrade("inversion", 13)) baseDrain = baseDrain.mul(upgradeEffect("inversion", 13));
const drain = baseDrain.mul(player.inversion.inversionSpeed);
const actualDrain = Decimal.min(drain, player.points);
player.points = player.points.sub(actualDrain);
player.inversion.points = player.inversion.points.add(actualDrain.sqrt());
    }

    let gain = player.inversion.points.mul(0.01);
    if (hasUpgrade("inversion", 11)) gain = gain.mul(upgradeEffect("inversion", 11));
    if (hasUpgrade("inversion", 12)) gain = gain.mul(upgradeEffect("inversion", 12));
    gain = gain.mul(diff);
    player.inversion.invertedEnergy = player.inversion.invertedEnergy.add(gain);
  },
});
