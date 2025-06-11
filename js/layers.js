// layers/b.js
addLayer("b", {
    name: "Bank",
    symbol: "B",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            bankingPoints: new Decimal(0),
            interest: new Decimal(0.05),
            bankingCredit: new Decimal(0),
        };
    },
    color: "#f5d442",
    row: 0,
    type: "custom",

    update(diff) {
        const A = player.points.max(1); // prevent divide by zero
        let i = player.b.interest;

        if (hasUpgrade("b", 12)) i = i.add(0.02);
        if (hasUpgrade("b", 13)) i = i.times(Decimal.pow(A, 0.1));

        const Ai = A.times(i);
        const bonus = Decimal.add(1, Ai.div(A.div(10)));
        let gain = A.times(i.add(1)).times(bonus).div(100);

        if (hasUpgrade("b", 13)) {
            const creditGain = player.b.bankingPoints.div(10000).times(diff);
            player.b.bankingCredit = player.b.bankingCredit.add(creditGain);
            gain = gain.times(player.b.bankingCredit.add(1));
        }

        player.b.bankingPoints = player.b.bankingPoints.add(gain.times(diff));
    },

    getResetGain() {
        return new Decimal(0);
    },
    getNextAt() {
        return new Decimal(Infinity);
    },
    canReset() {
        return false;
    },

    upgrades: {
        11: {
            title: "Improved Formula",
            description: "Improves banking point formula.",
            cost: new Decimal(200),
            canAfford() {
                return player.b.bankingPoints.gte(this.cost);
            },
            pay() {
                player.b.bankingPoints = player.b.bankingPoints.sub(this.cost);
            },
            unlocked: () => true,
            style: () => ({ "background-color": "#f5d442", color: "black" }),
        },
        12: {
            title: "+2% Interest",
            description: "Interest is increased by 2%.",
            cost: new Decimal(500),
            currencyDisplayName: "Banking Points",
            currencyInternalName: "bankingPoints",
            unlocked: () => true,
            style: () => ({ "background-color": "#f5d442", color: "black" }),
        },
        13: {
            title: "Point-Boosted Interest",
            description: "Your points boost interest (interest × A^0.1).",
            cost: new Decimal(1000),
            currencyDisplayName: "Banking Points",
            currencyInternalName: "bankingPoints",
            unlocked: () => true,
            style: () => ({ "background-color": "#f5d442", color: "black" }),
        },
    },

    milestones: {
        0: {
            requirementDescription: "Get Upgrade 13",
            done() { return hasUpgrade("b", 13); },
            effectDescription: "Unlock Banking Credit (1 per 10,000 Banking Points per second)",
            style: { "background-color": "#f5d442", color: "black" },
        },
    },

    tabFormat: [
        ["display-text", () => `<h2 style='color: white;'>Welcome to the Bank layer.</h2>`],
        ["display-text", () => `You have <b style='color: #f5d442;'>${format(player.b.bankingPoints)}</b> Banking Points.`],
        ["display-text", () => `You have <b style='color: #f5d442;'>${format(player.b.bankingCredit)}</b> Banking Credit.`],
        ["display-text", () => {
            const A = player.points.max(1);
            let i = player.b.interest;
            if (hasUpgrade("b", 12)) i = i.add(0.02);
            if (hasUpgrade("b", 13)) i = i.times(Decimal.pow(A, 0.1));
            const Ai = A.times(i);
            const bonus = Ai.div(A.div(10));
            return `Formula: <b style='color: white;'>C = A × (1 + i) × (1 + Ai / (A / 10)) × D / 100</b><br>Where A = <b style='color: #f5d442;'>${format(A)}</b>, i = <b style='color: #f5d442;'>${format(i.mul(100))}%</b>, D = <b style='color: #f5d442;'>${format(player.b.bankingCredit.add(1))}</b>, Bonus = <b style='color: #f5d442;'>${format(bonus)}</b>`;
        }],
        "upgrades",
        "milestones",
    ],
});
