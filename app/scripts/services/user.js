angular.module('publicApp')
  .service('UserService', function ($rootScope, $http, $q) {
      var api = $rootScope.api_url;

      this.getUser = function (id) {
        return $http({
          method: 'GET',
          url: api + '/user?id=' + id
        });
      }

      this.createUser = function () {
        return $http({
          method: 'POST',
          url: api + '/user',
          headers: {
            'Authorization': $rootScope.signedRequest
          }
        });
      }

      this.updateUser = function (data) {
        return $http({
          method: 'PUT',
          url: api + '/user',
          data: {'update': data},
          headers: {
            'Authorization': $rootScope.signedRequest
          }
        });
      }

      this.uploadProfile = function (dataUrl) {
         var request = {
            method: 'POST',
            url: api + '/user/pic',
            data: { 'pic': dataUrl },
            headers: {
                'Authorization': $rootScope.signedRequest
            }
        };

        return $http(request);
      }

  });
