const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  id: Number,
  title: String,
  publicationDate: Date,
  publisher: String,
  language: String,
  license: String,
  rights: String,
  authors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'author',
  }],
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subject',
  }],
});
bookSchema.index({ title: 1, publicationDate: 1 });

const Book = mongoose.model('book', bookSchema);

module.exports = Book;
