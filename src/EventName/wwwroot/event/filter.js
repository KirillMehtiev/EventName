'use strict';

eventApp.filter("personFilter", function () {
    return function (people, textSearch, filter) {

        // todo: rewrite into single loop |filterByMode + filterByFullName|
        var filterByMode = function (list, filter) {
            var listToBack = [];
            for (var i = 0; i < list.length; i++) {
                if (filter === true) {
                    if (list[i].isHere) listToBack.push(list[i]);
                } else if (filter === false) {
                    if (!list[i].isHere) listToBack.push(list[i]);
                }
            }
            return listToBack;
        }

        var filterByFullName = function (listToSearch) {

            if (textSearch != "") {
                var listToBack = [],
                    fullName, result;

                for (var i = 0; i < listToSearch.length; i++) {
                    fullName = (listToSearch[i].firstName + " " + listToSearch[i].lastName).toLowerCase();
                    result = fullName.indexOf(textSearch.toLowerCase());

                    if (result >= 0) {
                        listToBack.push(listToSearch[i]);
                    }
                }

                return listToBack;

            } else return listToSearch;
        }

        var filtredList = [];

        if (filter === "false") {                        // Unchecked
            filtredList = filterByMode(people, false);
            return filterByFullName(filtredList);
        } else if (filter === "true") {                  // Checked                         
            filtredList = filterByMode(people, true);
            return filterByFullName(filtredList);
        } else {                                         // All
            return filterByFullName(people);             
        }
    }
})
