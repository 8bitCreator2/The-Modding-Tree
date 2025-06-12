// Inversion Layer - Core Mechanics
addLayer("inversion", {
  name: "Inversion",
  symbol: "INV",
  position: 0,
  row: 0,
  color: "#FF6666",
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
    ["display-text", () => `You have <h2 style='color:#FF6666'>${formatWhole(player.inversion.invertedEnergy)}</h2> inverted energy.`],
    ["display-text", () => `Inverters boost your inverted energy gain.`],
    "clickables",
    "upgrades",
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
      fillStyle: { backgroundColor: "#FF9999" },
      baseStyle: { backgroundColor: "#222" },
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
  },

  update(diff) {
    if (player.inversion.inverting) {
      const baseDrain = Decimal.pow(1.05, player.inversion.points).mul(diff);
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
