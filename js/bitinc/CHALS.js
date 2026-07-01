const CHALS = {
    types: ['normal','inf','post_inf'],
    sumTotal() {
        let total = {}
        for (let x in this.types) {
            let total2 = 0
            for (let y = 1; y <= this[this.types[x]].length; y++) {
                if (player.bits.stats.chals_best[this.types[x]+y] === undefined) { total2 = 1e9; break }
                total2 += player.bits.stats.chals_best[this.types[x]+y]
            }
            total[this.types[x]] = total2
        }
        return total
    },
    onChal(x) { return player.infinity.chals.active == x },
    enter(ch, id) {
        if (player.infinity.chals.active == "") {
            player.infinity.chals.active = ch + id
            this[ch].onEnter()
        }
    },
    exit() { if (player.infinity.chals.active != "") { player.infinity.chals.active = "" } },
    normal: {
        btnMsg(x) { return player.infinity.chals.active == "normal"+x ? "Running" : (player.infinity.chals.comps.includes("normal"+x) ? "Completed" : "Start") },
        onEnter() { FORMS.inf.onReset(true) },
        length: 6,
        1: { unl() { return true }, desc: "Upgrade costs are 25% more expensive", reward: "Unlock Bit Cache autobuyer" },
        2: { unl() { return true }, desc: "You cannot buy Bit Multiplier, and bit gain starts 2x", reward: "Unlock Bit Multiplier autobuyer" },
        3: { unl() { return true }, desc: "Bit upgrades cost more", reward: "Unlock Bit Power autobuyer" },
        4: { unl() { return true }, desc: "Bit Pipeline is disabled, but Bit Duplication is 4x stronger", reward: "Unlock Bit Duplication autobuyer" },
        5: { unl() { return true }, desc: "Bit Cluster scales stronger", reward: "Unlock Bit Cluster autobuyer" },
        6: { unl() { return true }, desc: "Reboot points gain are raised by 0.85", reward: "100% of RP gained each second" },
    },
    inf: {
        requires: [new Decimal("1e1100"), new Decimal("1e1350"), new Decimal("1e2350"), new Decimal("1e3800"), new Decimal("1e10200"), new Decimal("1e11300")],
        canComplete() { return player.points.gte(this[player.infinity.chals.active.split("inf")[1]].goal) },
        canUnlock() { return player.points.gte(this.requires[player.infinity.chals.inf_unls]) },
        unlock() { if (this.canUnlock()) player.infinity.chals.inf_unls++ },
        btnMsg(x) { return player.infinity.chals.active == "inf"+x ? "Running" : (player.infinity.chals.comps.includes("inf"+x) ? "Completed" : "Start") },
        onEnter() { FORMS.inf.onReset(true) },
        length: 6,
        1: { goal: new Decimal("1e480"), desc: "All previous challenges at once", reward: "All completed challenges boost IP" },
        2: { goal: new Decimal("1e500"), desc: "Bit Cluster disabled, can compress", reward: "Bit Compress 50% stronger" },
        3: { goal: new Decimal("1e640"), desc: "Bit gain is halved", reward: "All upgrades 15% stronger" },
        4: { goal: new Decimal("1e2300"), desc: "Infinity Bit effects disabled", reward: "2x IP per completed challenge, unlock autobuyer" },
        5: { goal: new Decimal("1e4400"), desc: "Bit Compress disabled", reward: "IP gain softcap 50% weaker" },
        6: { goal: new Decimal("1e1400"), desc: "Cannot buy Reboot upgrades except 1-2", reward: "RP gain softcap slightly weaker" },
    },
    post_inf: {
        canUnlock() { return true },
        canComplete() { return player.points.gte(this[player.infinity.chals.active.split("post_inf")[1]].goal) },
        btnMsg(x) { return player.infinity.chals.active == "post_inf"+x ? "Running" : (player.infinity.chals.comps.includes("post_inf"+x) ? "Completed" : "Start") },
        onEnter() { FORMS.inf.onReset(true) },
        length: 1,
        1: { goal: new Decimal("1e400"), desc: "Bit gain is slower", reward: "Unlock the Infinity Kernel" },
    },
}
