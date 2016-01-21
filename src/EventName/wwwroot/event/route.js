"use strict";

eventApp.config(["$routeProvider",
    function ($routeProvider) {
        $routeProvider.
            when("/eventName", {
                templateUrl: "/event/views/worker.html",
                controller: "eventController"
            }).
            otherwise({
                redirectTo: "/eventName"
            })
    }
]);