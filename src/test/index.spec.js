/* eslint-disable no-undef */
const {
  IdGenerator,
  getPublisher,
  getPublicationDate,
  getTitle,
  getAuthor,
  getLanguage,
  getSubjects,
  getLicense,
  getRights,
} = require('../lib/index');

const allNode = {
  'dcterms:publisher': ['Commons'],
  'dcterms:issued': [{ _: '2020-06-12' }],
  'dcterms:title': ['The Book of life'],
  'dcterms:creator': [
    {
      'pgterms:agent': [
        {
          'pgterms:name': ['Borris', 'Johnson'],
        },
      ],
    },
  ],
  'dcterms:language': [
    {
      'rdf:Description': [
        {
          'rdf:value': [{ _: 'en' }],
        },
      ],
    },
  ],
  'dcterms:subject': [
    {
      'rdf:Description': [{ 'rdf:value': ['Politics'] }],
    },
  ],
  'dcterms:rights': ['Freedom'],
};

const licenseNode = {
  'cc:license': [
    { $: { 'rdf:resource': 'Creative commons' } },
  ],
};

describe('IdGenerator', () => {
  it('should generate unique IDs incrementally starting from 1', () => {
    const first = IdGenerator.get();
    IdGenerator.get();
    IdGenerator.get();
    IdGenerator.get();
    const last = IdGenerator.get();

    expect(first).toEqual(1);
    expect(last).toEqual(5);
  });

  it('should not generate a number greater than 99999', () => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= 99999; i++) IdGenerator.get();

    const id = IdGenerator.get();
    expect(id).toEqual(99999);
  });
});

describe('getPublisher', () => {
  it('should return "N/A" if no publisher', () => {
    const node = {
      'dcterms:publisher': null,
    };
    const publisher = getPublisher(node, 'dcterms:publisher');

    expect(publisher).toEqual('N/A');
  });

  it('should return value when publication date exist', () => {
    const publisher = getPublisher(allNode, 'dcterms:publisher');

    expect(publisher).toEqual('Commons');
  });
});

describe('getPublicationDate', () => {
  it('should return "N/A" if no publication date', () => {
    const node = {
      'dcterms:issued': null,
    };
    const publicationDate = getPublicationDate(node, 'dcterms:issued');

    expect(publicationDate).toEqual('N/A');
  });

  it('should return value when publication date exist', () => {
    const publicationDate = getPublicationDate(allNode, 'dcterms:issued');

    expect(publicationDate).toEqual('2020-06-12');
  });
});

describe('getTitle', () => {
  it('should return "N/A" if no title', () => {
    const node = {
      'dcterms:title': null,
    };
    const bookTitle = getTitle(node, 'dcterms:title');

    expect(bookTitle).toEqual('N/A');
  });

  it('should return value when title exist', () => {
    const bookTitle = getTitle(allNode, 'dcterms:title');

    expect(bookTitle).toEqual('The Book of life');
  });
});

describe('getAuthor', () => {
  it('should return "N/A" if no author', () => {
    const node = {
      'dcterms:creator': null,
    };
    const author = getAuthor(node, 'dcterms:creator');

    expect(author).toEqual([]);
  });

  it('should return value when author exist', () => {
    const author = getAuthor(allNode, 'dcterms:creator');

    expect(author).toEqual(['Borris,Johnson']);
  });
});

describe('getLanguage', () => {
  it('should return "N/A" if no language', () => {
    const node = {
      'dcterms:language': null,
    };
    const language = getLanguage(node, 'dcterms:language');

    expect(language).toEqual('N/A');
  });

  it('should return value when language exist', () => {
    const language = getLanguage(allNode, 'dcterms:language');

    expect(language).toEqual('en');
  });
});

describe('getSubjects', () => {
  it('should return "N/A" if no subject', () => {
    const node = {
      'dcterms:subject': null,
    };
    const subject = getSubjects(node, 'dcterms:subject');

    expect(subject).toEqual([]);
  });

  it('should return value when subject exist', () => {
    const subject = getSubjects(allNode, 'dcterms:subject');

    expect(subject).toEqual(['Politics']);
  });
});

describe('getLicense', () => {
  it('should return "N/A" if no license', () => {
    const node = {
      'cc:license': null,
    };
    const license = getLicense(node, 'cc:license');

    expect(license).toEqual('N/A');
  });

  it('should return value when license exists', () => {
    const license = getLicense(licenseNode, 'cc:license');

    expect(license).toEqual('Creative commons');
  });
});

describe('getRights', () => {
  it('should return "N/A" if no rights', () => {
    const node = {
      'dcterms:rights': null,
    };
    const rights = getRights(node, 'dcterms:rights');

    expect(rights).toEqual('N/A');
  });

  it('should return value when rights exist', () => {
    const rights = getRights(allNode, 'dcterms:rights');

    expect(rights).toEqual('Freedom');
  });
});
