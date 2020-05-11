// #!/usr/bin/env node
// 'use strict';

const fs = require('fs').promises; //to read file system
const path = require('path'); //to get links
const url = require('url');
const http = require('http');
const https = require('https');
const fetch = require('node-fetch');

// Obtener links
const getLinks = file => {
  return new Promise((resolve) => {
    const regex = /\[(.+)\]\((https?.+)\)/gm;
    let match;
    let i = 0;
    let newArray = [];
    for( i=0; regex.exec(file) !== null; i++) {
      const newObject = {
        href: match[2],
        text: match[1],
        File: path.resolve()
      };
      newArray.push(newObject);
    }
    resolve(newArray);
  })
};

//Leer archivo
const readFile = fileName => fs.readFile(fileName, 'utf8')
  .then(text => console.log(text))
  .catch(error => console.log(error))

//Aegurar que sea un archivo markdown
const isMarkDownFile = file => {
  return new Promise((resolve) => {
    const ext = path.extname(file) === ".md";
    resolve(ext);
    console.log('ext', ext)
    });
};

// isMarkDownFile('./README.md')

// Valida que los links regresen utilizando http de node
const validateLinks = link => {
  console.log(link);
  const { protocol } = url.parse(link.href);
  // console.log(protocol);
  const request = protocol === 'https:' ? https.get(link.href) : http.get(link.href);

  request.on('error', error => resolve({
    ...link,
    status: 0,
    error,
    ok: false,
  }));

  request.on('response', resp => resolve({
    ...link,
    status: resp.statusCode,
    ok: resp.statusCode === 200,
  }));

  request.end();
}

//Valida links utilizando fetch de node

const validateLinksFetch = arrayOfLinks => {
  arrayOfLinks.map(singleLink => {
    let link = singleLink.href;
    fetch(link)
      .then((link) => {
        link.url;
        link.statusText;
        console.log(`{ href: ${link.url} 
        status: ${link.statusText} }`);
      });
  });
}


