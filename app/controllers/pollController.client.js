'use strict';

(function() {
  var addOptionBtn = document.querySelector('#newoption-btn');
  var form = document.querySelector('#newoption-form');
  var subgrid = document.querySelector('.subgrid-poll');
  var title = document.querySelector('.title');
  var votelist = document.querySelector('.vote-list');
  var ctx = document.querySelector('canvas').getContext('2d');
  var apiUrl = pollUrl + '/update';

  const colors = ['#607D8B', '#00BBD3', '#4CAE50', '#E81E63', '#FEC007', '#9C27AF', '#03A8F3', '#009688', '#F34336', '#FE9800'];

  function updateHtmlElement(data, element, userProperty) {
    element.innerHTML = data[userProperty];
  }

  //add new option to current poll
  if (addOptionBtn) {
    addOptionBtn.addEventListener('click', function(event) {

      let div = document.querySelector('.vote-newoption');
      div.removeChild(div.firstChild);

      let input = document.createElement('input');
      input.setAttribute('class', 'form-control inputfield');
      input.setAttribute('name', 'newoption');
      input.setAttribute('placeholder', 'New Option');

      let text = document.createTextNode('Add Option');

      let textdiv = document.createElement('div');
      textdiv.setAttribute('class', 'vote-text');
      textdiv.appendChild(text);

      let submitBtn = document.createElement('button');
      submitBtn.setAttribute('type', 'submit');
      submitBtn.setAttribute('class', "btn btn-success btn-lg vote-buttons");
      submitBtn.appendChild(textdiv);

      form.appendChild(input);
      form.appendChild(submitBtn);
    });
  }

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, null, function(data) {

    var labelNames = [];
    var labelData = [];
    var pollData = JSON.parse(data);

    //if poll data is not available
    if (!pollData) {

      let grid = document.querySelector('.grid');
      grid.removeChild(grid.lastChild);

      let header = document.createElement('h3');
      header.innerHTML = 'Invalid Poll!'

      let div = document.createElement('div');
      div.setAttribute('class', 'well invalid');
      div.appendChild(header);

      grid.appendChild(div);

      return false;
    }

    //set poll title
    if (pollData.title) {
      title.innerHTML = pollData.title;
    }

    //if poll data is available    
    if (pollData.data) {

      //prepare datasets
      Object.keys(pollData.data).map(function(key) {
        labelNames.push(key);
        labelData.push(pollData.data[key]);
      });

      //generate poll list for voting
      labelNames.forEach(function(voteLabel) {
        let text = document.createTextNode(voteLabel);
        let option = document.createElement('option');
        option.setAttribute('value', voteLabel)
        option.appendChild(text);
        votelist.appendChild(option);
      });

      //generate vote chart
      var newPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labelNames,
          datasets: [{
            data: labelData,
            backgroundColor: colors
          }]
        },
        options: {
          legend: {
            labels: {
              fontSize: 14,
              fontColor: '#374046'
            },
            position: 'bottom'
          }
        }
      });
      
    }
  }));
})();
