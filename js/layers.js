// Example of a unique mechanic layer in The Modding Tree for an Energy-based game

addLayer("inverter", {
  name: "Inverter",
  symbol: "INV",
  position: 1,
  row: 1,
  startData() {
    return {
      unlocked: true,
      points: new Decimal(0),
      inverting: false,
    }
  },
  color: "#FF6666",
  requires: new Decimal(10), // Requires 10 player points (Energy) to unlock
  resource: "inverted energy",
  baseResource: "points", // Base resource is player points (Energy)
  baseAmount() { return player.points },
  type: "static", // Because it scales with how many you have
  exponent: 1.5,

  effect() {
    let eff = player[this.layer].points.add(1).pow(0.5)
    return eff
  },
  effectDescription() {
    return "which divides energy gain by x but multiplies all generator upgrades by √x"
  },

  layerShown() {
    return true
  },

  doReset(resettingLayer) {
    if (layers[resettingLayer].row > this.row) {
      let keep = []
      layerDataReset(this.layer, keep)
    }
  },

  upgrades: {
    11: {
      title: "Phase Inversion",
      description: "Inverted energy boosts generator speed (x^0.3).",
      cost: new Decimal(1),
      effect() {
        return player[this.layer].points.add(1).pow(0.3)
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
      canClick() { return true },
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
