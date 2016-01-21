'use strict';

eventApp.factory('backendHubProxy', ['$rootScope',
  function ($rootScope) {

      function backendFactory(hubName, connectionDone) {
          var connection = $.hubConnection();
          var hubProxy = connection.createHubProxy(hubName);

          // to init hub
          hubProxy.on("test", function () {

          });

          // turn on logging
          hubProxy.connection.logging = true;

          // start connection
          console.log("starting connection...")
          connection.start({ transport: ['webSockets', 'foreverFrame', 'longPolling'] })
              .done(function () {
                  console.log("connected " + $.connection.hub.id);

                  if (connectionDone != 'undefined')
                      connectionDone();
              }).fail(function (error) {
                  console.log("Error: " + error);
              });

          return hubProxy;
      };

      return backendFactory;
  }]);