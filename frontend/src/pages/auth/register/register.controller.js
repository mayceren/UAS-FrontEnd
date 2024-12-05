angular.module('MainApp')
  .controller('RegisterController', function ($scope, $http, $state) {
    $scope.message = '';  // Untuk menampilkan pesan
    $scope.user = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    $scope.submitForm = function () {
      // Cek kecocokan password dan confirm password
      if ($scope.user.password !== $scope.user.confirmPassword) {
        console.log("password not match!");
        $scope.message = "Password and confirm password do not match!";
        return;
      }

      // Kirim data ke backend
      $http.post('http://localhost:3001/api/register', $scope.user)
        .then(function (response) {
          console.log("registration success!");
          $scope.message = "Registration successful!";

          // Menampilkan pesan setelah registrasi sukses
          Swal.fire({
            title: 'Registration Successful!',
            text: 'Your account has been created successfully. Please log in.',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'swal-button--success'
            }
          }).then(() => {
            // Arahkan pengguna ke halaman login setelah pesan ditutup
            $state.go('login');
          });
        })
        .catch(function (error) {
          console.log("registration failed!");

          // Tampilkan pesan error jika ada, jika tidak ada tampilkan pesan default
          if (error.data && error.data.message) {
            $scope.message = "Registration failed: " + error.data.message;
          } else {
            $scope.message = "An error occurred. Please try again.";
          }
        });
    };
  });
