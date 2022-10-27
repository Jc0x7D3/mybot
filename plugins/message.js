const { segment } = require("oicq");

function makeXML(Title, Summary, CoverURL, url) {
    var xml = `<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>\
<msg serviceID="1" templateID="-1" action="web" brief="${Title}" sourceMsgId="0" url="" flag="0" adverSign="0" multiMsgFlag="0">\
<item layout="2" advertiser_id="0" aid="0">\
<picture cover="${CoverURL}" w="0" h="0" action="web" url="${url}"/>\
<title>${Title}</title>\
<summary>${Summary}</summary>\
</item>\
<source name="" icon="" action="" appid="0" />\
</msg>`;    
    return segment.xml(xml);
}

function makeGraph(url) {
    return segment.image(url);
}

function makeAt(id) {
    return segment.at(id);
}

exports.xml = makeXML;
exports.graph = makeGraph;
exports.at = makeAt;