"use strict";

eventApp.controller('eventController', ["$scope", "$rootScope", "$timeout", "backendHubProxy",
    function ($scope, $rootScope, $timeout, backendHubProxy) {
        
        // start out connection
        var myHub = backendHubProxy("eventHub", function () {
            // this func will be executed inside connection.start().done( HERE )
            myHub.invoke("getData");
        });

        // for switching
        $scope.display = true;

        $scope.changeView = function () {
            if ($scope.display)
                $scope.display = false;
            else
                $scope.display = true;
        }

        // ---- Main view -----

        // vars for search 
        $scope.searchText = "";
        $scope.selectFilter = [];
        $scope.selectFilter.mode = ""; // select radio
        $scope.categories = [
            { lable: "All", value: "" },
            { lable: "Checked", value: true },
            { lable: "Unchecked", value: false }
        ];

        // for loading purpose
        $scope.isBusy = false;

        $scope.tableHead = ["#", "First Name", "Last Name", "Chekin"];
        $scope.people = [];

        // add client-side method to hub
        myHub.on("getPeople", function (data) {
            $scope.people = data;
            $scope.isBusy = true;
            $rootScope.$apply();
        });

        // func handls when server sends person to update
        myHub.on("checkinOthers", function (updPerson) {
            updatePersonLocaly(updPerson, $scope.people);
        });

        // when admin added new person list will be updated on clients
        myHub.on("addPerson", function (newPerson) {
            $scope.people.push(newPerson);
            $rootScope.$apply();
        })

        // click ckeckin()
        $scope.checkin = function (person) {
            var updPerson = updatePersonLocaly(person, $scope.people);
            // sent to other connected clients
            myHub.invoke("updatePerson", updPerson);
        }

        // add new person to list
        myHub.on("addPerson", function (person) {
            $scope.people.push(person);
            $rootScope.$apply();
        });

        // get person and list of people
        // find person by id and change his prop (isHere)
        // return updated person
        var updatePersonLocaly = function (person, mas) {
            var temp = mas;
            for (var i = 0; i < temp.length; i++) {
                if (temp[i].id === person.id) {
                    if (temp[i].isHere) {
                        temp[i].isHere = false;
                        $('#row' + temp[i].id).removeClass("success");
                        $('#btn' + temp[i].id).val("Checkin");
                        return temp[i];
                    } else {
                        temp[i].isHere = true;
                        $('#row' + temp[i].id).addClass("success");
                        $('#btn' + temp[i].id).val("Cancel");
                        return temp[i];
                    }
                }
            }
        }

        // ------ Admin view ------

        // for inputs
        $scope.firstName;
        $scope.lastName;

        // for alert purpose
        $scope.message = "A new person has been added!";
        $scope.showMessage = false;

        // click add
        $scope.addNewPerson = function () {
            // send person to server in order to add it to db
            myHub.invoke("addPerson", $scope.firstName, $scope.lastName);

            // clean inputs
            $scope.firstName = "";
            $scope.lastName = "";

            // show 3 sec and then hide message
            $scope.showMessage = true;
            $timeout(function () {
                $scope.showMessage = false;
            }, 3000);

        }

        $scope.cleanList = function () {
            myHub.server.cleanList();
            alert("Done!")
        }
    }
]);
