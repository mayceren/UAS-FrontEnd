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
    
    $scope.deleteUser = function (userId) {
      console.log("delete user id : ", userId);
      
      Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to delete this account?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it',
          reverseButtons: true
      }).then((result) => {
          if (result.isConfirmed) {
              // Jika user memilih untuk menghapus
              $http.delete(`http://localhost:3001/api/user/${userId}`, {
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              }).then(function (response) {
                  Swal.fire(
                      'Deleted!',
                      'Your Account has been deleted.',
                      'success'
                  );
                  $state.go('home')
              }).catch(function (error) {
                  console.error('Error deleting account:', error);
                  Swal.fire(
                      'Error!',
                      'Failed to delete the account.',
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
  };

  $scope.getUserProfile();
});
