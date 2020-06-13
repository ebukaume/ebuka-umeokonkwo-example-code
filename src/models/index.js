const mongoose = require('mongoose');
const Author = require('./author');
const Book = require('./book');
const Subject = require('./subject');

mongoose.connect('mongodb://localhost:27017/books',
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

module.exports = { Author, Book, Subject };
