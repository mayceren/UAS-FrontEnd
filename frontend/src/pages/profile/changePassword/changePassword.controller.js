app.controller('ProfileController', function ($scope, $http, AuthService) {
    // Ambil user_id dari sessionStorage
    const userId = sessionStorage.getItem('user_id');
    const token = sessionStorage.getItem('token');
  
    if (!userId) {
      $scope.errorMessage = "User ID not found. Please login first.";
      return;
    }
  
    // API URL
    const apiUrl = `http://localhost:3001/api/user/${userId}`  

    // Fungsi untuk menampilkan atau menyembunyikan input password
    $scope.togglePasswordField = function () {
        $scope.showPasswordField = !$scope.showPasswordField;
        if (!$scope.showPasswordField) {
            $scope.user.password = '';
        }
    };

    // Fungsi untuk memperbarui password
    $scope.updatePassword = function () {
        if (!$scope.user.newPassword || !$scope.user.confirmPassword) {
            alert("Please fill in both fields.");
            return;
        }

        if ($scope.user.newPassword !== $scope.user.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const updateData = {
            password: $scope.user.newPassword,
        };

        // Simulasi permintaan API (ganti dengan logika HTTP sebenarnya)
        console.log("Updating password:", updateData);

        // Reset form dan sembunyikan input
        $scope.user.newPassword = '';
        $scope.user.confirmPassword = '';
        $scope.showPasswordField = false;
        alert("Password updated successfully.");
    };
});