angular.module('MainApp')
    .controller('ItineraryController', function ($scope, $http) {
        $scope.selectedLocation = '';
        $scope.itineraries = [];
        $scope.filteredItineraries = [];
        $scope.selectedDay = {};  // Inisialisasi objek untuk menyimpan hari yang dipilih

        // Ambil userId dan token dari sessionStorage
        const userId = sessionStorage.getItem('user_id');
        const token = sessionStorage.getItem('token');

        // Tentukan URL API berdasarkan ada tidaknya userId di sessionStorage
        const apiUrl = userId
            ? 'http://localhost:3001/api/itinerary'
            : 'http://localhost:3001/api/itineraries';

        // Siapkan konfigurasi request untuk Bearer token jika userId dan token ada
        const config = userId && token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};

        // Ambil data itineraries dari API
        $http.get(apiUrl, config)
            .then(function (response) {
                const datas = response.data
                console.log("response data :", response.data);
                $scope.itineraries = datas.filter(user => user.users_id.role == "admin")


                $scope.filterByLocation('');
            })
            .catch(function (error) {
                console.error('Error fetching itineraries:', error);
            });

        // Fungsi untuk filter itineraries berdasarkan lokasi
        $scope.filterByLocation = function (location) {
            $scope.selectedLocation = location;
            $scope.filteredItineraries = location
                ? $scope.itineraries.filter(itinerary => itinerary.location.toLowerCase() === location.toLowerCase())
                : $scope.itineraries;
        };

        // Fungsi untuk memilih hari yang ditampilkan
        $scope.selectDay = function (itineraryId, dayIndex) {
            // Simpan hari yang dipilih untuk itinerary tertentu
            $scope.selectedDay[itineraryId] = dayIndex;
        };

        // Fungsi untuk menambahkan atau menghapus favorit
        $scope.toggleFavorite = function (itinerary) {
            // Pastikan userId dan token tersedia
            if (!userId || !token) {
                // Gunakan SweetAlert untuk menunjukkan pesan
                Swal.fire({
                    icon: 'warning',
                    title: 'Please log in to add to favorites!',
                    showConfirmButton: true
                });
                return;
            }

            const data = {
                users_id: userId,
                itinerary_id: itinerary._id
            };

            // Kirim request untuk menambah atau menghapus favorit
            $http.post('http://localhost:3001/api/favorites', data, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(function (response) {
                    // Toggle status favorit berdasarkan response
                    itinerary.isFavorite = (response.data.message === 'Favorite added successfully');
                })
                .catch(function (error) {
                    console.error('Error toggling favorite:', error);
                });
        };
    });
