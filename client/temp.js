
    // Turn JSON into an object
    const parseJSON = (xhr, content) => {
      if(xhr.response && xhr.getResponseHeader('Content-Type') === 'application/json') {
        const obj = JSON.parse(xhr.response);
        console.dir(obj);

        if(obj.message) {
          content.innerHTML += `<p>Message: ${obj.message}</p>`;
        } else if(obj.users) {
          content.innerHTML += '<p>{</p>';
          for (let user in obj.users)
          {
            content.innerHTML += `<p>${obj.users[user].name}:</p>`
            content.innerHTML += `<p>{name: "${obj.users[user].name}", age: "${obj.users[user].age}"}</p>`;
          }
          content.innerHTML += '<p>}</p>';
        }
      }
      
    };

    // Process requests and put information on the page
    const handleResponse = (xhr, parseResponse) => {
      const content = document.querySelector('#content');

      switch(xhr.status){
        case 200:
          content.innerHTML = '<b>Success!</b>'
          break;
        case 201:
          content.innerHTML = '<b>Created!</b>'
          break;
        case 204:
          content.innerHTML = '<b>Updated (No Content)</b>'
          break;
        case 400:
          content.innerHTML = '<b>Bad Request</b>'
          break;
        case 404:
          content.innerHTML = '<b>Resource Not Found</b>'
          break;
        default:
          content.innerHTML = '<p>Not Implemented By Client</p>'
          break;
      }

      parseJSON(xhr, content);
    };

    // Send a get request for user information (or send a head request)
    const requestUpdate = (e, userForm) => {
      // Information for GET / HEAD requests
      const url = userForm.querySelector('#urlField').value;
      const method = userForm.querySelector('#methodSelect').value;

      // Set up the type of request
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      // Set up headers for the request
      xhr.setRequestHeader('Accept', 'application/json');

      // Get or load attach handleResponse
      if(method === 'get'){
        xhr.onload = () => handleResponse(xhr, true);
      } else {
        xhr.onload = () => handleResponse(xhr, false);
      }

      // Send data
      xhr.send();
      e.preventDefault();

      // Avoid bubbling
      return false;
    };

    // Send a post request with user information
    const sendPost = (e, nameForm) => {
      e.preventDefault();

      // Get information for PUSH
      const nameAction = nameForm.getAttribute('action');
      const nameMethod = nameForm.getAttribute('method');

      // Get input for PUSH
      const nameField = nameForm.querySelector('#nameField');
      const ageField = nameForm.querySelector('#ageField');

      // Make object for the request
      const xhr = new XMLHttpRequest();
      xhr.open(nameMethod, nameAction);

      // Assign headers
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      // Attach handleResponse
      xhr.onload = () => handleResponse(xhr, false);

      // Send the data
      const formData = `name=${nameField.value}&age=${ageField.value}`;
      xhr.send(formData);

      // Avoid bubbling
      return false;
    };

    // Attach form script information to the webpage
    const init = () => {
      console.log("init");

      // Get forms
      const userForm = document.querySelector('#userForm');
      const nameForm = document.querySelector('#nameForm');

      // Assign variables for methods
      const getUsers = (e) => requestUpdate(e, userForm); 
      const addUser = (e) => sendPost(e, nameForm); 

      // Assign events to those variables
      userForm.addEventListener('submit', getUsers);
      nameForm.addEventListener('submit', addUser);
    };

    window.onload = init;