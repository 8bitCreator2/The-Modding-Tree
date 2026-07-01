addLayer("kernel", {
    name() { return "Kernel" },
    symbol: "KC",
    position: 0,
    startData() { return { unlocked: false, points: new Decimal(0), upgrades: {} } },
    tooltip: "The final layer — earn Kernel Crystals for permanent, account-wide power.",
    color: "#00c853",
    requires: new Decimal(1),
    type: "none",
    doReset() {
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
    row: 4,
    layerShown() { return player.infinity.chals.comps.length >= 12 },
    tabFormat: {
        "Kernel": {
            content: [
                ["display-text", function() {
                    let kc = player.kernel.points
                    let html = '<div style="padding:8px;">'
                    html += '<h3 style="color:#00c853;">~ Infinity Kernel ~</h3>'
                    html += '<div style="font-size:11px;color:#888;margin:8px 0;">Reset everything to earn Kernel Crystals for permanent power.</div>'
                    html += '<div style="font-size:16px;margin:10px 0;">You have <b style="color:#00c853;">' + format(kc, 2) + '</b> Kernel Crystals</div>'
                    if (kc.gte(1) || FORMS.kernel.can()) {
                        let gain = FORMS.kernel.gain()
                        html += '<button class="btn" style="background:#00c853;color:#111;margin:10px 0;" onmousedown="FORMS.kernel.reset()">'
                        html += 'Reset for <b>' + format(gain, 0) + '</b> KC</button>'
                        html += '<div style="font-size:9px;color:#666;margin-bottom:10px;">Resets Bits, Reboot, Infinity, and Modules.</div>'
                    }
                    if (kc.gte(1)) {
                        html += '<hr style="border-color:#2a2e4a;"><br>'
                        html += '<h4 style="color:#00c853;">Kernel Upgrades</h4>'
                        for (let r = 1; r <= 3; r++) {
                            html += '<div class="table_center" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:8px;">'
                            for (let c = 1; c <= 4; c++) {
                                let id = r*10 + c
                                if (id > 32) continue
                                let lvl = player.kernel.upgrades[id] || 0
                                let cost = FORMS.kernel.upgCost(id)
                                let canBuy = FORMS.kernel.canBuy(id)
                                html += '<div style="min-width:200px;padding:10px;background:#181c30;border:1px solid #2a2e4a;border-radius:6px;' + (lvl>0?'border-color:#00c853;':'') + '">'
                                html += '<div style="font-weight:bold;color:#00c853;">' + FORMS.kernel.upgName(id) + ' <span style="color:#888;">(' + lvl + '/10)</span></div>'
                                html += '<div style="font-size:10px;color:#aaa;min-height:30px;">' + FORMS.kernel.upgDesc(id) + '</div>'
                                html += '<button class="btn" style="' + (canBuy?'background:#00c853;color:#111;':'opacity:0.5;') + '" onmousedown="FORMS.kernel.buy(' + id + ')" ' + (!canBuy?'disabled':'') + '>'
                                html += 'Upgrade (' + format(cost, 0) + ' KC)</button></div>'
                            }
                            html += '</div>'
                        }
                    }
                    html += '</div>'
                    return html
                }],
            ],
        },
    },
})
