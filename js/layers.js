// Inverter Layer - Fully Functional TMT Style
addLayer("inverter", {
  name: "Inverters",
  symbol: "INV",
  position: 1,
  row: 1,
  color: "#FF6666",
  type: "none",
  resource: "Inverters",

  startData() {
    return {
      unlocked: true,
      points: new Decimal(0),
      inverting: false,
      invertedEnergy: new Decimal(0),
      overcloakedEnergy: new Decimal(0),
      inversionSpeed: new Decimal(1),
    }
  },

  layerShown() {
    return true;
  },

  tabFormat: [
    "main-display",
    "blank",
    ["display-text", () => `You have <h2 style='color:#FF6666'>${formatWhole(player.inverter.invertedEnergy)}</h2> inverted energy.`],
    ["display-text", () => `Overcloaking consumes inverted energy to reduce energy drain by 10% per overcloaked energy. (Max 5)`],
    "blank",
    "clickables",
    "upgrades",
    "blank",
    ["bar", "inversionBar"],
    ["bar", "overcloakBar"],
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
    overcloakBar: {
      direction: RIGHT,
      width: 300,
      height: 30,
      progress() {
        return player.inverter.overcloakedEnergy.div(player.inverter.invertedEnergy.max(1)).toNumber();
      },
      display() {
        return `Overcloaked: ${formatWhole(player.inverter.overcloakedEnergy)}`;
      },
      fillStyle: { backgroundColor: "#9944FF" },
      baseStyle: { backgroundColor: "#222" },
      unlocked() {
        return true;
      },
    },
  },

  clickables: {
    11: {
      title: "Slow Inversion",
      display: "Set Inversion Speed to 25%",
      canClick: () => true,
      onClick() {
        player.inverter.inversionSpeed = new Decimal(0.25);
        console.log("Inversion speed set to 25%");
      },
    },
    12: {
      title: "Medium Inversion",
      display: "Set Inversion Speed to 50%",
      canClick: () => true,
      onClick() {
        player.inverter.inversionSpeed = new Decimal(0.5);
        console.log("Inversion speed set to 50%");
      },
    },
    13: {
      title: "Fast Inversion",
      display: "Set Inversion Speed to 100%",
      canClick: () => true,
      onClick() {
        player.inverter.inversionSpeed = new Decimal(1);
        console.log("Inversion speed set to 100%");
      },
    },
    14: {
      title: "Toggle Inversion",
      display() {
        return player.inverter.inverting ? "Stop Inverting" : "Start Inverting";
      },
      canClick() {
        return true;
      },
      onClick() {
        player.inverter.inverting = !player.inverter.inverting;
        console.log("Inversion toggled:", player.inverter.inverting);
      },
    },
    15: {
      title: "Overcloak",
      display() {
        const cost = Decimal.pow(player.inverter.overcloakedEnergy.add(1), 2);
        return `Overcloak for ${formatWhole(cost)} Inverted Energy`;
      },
      tooltip: "Consumes Inverted Energy to reduce energy drain. Each overcloak reduces drain by 10%. Max 5.",
      canClick() {
        const cost = Decimal.pow(player.inverter.overcloakedEnergy.add(1), 2);
        return player.inverter.invertedEnergy.gte(cost) && player.inverter.overcloakedEnergy.lt(5);
      },
      onClick() {
        const cost = Decimal.pow(player.inverter.overcloakedEnergy.add(1), 2);
        player.inverter.invertedEnergy = player.inverter.invertedEnergy.sub(cost);
        player.inverter.overcloakedEnergy = player.inverter.overcloakedEnergy.add(1);
        console.log("Overcloaked energy. Cost:", cost.toString());
      },
      unlocked() {
        return true;
      },
    },
  },

  upgrades: {
    11: {
      title: "Phase Inversion",
      description: "Reduces drain of points by 20%.",
      cost: new Decimal(5),
    },
    12: {
      title: "Antiflux Feedback",
      description: "Further reduces drain of points by 30%.",
      cost: new Decimal(10),
    },
    13: {
      title: "Polarity Amplifier",
      description: "Points are boosted by inverted energy.",
      cost: new Decimal(25),
      effect() {
        return player.inverter.invertedEnergy.add(1).pow(0.33);
      },
      effectDisplay() {
        return format(this.effect()) + "x";
      },
    },
    21: {
      title: "Overcloak Feedback",
      description: "Overcloaked energy boosts inverted energy gain by x².",
      cost: new Decimal(50),
      effect() {
        return player.inverter.overcloakedEnergy.add(1).pow(2);
      },
      effectDisplay() {
        return format(this.effect()) + "x";
      },
    },
    22: {
      title: "Temporal Tuning",
      description: "Gives finer control of inversion speed via clickables.",
      cost: new Decimal(100),
    },
  },

  update(diff) {
    let drainMult = new Decimal(1);
    if (hasUpgrade("inverter", 11)) drainMult = drainMult.mul(0.8);
    if (hasUpgrade("inverter", 12)) drainMult = drainMult.mul(0.7);
    const overcloakEffect = new Decimal(1).sub(player.inverter.overcloakedEnergy.mul(0.1));
    drainMult = drainMult.mul(overcloakEffect.max(0));

    // Inverter points reduce drain multiplier slightly
    const inverterPointEffect = Decimal.div(1, Decimal.add(player.inverter.points, 1).pow(0.05));
    drainMult = drainMult.mul(inverterPointEffect);

    if (player.inverter.inverting) {
      const baseDrain = Decimal.pow(1.05, player.inverter.points).mul(diff);
      const drain = baseDrain.mul(drainMult).mul(player.inverter.inversionSpeed);
      const actualDrain = Decimal.min(drain, player.points);
      console.log("Draining", actualDrain.toString(), "from energy");
      player.points = player.points.sub(actualDrain);
      player.inverter.points = player.inverter.points.add(actualDrain.div(3));
      console.log("Added", actualDrain.div(3).toString(), "to inverter points");
    }

    let gain = player.inverter.points.mul(0.01).mul(diff);
    if (hasUpgrade("inverter", 21)) {
      gain = gain.mul(upgradeEffect("inverter", 21));
