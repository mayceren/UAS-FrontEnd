angular.module('MainApp')
    .controller('LoginController', function ($scope, $http, $state, AuthService) {
        $scope.credentials = {};
        $scope.message = "";

        // Fungsi untuk login
        $scope.login = function () {
            $http.post('http://localhost:3001/api/login', $scope.credentials)
                .then(function (response) {
                    console.log('Login successful:', response.data);
                    $scope.message = "Login successful!";

                    AuthService.login(response.data.token);

                    sessionStorage.setItem('user_id', response.data.user_id);

                    // Decode token untuk mendapatkan role
                    const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
                    const role = decodedToken.role;

                    let targetState = 'home';
                    if (role === 'admin') {
                        targetState = 'admin';
                    }

                    Swal.fire({
                        title: 'Login Successful!',
                        text: 'You are now logged in.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'swal-button--success'
                        }
                    }).then(() => {
                        $state.go(targetState);
                    });
                })
                .catch(function (error) {
                    console.error('Login error:', error);
                    $scope.message = "Login failed: " + (error.data?.message || "Unknown error");
                });
        };
    });
