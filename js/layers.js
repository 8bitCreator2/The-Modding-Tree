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
        };
    },
    color: "#f5d442",
    row: 0,
    type: "none",

    update(diff) {
        let gain;
        if (hasUpgrade("b", 11)) {
            gain = player.points.div(player.b.interest).times(Decimal.add(1, player.b.interest)).div(100);
        } else {
            gain = player.points.times(Decimal.add(1, player.b.interest)).div(100);
        }
        player.b.bankingPoints = player.b.bankingPoints.add(gain.times(diff));
    },

    upgrades: {
        11: {
            title: "Improved Formula",
            description: "Change formula to C = (A / i) × (1 + i) / 100",
            cost: new Decimal(200),
            canAfford() {
                return player.b.bankingPoints.gte(this.cost);
            },
            pay() {
                player.b.bankingPoints = player.b.bankingPoints.sub(this.cost);
            },
            unlocked() {
                return true;
            },
            style() {
                return {"background-color": "#f5d442", color: "black"};
            },
        },
    },

    tabFormat: [
        ["display-text", () => `<h2 style='color: white;'>Welcome to the Bank layer.</h2>`],
        ["display-text", () => `You have <b style='color: #f5d442;'>${format(player.b.bankingPoints)}</b> Banking Points.`],
        ["display-text", () => {
            if (hasUpgrade("b", 11)) {
                return `Formula: <b style='color: white;'>C = (A / i) × (1 + i) / 100</b><br>Where A = Points = <b style='color: #f5d442;'>${format(player.points)}</b>, i = <b style='color: #f5d442;'>${format(player.b.interest.mul(100))}%</b>, C = Banking Points gained/sec`;
            } else {
                return `Formula: <b style='color: white;'>C = A × (1 + i) / 100</b><br>Where A = Points = <b style='color: #f5d442;'>${format(player.points)}</b>, i = <b style='color: #f5d442;'>${format(player.b.interest.mul(100))}%</b>, C = Banking Points gained/sec`;
            }
        }],
        "upgrades",
    ],
});
