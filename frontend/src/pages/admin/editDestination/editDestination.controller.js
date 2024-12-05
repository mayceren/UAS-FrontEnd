app.controller('EditDestinationAdminController', function ($scope, $http, $stateParams, $state) {
    $scope.destination = {};
    const token = sessionStorage.getItem('token')

    // Mendapatkan data destinasi berdasarkan ID
    $http.get(`http://localhost:3001/api/destination/${$stateParams.destination_id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    }).then(
        (response) => {
            $scope.destination = response.data;
        },
        (error) => {
            console.error('Gagal mendapatkan data destinasi:', error);
            alert('Terjadi kesalahan saat memuat data destinasi.');
        }
    );

    // Fungsi untuk memperbarui destinasi
    $scope.updateDestination = function () {
        var formData = new FormData();
        formData.append('title', $scope.destination.title);
        formData.append('description', $scope.destination.description);
        formData.append('url_map', $scope.destination.url_map);
        formData.append('location', $scope.destination.location);
     
        if ($scope.destination.newImage) {
           console.log("New Image: ", $scope.destination.newImage);
           formData.append('image', $scope.destination.newImage);
        }
     
        $http.put(`http://localhost:3001/api/destination/${$stateParams.destination_id}`, formData, {
           headers: { 'Content-Type': undefined, 'Authorization': `Bearer ${token}` }
        }).then(function(response) {
           console.log('Destination updated successfully:', response);
           $state.go('admin');
        }).catch(function(error) {
           console.error('Failed to update destination:', error);
        });
     };
     
});
