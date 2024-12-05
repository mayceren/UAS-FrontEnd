angular.module('MainApp')
    .controller('ContactController', function ($scope, $http) {
        $scope.formData = {};

        // Fungsi untuk mengirim pesan menggunakan Formspree
        $scope.sendMessage = function () {
            var data = {
                name: $scope.formData.name,
                email: $scope.formData.email,
                message: $scope.formData.message
            };

            // Mengirim data ke Formspree
            $http.post('https://formspree.io/f/xkgnpzlz', data)
                .then(function (response) {
                    // Jika pengiriman berhasil
                    $scope.successMessage = 'Your message has been sent successfully!';
                    $scope.errorMessage = '';
                    
                    $scope.formData = {};
                })
                .catch(function (error) {
                    // Jika pengiriman gagal
                    $scope.errorMessage = 'Sorry, there was an error sending your message.';
                    $scope.successMessage = '';
                });
        };
    });

