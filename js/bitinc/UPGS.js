Decimal.prototype.softcap = function(start, force, mode, log=false){
    var x = this.clone()
    start = new Decimal(start)
    if (x.lt(start)) return x
    if (log) { start = start.log10(); x = x.log10() }
    if([0,"pow"].includes(mode)) x = x.div(start).pow(force).mul(start).min(x)
    if([1,"mul"].includes(mode)) x = x.sub(start).div(force).add(start).min(x)
    return log ? Decimal.pow(10, x) : x
}

function hasPerk(id) { return player.bits.modules.list.includes(id) }

const UPGS = {
bits: {
cols: 6,
can(x) { return player.points.gte(this[x].cost()) && (x == 2 ? !(CHALS.onChal("normal2") || CHALS.onChal("inf1")) : true) && (this[x].unl ? this[x].unl() : true) },
canBuyAt(x, level) { return player.points.gte(this[x].cost(level)) && (x == 2 ? !(CHALS.onChal("normal2") || CHALS.onChal("inf1")) : true) && (this[x].unl ? this[x].unl() : true) },
buy(x, free=false) { if (this.can(x)) { if (!free) player.points = player.points.sub(this[x].cost()).max(1); player.bits.bit_upgs[x] = player.bits.bit_upgs[x].add(1) } },
buyMax() { for (let x = 1; x <= this.cols; x++) this.max(x) },
max(x, free=false) {
if (free) {
let lo = player.bits.bit_upgs[x]
if (this[x].bulk) { let hint = this[x].bulk(player.points); if (hint && hint.gt(lo)) lo = hint }
if (!this.canBuyAt(x, lo.add(1))) { if (lo.gt(player.bits.bit_upgs[x])) player.bits.bit_upgs[x] = lo; return }
let hi = lo.add(1); while (this.canBuyAt(x, hi) && hi.lt(1e12)) hi = hi.mul(2)
if (hi.gt(1e12)) hi = new Decimal(1e12)
while (hi.sub(lo).gt(1)) { let mid = lo.add(hi).div(2).floor(); if (this.canBuyAt(x, mid)) lo = mid; else hi = mid }
if (lo.gt(player.bits.bit_upgs[x])) player.bits.bit_upgs[x] = lo; return
}
for (let i = 0; i < 10000; i++) { if (!this.can(x)) break; this.buy(x) }
},
1: { id: 1, title: "Bit Optimizer",
cost(x) { if (x === undefined) x = player.bits.bit_upgs[this.id]
let exp = x.lt(300) ? 1.5 : x.lt(10000) ? 3.0 : 10.0
let c = new Decimal(10).mul(x.add(1).pow(exp))
if (CHALS.onChal("normal3") || CHALS.onChal("inf1")) c = c.mul(10)
if (player.reboot.reboot_upgs[2]) c = c.div(player.bits.compress.pow(0.1)); return c },
effect(x) { if (x === undefined) x = player.bits.bit_upgs[this.id]
let ret = player.bits.clusters.add(1).pow(0.3).mul(player.points.log10().add(1)).mul(x).mul(0.1)
if (player.infinity.inf_upgs.includes(24)) ret = ret.mul(UPGS.inf_upg[24].effect())
if (hasPerk(7)) ret = ret.mul(1.5); if (player.reboot.reboot_upgs[5]) ret = ret.mul(1.25)
if (player.reboot.reboot_upgs[3]) ret = ret.mul(player.reboot.points.max(1).log10().add(1).pow(1.5)); return ret },
desc(eff) { if (eff === undefined) eff = this.effect(); return "Adds " + format(eff) + " bit/s per level, scaled by clusters & total bits" } },
2: { id: 2, title: "Bit Multiplier",
cost(x) { if (x === undefined) x = player.bits.bit_upgs[this.id]
let exp = x.lt(40) ? 1.6 : x.lt(500) ? 3.0 : x.lt(10000) ? 5.0 : 15.0
let c = new Decimal(10).mul(x.add(1).pow(exp))
if (CHALS.onChal("normal3") || CHALS.onChal("inf1")) c = c.mul(10)
if (player.reboot.reboot_upgs[2]) c = c.mul(0.25).div(player.bits.compress.pow(0.1)); return c },
effect(x) { if (x === undefined) x = player.bits.bit_upgs[this.id]
let lvl = x.mul(FORMS.bits.cluster.effect()).mul(CHALS.onChal("normal4") || CHALS.onChal("inf1") ? UPGS.bits[4].effect() : 1)
lvl = lvl.mul(FORMS.upgrade.upgEffect(2))
if (player.kernel.points.gte(1)) lvl = lvl.mul(FORMS.kernel.effect().repUpg)
if (player.infinity.inf_upgs.includes(24)) lvl = lvl.mul(UPGS.inf_upg[24].effect())
let ret2 = lvl.div(5); if (hasPerk(7)) ret2 = ret2.mul(1.5)
if (player.reboot.reboot_upgs[5]) ret2 = ret2.mul(1.25); return ret2 },
desc(eff) { if (eff === undefined) eff = this.effect(); return "Adds " + format(eff) + " bit/s — gets stronger with clusters & upgrades" },
bulk(x) { if (x === undefined) x = player.points
let base = new Decimal(10)
if (CHALS.onChal("normal3") || CHALS.onChal("inf1")) base = base.mul(10)
if (player.reboot.reboot_upgs[2]) base = base.mul(0.25).div(player.bits.compress.pow(0.1))
if (x.div(base).lt(1)) return new Decimal(0)
let bulk = x.div(base).pow(1/3.0).sub(1).floor(); return bulk.lt(0) ? new Decimal(0) : bulk } },
3: { id: 3, title: "Bit Power",
cost(x) { if (x === undefined) x = player.bits.bit_upgs[this.id]
let exp = x.lt(8) ? 1.2 : x.lt(1500) ? 2.5 : x.lt(10000) ? 4.0 : 12.0
let c = new Decimal(100).mul(x.add(1).pow(exp))
if (CHALS.onChal("normal3") || CHALS.onChal("inf1")) c = c.mul(10)
if (player.reboot.reboot_upgs[1]) c = c.mul(0.66)
if (player.reboot.reboot_upgs[2]) c = c.div(player.bits.compress.pow(0.1)); return c },
effect(x) { if (x === undefined) x = player.bits.bit_upgs[this.id]
let ret = new Decimal(1).add(x.mul(FORMS.bits.cluster.effect()).mul(0.02))
if (player.infinity.inf_upgs.includes(24)) ret = ret.mul(UPGS.inf_upg[24].effect())
if (hasPerk(7)) ret = ret.mul(1.5); if (player.reboot.reboot_upgs[5]) ret = ret.mul(1.25); return ret },
desc(eff) { if (eff === undefined) eff = this.effect(); return "Multiply total bit gain by x" + format(eff) + " per level, boosted by clusters" },
bulk(x) { if (x === undefined) x = player.points
let base = new Decimal(100)
if (CHALS.onChal("normal3") || CHALS.onChal("inf1")) base = base.mul(10)
if (player.reboot.reboot_upgs[1]) base = base.mul(0.66)
if (player.reboot.reboot_upgs[2]) base = base.div(player.bits.compress.pow(0.1))
if (x.div(base).lt(1)) return new Decimal(0)
let bulk = x.div(base).pow(1/2.5).sub(1).floor(); return bulk.lt(0) ? new Decimal(0) : bulk } },
4: { id: 4, title: "Bit Pipeline",
cost(x) { if (x === undefined) x = player.bits.bit_upgs[this.id]
let exp = x.lt(5) ? 2.0 : x.lt(50) ? 4.0 : x.lt(10000) ? 6.0 : 15.0
let c = new Decimal(500).mul(x.add(1).pow(exp))
if (player.reboot.reboot_upgs[2]) c = c.div(player.bits.compress.pow(0.1)); return c },
effect(x) { if (x === undefined) x = player.bits.bit_upgs[this.id]
let ret = new Decimal(1).add(player.points.log10().div(20).mul(x).mul(FORMS.bits.cluster.effect()))
if (player.infinity.inf_upgs.includes(24)) ret = ret.mul(UPGS.inf_upg[24].effect())
if (hasPerk(7)) ret = ret.mul(1.5); if (player.reboot.reboot_upgs[5]) ret = ret.mul(1.25); return ret },
desc(eff) { if (eff === undefined) eff = this.effect(); return "Multiply total bit gain by x" + format(eff) + ", scales with total bits & clusters" },
bulk(x) { if (x === undefined) x = player.points
let base = new Decimal(500); if (player.reboot.reboot_upgs[3]) base = base.mul(0.5)
if (player.reboot.reboot_upgs[2]) base = base.div(player.bits.compress.pow(0.1))
if (x.div(base).lt(1)) return new Decimal(0)
let bulk = x.div(base).pow(0.25).sub(1).floor(); return bulk.lt(0) ? new Decimal(0) : bulk } },
5: { id: 5, title: "Bit Accelerator",
cost(x) { if (x === undefined) x = player.bits.bit_upgs[this.id]
let exp = x.lt(250) ? 1.8 : x.lt(10000) ? 3.0 : 10.0
let c = new Decimal(10000).mul(x.add(1).pow(exp))
if (player.reboot.reboot_upgs[4]) c = c.div(15); return c },
effect(x) { if (x === undefined) x = player.bits.bit_upgs[this.id]
let ret = x.mul(2); if (player.infinity.inf_upgs.includes(24)) ret = ret.mul(UPGS.inf_upg[24].effect())
if (hasPerk(7)) ret = ret.mul(1.5); if (player.reboot.reboot_upgs[5]) ret = ret.mul(1.25); return ret },
desc(eff) { if (eff === undefined) eff = this.effect(); return "Adds +" + format(eff) + " flat bit/s (after multipliers) per level" },
bulk(x) { if (x === undefined) x = player.points
let base = new Decimal(10000); if (player.reboot.reboot_upgs[4]) base = base.div(15)
if (x.div(base).lt(1)) return new Decimal(0)
let bulk = x.div(base).pow(1/1.8).sub(1).floor(); return bulk.lt(0) ? new Decimal(0) : bulk } },
6: { id: 6, title: "Parallel Bits", unl() { return player.infinity.unlocked },
cost(x) { if (x === undefined) x = player.bits.bit_upgs[this.id]
let exp = x.lt(10000) ? 2.0 : 8.0; return new Decimal(100000).mul(x.add(1).pow(exp)) },
effect(x) { if (x === undefined) x = player.bits.bit_upgs[this.id]
let ret = new Decimal(1).add(x.mul(0.05))
if (player.infinity.inf_upgs.includes(24)) ret = ret.mul(UPGS.inf_upg[24].effect())
if (hasPerk(7)) ret = ret.mul(1.5); if (player.reboot.reboot_upgs[5]) ret = ret.mul(1.25); return ret },
desc(eff) { if (eff === undefined) eff = this.effect(); return "Raise total bit gain to the ^" + format(eff) + " power per level" },
bulk(x) { if (x === undefined) x = player.points
let base = new Decimal(100000); if (x.div(base).lt(1)) return new Decimal(0)
let bulk = x.div(base).pow(0.5).sub(1).floor(); return bulk.lt(0) ? new Decimal(0) : bulk } },
},
reboot: {
cols: 5,
can(x) { let lvl = player.reboot.reboot_upgs[x] || 0; if (lvl >= 1) return false; return player.reboot.points.gte(this[x].cost()) },
buy(x) { if (this.can(x)) { player.reboot.points = player.reboot.points.sub(this[x].cost()); player.reboot.reboot_upgs[x] = 1 } },
1: { id: 1, title: "Bit Empowerment", cost() { return new Decimal(1) }, desc() { return "Bits self-boost. Bit Power cost -34%. RP boost bits." } },
2: { id: 2, title: "Cost Cutter", cost() { return new Decimal(3) }, desc() { return "Bit Multiplier cost x0.25. Better compress formula." } },
3: { id: 3, title: "Cluster Compression", cost() { return new Decimal(5) }, desc() { return "Cluster cost /10, effect x1.1. RP boost Optimizer." } },
4: { id: 4, title: "Accelerant", cost() { return new Decimal(200) }, desc() { return "Accelerator cost /15. Unlock autobuyers." } },
5: { id: 5, title: "Synergy", cost() { return new Decimal(325) }, desc() { return "All upgrade effects x1.25. RP gain 2x. Unlock more." } },
},
upgrade: {
cols: 4,
can(x) { let upg = this[x]; if (upg.unl && !upg.unl()) return false; return player.upgrade.points.gte(upg.cost()) },
buy(x) { if (this.can(x)) { let upg = this[x]; player.upgrade.points = player.upgrade.points.sub(upg.cost()); player.upgrade.upgrades[x] = (player.upgrade.upgrades[x] || 0) + 1 } },
1: { unl() { return true }, cost() { let lvl = player.upgrade.upgrades[1] || 0; return (lvl + 1) * Math.pow(2, lvl + 1) } },
2: { unl() { return true }, cost() { let lvl = player.upgrade.upgrades[2] || 0; return (lvl + 1) * 2 } },
3: { unl() { return true }, cost() { let lvl = player.upgrade.upgrades[3] || 0; return (lvl + 1) * Math.pow(2, lvl + 1) } },
4: { unl() { return true }, cost() { let lvl = player.upgrade.upgrades[4] || 0; return (lvl + 1) * 2 } },
},
inf_upg: {
cols: 4, rows: 2,
can(x) { return player.infinity.points.gte(this[x].cost) && !player.infinity.inf_upgs.includes(x) },
buy(x) { if (this.can(x)) { player.infinity.points = player.infinity.points.sub(this[x].cost); player.infinity.inf_upgs.push(x) } },
11: { unl() { return true }, desc: "Bit gain x2.", cost: new Decimal(2), effect() { return new Decimal(2) }, effDesc(eff) { if (eff===undefined)eff=this.effect();return format(eff)+'x' } },
12: { unl() { return true }, desc: "IP gain x2.", cost: new Decimal(5), effect() { return new Decimal(2) }, effDesc(eff) { if (eff===undefined)eff=this.effect();return format(eff)+'x' } },
13: { unl() { return true }, desc: "Keep Inf upgrades on reset.", cost: new Decimal(25) },
14: { unl() { return true }, desc: "All bit upgrades 15% stronger.", cost: new Decimal(100), effect() { return new Decimal(1.15) }, effDesc(eff) { if (eff===undefined)eff=this.effect();return format(eff)+'x' } },
21: { unl() { return true }, desc: "Cluster formula better.", cost: new Decimal(500), effect() { return new Decimal(1.5) }, effDesc(eff) { if (eff===undefined)eff=this.effect();return format(eff)+'x cluster' } },
22: { unl() { return FORMS.bits.compress.unl() }, desc: "Compress boosts IP gain.", cost: new Decimal(2500), effect() { return new Decimal(2).pow(player.bits.compress.pow(0.3)) }, effDesc(eff) { if (eff===undefined)eff=this.effect();return format(eff)+'x' } },
23: { unl() { return true }, desc: "Pipeline 2x stronger.", cost: new Decimal(10000), effect() { return new Decimal(2) }, effDesc(eff) { if (eff===undefined)eff=this.effect();return format(eff)+'x Pipeline' } },
24: { unl() { return true }, desc: "All Bit upgrade effects 25% stronger.", cost: new Decimal(50000), effect() { return new Decimal(1.25) }, effDesc(eff) { if (eff===undefined)eff=this.effect();return format(eff)+'x' } },
},
}
