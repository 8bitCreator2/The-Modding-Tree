const AUTOS = {
    interval: 1000,
    update(dt) {
        for (let x = 1; x <= this.length; x++) {
            let a = this[x]
            if (player.bits.autobuyer[a.id] && a.unl()) {
                a.time += dt * 1000
                if (a.time >= this.interval) {
                    a.time -= this.interval
                    a.action()
                }
            }
        }
    },
    length: 5,
    1: {
        dis: "Bit Cache autobuyer",
        id: "auto_cache",
        time: 0,
        unl() { return FORMS.inf.seen() || player.reboot.reboot_upgs[4] },
        see() { return player.infinity.chals.comps.includes("normal1") || player.reboot.reboot_upgs[4] },
        see_desc: "Complete challenge 1 or buy Accelerant to unlock.",
        action() { UPGS.bits.max(1) },
    },
    2: {
        dis: "Bit Multiplier autobuyer",
        id: "auto_mult",
        time: 200,
        unl() { return FORMS.inf.seen() || player.reboot.reboot_upgs[4] },
        see() { return player.infinity.chals.comps.includes("normal2") || player.reboot.reboot_upgs[4] },
        see_desc: "Complete challenge 2 or buy Accelerant to unlock.",
        action() { UPGS.bits.max(2) },
    },
    3: {
        dis: "Bit Power autobuyer",
        id: "auto_power",
        time: 400,
        unl() { return FORMS.inf.seen() || player.reboot.reboot_upgs[5] },
        see() { return player.infinity.chals.comps.includes("normal3") || player.reboot.reboot_upgs[5] },
        see_desc: "Complete challenge 3 or buy Synergy to unlock.",
        action() { UPGS.bits.max(3) },
    },
    4: {
        dis: "Bit Pipeline autobuyer",
        id: "auto_dup",
        time: 600,
        unl() { return FORMS.inf.seen() || player.reboot.reboot_upgs[5] },
        see() { return player.infinity.chals.comps.includes("normal4") || player.reboot.reboot_upgs[5] },
        see_desc: "Complete challenge 4 or buy Accelerant to unlock.",
        action() { UPGS.bits.max(4) },
    },
    5: {
        dis: "Bit Compress autobuyer",
        id: "auto_compress",
        time: 800,
        unl() { return player.infinity.unlocked },
        see() { return player.infinity.chals.comps.includes("inf4") },
        see_desc: "Complete Infinity challenge 4 to unlock.",
        action() { UPGS.bits.max(6); FORMS.bits.compress.doCompress() },
    },
}
