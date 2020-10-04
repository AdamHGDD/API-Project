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
    message: 'Must contain a team name and at least 1 row',
  };

  // Turn rows number into number
  let rows = parseInt(body.rows, 10);

  if (!body.teamName || !body.rows || rows < 1) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Set response code to say that an object was created
  let responseCode = 201;

  if (teams[body.teamName]) {
  // Set response code to say that an object was updated
    responseCode = 204;
  } else {
  // Create empty object if there is no object there currently
    teams[body.teamName] = {};
    teams[body.teamName].teamName = body.teamName;
  }

  // Set up for looping on GET requests
  teams[body.teamName].clix = rows;
  console.log(rows);

  // Go through all rows and add their information
  for (let i = 0; i < rows; i++) 
  {
    // Create cleared out object
    (teams[body.teamName])[i] = {};
    // Add in strings
    (teams[body.teamName])[i].name = body[`names${i}`];
    (teams[body.teamName])[i].link = body[`link${i}`];
    // Turn strings that are numbers into ints
    parseInt(body[`life${i}`], (teams[body.teamName])[i].life);
    parseInt(body[`cost${i}`], (teams[body.teamName])[i].cost);
    // Turn series of information into the arrays they represent
    (teams[body.teamName])[i].speeds = body[`speeds${i}`].split(" ");
    (teams[body.teamName])[i].strengths = body[`strengths${i}`].split(" ");
    (teams[body.teamName])[i].defenses = body[`defenses${i}`].split(" ");
    (teams[body.teamName])[i].damages = body[`damages${i}`].split(" ");

    // Check to make sure all information was there
    if(false)
    {
      responseJSON.message = 'At least one row was missing one of its stats';
      responseJSON.id = 'missingParams';
      return respondJSON(request, response, 400, responseJSON);
    } else if(false) {
      responseJSON.message = 'One of the stat blocks did not match up with the life';
      responseJSON.id = 'missingParams';
      return respondJSON(request, response, 400, responseJSON);
    }
  }
  // Console print teams
  console.dir(teams);

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
