app.controller('ChangePasswordController', function ($scope, $http, $state) {
    const userId = sessionStorage.getItem('user_id');
    const token = sessionStorage.getItem('token');

    $scope.passwordData = {
        newPassword: '',
        confirmPassword: '',
    };
    $scope.errorMessage = null;
    $scope.successMessage = null;

    // Fungsi untuk mengganti password
    $scope.changePassword = function () {
        if ($scope.passwordData.newPassword !== $scope.passwordData.confirmPassword) {
            $scope.errorMessage = 'New password and confirmation do not match.';
            return;
        }

        const payload = {
            newPassword: $scope.passwordData.newPassword,
        };

        $http
            .put(`http://localhost:3001/api/user/${userId}/change-password`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                $scope.successMessage = 'Password changed successfully.';
                $scope.errorMessage = null;
                $scope.passwordData = {}; // Reset form
                $state.go('profile'); // Redirect ke halaman profil
            })
            .catch((error) => {
                $scope.successMessage = null;
                $scope.errorMessage =
                    error.data && error.data.message
                        ? error.data.message
                        : 'Failed to change password. Please try again.';
            });
    };
});
