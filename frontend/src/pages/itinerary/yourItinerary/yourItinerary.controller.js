angular.module('MainApp')
    .controller('YourItineraryController', function ($scope, $http, $state) {
        $scope.selectedLocation = '';
        $scope.itineraries = [];
        $scope.filteredItineraries = [];
        $scope.selectedDay = {}; // Inisialisasi objek untuk menyimpan hari yang dipilih

        // Ambil userId dan token dari sessionStorage
        const token = sessionStorage.getItem('token');

        // Ambil data itineraries dari API
        $http.get('http://localhost:3001/api/your-itinerary', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function (response) {
                $scope.itineraries = response.data;
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

        $scope.editItinerary = function (itinerary_id) {
            if (!itinerary_id) {
                console.error('itinerary_id is undefined!'); // Debug
                return;
            }
            $state.go('edit-itinerary', { itinerary_id });
        };


        $scope.deleteItinerary = function (itineraryId) {
            // Gunakan SweetAlert2 untuk konfirmasi penghapusan
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to delete this itinerary?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // Jika user memilih untuk menghapus
                    $http.delete(`http://localhost:3001/api/itineraries/${itineraryId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(function (response) {
                        Swal.fire(
                            'Deleted!',
                            'Your itinerary has been deleted.',
                            'success'
                        );
                        // Perbarui daftar itinerary setelah penghapusan
                        $scope.itineraries = $scope.itineraries.filter(itinerary => itinerary._id !== itineraryId);
                        $scope.filterByLocation($scope.selectedLocation);
                    }).catch(function (error) {
                        console.error('Error deleting itinerary:', error);
                        Swal.fire(
                            'Error!',
                            'Failed to delete the itinerary.',
                            'error'
                        );
                    });
                } else {
                    // Jika user memilih untuk membatalkan
                    Swal.fire(
                        'Cancelled',
                        'Your itinerary is safe :)',
                        'info'
                    );
                }
            });
        };
    });
