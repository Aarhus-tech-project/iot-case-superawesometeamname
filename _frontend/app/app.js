// AngularJS app
var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "app/views/login.html",
            controller: "LoginController"
        })
        .when("/home", {
            templateUrl: "app/views/home.html",
            controller: "HomeController"
        })
        .when("/profile", {
            templateUrl: "app/views/profile.html",
            controller: "ProfileController"
        })
        .otherwise({ redirectTo: "/" });
});