'use strict';

var listBox = document.querySelector('#pollContainer');
var apiUrl = appUrl + '/home/list';

(function() {

    function genUserList(data) {

        var polls = JSON.parse(data);

        if (!polls) {

            let text = document.createTextNode("Create your poll by pressing New Poll above!");
            let header = document.createElement('h1');
            header.appendChild(text);
            listbox.appendChild(header);
        }
        
        else {

            polls.forEach(function(poll) {

                let pollBox = document.createElement('div');
                pollBox.setAttribute('id', poll.id);
                pollBox.setAttribute('class', 'listitem');

                let deleteText = document.createTextNode('Delete');
                let deleteBtn = document.createElement('a');
                deleteBtn.setAttribute('class', 'listitem-delete');
                deleteBtn.appendChild(deleteText);

                let titleText = document.createTextNode(poll.title);
                let pollLink = document.createElement('a');
                pollLink.setAttribute('class', 'listitem-title');
                pollLink.setAttribute('href', '/polls/' + poll.id);
                pollLink.appendChild(titleText);

                pollBox.appendChild(pollLink);
                pollBox.appendChild(deleteBtn);
                listBox.appendChild(pollBox);

            });
        }
    }

    //generate user poll list
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, null, genUserList));

})();
