var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
    showTree: true,
    treeLayout: [
        ["bits"],
        ["reboot"],
        ["upgrade"],
        ["infinity"],
        ["kernel"],
    ]
}

addNode("blank", { layerShown: "ghost" })

addLayer("tree-tab", {
    tabFormat: ["layer-nav"],
    previousTab: "",
    leftTab: true,
})
