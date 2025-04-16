// Energy Mechanics - TMT Style
addLayer("inverter", {
  name: "Inverters", // Resource layer name is 'Inverters'
  symbol: "INV", // Symbol for the Inverter layer
  position: 1, // This determines the layer's row placement
  row: 1, // The row in the prestige layers
  color: "#FF6666", // Color for the layer
  type: "none", // Type of layer ('none' is typical for resource-based layers)
  Resource: "Inverters", // Base resource is 'Inverters'
 
  // Initializing data for this layer
  startData() {
    return {
      unlocked: true, // Inverters are unlocked by default
      points: new Decimal(0), // Initial points for Inverters
      inverting: false, // Whether the inversion process is active
      invertedEnergy: new Decimal(0), // Inverted energy starts at 0
      overcloakedEnergy: new Decimal(0), // Overcloaked energy starts at 0
    };
  },

  // Determine when the layer should be visible
  layerShown() {
    return true; // Always show the Inverters layer
  },

  // Setting the format for the layer's display
  tabFormat: [
    "main-display",
    "blank",
    ["display-text", () => `You have <h2 style='color:#FF6666'>${formatWhole(player.inverter.invertedEnergy)}</h2> inverted energy.`],
    ["display-text", () => `You have <h2 style='color:#FF33FF'>${formatWhole(player.inverter.overcloakedEnergy)}</h2> overcloaked energy.`],
    "blank",
    "clickables", // Display clickable buttons (for inversion and overcloaking)
    "upgrades", // Display upgrades
    "milestones", // Display milestones
    "blank",
    ["bar", "inversionBar"], // Bar for inversion progress
    ["bar", "overcloakBar"], // Bar for overcloak progress
  ],

  // Progress bars for inversion and overcloaking
  bars: {
    inversionBar: {
      direction: RIGHT,
      width: 300,
      height: 30,
      progress() {
        if (!player.inverter.inverting) return 0;
        const drainRate = Decimal.pow(1.05, player.inverter.points);
        return player.points.div(player.points.add(drainRate)).toNumber(); // Calculating inversion progress
      },
      display() {
        return player.inverter.inverting ? "Inverting energy..." : "Not inverting"; // Show inversion status
      },
      fillStyle: { backgroundColor: "#FF9999" },
      baseStyle: { backgroundColor: "#222" },
    },
    overcloakBar: {
      direction: RIGHT,
      width: 300,
      height: 30,
      progress() {
        return player.inverter.overcloakedEnergy.div(player.inverter.invertedEnergy.max(1)).toNumber(); // Show overcloaked energy progress
      },
      display() {
        return `Overcloaked: ${formatWhole(player.inverter.overcloakedEnergy)}`;
      },
      fillStyle: { backgroundColor: "#FF33FF" }, // Set the reddish-blue color for overcloaking
      baseStyle: { backgroundColor: "#222" },
    },
  },

  // Clickable buttons for interaction
  clickables: {
    11: {
      title: "Toggle Inversion",
      display() {
        return player.inverter.inverting ? "Stop Inverting" : "Start Inverting"; // Toggle inversion state
      },
      canClick() {
        return true;
      },
      onClick() {
        player.inverter.inverting = !player.inverter.inverting; // Toggle inversion on/off
        console.log("Inversion toggled:", player.inverter.inverting); // Debugging output
      },
    },
    12: {
      title: "Overcloak",
      display() {
        return "Overcloak 1 Inverted Energy"; // Button to overcloak inverted energy
      },
      canClick() {
        return player.inverter.invertedEnergy.gte(1); // Can only click if enough inverted energy is available
      },
      onClick() {
        player.inverter.invertedEnergy = player.inverter.invertedEnergy.sub(1); // Subtract 1 inverted energy
        player.inverter.overcloakedEnergy = player.inverter.overcloakedEnergy.add(1); // Add 1 overcloaked energy
        console.log("Overcloaked 1 inverted energy"); // Debugging output
      },
    },
  },

  // Upgrades that modify the system's mechanics
  upgrades: {
    11: {
      title: "Phase Inversion",
      description: "Reduces drain of energy by 20%.",
      cost: new Decimal(5), // Cost of the upgrade
    },
    12: {
      title: "Antiflux Feedback",
      description: "Further reduces drain of energy by 30%.",
      cost: new Decimal(10), // Cost of the upgrade
    },
  },

  // Milestones that unlock new features or rewards
  milestones: {
    0: {
      requirementDescription: "25 Inverters", // Requirement to unlock overcloaking
      done() {
        return player.inverter.points.gte(25); // Check if player has enough Inverters
      },
      effectDescription: "Unlocks Overcloaking.", // Unlock overcloaking when the milestone is reached
    },
  },

  // Update function that handles time-based changes (like generation and draining)
  update(diff) {
    // Drain reduction multiplier from upgrades and overcloaking
    let drainMult = new Decimal(1);
    if (hasUpgrade("inverter", 11)) drainMult = drainMult.mul(0.8); // Apply 20% drain reduction from upgrade 11
    if (hasUpgrade("inverter", 12)) drainMult = drainMult.mul(0.7); // Apply 30% drain reduction from upgrade 12
    const overcloakEffect = new Decimal(1).sub(player.inverter.overcloakedEnergy.mul(0.1)); // Overcloaking effect on drain
    drainMult = drainMult.mul(overcloakEffect.max(0));

    // Handle the inversion process
    if (player.inverter.inverting) {
      const baseDrain = Decimal.pow(1.05, player.inverter.points).mul(diff); // Calculate drain based on inverter points
      const drain = baseDrain.mul(drainMult); // Apply the drain reduction multiplier
      const actualDrain = Decimal.min(drain, player.points); // Ensure we do not drain more than the available points
      console.log("Draining", actualDrain.toString(), "from energy"); // Debugging output
      player.points = player.points.sub(actualDrain); // Subtract the drained points
      player.inverter.points = player.inverter.points.add(actualDrain.div(3)); // Add inverter points based on drained energy
      console.log("Added", actualDrain.div(3).toString(), "to inverter points"); // Debugging output
    }

    // Generate inverted energy at 1% of inverter points per second
    const gain = player.inverter.points.mul(0.01).mul(diff); // 1% of inverter points generates inverted energy
    player.inverter.invertedEnergy = player.inverter.invertedEnergy.add(gain); // Add generated inverted energy
    console.log("Generated inverted energy:", gain.toString()); // Debugging output
  },
});
