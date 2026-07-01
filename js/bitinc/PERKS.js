const PERKS = {
    tree: {
        1:  { tier: 1, reqs: [],        cost: 1, title: "Bit Rush",           desc: "Bit gain is 2x stronger." },
        2:  { tier: 1, reqs: [],        cost: 1, title: "Cluster Push",        desc: "Cluster effect is 1.5x stronger." },
        3:  { tier: 1, reqs: [],        cost: 1, title: "Reboot Boost",        desc: "Reboot gain is 2x stronger." },
        4:  { tier: 1, reqs: [],        cost: 1, title: "Compute Charge",     desc: "PP gain is 1.25x stronger." },
        5:  { tier: 2, reqs: [1],       cost: 1, title: "Growth Amplifier",    desc: "Bit gain is ^1.05 stronger." },
        6:  { tier: 2, reqs: [2],       cost: 1, title: "Reboot Power",        desc: "Reboot gain is 2x stronger." },
        7:  { tier: 2, reqs: [3],       cost: 1, title: "Premium Upgrades",    desc: "Bit upgrade effects are 1.5x stronger." },
        8:  { tier: 2, reqs: [4],       cost: 1, title: "Compute Surge",      desc: "PP gain is 1.5x stronger." },
        9:  { tier: 3, reqs: [5, 6],    cost: 2, title: "Bit Overflow",        desc: "Bit gain is 3x stronger." },
        10: { tier: 3, reqs: [7, 8],    cost: 2, title: "Compute Overload",   desc: "PP gain is 3x stronger." },
        11: { tier: 3, reqs: "t2_any3", cost: 2, title: "Efficiency Module",   desc: "All upgrade effects are 25% stronger." },
        12: { tier: 4, reqs: [9, 10],   cost: 3, title: "Module Cascade",      desc: "Each owned module adds +2% to bit gain." },
        13: { tier: 4, reqs: [9, 11],   cost: 27, title: "Challenge Power",     desc: "Bit gain is 2x during challenges." },
        14: { tier: 5, reqs: [12, 13],  cost: 256, title: "Transcendence",       desc: "Bit ^1.15, Cluster 3x, Reboot 5x, Compute 3x." },
        15: { tier: 6, reqs: "all",     cost: 1024, title: "Perfection",          desc: "All gains 2.5x stronger." },
        16: { tier: 1, reqs: [],        cost: 1, title: "Bit Spark",           desc: "Bit gain is 1.25x stronger." },
        17: { tier: 1, reqs: [],        cost: 1, title: "Compute Ignition",   desc: "PP gain is ^1.1 stronger." },
        18: { tier: 2, reqs: [16],      cost: 1, title: "Cluster Ripple",      desc: "Cluster effect is 1.25x stronger." },
        19: { tier: 2, reqs: [17],      cost: 1, title: "Reboot Echo",         desc: "Reboot gain is 1.25x stronger." },
        20: { tier: 3, reqs: [18, 19],  cost: 2, title: "Exponential Surge",   desc: "Bit gain is ^1.03 stronger." },
        21: { tier: 3, reqs: [6, 8],    cost: 2, title: "Balanced Power",      desc: "Cluster and Compute effects are 2x stronger." },
        22: { tier: 4, reqs: [20, 21],  cost: 27, title: "Compute Reality",     desc: "Compute effects are 1.5x stronger." },
        23: { tier: 4, reqs: [10, 14],  cost: 27, title: "Overclock",           desc: "All bps is 2x stronger." },
        24: { tier: 5, reqs: [22, 23],  cost: 256, title: "Transcendent Growth", desc: "Bit gain is ^1.05 stronger." },
        25: { tier: 5, reqs: [12, 13],  cost: 256, title: "Upgrade Knowledge",   desc: "Each upgrade level adds +5% to bit gain." },
        26: { tier: 6, reqs: [24, 25],  cost: 1024, title: "Crystal Mastery",    desc: "Kernel crystal gain is 1.25x stronger." },
        27: { tier: 6, reqs: [15],      cost: 1024, title: "Ultimate Synthesis", desc: "All gains are 1.5x stronger." },
    },
    has(id) { return player.bits.modules.list.includes(id) },
    owned() { return player.bits.modules.list.length },
    unl(id) {
        if (id === undefined) {
            return player.bits.modules.unl
        }
        return true
    },
    respec() { player.bits.modules.list = [] },
    spent() {
        let s = new Decimal(0)
        for (let id of player.bits.modules.list) {
            let node = this.tree[id]
            if (node) s = s.add(node.cost)
        }
        return s
    },
    points() {
        let best = player.bits.stats.best_bits
        let total = new Decimal(0)
        for (let i = 0; i < this.milestones.length; i++) {
            if (best.gte(this.milestones[i][0])) total = total.add(this.milestones[i][1])
        }
        return total
    },
    nextMilestone() {
        let best = player.bits.stats.best_bits
        let thresholds = [
            new Decimal("1e4"), new Decimal("1e5"), new Decimal("1e6"), new Decimal("1e7"), new Decimal("1e8"), new Decimal("1e9"),
            new Decimal("1e10"), new Decimal("1e11"), new Decimal("1e16"), new Decimal("1e21"), new Decimal("1e26"), new Decimal("1e31"),
            new Decimal("1e36"), new Decimal("1e41"), new Decimal("1e46")
        ]
        for (let t of thresholds) {
            if (best.lt(t)) return t
        }
        return new Decimal(0)
    },
    milestones: [
        [new Decimal("1e4"), 1], [new Decimal("1e5"), 1], [new Decimal("1e6"), 1], [new Decimal("1e7"), 1],
        [new Decimal("1e8"), 1], [new Decimal("1e9"), 1], [new Decimal("1e10"), 2], [new Decimal("1e11"), 3],
        [new Decimal("1e16"), 5], [new Decimal("1e21"), 5], [new Decimal("1e26"), 5], [new Decimal("1e31"), 5],
        [new Decimal("1e36"), 5], [new Decimal("1e41"), 5], [new Decimal("1e46"), 5],
    ],
    canBuy(id) {
        let node = this.tree[id]
        if (!node) return false
        if (this.has(id)) return false
        if (this.points().sub(this.spent()).lt(node.cost)) return false
        if (id == 11) {
            let t2owned = 0
            for (let x = 5; x <= 8; x++) if (this.has(x)) t2owned++
            return t2owned >= 3
        }
        if (id == 15) {
            for (let i = 1; i <= 27; i++) {
                if (i === 15) continue
                let node = this.tree[i]
                if (node && node.tier < 6 && !this.has(i)) return false
            }
            return true
        }
        for (let req of node.reqs) {
            if (!this.has(req)) return false
        }
        return true
    },
    buy(id) {
        if (this.canBuy(id)) {
            player.bits.modules.list.push(id)
        }
    },
    getTier(id) {
        let node = this.tree[id]
        return node ? node.tier : 0
    },
    tierPerks(tier) {
        let result = []
        for (let id in this.tree) {
            if (this.tree[id].tier == tier) {
                let idNum = parseInt(id)
                result.push(idNum)
            }
        }
        return result.sort((a,b) => a-b)
    },
    prereqText(id) {
        if (this.has(id)) return ""
        let node = this.tree[id]
        if (!node) return ""
        if (id == 11) return "Requires: any 3 Tier 2 modules"
        if (id == 15) return "Requires: all Tier 1-5 modules"
        let names = node.reqs.map(r => this.tree[r]?.title || r).join(", ")
        return "Requires: " + names
    },
}
