const mysql = require("mysql")
const web = require("./webs")

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'try_database',
})

async function dbQuery(queryStr, paramList) {
    return new Promise((resolve, reject) => {
        db.query(queryStr, paramList, (err, res) => {
            if (err) reject(err);
            else resolve(res)
        })
    })
}


//used表查询
exports.isUsed = async function (id) {
    let res = await dbQuery('select id from used where id = ?', [id]);
    return (res.length != 0)
}

async function Useable(id) {
    // console.log(id)

    let res = await dbQuery('select id from used where id = ?', [id]);
    if (res.length == 0) {
        await dbQuery('insert into used (id) values (?)', [id]);
    }

    return (res.length == 0);
}

//tag表
async function update(tag, r18) {
    let res = await dbQuery('select page from tags where tag = ? and r18 = ?', [tag, r18]);
    let page = res[0].page + 1;

    await web.getNewPage(tag, page, r18);
}

exports.addTag = async function (tag, r18, idList, page) {
    if (page == 1) {
        await dbQuery('insert into tags (tag, r18, page, ids) values (?, ?, 1, ?)'
            , [tag, r18, JSON.stringify(idList)])
    }
    else {
        await dbQuery('update tags set page = ? , ids = ? where tag = ? and r18 = ?'
            , [page, JSON.stringify(idList), tag, r18])
    }
}

//url表
exports.addUrl = async function (id, url) {
    res = await dbQuery('select id from url where id = ?', [id]);
    
    if (res.length == 0) {
        await dbQuery('insert into url (id, url) values (?, ?)', [id, url]);
    }
}

exports.getOne = async function (tag, r18) {
    //首次加入
    var res = await dbQuery('select page from tags where tag = ? and r18 = ?', [tag, r18]);
    if (res.length == 0) await web.getNewPage(tag, 1, r18)

    console.log("Be in loop")

    //反复检查，缺页
    while (true) {
        res = await dbQuery('select ids from tags where tag = ? and r18 = ?', [tag, r18]);
        let list = JSON.parse(res[0].ids);
        // console.log(list)

        for (let i = 0; i < list.length; i++) {
            if (await Useable(list[i])) {
                return list[i];
            }
        }

        await update(tag, r18);
    }
}

exports.getUrl = async function (id) {
    return (await dbQuery('select url from url where id = ?', [id]))[0].url
}