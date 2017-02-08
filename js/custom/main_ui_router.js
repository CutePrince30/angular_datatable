var app = angular.module('DemoApp', ['ui.router', 'oc.lazyLoad']);

/* Setup Global Settings */
app.factory('settings', ['$rootScope', function($rootScope) {
  var settings = {
    serverUrl: 'http://127.0.0.1:8080'
  };

  $rootScope.settings = settings;
  return settings;
}]);

/* Setup Routing For All Pages */
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('login', {
      url: '/',
      templateUrl: './views/login.html',
      data: {
        pageTitle: '请登录'
      },
      controller: 'LoginController'
    })
    .state('list', {
      url: '/list',
      templateUrl: './views/list_ui_router.html',
      data: {
        pageTitle: '人员列表'
      },
      controller: 'ListController',
      resolve: {
        dep: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'list',
            insertBefore: '#ng_load_plugins_before',
            files: [
              'css/jquery.dataTables.min.css',
              'js/jquery.dataTables.min.js',

              'js/custom/my-datatable.js'
            ]
          });
        }]
      }
    })
    .state('view', {
      url: '/view/:id',
      templateUrl: './views/detail_ui_router.html',
      data: {
        pageTitle: '人员详情'
      },
      controller: 'DetailController'
    })
}]);

app.controller('LoginController', function ($rootScope, $scope, $http, $state, $httpParamSerializerJQLike) {
    $scope.submit = function () {
        login($scope.username, $scope.password);
    };

    // function login(username, password) {
    //   var data = {
    //     username: username,
    //     password: password
    //   }
    //   $http.post($rootScope.settings.serverUrl + '/sys/login', data).success(function(res) {
    //     if (res.data == 'success') {
    //       $state.go('list');
    //     }
    //   }).error(function(res) {
    //     alert('失败');
    //   });
    // }

    function login(username, password) {
        $http({
            url: $rootScope.settings.serverUrl + '/sys/login',
            method: 'post',
            data: $httpParamSerializerJQLike({
              username: username,
              password: password
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(res) {
          if (res.data == 'success') {
            $state.go('list');
          }
        }).error(function(res) {
          alert('失败');
        });
    };

});

app.controller('DetailController', function($rootScope, $scope, $http, $stateParams) {
  $http.get($rootScope.settings.serverUrl + '/user/detail/' + $stateParams.id).success(function(res) {
    $scope.student = res;
  }).error(function(res) {
    alert('失败');
  });
});

app.controller('ListController', function($rootScope, $scope, $http) {
  $scope.$on('$viewContentLoaded', function() {

  })
});


/* Init global settings and run the app */
app.run(["$rootScope", "settings", "$state", "$log", function($rootScope, settings, $state, $log) {
  /* state change monitor start */
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $log.debug('successfully changed states') ;

    // $log.debug('event', event);
    // $log.debug('toState', toState);
    // $log.debug('toParams', toParams);
    // $log.debug('fromState', fromState);
    // $log.debug('fromParams', fromParams);
  });

  $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
    $log.error('The request state was not found: ' + unfoundState);
  });

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    $log.error('An error occurred while changing states: ' + error);

    // $log.debug('event', event);
    // $log.debug('toState', toState);
    // $log.debug('toParams', toParams);
    // $log.debug('fromState', fromState);
    // $log.debug('fromParams', fromParams);
  });
  /* state change monitor end */

  $rootScope.$state = $state; // state to be accessed from view
  $rootScope.$settings = settings; // state to be accessed from view
}]);
