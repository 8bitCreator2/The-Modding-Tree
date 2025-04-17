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

  update(diff) {
    // Log current inverter points before applying logic
    console.log("Inverter points before cap:", player.inverter.points.toString());

    // Clamp inverter points to 1000 if it exceeds the cap
    if (player.inverter.points.gt(1000)) {
      player.inverter.points = new Decimal(1000);
      console.log("Inverter points capped at 1000.");
    }

    // Place other update logic here as needed...
  },

  tabFormat: [
    "main-display",
    "blank",
    ["display-text", () => `You have <h2 style='color:#FF6666'>${formatWhole(player.inverter.invertedEnergy)}</h2> inverted energy.`],
    ["display-text", () => `Overcloaking consumes inverted energy to reduce energy drain by 10% per overcloaked energy.`],
    ["display-text", () => player.inverter.points.gte(1000) ? "You have reached the inverter hard cap of 1000." : ""],
    ["display-text", () => player.inverter.overcloakedEnergy.gte(10) ? "Overcloak cost now scales significantly higher." : ""],
    "blank",
    "clickables",
    "upgrades",
    "milestones",
    "buyables",
    "challenges",
    "blank",
    ["bar", "inversionBar"],
    ["bar", "overcloakBar"],
  ],

  challenges: {
    11: {
      name: "Entropy Lock",
      challengeDescription: "Overcloak is disabled.",
      canComplete: () => player.inverter.points.gte(1000),
      goalDescription: "Reach 1000 Inverter Points.",
      rewardDescription: "Unlocks the next layer.",
      unlocked() {
        return player.inverter.overcloakedEnergy.gte(25);
      },
      onEnter() {
        player.inverter.overcloakDisabled = true;
        console.log("Entered Entropy Lock challenge.");
      },
      onExit() {
        player.inverter.overcloakDisabled = false;
        console.log("Exited Entropy Lock challenge.");
      }
    }
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
        const base = player.inverter.overcloakedEnergy.gte(10) ? 3 : 2;
        const cost = Decimal.pow(base, player.inverter.overcloakedEnergy.add(1));
        return `Overcloak for ${formatWhole(cost)} Inverted Energy`;
      },
      tooltip: "Consumes Inverted Energy to reduce energy drain. Each overcloak reduces drain by 10%.",
      canClick() {
        if (player.challenges["inverter"][11]) return false;
        const base = player.inverter.overcloakedEnergy.gte(10) ? 3 : 2;
        const cost = Decimal.pow(base, player.inverter.overcloakedEnergy.add(1));
        return player.inverter.invertedEnergy.gte(cost);
      },
      onClick() {
        const base = player.inverter.overcloakedEnergy.gte(10) ? 3 : 2;
        const cost = Decimal.pow(base, player.inverter.overcloakedEnergy.add(1));
        player.inverter.invertedEnergy = player.inverter.invertedEnergy.sub(cost);
        player.inverter.overcloakedEnergy = player.inverter.overcloakedEnergy.add(1);
        console.log("Overcloaked energy. Cost:", cost.toString());
      },
      unlocked() {
        return true;
      },
    },
    16: {
      title: "Precise: 1%",
      display: "Set Inversion Speed to 1%",
      canClick: () => true,
      onClick() {
        player.inverter.inversionSpeed = new Decimal(0.01);
        console.log("Inversion speed set to 1%");
      },
      unlocked() {
        return hasUpgrade("inverter", 22);
      },
    },
    17: {
      title: "Precise: 10%",
      display: "Set Inversion Speed to 10%",
      canClick: () => true,
      onClick() {
        player.inverter.inversionSpeed = new Decimal(0.10);
        console.log("Inversion speed set to 10%");
      },
      unlocked() {
        return hasUpgrade("inverter", 22);
      },
    },
    18: {
      title: "Precise: 75%",
      display: "Set Inversion Speed to 75%",
      canClick: () => true,
      onClick() {
        player.inverter.inversionSpeed = new Decimal(0.75);
        console.log("Inversion speed set to 75%");
      },
      unlocked() {
        return hasUpgrade("inverter", 22);
      },
    },
  },

  // Rest of the layer remains unchanged
});
