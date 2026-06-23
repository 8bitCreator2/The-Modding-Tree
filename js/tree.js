var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
    showTree: true,

    treeLayout: [
        ["paleolithic"],
    ]
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
},
)


addLayer("tree-tab", {
    tabFormat: [
        "layer-nav"
    ],
    previousTab: "",
    leftTab: true,
})
