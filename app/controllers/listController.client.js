'use strict';

(function() {
    var list = document.querySelector('.list-group');
    var apiUrl = appUrl + '/polllist/listdata';

    function genPollList(data) {

        var polls = JSON.parse(data);

        if (polls) {
            polls.forEach(function(poll) {
                let title = document.createTextNode(poll.title);
                let a = document.createElement('a');
                a.setAttribute('href', '/polls/' + poll.id);
                a.setAttribute('class', 'list-group-item');
                a.appendChild(title);
                list.appendChild(a);
            });
        }
    }

    //generate poll list
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, null, genPollList));

})();
