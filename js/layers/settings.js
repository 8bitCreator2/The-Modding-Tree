addLayer("settings", {
    name: "Settings",
    symbol: "\u2699",
    position: 999,
    startData() { return { unlocked: true } },
    color: "#888888",
    requires: new Decimal(0),
    resource: "",
    baseResource: "",
    type: "none",
    row: "side",
    previousTab: "",
    tooltip: "Settings",
    layerShown() { return true },
    tabFormat: {
        "Main": {
            content: [
                ["display-text", function() {
                    return '<div style="padding:16px;">' +
                        '<h2>Settings</h2><br>' +
                        '<div style="margin-bottom:8px;color:#888;font-size:11px;">Bit Incremental fused into The Modding Tree</div><br>' +
                        '<button onmousedown="save()" style="padding:8px 16px;cursor:pointer;background:#444;color:#fff;border:1px solid #888;border-radius:4px;margin-right:8px;">Save</button>' +
                        '<button onmousedown="if(confirm(\'Hard reset?\')){hardReset(true)}" style="padding:8px 16px;cursor:pointer;background:#633;color:#fff;border:1px solid #a44;border-radius:4px;">Hard Reset</button><br><br>' +
                        '<div style="margin-top:12px;font-size:10px;color:#555;">Auto-saves every 5 seconds</div>' +
                        '</div>'
                }],
            ],
        },
    },
})
