// Inverter Layer - Fully Functional TMT Style
addLayer("inverter", {
  name: "Inverter",
  symbol: "INV",
  position: 1,
  row: 1,
  color: "#FF6666",
  type: "none",

  startData() {
    return {
      unlocked: true,
      points: new Decimal(0),
      inverting: false,
    }
  },

  layerShown() {
    return true;
  },

  tabFormat: [
    "main-display",
    "blank",
    ["display-text", () => `You have <h2 style='color:#FF6666'>${formatWhole(player.inverter.points)}</h2> inverted energy.`],
    "blank",
    "clickables",
    "upgrades",
    "blank",
    ["bar", "inversionBar"],
  ],

  effect() {
    return player.inverter.points.add(1).sqrt();
  },

  effectDescription() {
    return `which divides energy gain by √x but boosts generator upgrades by √x`;
  },

  bars: {
    inversionBar: {
      direction: RIGHT,
      width: 300,
      height: 30,
      progress() {
        if (!player.inverter.inverting) return 0;
        const drainRate = Decimal.pow(1.05, player.inverter.points);
        return player.points.div(player.points.add(drainRate)).toNumber();
      },
      display() {
        return player.inverter.inverting ? "Inverting energy..." : "Not inverting";
      },
      fillStyle: { backgroundColor: "#FF9999" },
      baseStyle: { backgroundColor: "#222" },
    },
  },

  clickables: {
    11: {
      title: "Toggle Inversion",
      display() {
        return player.inverter.inverting ? "Stop Inverting" : "Start Inverting";
      },
      canClick() {
        return true;
      },
      onClick() {
        player.inverter.inverting = !player.inverter.inverting;
      },
    },
  },

  upgrades: {
    11: {
      title: "Phase Inversion",
      description: "Inverted energy boosts generator speed (x^0.3).",
      cost: new Decimal(1),
      effect() {
        return player.inverter.points.add(1).pow(0.3);
      },
      effectDisplay() {
        return format(this.effect()) + "x";
      },
    },
    12: {
      title: "Antiflux Feedback",
      description: "Each inverter point gives +10% generator efficiency.",
      cost: new Decimal(5),
    },
  },

  update(diff) {
    if (player.inverter.inverting) {
      const drain = Decimal.pow(1.05, player.inverter.points).mul(diff);
      const actualDrain = Decimal.min(drain, player.points);
      player.points = player.points.sub(actualDrain);
      player.inverter.points = player.inverter.points.add(actualDrain.div(1e6));
    }
  },
});
