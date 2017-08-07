'use strict';

var appUrl = window.location.origin;
var pollUrl = window.location.href;

var ajaxFunctions = {

   ready: function ready(fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   },

   ajaxRequest: function ajaxRequest(method, url, data, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function() {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      if (method === 'GET' || 'POST') {
         xmlhttp.open(method, url, true);
         xmlhttp.send();
      }
      else if (method === 'DELETE') {
         xmlhttp.open("DELETE", url, true);
         xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
         xmlhttp.send('data=' + data);
      }
   }
};


//to refactor
