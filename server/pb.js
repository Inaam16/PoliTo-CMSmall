'use strict';

const dayjs = require('dayjs');

function Page(id, title, creationDate, publishDate, username, blocks) {
    this.id = id
    this.title = title
    this.creationDate = dayjs(creationDate)
    this.publishDate = dayjs(publishDate)
    this.username = username
    this.blocks = blocks
}

function Block(id, type, content, rank, pageid) {
    this.id = id
    this.type = type
    this.content = content
    this.rank = rank
    this.pageid = pageid
}

exports.Page = Page;
exports.Block = Block;