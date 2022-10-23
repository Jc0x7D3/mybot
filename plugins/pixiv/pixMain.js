//»ù´¡
const global = require("../../public/global").val;
const axios = require("axios");
const FormData = require('form-data');

//const sql = require("./sql");

const CheckReg = /^[0-9A-z\u4e00-\u9fff]+$/

const GrPorxy = "https://i.pixiv.re/";
const Authorization = "eyJhbGciOiJIUzUxMiJ9.eyJwZXJtaXNzaW9uTGV2ZWwiOjIsInJlZnJlc2hDb3VudCI6MiwiaXNDaGVja1Bob25lIjoxLCJ1c2VySWQiOjI4NDU4LCJpYXQiOjE2NTcwMTM2NTIsImV4cCI6MTY1NzUzMjA1Mn0.4IP7t4yWOXvj5rdnHIMav_TiHn3hb8Dn8kKNOn5cLGkGsLTZue0hp4OamITfWsf9ZszY68S7S1DwdFVMzY_Rtw";

exports.id = async (id) => {
    return await axios.get(`https://api.pixivel.moe/v2/pixiv/illust/${id}`,
        {
            Headers: {
                "User-Agent":"PostmanRuntime/7.29.0"
            }
        }
    )
        .then(res => {
            console.log(res);
            return res.data;
        })
        .then(res => {
            //console.log(res)
            //res = res.data.createDate
            ////2022-07-16T01:38:47
            ////https://i.pixiv.re/img-original/img/2021/08/03/05/01/46/91692249_p0.jpg
            //res = res.replace(/[\-:T]/g, '/');
            //console.log(res);
            //return `${GrPorxy}img-original/img/${res}/${id}_p0.jpg`

        })
        //.catch(() => {
        //    return [global.reply.pixivNoId];
        //})
}


exports.searchURL = async (url) => {
    console.log("Finding: ", url);

    var fd = new FormData();

    fd.append("url", url);
    fd.append("dbs[]", 5);

    let id = await
        axios.post("https://saucenao.com/search.php", fd)
            .then(res => {
                let ml = res.data.match(/(\d+?)_p(\d+?)(_master1200)?/);
                if (ml) return [ml[1], ml[2]];
                else return undefined;
            });

    if (!id) return undefined;
    let urls = await exports.id(id[0]);
    console.log(urls);
    return "Pixiv: " + id[0] + "\n" + urls[id[1]];
}

exports.sese = async (tag) => {
    if (tag == "") tag = global.def;
    let url = `https://api.lolicon.app/setu/v2?tag=${tag}&r18=${global.r18}&size=thumb&size=original`;

    return axios.get(encodeURI(url))
        .then(res => {
            let ret = res.data.data[0];
            if (ret) {
                return {
                    "id": ret.pid,
                    "org": ret.urls.original,
                    "cover": ret.urls.thumb,
                }
            }
            else return undefined;
        })
        .catch((err) => {
            console.log(err);
            return undefined;
        })
}

//exports.tag = async (tag) => {
//    try {
//        if (CheckReg.test(tag)) throw "symbol err";
//        if (tag.length > 5) throw "string too long";

//        console.log(tag);

//        var id = await sql.getOne(tag, r18);
//        var url = await sql.getUrl(id);
//        web.sendImage(id, url);
//    }
//    catch (err) {
//        web.sendInfo(JSON.stringify(err))
//    }
//}
//