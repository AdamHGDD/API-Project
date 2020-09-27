// Basic includes
const http = require('http');
const url = require('url');
const query = require('querystring');
const pageHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// Find a valid port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Kept the URL struct because I still need GET vs Head
const urlStruct = {
  GET: {
    '/': pageHandler.getIndex,
    '/style.css': pageHandler.getStyle,
    '/getUsers': jsonHandler.getUsers,
    '/updateUser': jsonHandler.updateUser,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    notFound: jsonHandler.notFoundMeta,
  },
};

// Post is done with it's own method unlike GET and HEAD which use the url struct
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const body = [];

    // Event handler for errors while retrieving data
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    // Chunk of data has arrived
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // Finished getting chunks of data
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      // Add user
      jsonHandler.addUser(request, response, bodyParams);
    });
  }
};

// Request response code
const onRequest = (request, response) => {
  // Get parsed request information
  const parsedUrl = url.parse(request.url);

  // Print out information for the request
  console.dir(parsedUrl.pathname);
  console.dir(request.method);

  if (request.method === 'POST') {
    // Go to method for posting new request
    handlePost(request, response, parsedUrl);
  } else if (urlStruct[request.method][parsedUrl.pathname]) {
    // Get and Head requests
    // Call relevant method
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    // Request URL is not found
    urlStruct[request.method].notFound(request, response);
  }
};

// Call HTTP to set up request response function
http.createServer(onRequest).listen(port);

// Basic print for port
console.log(`Listening on 127.0.0.1: ${port}`);
