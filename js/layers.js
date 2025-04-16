// Inverter Layer - Fully Functional TMT Style
addLayer("inverter", {
  name: "Inverters", // Updated resource layer name to 'Inverters'
  symbol: "INV",
  position: 1,
  row: 1,
  color: "#FF6666",
  type: "none",
  resource: "Inverters", // Added base resource as 'Inverters'

  startData() {
    return {
      unlocked: true,
      points: new Decimal(0),
      inverting: false,
      invertedEnergy: new Decimal(0), // Track inverted energy
    }
  },

  layerShown() {
    return true;
  },

  tabFormat: [
    "main-display",
    "blank",
    ["display-text", () => `You have <h2 style='color:#FF6666'>${formatWhole(player.inverter.invertedEnergy)}</h2> inverted energy.`],
    "blank",
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
        console.log("Inversion toggled:", player.inverter.inverting); // Debugging output
      },
    },
  },

  upgrades: {
    11: {
      title: "Phase Inversion",
      description: "Reduces drain of energy by 20%.",
      cost: new Decimal(5),
    },
    12: {
      title: "Antiflux Feedback",
      description: "Further reduces drain of energy by 30%.",
      cost: new Decimal(10),
    },
  },

  update(diff) {
    // Drain reduction multiplier from upgrades
    let drainMult = new Decimal(1);
    if (hasUpgrade("inverter", 11)) drainMult = drainMult.mul(0.8);
    if (hasUpgrade("inverter", 12)) drainMult = drainMult.mul(0.7);

    if (player.inverter.inverting) {
      const baseDrain = Decimal.pow(1.05, player.inverter.points).mul(diff);
      const drain = baseDrain.mul(drainMult);
      const actualDrain = Decimal.min(drain, player.points);
      console.log("Draining", actualDrain.toString(), "from energy"); // Debugging output
      player.points = player.points.sub(actualDrain);
      player.inverter.points = player.inverter.points.add(actualDrain.div(3));
      console.log("Added", actualDrain.div(3).toString(), "to inverter points"); // Debugging output
    }

    // Generate inverted energy at 1% of inverter points per second
    const gain = player.inverter.points.mul(0.01).mul(diff);
    player.inverter.invertedEnergy = player.inverter.invertedEnergy.add(gain);
    console.log("Generated inverted energy:", gain.toString());
  },
});
