app.controller('AdminController', function ($scope, $http, $state, AuthService) {
    $scope.selectedTab = 'destination';
    $scope.destinations = [];
    $scope.itineraries = [];

    $scope.selectTab = function (tab) {
        $scope.selectedTab = tab;
    };

    const token = sessionStorage.getItem('token');

    function fetchDestinations() {
        $http.get('http://localhost:3001/api/destinations', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(function (response) {
                $scope.destinations = response.data;
            })
            .catch(function (error) {
                console.log('Error fetching destinations:', error);
            });
    }

    function fetchItineraries() {
        $http.get('http://localhost:3001/api/itinerary', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(function (response) {
                const datas = response.data;
                $scope.itineraries = datas.filter(user => user.users_id.role == "admin");
            })
            .catch(function (error) {
                console.log('Error fetching itineraries:', error);
            });
    }

    // Initial fetch
    fetchDestinations();
    fetchItineraries();

    $scope.editDestination = function (destination_id) {
        console.log(destination_id);

        if (!destination_id) {
            console.error('destination_id is undefined!');
            return;
        }
        $state.go('admin-edit-destination', { destination_id });
    };

    $scope.editItinerary = function (itinerary_id) {
        console.log(itinerary_id);

        if (!itinerary_id) {
            console.error('itinerary_id is undefined!');
            return;
        }
        $state.go('admin-edit-itinerary', { itinerary_id });
    };

    // Delete destination
    $scope.deleteDestination = function (destinationId) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this destination?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Jika user memilih untuk menghapus
                $http.delete(`http://localhost:3001/api/destination/${destinationId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(function (response) {
                    Swal.fire(
                        'Deleted!',
                        'Your destination has been deleted.',
                        'success'
                    );
                    // Fetch the latest data after deletion
                    fetchDestinations();
                }).catch(function (error) {
                    console.error('Error deleting destination:', error);
                    Swal.fire(
                        'Error!',
                        'Failed to delete the destination.',
                        'error'
                    );
                });
            } else {
                // Jika user memilih untuk membatalkan
                Swal.fire(
                    'Cancelled',
                    'Your destination is safe :)',
                    'info'
                );
            }
        });
    };

    // Delete itinerary
    $scope.deleteItinerary = function (itineraryId) {
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
                    // Fetch the latest data after deletion
                    fetchItineraries();
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

    $scope.logout = function () {
        Swal.fire({
            title: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                confirmButton: 'swal-button--error',
                cancelButton: 'swal-button--cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                AuthService.logout();
                Swal.fire(
                    'Logged Out!',
                    'You have been logged out successfully.',
                    'success'
                );
            }
        });
    };
});
