angular.module('MainApp')
    .controller('DestinationController', function ($scope, $http, $stateParams, $state) {
        $scope.selectedLocation = $stateParams.selectedLocation || '';
        $scope.cards = [];
        $scope.filteredCards = [];
        $scope.recomendation = [];

        // Tentukan URL API berdasarkan sessionStorage
        const userId = sessionStorage.getItem('user_id');
        const token = sessionStorage.getItem('token');
        const apiUrl = userId
            ? 'http://localhost:3001/api/destinations'
            : 'http://localhost:3001/api/destination';

        // Menyiapkan header Authorization jika user_id ada
        const config = userId && token ? {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        } : {};

        // Ambil data dari API
        $http.get(apiUrl, config)
            .then(function (response) {
                $scope.cards = response.data;
                $scope.recomendation = response.data.slice(0, 5);

                $scope.filterByLocation($scope.selectedLocation);
            })
            .catch(function (error) {
                console.error('Error fetching destinations:', error);
            });

        // Fungsi untuk filter destinasi berdasarkan lokasi
        $scope.filterByLocation = function (location) {
            $scope.selectedLocation = location;
            $scope.filteredCards = location
                ? $scope.cards.filter(card => card.location.toLowerCase() === location.toLowerCase())
                : $scope.cards;
        };

        // Fungsi untuk mengubah URL ketika tombol lokasi diklik
        $scope.changeLocation = function (location) {
            $state.go('destination', { selectedLocation: location });
        };

        // Fungsi untuk menambahkan atau menghapus favorit
        $scope.toggleFavorite = function (card) {
            // Pastikan user_id dan token tersedia
            const userId = sessionStorage.getItem('user_id');
            const token = sessionStorage.getItem('token');

            if (!userId || !token) {
                // Gunakan SweetAlert untuk menunjukkan pesan
                Swal.fire({
                    icon: 'warning',
                    title: 'Please log in to add to favorites!',
                    showConfirmButton: true
                });
                return;
            }

            // Siapkan data untuk dikirimkan ke API
            const data = {
                users_id: userId,
                destination_id: card._id
            };

            // Siapkan konfigurasi request dengan token Bearer
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            // Kirim request ke API untuk menambah/menghapus favorit
            $http.post('http://localhost:3001/api/favorites', data, config)
                .then(function (response) {
                    if (response.data.message === 'Favorite added successfully') {
                        card.isFavorite = true;
                    } else if (response.data.message === 'Favorite removed successfully') {
                        card.isFavorite = false;
                    }
                    console.log(response.data.message);
                })
                .catch(function (error) {
                    console.error('Error toggling favorite:', error);
                });
        };
    });
