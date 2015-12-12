angular.module('publicApp')
  .service('UserService', function ($http, $q) {
      //var api = "http://localhost:3000";
      var api = 'http://45.55.61.237';
      
      this.getUser = function (id) {
        return $http({
          method: 'GET',
          url: api + '/user?id=' + id
        });
      }

      this.createUser = function (data) {
        return $http({
          withCredentials: true,
          method: 'POST',
          url: api + '/user',
          data: {'signedRequest': data}
        });
      }

      this.updateUser = function (data) {
        return $http({
          withCredentials: true,
          method: 'PUT',
          url: api + '/user',
          data: {'update': data}
        });
      }

      this.uploadProfile = function (file) {
        var fd = new FormData();
        fd.append('profile', file);

         var request = {
            withCredentials: true,
            method: 'POST',
            url: api + '/user/pic',
            data: fd,
            headers: {
                'Content-Type': undefined
            }
        };

        return $http(request);
      }

  });
