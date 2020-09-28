// Object that holds all teams
const teams = {};

// Generic helper for sending some sort of JSON response
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// Generic helper for sending some sort of JSON response
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

// Get teams object
const getTeams = (request, response) => {
  // Object to send
  const responseJSON = {
    teams,
  };

  // Use helper function
  return respondJSON(request, response, 200, responseJSON);
};

// Get HEAD for teams object
const getTeamsMeta = (request, response) => respondJSONMeta(request, response, 200);

// Error for GET request
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

// Error for HEAD request
const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

// Temporary method for creating a team
const addTeam = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Set response code to say that an object was created
  let responseCode = 201;

  if (teams[body.name]) {
  // Set response code to say that an object was updated
    responseCode = 204;
  } else {
  // Create empty object if there is no object there currently
    teams[body.name] = {};
    teams[body.name].name = body.name;
  }

  // Fill object with age
  teams[body.name].age = body.age;

  // Return a message that shows it was successful
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully!';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // Return header but there can't be a message
  return respondJSONMeta(request, response, responseCode);
};

module.exports = {
  getTeams,
  getTeamsMeta,
  notFound,
  notFoundMeta,
  addTeam,
};
