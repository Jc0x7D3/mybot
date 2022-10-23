const { createClient } = require("oicq")
const client = createClient(514195896)

exports.client = client;
exports.group = client.pickGroup(1038820608);
exports.root = client.pickFriend(1951360581);