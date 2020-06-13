const glob = require('glob');
const { promisify } = require('util');
const path = require('path');
const { Book, Author, Subject } = require('../models');

const walkDir = promisify(glob);

// const id = // (will be a number with 0-5 digits)
const KEYS = {
  publisher: 'dcterms:publisher',
  publicationDate: 'dcterms:issued',
  title: 'dcterms:title',
  authors: 'dcterms:creator',
  language: 'dcterms:language',
  subjects: 'dcterms:subject',
  license: 'cc:license',
  rights: 'dcterms:rights',
};

const IdGenerator = (function () {
  let number;
  return {
    get() {
      if (number == null) {
        number = 0;
      }
      if (number === 99999) return number;
      number += 1;
      return number;
    },
  };
}());

const getPublisher = (node, key) => {
  const publisher = node[key];
  if (!publisher) return 'N/A';

  return publisher[0];
};

const getPublicationDate = (node, key) => {
  const publicationDate = node[key];
  if (!publicationDate) return 'N/A';

  return publicationDate[0]._;
};

const getTitle = (node, key) => {
  const title = node[key];
  if (!title) return 'N/A';

  return title[0];
};

const getAuthor = (node, key) => {
  const authors = node[key];
  if (!authors) return [];

  return authors[0]['pgterms:agent'].map((agent) => agent['pgterms:name'].join(','));
};

const getLanguage = (node, key) => {
  const language = node[key];
  if (!language) return 'N/A';

  return language[0]['rdf:Description'][0]['rdf:value'][0]._;
};

const getSubjects = (node, key) => {
  const subjects = node[key];
  if (!subjects) return [];

  return subjects.map((subject) => subject['rdf:Description'][0]['rdf:value'].join());
};

const getLicense = (node, key) => {
  const license = node[key];
  if (!license) return 'N/A';

  return license[0].$['rdf:resource'];
};

const getRights = (node, key) => {
  const rights = node[key];
  if (!rights) return 'N/A';

  return rights[0];
};

const parseRDF = async (pathName, xmlParser, fileReader) => {
  const stringXML = await fileReader(pathName, { encoding: 'utf-8' });
  const data = await xmlParser(stringXML);
  const ebook = data['rdf:RDF']['pgterms:ebook'][0];
  const workMeta = data['rdf:RDF']['cc:Work'][0];

  const output = {
    id: IdGenerator.get(),
    publisher: getPublisher(ebook, KEYS.publisher),
    publicationDate: getPublicationDate(ebook, KEYS.publicationDate),
    title: getTitle(ebook, KEYS.title),
    authors: getAuthor(ebook, KEYS.authors),
    language: getLanguage(ebook, KEYS.language),
    subjects: getSubjects(ebook, KEYS.subjects),
    license: getLicense(workMeta, KEYS.license),
    rights: getRights(ebook, KEYS.rights),
  };

  return output;
};

const enumerateFiles = async (directory, format = '') => {
  const parentPath = __dirname.split('/');
  parentPath.pop();
  const absolutePath = path.join(parentPath.join('/'), directory);
  const directoryContent = await walkDir(absolutePath);

  return directoryContent.filter((file) => file.endsWith(format));
};

const LoadtoDatabase = async (bookData) => {
  const { authors, subjects } = bookData;
  const authorIds = await Author.getIds(authors);
  const subjectIds = await Subject.getIds(subjects);
  const book = Object.assign(bookData, { subjects: subjectIds, authors: authorIds });
  const saved = await Book.create(book);

  return saved;
};

const parseMetadataAndLoadtoDatabase = async (filePath, RDFparser, fileReader) => {
  const metaData = await parseRDF(filePath, RDFparser, fileReader);
  const docs = await LoadtoDatabase(metaData);

  return docs;
};

module.exports = {
  enumerateFiles,
  parseMetadataAndLoadtoDatabase,
  IdGenerator,
  getPublisher,
  getPublicationDate,
  getTitle,
  getAuthor,
  getLanguage,
  getSubjects,
  getLicense,
  getRights,
};
