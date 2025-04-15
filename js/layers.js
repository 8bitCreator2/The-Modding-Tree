// Inverter Layer - TMT Style Updated

addLayer("inverter", {
  name: "Inverter",
  symbol: "INV",
  position: 1,
  row: 1,
  color: "#FF6666",
  type: "none",

  startData() { return {
    unlocked: true,
    points: new Decimal(0),
    inverting: false,
  }},

  layerShown() { return true },

  tabFormat: [
    "main-display",
    "blank",
    ["display-text", () => `You have <h2 style='color:#FF6666'>${format(player.inverter.points)}</h2> inverted energy.`],
    "blank",
    "clickables",
    "upgrades",
    "blank",
    ["bar", "inversionBar"],
  ],

  effect() {
    return player.inverter.points.add(1).sqrt()
  },

  effectDescription() {
    return `which divides energy gain by x but multiplies all generator upgrades by √x`
  },

  bars: {
    inversionBar: {
      direction: RIGHT,
      width: 300,
      height: 30,
      progress() {
        if (!player.inverter.inverting) return 0
        return player.points.div(player.points.add(Decimal.pow(1.05, player.inverter.points))).toNumber()
      },
      display() {
        return player.inverter.inverting ? "Inverting energy..." : "Not inverting"
      },
      fillStyle: { "background-color": "#FF9999" },
      baseStyle: { "background-color": "#444" },
    },
  },

  upgrades: {
    11: {
      title: "Phase Inversion",
      description: "Inverted energy boosts generator speed (x^0.3).",
      cost: new Decimal(1),
      effect() {
        return player.inverter.points.add(1).pow(0.3)
      },
      effectDisplay() { return format(this.effect()) + "x" },
    },
    12: {
      title: "Antiflux Feedback",
      description: "Every Inverter reset adds +10% to generator efficiency permanently.",
      cost: new Decimal(5),
    },
  },

  clickables: {
    11: {
      title: "Invert Mode",
      display() {
        return player.inverter.inverting ? "Stop Inverting" : "Start Inverting"
      },
      canClick: () => true,
      onClick() {
        player.inverter.inverting = !player.inverter.inverting
      },
    },
  },

  update(diff) {
    if (player.inverter.inverting) {
      let drain = diff.mul(Decimal.pow(1.05, player.inverter.points)).min(player.points)
      player.points = player.points.sub(drain)
      player.inverter.points = player.inverter.points.add(drain.div(1e6))
    }
  },
});
