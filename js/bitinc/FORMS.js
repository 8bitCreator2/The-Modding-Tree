const FORMS = {
    MAX: new Decimal("1e50"),
    secretMessage(msg, seen=true) { return seen ? msg : "???" },
    bits: {
        gain() {
            let bps = new Decimal(1)
            bps = bps.add(UPGS.bits[1].effect())
            bps = bps.add(UPGS.bits[2].effect())
            if (CHALS.onChal("normal2") || CHALS.onChal("inf1")) bps = new Decimal(2)
            if (hasPerk(1)) bps = bps.mul(2)
            if (hasPerk(16)) bps = bps.mul(1.25)
            if (hasPerk(9)) bps = bps.mul(3)
            if (hasPerk(12)) bps = bps.mul(1 + 0.02 * PERKS.owned())
            if (hasPerk(13) && player.infinity.chals.active) bps = bps.mul(2)
            if (hasPerk(15)) bps = bps.mul(2)
            if (hasPerk(27)) bps = bps.mul(1.5)
            if (this.compress.unl()) bps = bps.mul(this.compress.effMult())
            if (player.bits.compute.upgrades[1]) bps = bps.mul(new Decimal(1).add((player.bits.compute.upgrades[1] || 0) * 0.3))
            bps = bps.mul(UPGS.bits[3].effect())
            if (hasPerk(5)) bps = bps.pow(1.05)
            if (hasPerk(20)) bps = bps.pow(1.03)
            if (hasPerk(14)) bps = bps.pow(1.15)
            if (hasPerk(24)) bps = bps.pow(1.05)
            if (player.reboot.reboot_upgs[1]) {
                bps = bps.mul(player.points.log10().add(1).mul(0.05).add(1))
                if (player.reboot.points.gt(0)) bps = bps.mul(player.reboot.points.log10().add(1).mul(0.75).add(1))
            }
            bps = bps.mul(FORMS.upgrade.upgEffect(4))
            bps = bps.mul(UPGS.bits[4].effect())
            bps = bps.add(UPGS.bits[5].effect())
            if (hasPerk(25)) bps = bps.mul(1 + 0.05 * player.upgrade.level.toNumber())
            if (player.kernel.points.gte(1)) {
                let ke = this.kernelEffect()
                bps = bps.mul(ke.growth)
                bps = bps.pow(ke.growthPow)
            }
            if (UPGS.bits[6].unl()) bps = bps.pow(UPGS.bits[6].effect())
            if (player.infinity.inf_upgs.includes(11)) bps = bps.mul(UPGS.inf_upg[11].effect())
            let ret = bps
            if (ret.lt(1) || ret.isNan() || !ret.isFinite()) ret = new Decimal(1)
            return ret
        },
        cluster: {
            req(x) {
                if (x === undefined) x = player.bits.clusters
                let r = new Decimal(1000).mul(new Decimal(5).pow(x.min(10))).mul(new Decimal(10).pow(x.sub(10).max(0))).div(FORMS.upgrade.upgEffect(3)).max(1)
                if (player.reboot.reboot_upgs[3]) r = r.div(10)
                if (ACHS.has(45)) r = r.mul(0.9)
                return r
            },
            can() { return player.points.gte(this.req()) && !CHALS.onChal("inf2") },
            reset(bulk=false) {
                if (this.can()) {
                    if (bulk && this.bulk().gt(player.bits.clusters)) player.bits.clusters = this.bulk()
                    else player.bits.clusters = player.bits.clusters.add(1)
                    this.onReset()
                }
            },
            onReset(force=false) {
                player.points = new Decimal(1)
                if (!force && player.kernel.points.gte(1)) player.points = player.points.add(FORMS.kernel.effect().start)
                for (let x = 1; x <= UPGS.bits.cols; x++) player.bits.bit_upgs[x] = new Decimal(0)
            },
            effect(x) {
                if (x === undefined) x = player.bits.clusters
                let ret = x
                ret = ret.mul(FORMS.upgrade.upgEffect(3))
                if (ACHS.has(24)) ret = ret.mul(1.25)
                if (hasPerk(2)) ret = ret.mul(1.5)
                if (hasPerk(18)) ret = ret.mul(1.25)
                if (hasPerk(14)) ret = ret.mul(3)
                if (hasPerk(15)) ret = ret.mul(2)
                if (hasPerk(27)) ret = ret.mul(1.5)
                if (player.kernel.points.gte(1)) ret = ret.mul(FORMS.kernel.effect().galaxy)
                if (player.infinity.inf_upgs.includes(21)) ret = ret.mul(UPGS.inf_upg[21].effect())
                if (hasPerk(21)) ret = ret.mul(2)
                if (player.reboot.reboot_upgs[3]) ret = ret.mul(1.1)
                let rootExp = 3
                return ret.add(1).root(rootExp)
            },
            bulk(x) {
                if (x === undefined) x = player.points
                let mul = FORMS.upgrade.upgEffect(3)
                let adjusted = x.mul(mul)
                if (adjusted.lt(1000)) return new Decimal(0)
                return adjusted.div(1000).max(1).logBase(5).add(1).floor()
            },
        },
        compress: {
            unl() { return player.bits.compress_unl },
            calcMult(v) { if (v === undefined) v = player.points; return v.log10().add(1).pow(1.25) },
            effMult(v) {
                if (v === undefined) v = player.bits.compress
                let m = v
                if (m.gt(4)) m = new Decimal(4).mul(m.div(4).pow(0.5))
                return m
            },
            can() { return this.calcMult().gt(player.bits.compress) },
            doCompress() {
                if (this.can()) {
                    player.bits.compress = this.calcMult()
                    player.bits.compress_unl = true
                    player.points = new Decimal(1)
                }
            },
        },
        chip: {
            unl() { return player.bits.chip_unl },
            calcMult(v) { if (v === undefined) v = player.points; return v.log10().add(1).pow(0.5) },
            effMult(v) {
                if (v === undefined) v = player.bits.chip
                let m = v
                if (m.gt(10)) m = new Decimal(10).mul(m.div(10).pow(0.5))
                return m
            },
            can() { return this.calcMult().gt(player.bits.chip) },
            doChip() {
                if (this.can()) {
                    player.bits.chip = this.calcMult()
                    player.bits.chip_unl = true
                    player.points = new Decimal(1)
                }
            },
            effect() {
                if (!player.bits.chip_unl) return new Decimal(1)
                let ret = this.effMult()
                if (player.reboot.reboot_upgs[5]) ret = ret.mul(FORMS.compute.upgEffect(3))
                return ret
            },
            displaySet() { return this.effMult(this.calcMult()) },
        },
        kernelEffect() {
            let ke = FORMS.kernel.effect()
            return { growth: ke.growth || new Decimal(1), growthPow: ke.growthPow || new Decimal(1) }
        },
    },
    reboot: {
        seen() { return player.bits.clusters.gte(2) || player.reboot.unlocked },
        gain() {
            let gain = player.points.div(1000).log10().add(1)
            if (gain.lt(1)) return new Decimal(0)
            if (CHALS.onChal("normal6") || CHALS.onChal("inf1")) gain = gain.pow(0.85)
            if (hasPerk(3)) gain = gain.mul(2)
            if (hasPerk(6)) gain = gain.mul(2)
            if (hasPerk(14)) gain = gain.mul(5)
            if (hasPerk(15)) gain = gain.mul(2)
            if (hasPerk(19)) gain = gain.mul(1.25)
            if (hasPerk(27)) gain = gain.mul(1.5)
            if (player.kernel.points.gte(1)) gain = gain.mul(FORMS.kernel.effect().prestige)
            if (player.reboot.reboot_upgs[5]) gain = gain.mul(2)
            if (player.bits.compute.upgrades[2]) gain = gain.mul(new Decimal(1).add((player.bits.compute.upgrades[2] || 0) * 0.25))
            return gain.floor()
        },
        can() { return this.gain().gte(1) },
        reset() {
            if (this.can()) {
                player.reboot.unlocked = true
                player.reboot.points = player.reboot.points.add(this.gain())
                if (player.bits.clusters.lte(0)) ACHS.unl(24)
                this.onReset()
            }
        },
        onReset(force=false) {
            player.bits.clusters = new Decimal(0)
            player.bits.compress = new Decimal(1)
            player.bits.chip = new Decimal(1)
            FORMS.bits.cluster.onReset(force)
        },
    },
    upgrade: {
        unl() { return player.reboot.unlocked },
        gain() {
            let rp = player.reboot.points
            if (rp.lt(1e3)) return new Decimal(0)
            let gain = rp.div(1e3).log10().add(1).pow(1.25).floor()
            return gain.max(0)
        },
        bulk(rp) { if (rp === undefined) rp = player.reboot.points; if (rp.lt(1e3)) return new Decimal(0); return rp.div(1e3).log10().add(1).pow(1.25).floor() },
        reqPP(lvl) { if (lvl === undefined) lvl = player.upgrade.level.add(1); if (lvl.lte(0)) return new Decimal(0); return new Decimal(1000).mul(new Decimal(10).pow(lvl.pow(0.8).sub(1))) },
        can() { if (player.infinity.chals.active) return false; return this.gain().gt(player.upgrade.level) },
        reset(bulk=false) {
            if (this.can()) {
                player.upgrade.level = player.upgrade.level.add(1)
                player.reboot.points = new Decimal(0)
                this.addPoints()
            }
        },
        addPoints() {
            let total = player.upgrade.level
            let spent = new Decimal(0)
            for (let x = 1; x <= UPGS.upgrade.cols; x++) spent = spent.add(player.upgrade.upgrades[x] || 0)
            player.upgrade.points = total.sub(spent).max(0)
        },
        milestones: [[1,1],[3,1],[5,1],[8,1],[11,1],[15,2],[20,2],[25,2],[30,2],[40,3],[50,3],[65,3],[80,4],[100,5],[125,5],[150,5],[200,5],[300,5],[500,5]],
        getUpg(id) { return player.upgrade.upgrades[id] || 0 },
        upgEffect(id) {
            let lvl = this.getUpg(id)
            switch (id) {
                case 1: return new Decimal(1).add(lvl * 0.5)
                case 2: return new Decimal(1).add(lvl * 0.4)
                case 3: return new Decimal(1).add(lvl * 0.5)
                case 4: return new Decimal(1).add(lvl * 0.25)
                default: return new Decimal(1)
            }
        },
        totalAP() { return player.upgrade.level },
        spentAP() { let spent = new Decimal(0); for (let x = 1; x <= UPGS.upgrade.cols; x++) spent = spent.add(player.upgrade.upgrades[x] || 0); return spent },
        upgName(id) { const n = {1:"Upgraded Reboot",2:"Upgraded Power",3:"Upgraded Cluster",4:"Upgraded Mastery"}; return n[id] || "Unknown" },
        upgDesc(id) {
            let eff = this.upgEffect(id)
            switch (id) {
                case 1: return "RP gain x" + format(eff)
                case 2: return "Bit upgrade effects x" + format(eff)
                case 3: return "Cluster effect x" + format(eff) + " & req /" + format(eff)
                case 4: return "Bit gain x" + format(eff)
            }
            return ""
        },
    },
    inf: {
        reached() { return player.points.gte(FORMS.MAX) },
        seen() { return player.infinity.unlocked },
        gain() {
            let gain = player.points.log10().div(50)
            if (gain.lt(1)) return new Decimal(0)
            gain = gain.pow(2)
            if (player.infinity.inf_upgs.includes(12)) gain = gain.mul(UPGS.inf_upg[12].effect())
            if (player.infinity.inf_upgs.includes(22)) gain = gain.mul(UPGS.inf_upg[22].effect())
            if (player.kernel.points.gte(1)) gain = gain.mul(FORMS.kernel.effect().infinity)
            return gain.floor()
        },
        can() {
            if (player.infinity.chals.active.startsWith("normal")) return player.points.gte(FORMS.MAX)
            if (player.infinity.chals.active.startsWith("inf")) return CHALS.inf.canComplete()
            if (player.infinity.chals.active.startsWith("post_inf")) return CHALS.post_inf.canComplete()
            return this.gain().gte(1)
        },
        reset() {
            if (this.reached() || this.can()) {
                if (player.infinity.best > player.infinity.time) player.infinity.best = player.infinity.time
                if (player.infinity.chals.active.startsWith("normal") || player.infinity.chals.active.startsWith("inf") || player.infinity.chals.active.startsWith("post_inf")) {
                    if (!player.infinity.chals.comps.includes(player.infinity.chals.active)) player.infinity.chals.comps.push(player.infinity.chals.active)
                    if (player.bits.stats.chals_best[player.infinity.chals.active] === undefined) player.bits.stats.chals_best[player.infinity.chals.active] = 999999999
                    if (player.infinity.time < player.bits.stats.chals_best[player.infinity.chals.active]) player.bits.stats.chals_best[player.infinity.chals.active] = player.infinity.time
                    CHALS.exit()
                }
                player.infinity.points = player.infinity.points.add(this.gain())
                player.infinity.unlocked = true
                this.onReset()
            }
        },
        onReset(force=false) {
            player.infinity.time = 0
            player.reboot.points = new Decimal(0)
            if (!player.infinity.inf_upgs.includes(13) || force) player.infinity.inf_upgs = []
            player.bits.modules.list = []
            player.bits.modules.unl = false
            player.bits.stats.best_bits = new Decimal(1)
            FORMS.reboot.onReset(force)
        },
    },
    kernel: {
        unl() {
            let ch = player.infinity.chals.comps
            return ch.includes("normal1") && ch.includes("normal2") && ch.includes("normal3")
                && ch.includes("normal4") && ch.includes("normal5") && ch.includes("normal6")
                && ch.includes("inf1") && ch.includes("inf2") && ch.includes("inf3")
                && ch.includes("inf4") && ch.includes("inf5") && ch.includes("inf6")
                && ch.includes("post_inf1")
        },
        gain() {
            let gain = player.infinity.points.root(2).floor()
            if (hasPerk(26)) gain = gain.mul(1.25)
            return gain.max(1)
        },
        can() { return this.unl() && player.infinity.points.gte(1) },
        reset() {
            if (this.can()) {
                player.kernel.points = player.kernel.points.add(this.gain())
                this.onReset()
            }
        },
        onReset() {
            player.points = new Decimal(1)
            player.bits.clusters = new Decimal(0)
            player.bits.compress = new Decimal(1)
            player.bits.chip = new Decimal(1)
            player.bits.bit_upgs = {}
            for (let x = 1; x <= UPGS.bits.cols; x++) player.bits.bit_upgs[x] = new Decimal(0)
            player.reboot.points = new Decimal(0)
            player.reboot.unlocked = false
            player.upgrade.level = new Decimal(0)
            player.upgrade.points = new Decimal(0)
            player.upgrade.upgrades = {}
            for (let x = 1; x <= UPGS.upgrade.cols; x++) player.upgrade.upgrades[x] = 0
            player.infinity.points = new Decimal(0)
            player.infinity.time = 0
            player.infinity.unlocked = false
            player.infinity.inf_upgs = []
            player.bits.modules.list = []
            player.bits.modules.unl = false
            player.bits.stats.best_bits = new Decimal(1)
            player.bits.time = 0
        },
        effect() {
            let ret = { growth: new Decimal(1), growthPow: new Decimal(1), storage: new Decimal(1), repUpg: new Decimal(1), galaxy: new Decimal(1), prestige: new Decimal(1), infinity: new Decimal(1), sacrifice: new Decimal(1), all: new Decimal(1), softcapStart: new Decimal(0), start: new Decimal(0) }
            let u = player.kernel.upgrades
            let nx = (id) => u[id] || 0
            let ttl = 0
            for (let x = 1; x <= 3; x++) for (let y = 1; y <= 4; y++) ttl += nx(x*10+y)
            let allEff = new Decimal(1.1).pow(ttl)
            if (nx(32) > 0) allEff = allEff.mul(new Decimal(1.5).pow(nx(32)))
            ret.all = allEff
            ret.growth = allEff.mul(new Decimal(2).pow(nx(11)))
            ret.storage = allEff.mul(new Decimal(10).pow(nx(12)))
            ret.repUpg = allEff.mul(new Decimal(2).pow(nx(13)))
            ret.galaxy = allEff.mul(new Decimal(2).pow(nx(14)))
            ret.prestige = allEff.mul(new Decimal(2).pow(nx(21)))
            ret.infinity = allEff.mul(new Decimal(2).pow(nx(22)))
            ret.sacrifice = allEff.mul(new Decimal(1.5).pow(nx(23)))
            ret.softcapStart = nx(31) * 5
            ret.start = new Decimal(10).pow(nx(31) * 10)
            ret.growthPow = new Decimal(1.1).pow(nx(11))
            return ret
        },
        upgCost(id) { let lvl = player.kernel.upgrades[id] || 0; return new Decimal(10).pow(Math.pow(lvl + 1, 1.5)) },
        canBuy(id) { let lvl = player.kernel.upgrades[id] || 0; if (lvl >= 10) return false; return player.kernel.points.gte(this.upgCost(id)) },
        buy(id) { if (this.canBuy(id)) { player.kernel.points = player.kernel.points.sub(this.upgCost(id)); player.kernel.upgrades[id] = (player.kernel.upgrades[id] || 0) + 1 } },
        upgName(id) {
            const n = {11:"Kernel Growth",12:"Kernel Storage",13:"Kernel Power",14:"Kernel Cluster",21:"Kernel Reboot",22:"Kernel Infinity",23:"Kernel Compress",24:"Kernel Boost",31:"Genesis",32:"Mastery"}
            return n[id] || "Unknown"
        },
        upgDesc(id) {
            let n = (id) => player.kernel.upgrades[id] || 0
            switch (id) {
                case 11: return "Bit gain x" + format(new Decimal(2).pow(n(11))) + " & ^" + format(new Decimal(1.1).pow(n(11)))
                case 12: return "All upgrades x" + format(new Decimal(10).pow(n(12))) + " stronger"
                case 13: return "Bit upgrades x" + format(new Decimal(2).pow(n(13))) + " stronger"
                case 14: return "Cluster effect x" + format(new Decimal(2).pow(n(14)))
                case 21: return "Reboot gain x" + format(new Decimal(2).pow(n(21)))
                case 22: return "IP gain x" + format(new Decimal(2).pow(n(22)))
                case 23: return "Compress effect x" + format(new Decimal(1.5).pow(n(23)))
                case 24: return "All kernel effects x" + format(new Decimal(1.1).pow(n(24)))
                case 31: return "Softcap +" + (n(31)*5) + " OoM later & start +" + format(new Decimal(10).pow(n(31)*10),0) + " bits"
                case 32: return "All kernel effects x" + format(new Decimal(1.5).pow(n(32)))
            }
            return ""
        },
    },
    compute: {
        unl() { return player.bits.compute.unl || player.reboot.reboot_upgs[3] },
        upgUnl(id) { if (id <= 2) return true; return player.reboot.reboot_upgs[5] },
        upgEffect(id) {
            let lvl = (player.bits.compute.upgrades && player.bits.compute.upgrades[id]) || 0
            if (id == 1) return new Decimal(1).add(lvl * 0.3)
            if (id == 2) return new Decimal(1).add(lvl * 0.25)
            return new Decimal(1).add(lvl * 0.5)
        },
        upgCost(id) {
            let lvl = (player.bits.compute.upgrades && player.bits.compute.upgrades[id]) || 0
            let base = id == 1 ? 10 : id == 2 ? 25 : 50
            return new Decimal(base).mul(new Decimal(2.5).pow(lvl))
        },
        canBuy(id) { return this.upgUnl(id) && player.bits.compute.pp && player.bits.compute.pp.gte(this.upgCost(id)) },
        buy(id) {
            if (this.canBuy(id)) {
                player.bits.compute.pp = player.bits.compute.pp.sub(this.upgCost(id))
                if (!player.bits.compute.upgrades) player.bits.compute.upgrades = {}
                player.bits.compute.upgrades[id] = (player.bits.compute.upgrades[id] || 0) + 1
            }
        },
        upgName(id) { if (id == 1) return "Overclock"; if (id == 2) return "Reboot Pipeline"; return "Chip Amplifier" },
        upgDesc(id) {
            let eff = this.upgEffect(id)
            if (id == 1) return "Bit gain x" + format(eff)
            if (id == 2) return "RP gain x" + format(eff)
            return "Chip effect x" + format(eff)
        },
    },
}

function getDisplayShrink(x) { return x.gte(1e4) ? "1 / "+format(x) : format(x.pow(-1)) }
