function E(x){return new ExpantaNum(x)};
function ex(x){
    if (x === null || x === undefined || typeof x !== 'object') return E(x || 0)
    let nx = new E(0);
    nx.array = x.array;
    nx.sign = x.sign;
    nx.layer = x.layer;
    return nx;
}

ExpantaNum.prototype.softcap = function (start, force, mode, log=false){
    var x = this.clone()
    start = E(start)
    if (x.lt(start)) return x
    if (log) {
        start = start.log10()
        x = x.log10()
    }
    if([0,"pow"].includes(mode)) x = x.div(start).pow(force).mul(start).min(x)
    if([1,"mul"].includes(mode)) x = x.sub(start).div(force).add(start).min(x)
    return log ? E(10).pow(x) : x
}

const FORMS_MAX = E("1e50")
