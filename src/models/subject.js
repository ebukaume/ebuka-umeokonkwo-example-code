const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({ name: String });
subjectSchema.index({ name: 1 });

async function getIds(names) {
  let docs = await Promise.all(names.map((name) => this.findOne({ name })));
  docs = await Promise.all(docs.map((doc, index) => doc || this.create({ name: names[index] })));

  // eslint-disable-next-line no-underscore-dangle
  return docs.map((doc) => doc._id);
}

subjectSchema.static('getIds', getIds);
const Subject = mongoose.model('subject', subjectSchema);

module.exports = Subject;
