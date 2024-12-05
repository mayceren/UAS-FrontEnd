app.controller('UpdateProfileController', function ($scope, $http, $window, $state) {
    const userId = sessionStorage.getItem('user_id');
    const token = sessionStorage.getItem('token');

    $scope.user = {}; // Objek user untuk form
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
});
