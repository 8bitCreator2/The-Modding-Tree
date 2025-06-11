// layers/b.js
addLayer("b", {
    name: "Bank",
    symbol: "B",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        bankingPoints: new Decimal(0),
        interest: new Decimal(0.05),
    }},
    color: "#f5d442",
    row: 0,
    type: "none",

    update(diff) {
        let gain = player.points.times(Decimal.add(1, player.b.interest)).div(100);
        player.b.bankingPoints = player.b.bankingPoints.add(gain.times(diff));
    },

    tabFormat: [
        ["display-text", () => `<h2 style='color: #f5d442;'>Welcome to the Bank layer.</h2>`],
        ["display-text", () => `<span style='color: #f5d442;'>You have <b>${format(player.b.bankingPoints)}</b> Banking Points.</span>`],
        ["display-text", () => `<span style='color: #f5d442;'>Formula: <b>C = A × (1 + i) / 100</b><br>Where A = Points = ${format(player.points)}, i = ${format(player.b.interest.mul(100))}%, C = Banking Points gained/sec</span>`],
    ],
});
