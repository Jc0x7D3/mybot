function not_root(d) {
    return d[0].sender.user_id != d[1].config.root;
}

exports.on = function on(_, d)  {
    if (not_root(d)) return;
    d[1].static.on = true;
    return d[1].static.reply.rootOK;
}

exports.off = function off(_, d)  {
    if (not_root(d)) return;
    d[1].static.on = false;
    return d[1].static.reply.rootOK;
}

exports.ban = function ban(_, d)  {
    if (not_root(d)) return;
    let BlackList = d[1].db.data.clinet.ban;
    d[0].message.forEach((obj) => {
        if (obj.type == 'at' && !BlackList.includes(obj.qq)) {
            BlackList.push(obj.qq);
        }
    })
    console.log(BlackList);
    d[1].db.flush();
    return d[1].static.reply.rootOK;
}

exports.pardon = function pardon(_, d) {
    if (not_root(d)) return;
    let BlackList = d[1].db.data.clinet.ban;
    d[0].message.forEach((obj) => {
        if (obj.type == 'at' && BlackList.includes(obj.qq)) {
            BlackList.splice(BlackList.findIndex(id => (id == obj.qq)), 1);
        }
    })
    console.log(BlackList);
    d[1].db.flush();
    return d[1].static.reply.rootOK;
}

exports.setget = function setget(str, d) {
    if (not_root(d)) return;

    ok = 0;
    let res = /^(\S+?)\s+(\S.*?)$/.exec(str);
    console.log("Root exec: ", res);

    var db = d[1].db;
    var global = db.data.value;

    if (res) {
        //设置值
        let key = res[1], val = res[2];
        if (key in global) {
            if (typeof global[key] == "number") {
                global[key] = parseInt(val);
            }
            else {
                global[key] = val;
            }
            db.flush();
            return d[1].static.reply.rootOK;
        }
        else return "Variable not found!";
    }
    else {
        //获取值
        if (str in global)
            return JSON.stringify(global[str]);
        else return "Variable not found!";
    }
}