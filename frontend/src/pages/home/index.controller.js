angular.module('MainApp')
    .controller('HomeController', function ($scope, $state) {
        // Daftar lokasi untuk suggestion
        $scope.locations = ["Bandung", "Raja Ampat", "Yogyakarta", "Bali", "Jakarta"];
        $scope.suggestions = [];
        $scope.searchQuery = "";

        // Perbarui suggestion berdasarkan input
        $scope.updateSuggestions = function () {
            const query = $scope.searchQuery.toLowerCase();
            $scope.suggestions = query
                ? $scope.locations.filter(location => location.toLowerCase().includes(query))
                : [];
        };

        // Pilih suggestion
        $scope.selectSuggestion = function (location) {
            $scope.searchQuery = location;
            $scope.suggestions = [];
        };

        // Arahkan ke halaman destination
        $scope.goToDestination = function () {
            const selectedLocation = $scope.searchQuery.toLowerCase();
            if (selectedLocation) {
                $state.go('destination', { selectedLocation: selectedLocation });
            }
        };
    });
