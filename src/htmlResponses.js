// File accessing include
const fs = require('fs');

// Define all HTML files
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const add = fs.readFileSync(`${__dirname}/../client/add.html`);
const examine = fs.readFileSync(`${__dirname}/../client/examine.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

// Methods for HTMl request
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};
const getAdd = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(add);
  response.end();
};
const getExamine = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(examine);
  response.end();
};
// Method for style request
const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

// Export methods
module.exports.getIndex = getIndex;
module.exports.getAdd = getAdd;
module.exports.getExamine = getExamine;
module.exports.getStyle = getStyle;
