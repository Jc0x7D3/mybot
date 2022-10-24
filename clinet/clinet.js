const jf = require("../public/jsonFile")
const { createClient, segment } = require("oicq")

var config = jf.read("./oicq.json")
const client = createClient(config.id)

const root_obj = client.pickFriend(1951360581);
const { segment, Message } = require("oicq");

client.on("system.login.qrcode", function (e) {
    //扫码后按回车登录
    process.stdin.once("data", () => {
        this.login()
    })
})