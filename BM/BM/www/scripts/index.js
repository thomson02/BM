// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function readHealthkitData(startDate, endDate, sampleType, unit) {
        var p = $.Deferred();
        window.plugins.healthkit.querySampleType({
            "startDate": startDate || new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
            "endDate": endDate || new Date(),
            "sampleType": sampleType || "HKQuantityTypeIdentifierStepCount",
            "unit": unit || "count"
        },
            p.resolve,
            p.reject
        );

        return p;
    };

    function requestAuthorization() {
        var p = $.Deferred();
        window.plugins.healthkit.requestAuthorization(
            {
                'readTypes': ['HKQuantityTypeIdentifierStepCount'],
                'writeTypes': []
            },
            p.resolve,
            p.reject
        );

        return p;
    };

    function isHealthkitAvailable() {
        var p = $.Deferred();

        if (!window.plugins.healthkit) {
            return p.reject();
        }

        window.plugins.healthkit.available(
            p.resolve,
            p.reject
        );

        return p;
    };

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var element = document.getElementById("deviceready");
        element.innerHTML = 'Device Ready';
        element.className += ' ready';


        // Check healthkit available
        isHealthkitAvailable()
            .then(function() {
                return requestAuthorization();
            })
            .then(function () {
                var startDate = new Date();
                
                var endDate = startDate;
                endDate.setHours(endDate.getHours() - 1);

                return readHealthkitData(startDate, endDate, 'HKQuantityTypeIdentifierDistanceWalkingRunning', 'm');
            })
            .then(function(data) {
                alert("Distance walked in past hour: " + data);
                alert("Distance walked in past hour: " + JSON.stringify(data));
            })
            .fail(function() {
                alert("something went wrong");
            });
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();