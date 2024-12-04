app.controller('AddItineraryController', function (
    $scope,
    $state,
    $http
) {
    const token = sessionStorage.getItem('token');
    const user_id = sessionStorage.getItem('user_id');

    // Initialize a new itinerary
    $scope.itinerary = {
        users_id: user_id,
        title: '',
        location: '',
        days: [
            {
                pagi: '',
                siang: '',
                sore: '',
                malam: '',
            },
        ],
    };

    // Initialize visibility state for days
    $scope.dayDetailsVisible = [true];

    // Add a new day
    $scope.addDay = function () {
        $scope.itinerary.days.push({
            pagi: '',
            siang: '',
            sore: '',
            malam: '',
        });
        $scope.dayDetailsVisible.push(false);
    };

    // Remove the last day
    $scope.removeDay = function () {
        $scope.itinerary.days.pop();
        $scope.dayDetailsVisible.pop();
    };

    // Toggle visibility of day details
    $scope.toggleDayDetails = function (index) {
        $scope.dayDetailsVisible[index] = !$scope.dayDetailsVisible[index];
    };

    // Add a new itinerary
    $scope.addItinerary = function (itinerary) {
        // Validasi lokasi tidak boleh kosong
        if (!itinerary.location) {
            Swal.fire(
                'Error!',
                'Location is required to add an itinerary.',
                'error'
            );
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to add this itinerary?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, add it!',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .post('http://localhost:3001/api/itineraries', itinerary, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then(() => {
                        Swal.fire(
                            'Success!',
                            'The itinerary has been added successfully.',
                            'success'
                        ).then(() => {
                            $state.go('your-itinerary');
                        });
                    })
                    .catch((error) => {
                        Swal.fire(
                            'Error!',
                            'Failed to add itinerary: ' + (error.data?.message || 'Unknown error'),
                            'error'
                        );
                    });
            }
        });
    };
});
