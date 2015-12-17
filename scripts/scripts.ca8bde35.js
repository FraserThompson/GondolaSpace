"use strict";angular.module("publicApp",["ngAnimate","ngCookies","ngResource","ui.router","ngSanitize","ngTouch","ezfb","ui.bootstrap","ui-notification","pw.canvas-painter"]).run(["$rootScope",function(a){a.api_url="https://api.gondola.space"}]).config(["$stateProvider","$urlRouterProvider","NotificationProvider","ezfbProvider",function(a,b,c,d){c.setOptions({delay:1e4,startTop:20,startRight:10,verticalSpacing:20,horizontalSpacing:20,positionX:"left",positionY:"bottom"}),d.setLocale("en_NZ"),d.setInitParams({appId:"156068884749797",version:"v2.5"}),b.otherwise("/"),a.state("home",{url:"/?gondola",templateUrl:"views/main.html",controller:"MainCtrl",reloadOnSearch:!1,resolve:{gondola:["GondolaService","$stateParams",function(a,b){return b.gondola?a.getSpecific(b.gondola):a.getRandom()}]},onEnter:["$location","gondola",function(a,b){b&&a.search("gondola",b._id)}]}).state("profile",{url:"/profile/:id",templateUrl:"views/profile.html",controller:"ProfileCtrl",resolve:{user:["UserService","$stateParams",function(a,b){return console.log(b.id),a.getUser(b.id)}]}})}]),angular.module("publicApp").directive("fileModel",["$parse",function(a){return{restrict:"A",link:function(b,c,d){var e=a(d.fileModel),f=e.assign;c.bind("change",function(){b.$apply(function(){f(b,c[0].files[0])})})}}}]),angular.module("publicApp").service("GondolaService",["$rootScope","$http","$q",function(a,b,c){var d=this,e=a.api_url;this.getFlavour=function(a){for(var b=Object.keys(a.flavours),c=b.length;c--;)a.flavours[b[c]]||b.splice(c,1);var d=b.sort(function(b,c){return-(a.flavours[b]-a.flavours[c])}),e=d[0]&&d[1]?d[0]+" & "+d[1]:"bland";return e},this.uploadGondola=function(c){var d=new FormData;d.append("gondola",c);var f={method:"POST",url:e+"/",data:d,headers:{"Content-Type":void 0,Authorization:a.signedRequest}};return b(f)},this.getFromOwner=function(a){var d=c.defer();return b({method:"GET",url:e+"/?owner="+a}).then(function(a){d.resolve(a.data)},function(a){d.reject(a)}),d.promise},this.getRandom=function(){var a=c.defer();return b({method:"GET",url:e+"/?random=1"}).then(function(b){console.log(b),null===b.data?a.resolve(null):(b.data.flavour=d.getFlavour(b.data),a.resolve(b.data))},function(b){a.reject(b)}),a.promise},this.getSpecific=function(a){var f=c.defer();return b({method:"GET",url:e+"/?id="+a}).then(function(a){null===a.data?f.resolve(null):(a.data[0].flavour=d.getFlavour(a.data[0]),f.resolve(a.data[0]))},function(a){f.reject(a)}),f.promise},this.updateGondola=function(a,d,f){var g={id:a},h=c.defer();return d&&(g.flavours=d),f&&(g.voted=f),b({method:"PUT",url:e+"/",data:g}).then(function(a){console.log(a.data),h.resolve(a.data)},function(a){h.reject(a)}),h.promise}}]),angular.module("publicApp").service("UserService",["$rootScope","$http","$q",function(a,b,c){var d=a.api_url;this.getUser=function(a){return b({method:"GET",url:d+"/user?id="+a})},this.createUser=function(){return b({method:"POST",url:d+"/user",headers:{Authorization:a.signedRequest}})},this.updateUser=function(c){return b({method:"PUT",url:d+"/user",data:{update:c},headers:{Authorization:a.signedRequest}})},this.uploadProfile=function(c){var e={method:"POST",url:d+"/user/pic",data:{pic:c},headers:{Authorization:a.signedRequest}};return b(e)}}]),angular.module("publicApp").controller("HeaderCtrl",["$rootScope","$scope","$state","$timeout","Notification","ezfb","GondolaService","UserService",function(a,b,c,d,e,f,g,h){a.LOGGED_IN_USER={},b.loginStatus={},b.login=function(){f.login(function(b){b.authResponse?(a.signedRequest=b.authResponse.signedRequest,h.createUser(),i(j)):console.log("no auth")},{scope:"public_profile"})},b.updateUser=function(a){h.updateUser(a)};var i=function(c){f.getLoginStatus(function(d){a.signedRequest=d.authResponse.signedRequest,b.loginStatus=d,(c||angular.noop)()})},j=function(){f.api("/me",function(a){b.apiMe=a,b.getUser(b.apiMe.id)})};b.getUser=function(b){h.getUser(b).then(function(b){a.LOGGED_IN_USER=b.data,e.success("Successfully logged in as "+a.LOGGED_IN_USER._id),console.log(a.LOGGED_IN_USER._id),b.data.pic||e.warning("You should set a profile pic.")})},b.uploadGondola=function(){return""==a.LOGGED_IN_USER.pic?void e.error("You need a profile pic before you can submit a gondola."):void g.uploadGondola(b.gondolaFile).then(function(a){$("#gondolaModal").modal("hide"),c.go("home",{gondola:a.data._id},{reload:!0})},function(a){console.log(a)})},i(j)}]),angular.module("publicApp").controller("ProfileCtrl",["$rootScope","$scope","$timeout","$state","$stateParams","$http","user","UserService","GondolaService",function(a,b,c,d,e,f,g,h,i){b.user=g.data,b.pic_url=a.api_url+b.user.pic+"?decache="+Math.random(),b.uploadProfile=function(){var c=document.getElementById("canvas");h.uploadProfile(c.toDataURL("image/png")).then(function(c){b.user=c.data,b.pic_url=a.api_url+b.user.pic+"?decache="+Math.random(),d.go("profile",{id:b.user._id},{reload:!0})},function(a){console.log(a)})},b.uploadDescription=function(){var a=document.getElementById("user_description").value;b.user.description=a,h.updateUser(b.user).then(function(a){b.user=a.data,d.go("profile",{id:b.user._id},{reload:!0})},function(a){console.log(a)})},i.getFromOwner(b.user._id).then(function(a){b.own_gondolas=a})}]),angular.module("publicApp").controller("MainCtrl",["$rootScope","$scope","$state","$location","$stateParams","$http","gondola","GondolaService","UserService",function(a,b,c,d,e,f,g,h,i){var j={},k="";b.gondola=g,g&&i.getUser(g.owner).then(function(a){b.owner=a.data}),b.getRandom=function(){h.getRandom().then(function(a){k="",j={},b.gondola=a,d.search("gondola",a._id)})},b.updateVote=function(a,b,c){"umami"==c&&"notUmami"==k||"notUmami"==c&&"umami"==k||(c==k?(k="",b[c]-=1):(k=c,b[c]+=1),h.updateGondola(a,null,b))},b.updateFlavour=function(a,c,d){d in j?(delete j[d],c[d]-=1):(j[d]=1,c[d]+=1),h.updateGondola(a,c).then(function(a){b.gondola.flavour=h.getFlavour(a)})},b.addFavorite=function(a){i.updateUser({favorite:a})},$("#myModal").on("hidden.bs.modal",function(a){c.go("home",{gondola:b.gondola._id},{notify:!1,reload:!0})})}]),angular.module("publicApp").run(["$templateCache",function(a){a.put("views/main.html",'<div class="row"> <div class="col-xs-11"> <h2 style="margin-top: 0">this gondola is {{gondola.flavour}} with a score of {{gondola.voted.umami - gondola.voted.notUmami}}</h2> </div> <div class="col-xs-1"> <a href="" ng-click="addFavorite(gondola._id)">favorite</a> </div> </div> <div class="row"> <div class="col-xs-12"> <a href="" ng-click="getRandom()"> <img ng-src="{{api_url}}/uploads/gondola/{{gondola.file.thumbnail}}" style="width: 100%" alt="Gondola"> </a> </div> </div> <div class="row" style="margin-top: 23px"> <form> <div class="col-xs-3"> <div class="btn-group" role="group"> <button class="btn btn-success" ng-click="updateVote(gondola._id, gondola.voted, \'umami\')"> Umami <span class="badge">{{gondola.voted.umami}}</span> </button> <button class="btn btn-danger" ng-click="updateVote(gondola._id, gondola.voted, \'notUmami\')"> Spicy <span class="badge">{{gondola.voted.notUmami}}</span> </button> </div> </div> <div class="col-xs-5"> <button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off" tooltip-placement="top" uib-tooltip="calming or nostalgic" ng-click="updateFlavour(gondola._id, gondola.flavours, \'sweet\')"> Sweet <span class="badge">{{gondola.flavours.sweet}}</span> </button> <button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off" tooltip-placement="top" uib-tooltip="funny or strange" ng-click="updateFlavour(gondola._id, gondola.flavours, \'salty\')"> Salty <span class="badge">{{gondola.flavours.salty}}</span> </button> <button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off" tooltip-placement="top" uib-tooltip="melancholy or deep" ng-click="updateFlavour(gondola._id, gondola.flavours, \'bitter\')"> Bitter <span class="badge">{{gondola.flavours.bitter}}</span> </button> <button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off" tooltip-placement="top" uib-tooltip="lighthearted or exciting" ng-click="updateFlavour(gondola._id, gondola.flavours, \'sour\')"> Sour <span class="badge">{{gondola.flavours.sour}}</span> </button> </div> </form> <div class="col-xs-4"> this gondola was discovered by <a style="float: right" ui-sref="profile({id: owner._id })"><img ng-src="{{api_url}}{{owner.pic}}" alt="owner" width="80" height="80"></a> </div> </div> '),a.put("views/profile.html",'<div class="row"> <div class="col-sm-2"> <div ng-if="user.pic != \'\'"> <img ng-src="{{pic_url}}" alt="owner"> </div> <div ng-if="user.pic == \'\'"> No user pic. </div> <button ng-if="LOGGED_IN_USER._id = user._id" class="btn btn-primary" popover-placement="bottom" uib-popover-template="\'upload_popover.html\'" popover-title="Draw" type="button" class="btn btn-default">Draw something</button> </div> <div class="col-sm-10"> <p ng-hide="{{user.description != \'\'}}">This gondola has nothing to say about themselves.</p> <p>{{user.description}}</p> <button ng-if="LOGGED_IN_USER._id = user._id" class="btn btn-primary" popover-placement="bottom" uib-popover-template="\'description_popover.html\'" popover-title="Write" type="button" class="btn btn-default">Say something</button> </div> </div> <div class="row"> <div class="col-sm-12"> <h2>Favorite Gondolas:</h2> </div> </div> <div class="row"> <div ng-if="fav_gondolas"> <div ng-repeat="gondola in fav_gondolas"> <div class="col-sm-3"> <a href="" ui-sref="home({gondola: gondola._id})"><img ng-src="{{api_url}}/uploads/gondola/{{gondola.file.thumbnail}}" style="width: 100%" alt="Gondola"></a> </div> </div> </div> <div ng-show="!fav_gondolas"> <div class="col-sm-12"> <h3>None yet!</h3> </div> </div> </div> <div class="row"> <div class="col-sm-12"> <h2>Posted Gondolas:</h2> </div> </div> <div class="row"> <div ng-if="own_gondolas"> <div ng-repeat="gondola in own_gondolas"> <div class="col-sm-3"> <a href="" ui-sref="home({gondola: gondola._id})"><img ng-src="{{api_url}}/uploads/gondola/{{gondola.file.thumbnail}}" style="width: 100%" alt="Gondola"></a> </div> </div> </div> <div ng-show="!own_gondolas"> <div class="col-sm-12"> <h3>None yet!</h3> </div> </div> </div> <script type="text/ng-template" id="upload_popover.html"><div>\r\n	<div pw-canvas options="{width: 80, height: 80, color: model.myColor, customCanvasId: \'canvas\'}"></div>\r\n	<div pw-color-selector="[\'#000\', \'#00f\', \'#0f0\', \'#f00\']" color="model.myColor"></div>\r\n	<button class="btn btn-default" ng-click="uploadProfile()">Save</button>\r\n	</div></script> <script type="text/ng-template" id="description_popover.html"><div style="width: 400px;">\r\n		<div class="row">\r\n			<div class="col-sm-12">\r\n				<textarea rows="4" cols="10" id="user_description"></textarea>\r\n			</div>\r\n		</div>\r\n		<button class="btn btn-default" ng-click="uploadDescription()">Save</button>\r\n	</div></script>')}]);