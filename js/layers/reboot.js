addLayer("reboot", {
    name() { return "Reboot" },
    symbol: "RP",
    position: 0,
    startData() { return { unlocked: true, points: new Decimal(0), reboot_upgs: {} } },
    color: "#ffaa2b",
    requires: new Decimal(1000),
    tooltip: "Reach 1,000 bits to reboot and earn Reboot Points for permanent multipliers.",
    resource() { return "Reboot Points" },
    baseResource() { return "Bits" },
    baseAmount() { return player.points },
    type: "custom",
    getResetGain() { return FORMS.reboot.gain() },
    getNextAt() { return new Decimal(1000).mul(new Decimal(10).pow(player.reboot.points)) },
    canReset() { return player.points.gte(1000) },
    onPrestige(gain) {
        player.reboot.unlocked = true
        if (player.bits.clusters.lte(0)) ACHS.unl(24)
    },
    doReset() {
        player.bits.clusters = new Decimal(0)
        player.bits.compress = new Decimal(1)
        player.bits.chip = new Decimal(1)
        FORMS.bits.cluster.onReset()
    },
    row: 1,
    layerShown() { return true },
    tabFormat: {
        "Reboot": {
            content: [
                "main-display",
                ["display-text", function() {
                    let gain = FORMS.reboot.gain()
                    let can = player.points.gte(1000)
                    let html = '<div style="padding:8px 0;">'
                    if (can) {
                        html += '<button class="btn" style="background:#ffaa2b;color:#111;padding:8px 24px;font-size:14px;" onmousedown="FORMS.reboot.reset()">'
                        html += 'Reset for <b>' + format(gain) + '</b> RP</button>'
                    } else {
                        html += '<button class="btn" style="opacity:0.5;padding:8px 24px;font-size:14px;" disabled>'
                        html += 'Need 1,000 bits to unlock Reboot</button>'
                    }
                    html += '</div>'
                    return html
                }],
                "resource-display",
                "blank",
                ["display-text", function() {
                    let html = '<div class="table_center" style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;">'
                    for (let x = 1; x <= UPGS.reboot.cols; x++) {
                        let upg = UPGS.reboot[x]
                        let owned = player.reboot.reboot_upgs[x] ? true : false
                        let canAfford = UPGS.reboot.can(x)
                        html += '<div style="min-width:220px;margin:5px;padding:10px;background:#181c30;border:1px solid #2a2e4a;border-radius:6px;">'
                        html += '<h3 style="color:#ffaa2b;">' + upg.title + '</h3><br>'
                        html += '<div style="font-size:10px;color:#999;margin-bottom:6px;">' + upg.desc() + '</div>'
                        if (owned) {
                            html += '<div style="color:#14b8a6;font-weight:bold;font-size:12px;">OWNED</div>'
                        } else {
                            html += '<button class="btn" style="' + (canAfford?'background:#ffaa2b;color:#111;':'opacity:0.5;') + '" onmousedown="UPGS.reboot.buy(' + x + ')" ' + (!canAfford?'disabled':'') + '>'
                            html += 'Cost: ' + format(upg.cost()) + ' RP</button>'
                        }
                        html += '</div>'
                    }
                    html += '</div>'
                    return html
                }],
            ],
        },
        "Compute": {
            content: [
                ["display-text", function() {
                    let pp = player.bits.compute.pp || new Decimal(0)
                    let toggle = player.bits.compute.toggle
                    let unl = player.bits.compute.unl || player.reboot.reboot_upgs[3]
                    if (!unl) return '<div style="color:#666;padding:16px;">Buy Cluster Compression (Reboot Upgrade 3) to unlock Processing Power.</div>'
                    let html = '<div style="padding:8px;">'
                    html += '<h3 style="color:#00c853;">Processing Power: ' + format(pp, 2) + '</h3>'
                    html += '<div style="font-size:10px;color:#888;margin:8px 0;">Toggle to divert half of bit gain into processing power.</div>'
                    html += '<button class="btn" onmousedown="player.bits.compute.toggle=!player.bits.compute.toggle" style="' + (toggle?'background:#00c853;color:#111;':'') + 'margin-bottom:12px;">'
                    html += (toggle ? 'ON: Bits halved, PP generated' : 'OFF: Normal bits') + '</button><br>'
                    html += '<div class="table_center" style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;">'
                    for (let id of [1,2,3]) {
                        if (!FORMS.compute.upgUnl(id)) continue
                        let lvl = (player.bits.compute.upgrades && player.bits.compute.upgrades[id]) || 0
                        let cost = FORMS.compute.upgCost(id)
                        let canBuy = FORMS.compute.canBuy(id)
                        html += '<div style="min-width:200px;margin:5px;padding:10px;background:#181c30;border:1px solid #2a2e4a;border-radius:6px;">'
                        html += '<div style="font-weight:bold;color:#00c853;">' + FORMS.compute.upgName(id) + '</div>'
                        html += '<div style="font-size:10px;color:#aaa;margin:4px 0;">' + FORMS.compute.upgDesc(id) + '</div>'
                        if (lvl > 0) html += '<div style="color:#14b8a6;">Level ' + lvl + '</div>'
                        html += '<button class="btn" style="' + (canBuy?'background:#00c853;color:#111;':'opacity:0.5;') + '" onmousedown="FORMS.compute.buy(' + id + ')" ' + (!canBuy?'disabled':'') + '>'
                        html += 'Cost: ' + format(cost, 2) + ' PP</button></div>'
                    }
                    html += '</div></div>'
                    return html
                }],
            ],
            unlocked() { return player.bits.compute.unl || player.reboot.reboot_upgs[3] },
        },
    },
})
