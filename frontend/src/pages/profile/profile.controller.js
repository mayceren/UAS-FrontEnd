app.controller('ProfileController', function ($scope, $http, AuthService) {
  // Ambil user_id dari sessionStorage
  const userId = sessionStorage.getItem('user_id');
  const token = sessionStorage.getItem('token');

  if (!userId) {
    $scope.errorMessage = "User ID not found. Please login first.";
    return;
  }

  // API URL
  const apiUrl = `http://localhost:3001/api/user/${userId}`;

  $scope.getUserProfile = function () {
    $http
      .get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(function (response) {
        $scope.user = response.data;
      })
      .catch(function (error) {
        console.error("Error fetching user profile:", error);
        $scope.errorMessage = "Failed to load user profile. Please try again.";
      });
  };

  // Fungsi logout dari AuthService
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

  $scope.getUserProfile();
});
