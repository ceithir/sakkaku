#!/usr/bin/env node

const fs = require("fs");
const { readFile, writeFile } = fs;

const csvpath = "node_modules/l5r-ffg-probabilities/probabilities.csv";
const jsonpath = `${__dirname}/../data/cached.json`;

const output = {};

readFile(csvpath, "utf8", (err, data) => {
  if (err) {
    throw err;
  }

  data.split("\n").forEach((line, index) => {
    if (!line || index === 0) {
      return;
    }
    const params = line.split(",");
    const result = params.pop();

    output[params.join("|")] = result;
  });
  writeFile(jsonpath, JSON.stringify(output), (err) => {
    if (err) {
      throw err;
    }
    console.log("All good?");
  });
});
