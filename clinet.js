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

client.on("system.login.qrcode", function (e) {
    //扫码后按回车登录
    process.stdin.once("data", () => {
        this.login()
    })
})

client.on("system.online", () => {
    console.log("Success to login!");
})

client.on("message", (e) => {
    let sender = e.sender.user_id;

    if (sender != config.root
        && (!Shared.static.on
        || Shared.db.data.clinet.ban.has(sender))) {
        console.log("blocked");
        return;
    }

    let ret_target;
    if (e.message_type === "group") ret_target = client.pickGroup(e.group_id);
    else ret_target = client.pickFriend(sender);
    
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