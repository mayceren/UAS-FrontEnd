app.controller('AddDestinationAdminController', function ($scope, $http, $state) {
    $scope.destination = {};
    const token = sessionStorage.getItem('token');

    function validateDestination(destination) {
        if (!destination.title) return "Title is required.";
        if (!destination.description) return "Description is required.";
        if (!destination.url_map) return "Map URL is required.";
        if (!destination.location) return "Location is required.";
        if (!destination.image) return "Image is required.";
        if (destination.image && !destination.image.type.startsWith('image/')) return "File must be an image.";
        return null;
    }

    $scope.addDestination = function () {
        const errorMessage = validateDestination($scope.destination);
        if (errorMessage) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: errorMessage
            });
            return;
        }

        console.log("Destination data before sending:", $scope.destination);

        var formData = new FormData();
        formData.append('title', $scope.destination.title);
        formData.append('description', $scope.destination.description);
        formData.append('url_map', $scope.destination.url_map);
        formData.append('location', $scope.destination.location);
        formData.append('image', $scope.destination.image);

        $http.post('http://localhost:3001/api/destination', formData, {
            headers: { 'Content-Type': undefined, Authorization: `Bearer ${token}` }
        }).then(function (response) {
            console.log("API response:", response);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Destination added successfully!',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                $state.go('admin');
            });
        }).catch(function (error) {
            console.error("API error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.data?.error || 'Failed to add destination. Please try again.'
            });
        });
    };

});