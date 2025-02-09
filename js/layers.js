addLayer("e", {
    name: "Element Tree",       
    symbol: "E",                
    position: 0,                
    startData() { return { 
        unlocked: true,        
        points: new Decimal(0),  // Layer points: "Elements"
        elements: {             
            H: new Decimal(1),   // Hydrogen (H)
            He: new Decimal(0),  // Helium (He)
            C: new Decimal(0),   // Carbon (C)
            O: new Decimal(0),   // Oxygen (O)
            N: new Decimal(0),   // Nitrogen (N)
            H2O: new Decimal(0), // Water (H₂O)
            NH3: new Decimal(0), // Ammonia (NH₃)
            HNO3: new Decimal(0), // Nitric Acid (HNO₃)
        },
    }},
    color: "#FFAA00",          
    resource: "Elements",      
    baseResource: "points",    
    baseAmount() { return player.points }, 
    type: "none",              
    row: 1,                   
    layerShown() { return true },

    // Function to Gain Layer Points on Fusion
    gainOnFusion(fusedElement) {
        let gain = new Decimal(0);
        if (fusedElement == "He") gain = new Decimal(1);  
        if (fusedElement == "C") gain = new Decimal(3);  
        if (fusedElement == "O") gain = new Decimal(5);
        if (fusedElement == "N") gain = new Decimal(7);
        if (fusedElement == "H2O") gain = new Decimal(6);
        if (fusedElement == "NH3") gain = new Decimal(8);
        if (fusedElement == "HNO3") gain = new Decimal(12);
        player.e.points = player.e.points.add(gain);
    },

    // Clickables for Fusion
    clickables: {
        11: {  // 2 H → Helium
            title: "Fuse 2H → He",
            display() { return `Fuse 2H → He (${player.e.elements.H.gte(2) ? "Available" : "Need More"})`; },
            canClick() { return player.e.elements.H.gte(2); },
            onClick() {
                player.e.elements.H = player.e.elements.H.sub(2);
                player.e.elements.He = player.e.elements.He.add(1);
                layers.e.gainOnFusion("He");
            },
        },
        12: {  // 6 H → Carbon
            title: "Fuse 6H → C",
            display() { return `Fuse 6H → C (${player.e.elements.H.gte(6) ? "Available" : "Need More"})`; },
            canClick() { return player.e.elements.H.gte(6); },
            onClick() {
                player.e.elements.H = player.e.elements.H.sub(6);
                player.e.elements.C = player.e.elements.C.add(1);
                layers.e.gainOnFusion("C");
            },
        },
        13: {  // 8 H → Oxygen
            title: "Fuse 8H → O",
            display() { return `Fuse 8H → O (${player.e.elements.H.gte(8) ? "Available" : "Need More"})`; },
            canClick() { return player.e.elements.H.gte(8); },
            onClick() {
                player.e.elements.H = player.e.elements.H.sub(8);
                player.e.elements.O = player.e.elements.O.add(1);
                layers.e.gainOnFusion("O");
            },
        },
        14: {  // 7 H → Nitrogen
            title: "Fuse 7H → N",
            display() { return `Fuse 7H → N (${player.e.elements.H.gte(7) ? "Available" : "Need More"})`; },
            canClick() { return player.e.elements.H.gte(7); },
            onClick() {
                player.e.elements.H = player.e.elements.H.sub(7);
                player.e.elements.N = player.e.elements.N.add(1);
                layers.e.gainOnFusion("N");
            },
        },
        15: {  // Water (H₂O): 2 H + 1 O → H₂O
            title: "Fuse 2H + 1O → H₂O",
            display() { return `Fuse 2H + 1O → H₂O (${player.e.elements.H.gte(2) && player.e.elements.O.gte(1) ? "Available" : "Need More"})`; },
            canClick() { return player.e.elements.H.gte(2) && player.e.elements.O.gte(1); },
            onClick() {
                player.e.elements.H = player.e.elements.H.sub(2);
                player.e.elements.O = player.e.elements.O.sub(1);
                player.e.elements.H2O = player.e.elements.H2O.add(1);
                layers.e.gainOnFusion("H2O");
            },
        },
        16: {  // Ammonia (NH₃): 1 N + 3 H → NH₃
            title: "Fuse 1N + 3H → NH₃",
            display() { return `Fuse 1N + 3H → NH₃ (${player.e.elements.N.gte(1) && player.e.elements.H.gte(3) ? "Available" : "Need More"})`; },
            canClick() { return player.e.elements.N.gte(1) && player.e.elements.H.gte(3); },
            onClick() {
                player.e.elements.N = player.e.elements.N.sub(1);
                player.e.elements.H = player.e.elements.H.sub(3);
                player.e.elements.NH3 = player.e.elements.NH3.add(1);
                layers.e.gainOnFusion("NH3");
            },
        },
        17: {  // Nitric Acid (HNO₃): 1 H + 1 N + 3 O → HNO₃
            title: "Fuse 1H + 1N + 3O → HNO₃",
            display() { return `Fuse 1H + 1N + 3O → HNO₃ (${player.e.elements.H.gte(1) && player.e.elements.N.gte(1) && player.e.elements.O.gte(3) ? "Available" : "Need More"})`; },
            canClick() { return player.e.elements.H.gte(1) && player.e.elements.N.gte(1) && player.e.elements.O.gte(3); },
            onClick() {
                player.e.elements.H = player.e.elements.H.sub(1);
                player.e.elements.N = player.e.elements.N.sub(1);
                player.e.elements.O = player.e.elements.O.sub(3);
                player.e.elements.HNO3 = player.e.elements.HNO3.add(1);
                layers.e.gainOnFusion("HNO3");
            },
        },
    },

    // Displaying Elements and Compounds
    display() {
        return `
            <h3>Elements</h3>
            <p>H: ${format(player.e.elements.H)}</p>
            <p>He: ${format(player.e.elements.He)}</p>
            <p>C: ${format(player.e.elements.C)}</p>
            <p>O: ${format(player.e.elements.O)}</p>
            <p>N: ${format(player.e.elements.N)}</p>
            <p>H₂O: ${format(player.e.elements.H2O)}</p>
            <p>NH₃: ${format(player.e.elements.NH3)}</p>
            <p>HNO₃: ${format(player.e.elements.HNO3)}</p>
        `;
    },
});
