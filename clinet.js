const { createClient } = require("oicq");
const { JsonFile, read } = require("./jsonFile");
const { load_config, parse } = require("./parser");

const config = read("./json/oicq.json");
const client = createClient(config.id);
const root_friend = client.pickFriend(config.root);
load_config(config.cmd_config);

var Shared = {
    static: read("./json/static.json"),
    config: config,
    db: new JsonFile("./json/dynamic.json")
};

/* 标准错误处理 */
function stdErr(err, info) {
    console.error("Exception occurred!!!")
    console.error(err);
    if (info) {
        console.error("More info: ");
        console.error(info);
    }
    else {
        console.error("No more info.");
    }
    root_friend.sendMsg("Exception: " + JSON.stringify(err))
        .catch(() => {
            console.error("Sending log Failure!!!");
        })
}

client.on("system.login.qrcode", (e) => {
    process.stdin.once("data", () => this.login());
})

client.on("system.online", () => {
    console.log("Success to login!");
    log("Login!");
})

client.on("message", (e) => {
    if (!(e.from_id == config.root)
        && (!Shared.static.on
            || Shared.db.data.clinet.ban.has(e.from_id))) {
        return;
    }

    let ret_target;
    if (e.message_type == "group") ret_target = client.pickGroup(e.group_id);
    else ret_target = client.pickFriend(e.from_id);
    
    let ret = parse(e.raw_message, [e, Shared]);
    if (ret instanceof Promise) {
        ret.then((result) => {
            ret_target
                .sendMsg(result)
                .catch((err) => { stdErr(err, ["Send Failure", ret]) });
        }).catch((err) => { stdErr(err, e) });
    }
    else {
        if (ret) {
            ret_target
                .sendMsg(ret)
                .catch((err) => { stdErr(err, ["Send Failure", ret]) });
        }
    }
})

if (config.use_password) {
    client.login(config.password);
} else {
    client.login();
}