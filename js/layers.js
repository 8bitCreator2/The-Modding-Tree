
addLayer("b", {
    name: "Bank",
    symbol: "B",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0), // Not used for prestige in this layer
        deposit: new Decimal(0),
        i: 0.03,
        D: 100,
    }},
    color: "#f5d442",
    row: 0,
    type: "none", // Passive layer

    tabFormat: [
        ["display-text", function() { return `You have <b>${format(player.b.deposit)}</b> Points in the Bank.` }],
        ["display-text", function() {
            let gain = player.b.deposit.times(1 + player.b.i).div(player.b.D).floor();
            return `Withdrawing now would give <b>${format(gain)}</b> Points.`;
        }],
        "blank",
        ["clickable", 0],
        ["clickable", 1],
    ],

    clickables: {
        0: {
            title: "Deposit",
            display() {
                return `Deposit 10% of your current Points\nCost: ${format(player.points.div(10))}`;
            },
            canClick() { return player.points.gte(10) },
            onClick() {
                let amount = player.points.div(10);
                player.points = player.points.sub(amount);
                player.b.deposit = player.b.deposit.add(amount);
            },
            style: { width: "200px", height: "100px" },
        },
        1: {
            title: "Withdraw",
            display() {
                let gain = player.b.deposit.times(1 + player.b.i).div(player.b.D).floor();
                return `Withdraw your deposit\nGain: ${format(gain)} Points`;
            },
            canClick() { return player.b.deposit.gt(0) },
            onClick() {
                let gain = player.b.deposit.times(1 + player.b.i).div(player.b.D).floor();
                player.points = player.points.add(gain);
                player.b.deposit = new Decimal(0);
            },
            style: { width: "200px", height: "100px" },
        },
    },
});
