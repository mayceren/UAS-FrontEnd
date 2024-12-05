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
    .state('admin', {
      url: '/admin',
      templateUrl: 'pages/admin/admin.html',
      controller: 'AdminController',
      resolve: {
        auth: function ($q, $state) {
          const token = sessionStorage.getItem('token');
          if (!token) {
            $state.go('login');
            return $q.reject('Not Authenticated');
          }

          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          console.log("decodeToken :", decodedToken)
          if (decodedToken.role !== 'admin') {
            $state.go('home');
            return $q.reject('Not Authorized');
          }

          return true;
        },
      },
    })
    .state('admin-add-destination', {
      url: '/admin/add-destination',
      templateUrl: 'pages/admin/addDestination/addDestination.html',
      controller: 'AddDestinationAdminController',
      resolve: {
        auth: function ($q, $state) {
          const token = sessionStorage.getItem('token');
          if (!token) {
            $state.go('login');
            return $q.reject('Not Authenticated');
          }

          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          console.log("decodeToken :", decodedToken)
          if (decodedToken.role !== 'admin') {
            $state.go('home');
            return $q.reject('Not Authorized');
          }

          return true;
        },
      },
    })
    .state('admin-edit-destination', {
      url: '/admin/edit-destination/:destination_id',
      templateUrl: 'pages/admin/editDestination/editDestination.html',
      controller: 'EditDestinationAdminController',
      resolve: {
        auth: function ($q, $state) {
          const token = sessionStorage.getItem('token');
          if (!token) {
            $state.go('login');
            return $q.reject('Not Authenticated');
          }

          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          console.log("decodeToken :", decodedToken)
          if (decodedToken.role !== 'admin') {
            $state.go('home');
            return $q.reject('Not Authorized');
          }

          return true;
        },
      },
    })
    .state('admin-add-itinerary', {
      url: '/admin/add-itinerary',
      templateUrl: 'pages/admin/addItinerary/addItinerary.html',
      controller: 'AddItineraryAdminController',
      resolve: {
        auth: function ($q, $state) {
          const token = sessionStorage.getItem('token');
          if (!token) {
            $state.go('login');
            return $q.reject('Not Authenticated');
          }

          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          console.log("decodeToken :", decodedToken)
          if (decodedToken.role !== 'admin') {
            $state.go('home');
            return $q.reject('Not Authorized');
          }

          return true;
        },
      },
    })
    .state('admin-edit-itinerary', {
      url: '/admin/edit-itinerary/:itinerary_id',
      templateUrl: 'pages/admin/editItinerary/editItinerary.html',
      controller: 'EditItineraryAdminController',
      resolve: {
        auth: function ($q, $state) {
          const token = sessionStorage.getItem('token');
          if (!token) {
            $state.go('login');
            return $q.reject('Not Authenticated');
          }

          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          console.log("decodeToken :", decodedToken)
          if (decodedToken.role !== 'admin') {
            $state.go('home');
            return $q.reject('Not Authorized');
          }

          return true;
        },
      },
    })
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
    .state('destination', {
      url: '/destination?selectedLocation',
      templateUrl: 'pages/destination/destination.html',
      controller: 'DestinationController',
    })
    .state('itinerary', {
      url: '/itinerary',
      templateUrl: 'pages/itinerary/itnerary.html',
      controller: 'ItineraryController',
    })
    .state('contact', {
      url: '/contact',
      templateUrl: 'pages/contact/contact.html',
      controller: 'ContactController',
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'pages/profile/profile.html',
      controller: 'ProfileController',
      resolve: {
        auth: function ($q, $state) {
          const token = sessionStorage.getItem('token');
          if (!token) {
            $state.go('login');
            return $q.reject('Not Authenticated');
          }
          return true;
        },
      },
    })
    .state('update-profile', {
      url: '/update-profile',
      templateUrl: 'pages/profile/updateProfile/updateProfile.html',
      controller: 'UpdateProfileController',
      resolve: {
        auth: function ($q, $state) {
          const token = sessionStorage.getItem('token');
          if (!token) {
            $state.go('login');
            return $q.reject('Not Authenticated');
          }
          return true;
        },
      },
    })
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
    .state('your-itinerary', {
      url: '/your-itinerary',
      templateUrl: 'pages/itinerary/yourItinerary/yourItinerary.html',
      controller: 'YourItineraryController',
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
    .state('add-itinerary', {
      url: '/add-itinerary',
      templateUrl: 'pages/itinerary/addItinerary/addItinerary.html',
      controller: 'YourItineraryController',
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
    .state('edit-itinerary', {
      url: '/itineraries/:itinerary_id',
      templateUrl: 'pages/itinerary/editItinerary/editItinerary.html',
      controller: 'EditItineraryController',
      resolve: {
        auth: function ($q, $state, ItineraryService, $stateParams) {
          const token = sessionStorage.getItem('token');
          if (!token) {
            $state.go('login');
            return $q.reject('Not Authenticated');
          }
          if (!$stateParams.itinerary_id) {
            console.error('itinerary_id is missing in resolve!');
            return $q.reject('Missing itinerary_id');
          }
          return ItineraryService.getItinerary($stateParams.itinerary_id);
        },
      },
    });
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

app.service('ItineraryService', function ($http) {
  const token = sessionStorage.getItem('token');

  this.getItinerary = function (id) {
    return $http.get(`http://localhost:3001/api/itinerary/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then((res) => res.data);
  };

  this.updateItinerary = function (itinerary) {
    return $http.put(`http://localhost:3001/api/itineraries/${itinerary._id}`, itinerary, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };
});

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


app.directive('swiperDirective', function () {
  return {
    link: function () {
      new Swiper('.swiper', {
        loop: true,
        slidesOffsetAfter: 40,
        slidesOffsetBefore: 40,
        grabCursor: true,
        // spaceBetween: 10,
        // centeredSlides: true,
        // centerInsufficientSlides: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: false,
          dynamicBullets: true
        },
        breakpoints: {
          0: {
            slidesPerView: 1
          },
          768: {
            slidesPerView: 2
          },
          1024: {
            slidesPerView: 3
          },
        }
      });
    },
  };
});
