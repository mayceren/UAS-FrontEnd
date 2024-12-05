app.controller('UpdateProfileController', function ($scope, $http, $window, $state) {
    const userId = sessionStorage.getItem('user_id');
    const token = sessionStorage.getItem('token');

    $scope.user = {}; // Objek user untuk form
    $scope.showPasswordField = false;
    $scope.errorMessage = null;
    $scope.successMessage = null;

    // Fungsi untuk mengambil data pengguna
    function fetchUserData() {
        $http
            .get(`http://localhost:3001/api/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                $scope.user = response.data;
            })
            .catch((error) => {
                $scope.errorMessage = 'Failed to fetch user data. Please try again.';
            });
    }

    fetchUserData();

    // Fungsi untuk memperbarui data pengguna
    $scope.updateProfile = function () {
        const updateData = {
            name: $scope.user.name,
            email: $scope.user.email,
        };

        // Tambahkan password hanya jika diisi
        if ($scope.user.password) {
            updateData.password = $scope.user.password;
        }

        $http
            .put(`http://localhost:3001/api/user/${userId}`, updateData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                $scope.successMessage = 'Profile updated successfully.';
                $scope.errorMessage = null;
                $state.go('profile');
            })
            .catch((error) => {
                $scope.successMessage = null;
                $scope.errorMessage =
                    error.data && error.data.message
                        ? error.data.message
                        : 'Error updating profile. Please try again.';
            });
    };

    // Fungsi untuk menampilkan atau menyembunyikan input password
    $scope.togglePasswordField = function () {
        $scope.showPasswordField = !$scope.showPasswordField;
        if (!$scope.showPasswordField) {
            $scope.user.password = '';
        }
    };

    $scope.deleteUser = function (userId) {
        console.log("delete user id : ", userId);
        
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'Do you want to delete this account?',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Yes, delete it!',
        //     cancelButtonText: 'No, keep it',
        //     reverseButtons: true
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         // Jika user memilih untuk menghapus
        //         $http.delete(`http://localhost:3001/api/user/${userId}`, {
        //             headers: {
        //                 'Authorization': `Bearer ${token}`
        //             }
        //         }).then(function (response) {
        //             Swal.fire(
        //                 'Deleted!',
        //                 'Your Account has been deleted.',
        //                 'success'
        //             );
        //             $state.go('home')
        //         }).catch(function (error) {
        //             console.error('Error deleting account:', error);
        //             Swal.fire(
        //                 'Error!',
        //                 'Failed to delete the account.',
        //                 'error'
        //             );
        //         });
        //     } else {
        //         // Jika user memilih untuk membatalkan
        //         Swal.fire(
        //             'Cancelled',
        //             'Your itinerary is safe :)',
        //             'info'
        //         );
        //     }
        // });
    };
});
