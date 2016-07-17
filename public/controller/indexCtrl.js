/**
 *  Calls the api to list the movies of a specific year.
*/
	
var pagecount=1;

sampleApp.controller('myCtrl', function($scope,listFactory) {
    listFactory.factoryCall(pagecount).then(function(output) {
        output=JSON.parse(output);
        $scope.obj=output;
    }); 

	//Decrease the page count
    $scope.decrese =function(){
        pagecount--;
        if (pagecount<=0) {
            pagecount=1;
        }
        listFactory.factoryCall(pagecount).then(function(output) {
            output=JSON.parse(output);
            $scope.obj=output;
        });
    };

	//Increase the page count
    $scope.increse = function(){
        pagecount++;
        listFactory.factoryCall(pagecount).then(function(output) {
            output=JSON.parse(output);
            $scope.obj=output;
        });
    }; 
}); 
