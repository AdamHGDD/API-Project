// Object that holds all teams
let teams = {};

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
const getTeams = (request, response, search) => {
  // All teams to start
  let responseJSON = {
    teams,
  };

  // If search params are added check for that string in the teams name
  if(search)
  {
    // New team for just searched names
    let selectedTeams = {};
    // Loop through all possible teams
    for (let team in teams) 
    {
      console.log(`about to print a team for ${search}`);
      console.dir(team);
      if(team.includes(search))
      {
        // Add to the new object if the string is contained
        selectedTeams[teams] = teams[team];
      }
    }
    // Set temp variable to hold object
    let tempTeams = teams;
    teams = selectedTeams;
    responseJSON = { teams, };
    // Set teams back to being correct
    teams = tempTeams;
  }

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
  let prevTeam = teams[body.teamName];

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
  teams[body.teamName].cost = 0;

  // Go through all rows and add their information
  for (let i = 0; i < rows; i++) 
  {
    // Create cleared out object
    (teams[body.teamName])[i] = {};
    // Add in strings
    (teams[body.teamName])[i].name = body[`name${i}`];
    (teams[body.teamName])[i].link = body[`link${i}`];
    // Turn strings that are numbers into ints
    (teams[body.teamName])[i].life = parseInt(body[`life${i}`], 10);
    (teams[body.teamName])[i].cost = parseInt(body[`cost${i}`], 10);
    teams[body.teamName].cost += (teams[body.teamName])[i].cost;
    // Turn series of information into the arrays they represent
    (teams[body.teamName])[i].speeds = body[`speeds${i}`].split(" ");
    (teams[body.teamName])[i].strengths = body[`strengths${i}`].split(" ");
    (teams[body.teamName])[i].defenses = body[`defenses${i}`].split(" ");
    (teams[body.teamName])[i].damages = body[`damages${i}`].split(" ");

    // Temp values for checks
    let life = (teams[body.teamName])[i].life;
    // Without these the line gets too long
    let len1 = ((teams[body.teamName])[i].speeds).length;
    let len2 = ((teams[body.teamName])[i].strengths).length
    let len3 = ((teams[body.teamName])[i].defenses).length
    let len4 = ((teams[body.teamName])[i].damages).length

    // Check to make sure all information was there
    if(!body[`name${i}`] || !body[`link${i}`] || !life || !(teams[body.teamName])[i].cost) {
      responseJSON.message = 'At least one row was missing one of its basic pieces of information';
      responseJSON.id = 'missingParams';
      // Undo bad call's changes on the object
      teams[body.teamName] = prevTeam;
      // Bad request
      return respondJSON(request, response, 400, responseJSON);
    } else if(life !== len1 || life !== len2 || life !== len3 || life !== len4 ) {
      responseJSON.message = 'The length of values in one of the stat blocks did not match up with the associated life';
      responseJSON.id = 'misalignedArray';
      // Undo bad call's changes on the object
      teams[body.teamName] = prevTeam;
      // Bad request
      return respondJSON(request, response, 400, responseJSON);
    }
  }
  // Console print teams
  console.dir(teams);

  // Return a message that shows it was successful
  if (responseCode === 201) {
    responseJSON.message = `Cost: ${teams[body.teamName].cost}`;
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
