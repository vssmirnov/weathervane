'use strict';

angular.module('mainPage').component('mainPage', {
  templateUrl: './main-page/main-page.template.html',
  controller: ['$scope', 'keyService', 'geocodingService', 'forecastRequestService', 'forecastFormatService', 'displayForecastService', 'headerAnimationService', function mainPageController($scope, keyService, geocodingService, forecastRequestService, forecastFormatService, displayForecastService, headerAnimationService) {
    var _this = this;

    this.locationInput = 'city, zip, or location';
    this.locationName = '';
    this.fiveDayForecast = [];
    this.weather = {};
    this.getWeatherIcon = displayForecastService.getWeatherIcon;
    this.notCurrentDay = '!';
    this.tempUnits = 'C';

    this.clearLocationInput = function () {
      _this.locationInput = '';
    };

    this.getLocationConditions = function getLoactionConditions() {
      var cwWrap = document.getElementById('cw-wrap');
      var fdfWrap = document.getElementById('fdf-wrap');

      cwWrap.style.transition = 'transform, 0s';
      fdfWrap.style.transition = 'transform, 0s';
      cwWrap.style.transform = 'translateY(-1000px)';
      fdfWrap.style.transform = 'translateY(-3000px)';

      geocodingService.getLatLngByAddress(_this.locationInput).then(function (location) {
        _this.locationName = location.name;
        requestForecast({ lat: location.lat, lng: location.lng });
      });

      function requestForecast(latLng) {
        keyService.getKey("Apixu").then(function (apiKey) {
          getForecast(apiKey);
        });

        function getForecast(apiKey) {
          forecastRequestService.forecastRequestByLatLng(latLng.lat, latLng.lng, apiKey).then(function (response) {
            formatWeather(response.current);
            formatForecast(response.forecast.forecastday);
            displayWeather();
          });
        }
      }

      function formatWeather(weather) {
        _this.weather = forecastFormatService.formatWeather(weather);
        _this.notCurrentDay = '!' + _this.weather.dayNum;
        $scope.$apply();
      }

      function formatForecast(forecast) {
        _this.fiveDayForecast = forecastFormatService.formatFiveDayForecast(forecast);
        $scope.$apply();
      }

      function displayWeather() {
        cwWrap.style.transition = 'transform, 1s';
        fdfWrap.style.transition = 'transform, 1s';
        cwWrap.style.transform = 'translateY(0px)';
        fdfWrap.style.transform = 'translateY(0px)';
      }
    };

    headerAnimationService.applyHeaderAnimation();
  }]
});