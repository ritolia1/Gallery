/**
 * factory method used by listCtrl for movie list.
 */

sampleApp.factory('listFactory', function($http) {
    var listFactory = {
        factoryCall: function(pagecount) {
            var promise = $http.get('/animals/'+pagecount).then(function (response) {
                var output=JSON.parse(response.data);
                return output;
            });
            return promise;
        }
    };
    return listFactory;
});
