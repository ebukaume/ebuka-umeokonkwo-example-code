const mongoose = require('mongoose');
// const { getIds, enumerateFiles } = require('../lib');

const authorSchema = new mongoose.Schema({ name: String });
authorSchema.index({ name: 1 });

async function getIds(names) {
  let docs = await Promise.all(names.map((name) => this.findOne({ name })));
  docs = await Promise.all(docs.map((doc, index) => doc || this.create({ name: names[index] })));

  // eslint-disable-next-line no-underscore-dangle
  return docs.map((doc) => doc._id);
}

authorSchema.static('getIds', getIds);

const Author = mongoose.model('author', authorSchema);

module.exports = Author;
