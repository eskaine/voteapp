'use strict';

(function() {

    var newPollButton = document.querySelector('#new');
    var addOptionButton = document.querySelector('#add');
    var submitButton = document.querySelector('#submit');
    var optionsList = document.querySelector('#options');
    var options = 2;
    
    const minOption = 2;

    function clearPoll() {

        //reset option count    
        options = minOption;

        document.querySelector('#pollTitle').value = '';
        document.querySelector('#option1').value = '';
        document.querySelector('#option2').value = '';

        let children = optionsList.childNodes;

        if (children.length > minOption) {
            for (var i = minOption, n = children.length; i < n - 1; i++) {
                optionsList.removeChild(children[i]);
            }
            optionsList.removeChild(optionsList.lastChild);
        }
    }

    //clear poll on modal hidden
    $("#pollModal").on('hidden.bs.modal', function() {
        clearPoll();
    });

    //clear poll on navigating away from current page
    window.addEventListener('unload', function(event) {
        clearPoll();
    });

    //delete poll
    document.addEventListener('click', function(event) {
        let id = event.target.parentElement.id;

        //check for delete button
        if (event.target.tagName === 'A' && event.target.className === 'listitem-delete') {
            //delete poll from database
            ajaxFunctions.ajaxRequest('DELETE', apiUrl, id, function(respond) {
                if (respond) {
                    //delete poll from user list
                    let element = document.getElementById(id);
                    listBox.removeChild(element);
                }
            });
        }
    });

    //add option to option list
    addOptionButton.addEventListener('click', function() {

        options++;

        let container = document.createElement('div');

        let label = document.createElement('label');
        label.setAttribute('class', 'label-option');
        label.setAttribute('for', 'option' + options);

        let labelText = document.createTextNode('Option ' + options);
        label.appendChild(labelText);

        let input = document.createElement('input');
        input.setAttribute('id', 'option' + options);
        input.setAttribute('class', 'form-control');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'option' + options);

        container.appendChild(label);
        container.appendChild(input);
        optionsList.appendChild(container);

    });
    
})();
