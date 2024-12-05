app.controller('EditItineraryAdminController', function (
    $scope,
    $state,
    $stateParams,
    ItineraryService
) {
    let originalItinerary;

    // Fetch itinerary based on ID
    ItineraryService.getItinerary($stateParams.itinerary_id).then(function (data) {
        $scope.itinerary = angular.copy(data);
        originalItinerary = angular.copy(data);

        $scope.dayDetailsVisible = new Array($scope.itinerary.days.length).fill(false);

        if ($scope.itinerary.days.length > 0) {
            $scope.dayDetailsVisible[0] = true;
        }
    });

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

    // Check if there are unsaved changes
    const hasUnsavedChanges = function () {
        return !angular.equals($scope.itinerary, originalItinerary);
    };

    // Save the updated itinerary
    $scope.saveItinerary = function (itinerary) {
        console.log('Itinerary to save:', itinerary);
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save the changes?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save it!'
        }).then((result) => {
            if (result.isConfirmed) {
                ItineraryService.updateItinerary(itinerary).then(function () {
                    originalItinerary = angular.copy(itinerary);
                    Swal.fire(
                        'Saved!',
                        'Your changes have been saved successfully.',
                        'success'
                    ).then(() => {
                        $state.go('admin');
                    });
                }).catch(function (error) {
                    // Handle error if the status is 403
                    if (error.status === 403) {
                        Swal.fire(
                            'Unauthorized',
                            'You are not authorized to update this itinerary.',
                            'error'
                        );
                    } else {
                        // Handle other types of errors
                        Swal.fire(
                            'Error',
                            'There was an error saving the itinerary. Please try again later.',
                            'error'
                        );
                    }
                });
            }
        });
    };



    // Handle state change
    $scope.$on('$stateChangeStart', function (event, toState) {
        if (hasUnsavedChanges()) {
            event.preventDefault(); // Prevent state change
            Swal.fire({
                title: 'Unsaved Changes',
                text: 'You have unsaved changes. Do you really want to leave this page?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, leave',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    $state.go(toState.name); // Allow navigation
                }
            });
        }
    });
});
