const ACHS = {
    unl(id) {
        if (!player.bits.achs.includes(id)) {
            player.bits.achs.push(id)
        }
    },
    has(id) { return player.bits.achs.includes(id) },
    getText(id) {
        let txt = this.descs[id]+(this.rewards[id] !== undefined ? " Reward: "+this.rewards[id] : "")
        if (txt.indexOf("format") != -1) {
            let txt2 = txt.split("format")[1];
            return txt.split("format")[0] + format(txt2.slice(1, txt2.indexOf(")"))) + txt2.split(")")[1];
        }
        return txt
    },
    checkACHS() {
        for (let r = 1; r <= this.rows; r++) for (let c = 1; c <= this.cols; c++) if (this.checks[r*10+c] !== undefined ? this.checks[r*10+c]() : false) this.unl(r*10+c)
    },
    cols: 8,
    rows: 4,
    names: {
        24: "Compress without clusters?",
        45: "Galaxy Discount",
    },
    descs: {
        24: "Reboot without Bit Cluster.",
        45: "Own Cost Cutter.",
    },
    rewards: {
        24: "Bit Cluster is 25% stronger.",
        45: "Cluster cost -10%.",
    },
    checks: {
        45() { return player.reboot.reboot_upgs[2] == 1 },
    },
}
