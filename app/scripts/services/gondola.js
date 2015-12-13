angular.module('publicApp')
  .service('GondolaService', function ($rootScope, $http, $q) {
      var self = this;
      var api = $rootScope.api_url;

      this.getFlavour = function (gondola){
        var keys = Object.keys(gondola.flavours);
        var i = keys.length;

        while (i--) {
          if (!gondola.flavours[keys[i]]){
            keys.splice(i, 1);
          }
        }
        var keysSorted = keys.sort(function(a, b) {return -(gondola.flavours[a] - gondola.flavours[b])});
        var flavour = (keysSorted[0] && keysSorted[1]) ? keysSorted[0] + " & " + keysSorted[1] : "bland";
        return flavour;
      }

      this.uploadGondola = function (file) {
        var fd = new FormData();
        fd.append('gondola', file);

         var request = {
            method: 'POST',
            url: api + '/',
            data: fd,
            headers: {
                'Content-Type': undefined,
                'Authorization': $rootScope.signedRequest
            }
        };

        return $http(request);
      }

      this.getFromOwner = function(owner) {
        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: api + '/?owner=' + owner
        }).then( function (gondola) {
          deferred.resolve(gondola.data);
        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      }

      this.getRandom = function() {
        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: api + '/?random=1'
        }).then( function (gondola) {
          console.log(gondola);
          if (gondola.data === null){
            deferred.resolve(null);
          } else {
            gondola.data.flavour = self.getFlavour(gondola.data);
            deferred.resolve(gondola.data);
          }
        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      }

      this.getSpecific = function (id) {
        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: api + '/?id=' + id
        }).then( function (gondola) {
          if (gondola.data === null){
            deferred.resolve(null);
          } else {
            gondola.data[0].flavour = self.getFlavour(gondola.data[0]);
            deferred.resolve(gondola.data[0]);
          }
        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      }

      this.updateGondola = function (id, flavours, voted) {
        var data = {'id': id}
        var deferred = $q.defer();

        if (flavours){ data.flavours = flavours; }
        if (voted){ data.voted = voted; }

        $http({
          method: 'PUT',
          url: api + '/',
          data: data
        }).then (function (gondola) {
          console.log(gondola.data);
          deferred.resolve(gondola.data);
        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      }

  });
