angular.module('publicApp')
  .service('UserService', function ($rootScope, $http, $q) {
      var api = $rootScope.api_url;

      this.getUser = function (id) {
        return $http({
          method: 'GET',
          url: api + '/user?id=' + id
        });
      }

      this.createUser = function (data) {
        return $http({
          method: 'POST',
          url: api + '/user',
          data: {'signedRequest': data},
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

      this.uploadProfile = function (file) {
        var fd = new FormData();
        fd.append('profile', file);

         var request = {
            method: 'POST',
            url: api + '/user/pic',
            data: fd,
            headers: {
                'Content-Type': undefined,
                'Authorization': $rootScope.signedRequest
            }
        };

        return $http(request);
      }

  });
