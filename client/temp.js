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

    // Send a post request with user information
    const sendPost = (e, nameForm) => {
      e.preventDefault();

      // Get input for PUSH
      const iRows = document.querySelectorAll(".iRow");
      const nameField = document.querySelector('#nameField');
      let formData = `teamName=${nameField.value}&rows=${iRows.length}`;
      
      // Loop through the rows
      for(let row = 0; row < iRows.length; row++)
      {
        let iNameField = iRows[row].querySelector('#iNameField');
        let iLinkField = iRows[row].querySelector('#iLinkField');
        let iLifeField = iRows[row].querySelector('#iLifeField');
        let iCostField = iRows[row].querySelector('#iCostField');
        let iSpeedsField = iRows[row].querySelector('#iSpeedsField');
        let iStrengthsField = iRows[row].querySelector('#iStrengthsField');
        let iDefensesField = iRows[row].querySelector('#iDefensesField');
        let iPowersField = iRows[row].querySelector('#iPowersField');
        formData += `&name${row}=${iNameField.value}`;
      }

      // Make object for the request
      const xhr = new XMLHttpRequest();
      xhr.open(nameMethod, nameAction);

      // Assign headers
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      // Attach handleResponse
      xhr.onload = () => handleResponse(xhr, false);

      // Send the data
      xhr.send(formData);

      // Avoid bubbling
      return false;
    };

    // Method for adding new row
    const newRow = () => {
      // Need to implement
    };


    // Attach form script information to the webpage
    const init = () => {
      console.log("init");

      // Get forms
      const nameForm = document.querySelector('#nameForm');

      // Assign variables for methods 
      const addUser = (e) => sendPost(e, nameForm); 

      // Assign events to those variables
      nameForm.addEventListener('submit', addUser);
    };

    window.onload = init;