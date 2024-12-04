angular.module('MainApp')
    .controller('FavoriteController', function ($scope, $http) {
        const userId = sessionStorage.getItem('user_id');
        const token = sessionStorage.getItem('token');

        // Inisialisasi variabel
        $scope.destinations = [];
        $scope.itineraries = [];
        $scope.filteredDestinations = [];
        $scope.filteredItineraries = [];
        $scope.selectedLocationDestination = '';
        $scope.selectedLocationItinerary = '';
        $scope.selectedDay = {};
        $scope.selectedTab = 'destination';

        // Available locations
        $scope.availableLocations = ['Bali', 'Bandung', 'Raja Ampat', 'Yogyakarta', 'Jakarta'];

        // Mendapatkan data favorite
        $scope.getFavorites = function () {
            if (!userId || !token) {
                console.error('Missing user ID or token');
                return;
            }

            $http
                .get(`http://localhost:3001/api/favorites/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    const favorites = response.data;
                    console.log("favorite :", favorites);


                    // Filter data berdasarkan tipe
                    $scope.destinations = favorites.filter((fav) => fav.destination_id && fav.destination_id._id);
                    $scope.itineraries = favorites.filter((fav) => fav.itinerary_id && fav.itinerary_id._id);
                    console.log("destination :", $scope.destinations);

                    // Set data awal
                    $scope.filteredDestinations = [...$scope.destinations];
                    $scope.filteredItineraries = [...$scope.itineraries];
                })
                .catch((error) => {
                    console.error('Error fetching favorites:', error);
                });
        };

        // Fungsi filter destinasi berdasarkan lokasi
        $scope.filterDestinationsByLocation = function (location) {
            $scope.selectedLocationDestination = location;
            $scope.filteredDestinations =
                location === ''
                    ? [...$scope.destinations]
                    : $scope.destinations.filter((dest) => dest.destination_id.location.toLowerCase() === location.toLowerCase());
        };

        // Fungsi filter itineraries berdasarkan lokasi
        $scope.filterItinerariesByLocation = function (location) {
            $scope.selectedLocationItinerary = location;
            $scope.filteredItineraries =
                location === ''
                    ? [...$scope.itineraries]
                    : $scope.itineraries.filter((itinerary) => itinerary.itinerary_id.location.toLowerCase() === location.toLowerCase());
        };

        // Fungsi untuk memilih hari
        $scope.selectDay = function (itineraryId, dayIndex) {
            $scope.selectedDay[itineraryId] = dayIndex;
        };

        // Fungsi untuk menambahkan atau menghapus destinasi dari favorit
        $scope.toggleFavoriteDestination = function (card) {
            if (!userId || !token) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Please log in to add to favorites!',
                    showConfirmButton: true
                });
                return;
            }

            const data = {
                users_id: userId,
                destination_id: card.destination_id._id
            };

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            $http.post('http://localhost:3001/api/favorites', data, config)
                .then(function (response) {
                    if (response.data.message === 'Favorite added successfully') {
                        card.destination_id.isFavorite = true;
                    } else if (response.data.message === 'Favorite removed successfully') {
                        card.destination_id.isFavorite = false;
                    }
                    console.log(response.data.message);
                })
                .catch(function (error) {
                    console.error('Error toggling favorite destination:', error);
                });
        };

        // Fungsi untuk menambahkan atau menghapus itinerary dari favorit
        $scope.toggleFavoriteItinerary = function (itinerary) {
            if (!userId || !token) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Please log in to add to favorites!',
                    showConfirmButton: true
                });
                return;
            }

            const data = {
                users_id: userId,
                itinerary_id: itinerary.itinerary_id._id
            };

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            $http.post('http://localhost:3001/api/favorites', data, config)
                .then(function (response) {
                    if (response.data.message === 'Favorite added successfully') {
                        itinerary.itinerary_id.isFavorite = true;
                    } else if (response.data.message === 'Favorite removed successfully') {
                        itinerary.itinerary_id.isFavorite = false;
                    }
                    console.log(response.data.message);
                })
                .catch(function (error) {
                    console.error('Error toggling favorite itinerary:', error);
                });
        };

        // Fungsi untuk memilih tab (Destination atau Itinerary)
        $scope.selectTab = function (tab) {
            $scope.selectedTab = tab;
        };

        // Panggil fungsi untuk mendapatkan favorites
        $scope.getFavorites();
    });
