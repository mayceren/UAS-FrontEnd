// app.js
var app = angular.module('MainApp', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'pages/home/index.html',
      controller: 'HomeController',
    })
    // tempat admin
    .state('register', {
      url: '/register',
      templateUrl: 'pages/auth/register/register.html',
      controller: 'RegisterController',
    })
    .state('login', {
      url: '/login',
      templateUrl: 'pages/auth/login/login.html',
      controller: 'LoginController',
    })
    // bag chella

    // tempat contact

    // tempat profile
    
    .state('favorite', {
      url: '/favorite',
      templateUrl: 'pages/favorite/favorite.html',
      controller: 'FavoriteController',
      resolve: {
        auth: function ($q, $state) {
          const token = sessionStorage.getItem('token');
          if (!token) {
            $state.go('home');
            return $q.reject('Not Authenticated');
          }
          return true;
        },
      },
    })
    // bag chella
});

app.run(function ($transitions, $state) {
  $transitions.onStart({}, function (transition) {
    const token = sessionStorage.getItem('token');
    const toState = transition.to();

    if ((toState.name === 'login' || toState.name === 'register') && token) {
      return $state.target('home');
    }
  });
});

app.service('AuthService', function ($rootScope, $state) {
  const service = {
    isLoggedIn: !!sessionStorage.getItem('token'),

    login: function (token) {
      sessionStorage.setItem('token', token);
      this.isLoggedIn = true;
      $rootScope.isLoggedIn = this.isLoggedIn;
      $state.go('home');
    },

    logout: function () {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user_id');
      this.isLoggedIn = false;
      $rootScope.isLoggedIn = this.isLoggedIn;
      $state.go('home');
    },
  };

  $rootScope.isLoggedIn = service.isLoggedIn;

  return service;
});



app.controller('NavbarController', function ($scope, $rootScope, $state, AuthService) {
  $scope.isLoggedIn = $rootScope.isLoggedIn;

  $scope.logout = function () {
    AuthService.logout();
  };

  $scope.isActive = function (stateName) {
    return $state.is(stateName);
  };

  $scope.$watch(() => $rootScope.isLoggedIn, (newVal) => {
    $scope.isLoggedIn = newVal;
  });
});

// itenerary

app.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      element.bind('change', function () {
        scope.$apply(function () {
          console.log("File uploaded: ", element[0].files[0]);
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);


// swiper
