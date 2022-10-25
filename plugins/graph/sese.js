const axios = require("axios");

exports.sese = async (tag, r18) => {
    let url = `https://api.lolicon.app/setu/v2?tag=${tag}&r18=${r18}&size=thumb&size=original&size=regular`;
    console.log("Sese get:");
    console.log(url);

    return axios.get(encodeURI(url))
        .then(res => {
            let ret = res.data.data[0];
            if (ret) {
                return {
                    "title": ret.title,
                    "id": ret.pid,
                    "org": ret.urls.original,
                    "mid": ret.urls.regular,
                    "small": ret.urls.thumb,
                }
            }
            else return { err: 2 };
        })
        .catch((err) => {
            return { err: 1 };
        })
}