/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const fs = require('fs');
const { chunk } = require('lodash');
const mongoose = require('mongoose');
const { promisify } = require('util');
const { parseStringPromise } = require('xml2js');
const { enumerateFiles, parseMetadataAndLoadtoDatabase } = require('./lib');

const fileReader = promisify(fs.readFile);

const run = async ({ chunkSize }) => {
  let rdfFiles;
  try {
    console.log('[INFO]: Reading RDF files...');
    rdfFiles = await enumerateFiles('rdf-files/**/*', '.rdf');
  } catch (ex) {
    console.log('[IOERROR]: Make sure you have an "rf-files" directory in the root.');
  }

  const jobs = chunk(rdfFiles, chunkSize);
  const jobSize = jobs.length - 1;
  let count = 0;
  try {
    while (count <= jobSize) {
      const asyncJobs = jobs[count].map((file) => parseMetadataAndLoadtoDatabase(file, parseStringPromise, fileReader));
      await Promise.all(asyncJobs);
      count += 1;
      console.log(`[INFO]: Processed ${chunkSize * count} of ${jobSize}`);
    }
  } catch (ex) {
    console.log(`[ERROR]: ${ex}`);
  }
};

mongoose.connection.on('error', console.error.bind(console, '[NETERROR] Connection error:'));
mongoose.connection.once('open', () => {
  console.log('[INFO]: Connected to the DataBase');
  run({ chunkSize: 10 });
});
