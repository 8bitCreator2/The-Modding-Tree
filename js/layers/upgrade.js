addLayer("upgrade", {
    name() { return "Upgrade" },
    symbol: "UP",
    position: 0,
    startData() {
        let upgs = {}
        for (let x = 1; x <= 4; x++) upgs[x] = 0
        return { unlocked: false, points: new Decimal(0), level: new Decimal(0), upgrades: upgs }
    },
    color: "#8B5CF6",
    requires: new Decimal(1e3),
    tooltip: "Spend RP to gain Upgrade Levels and purchase permanent upgrades.",
    resource() { return "Upgrade Points" },
    baseResource() { return "Reboot Points" },
    baseAmount() { return player.reboot.points },
    type: "custom",
    getResetGain() { return FORMS.upgrade.gain() },
    getNextAt() { return new Decimal(1000).mul(new Decimal(10).pow(player.upgrade.level.add(1).pow(0.8).sub(1))) },
    canReset() { return FORMS.upgrade.can() },
    onPrestige(gain) {
        player.upgrade.level = player.upgrade.level.add(gain)
        player.reboot.points = new Decimal(0)
        FORMS.upgrade.addPoints()
        player.upgrade.points = player.upgrade.points.sub(gain)
    },
    doReset() {
        player.upgrade.points = new Decimal(0)
        player.upgrade.level = new Decimal(0)
        for (let x = 1; x <= 4; x++) player.upgrade.upgrades[x] = 0
    },
    row: 2,
    layerShown() { return player.reboot.unlocked },
    tabFormat: {
        "Upgrade": {
            content: [
                ["display-text", function() {
                    let lvl = player.upgrade.level
                    let pts = player.upgrade.points
                    let html = '<div style="padding:8px;">'
                    html += '<h3 style="color:#8B5CF6;">Upgrade Levels: ' + format(lvl, 0) + '</h3>'
                    html += '<div style="color:#a78bfa;font-size:13px;">Upgrade Points: ' + format(pts, 0) + '</div>'
                    let gain = FORMS.upgrade.gain()
                    let canUpg = FORMS.upgrade.can()
                    if (player.infinity.chals.active) {
                        html += '<div style="color:#ef4444;font-size:10px;">Cannot upgrade during challenges.</div>'
                    } else if (lvl.gt(0) || gain.gt(0)) {
                        html += '<button class="btn" style="margin:10px 0;' + (canUpg?'background:#8B5CF6;color:#fff;':'opacity:0.5;') + '" onmousedown="FORMS.upgrade.reset()" ' + (!canUpg?'disabled':'') + '>'
                        if (canUpg) html += 'Upgrade to Level ' + format(lvl.add(1), 0) + ' (+' + format(gain.sub(lvl), 0) + ' levels)'
                        else html += 'Need ' + format(new Decimal(1000)) + ' RP for next level'
                        html += '</button>'
                    }
                    let reqRP = FORMS.upgrade.reqPP()
                    if (reqRP.gt(0)) html += '<div style="font-size:9px;color:#666;">Next level requires: ' + format(reqRP, 0) + ' RP</div>'
                    html += '<br><br><div class="section-header">Upgrade Purchases</div>'
                    html += '<div class="table_center" style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;">'
                    for (let x = 1; x <= UPGS.upgrade.cols; x++) {
                        let upg = UPGS.upgrade[x]
                        let lvl2 = player.upgrade.upgrades[x] || 0
                        let cost = upg.cost()
                        let canBuy = UPGS.upgrade.can(x)
                        html += '<div style="min-width:200px;margin:5px;padding:10px;background:#181c30;border:1px solid #2a2e4a;border-radius:6px;">'
                        html += '<div style="font-weight:bold;color:#8B5CF6;">' + FORMS.upgrade.upgName(x) + '</div>'
                        html += '<div style="font-size:10px;color:#aaa;">' + FORMS.upgrade.upgDesc(x) + '</div>'
                        html += '<div style="color:#14b8a6;font-size:11px;">Level ' + lvl2 + '</div>'
                        if (player.upgrade.points.gte(cost)) {
                            html += '<button class="btn" style="background:#8B5CF6;color:#fff;" onmousedown="UPGS.upgrade.buy(' + x + ')">Buy (' + cost + ' UP)</button>'
                        } else {
                            html += '<button class="btn" style="opacity:0.5;" disabled>Cost: ' + cost + ' UP</button>'
                        }
                        html += '</div>'
                    }
                    html += '</div></div>'
                    return html
                }],
            ],
        },
    },
})
