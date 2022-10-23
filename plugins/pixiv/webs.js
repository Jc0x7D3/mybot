const { segment } = require("oicq");
const sql = require("./sql");
const axios = require("axios")

const client = require("../../public/clinet");
const { log } = require("oicq/lib/common");
const Group = client.group;


var LeastNum = '000'
var Agent = 'http://localhost:11451/?url='


exports.getNewPage = async function (tag, page, r18) {

    let word = `${tag} ${LeastNum}users\u5165\u308A`
    let url = Agent + `www.pixiv.net/ajax/search/artworks/${word}?word=${word}&order=date_d&mode=${r18 ? 'r18' : 'safe'}&p=${page}&s_mode=s_tag&type=illust&lang=zh`;
    url = encodeURI(url);

    let res = await axios.get(url);

    if (res.data.error) throw "Data error!!!"
    let idList = new Array();

    let rawList = res.data.body.illustManga.data;
    for (let i = 0; i < rawList.length; i++) {
        await parseImage(rawList[i], idList)
    }


    // console.log(idList);
    await sql.addTag(tag, r18, idList, page)
}

async function parseImage(obj, idList) {
    var id = parseInt(obj.id)
    console.log("Parsing: ", id)

    let used = await sql.isUsed(id);
    if (!used) idList.push(id)
    await sql.addUrl(id, obj.url.match(/\d{4}(\/\d\d){5}/g)[0]) // 2020/09/22/19/38/47
}

exports.sendImage = async function (id, url) {
    let totalUrl = `https://proxy.pixivel.moe/img-master/img/${url}/${id}_p0_master1200.jpg`

    console.log("Result Image:", id, totalUrl)

    var image = segment.image(totalUrl)
    var info = segment.text(`Id: ${id}`);
    Group.sendMsg([info, image])
}

exports.sendInfo = async function (info) {
    Group.sendMsg(info)
}
