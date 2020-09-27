// File accessing include
const fs = require('fs');

// Define all HTML files
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

// Method for HTMl request
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
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
module.exports.getStyle = getStyle;
