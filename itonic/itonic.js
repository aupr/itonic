(function (global, require, factory, helper) {

    "use strict";

    if (helper().compareVersion(require.fn.jquery,"3.0.0")>-1) {
        factory(global, require);
    } else {
        console.error("Minimum version of jQuery 3.0.0 is required");
    }

})(window, jQuery, function (window, $) {

    "use strict";

    var itonic = {
        version: "1.0.0"
    };

    /* pixel verification method*/
    itonic.isPixel = function (pixel) {
        if (pixel === "") {
            return false;
        }
        if (pixel === "inherit") {
            return false;
        }
        if (pixel === "auto") {
            return false;
        }
        var e = document.createElement("p");
        e.style.width = '10px';
        e.style.width = pixel;
        if (e.style.width !== '10px') {
            return true;
        }
        e.style.width = '20px';
        e.style.width = pixel;
        return e.style.width !== '20px';
    };

    /* Color verification method*/
    itonic.isColor = function (color) {
        if (color === "") {
            return false;
        }
        if (color === "inherit") {
            return false;
        }
        if (color === "transparent") {
            return false;
        }
        var e = document.createElement("p");
        e.style.color = "rgb(0, 0, 0)";
        e.style.color = color;
        if (e.style.color !== "rgb(0, 0, 0)") {
            return true;
        }
        e.style.color = "rgb(255, 255, 255)";
        e.style.color = color;
        return e.style.color !== "rgb(255, 255, 255)";
    };

    /* Text special character to entity conversion*/
    itonic.toEntity = function(text) {
        text.trim();
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    };

    /*
     URI query parser
     @urlWithQuery: Don't need give any url as input for current location.
     @isArray: it should be true if there is any array in the uri query otherwise skip it or put false
     */
    itonic.getQuery = function (isArray, urlWithQuery) {
        if(typeof urlWithQuery !== 'string') urlWithQuery = window.location.href;
        var queryStart = urlWithQuery.indexOf("?") + 1;
        var queryEnd = urlWithQuery.indexOf("#") + 1 || urlWithQuery.length + 1;
        var query = urlWithQuery.slice(queryStart, queryEnd - 1);

        if (query + '#' === urlWithQuery || query === urlWithQuery || query === "") return;

        var pairs = query.replace(/\+/g, " ").split("&");
        var params = {};

        pairs.forEach(function(val){
            var indval = val.split("=", 2);
            var indname = decodeURIComponent(indval[0]);
            var value = decodeURIComponent(indval[1]);

            if(isArray){
                if (!params.hasOwnProperty(indname)) params[indname] = [];
                params[indname].push(value);
            }else{
                params[indname] = value;
            }
        });
        return params;
    };


    //Appending hte existing html document as per library requirement
    $(function () {
        var im = document.createElement("div"),
            imLoadSpinner = im,
            imMsg = im,
            imContent = im,
            imHeader = im,
            imBody = im,
            imFooter = im;

        im.id = "iM_";

        console.log(im);
        console.log(imBody);
        //modalFace.id = "def";
        //modalFace.innerText = "hello";


        //$("body").append(modalFace);
        $("body").append("<div id='iM_'><div id='iM_-loadspinner'></div><div id='iM_-msg'></div><div id='iM_-content'><div id='iM_-header'><span id='iM_-close'>&#10006;</span><h3></h3></div><div id='iM_-body'></div><div id='iM_-footer'><button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button></div></div></div>");
    });

    //$("<div>", {id: 'foo', class: 'a'});


    window.iTonic = window.itonic = window.it = itonic;

    return itonic;
}, function () {
    var helperFunctions = {};

    /**
     * Checks if versionA is bigger, lower or equal versionB
     * It checks only pattern like 1.8.2 or 1.11.0
     * Major version, Minor version, patch release
     * @param strVersionA a version to compare
     * @param strVersionB the other version to compare
     * @returns {*} 1 if versionA is bigger than versionB, -1 if versionA is lower than versionB and 0 if both versions are equal
     * false if nothing worked
     */
    helperFunctions.compareVersion = function (strVersionA, strVersionB) {
        var arrVersionA = strVersionA.split('.');
        var arrVersionB = strVersionB.split('.');
        var intVersionA = (100000000 * parseInt(arrVersionA[0])) + (1000000 * parseInt(arrVersionA[1])) + (10000 * parseInt(arrVersionA[2]));
        var intVersionB = (100000000 * parseInt(arrVersionB[0])) + (1000000 * parseInt(arrVersionB[1])) + (10000 * parseInt(arrVersionB[2]));

        if (intVersionA > intVersionB) {
            return 1;
        }else if(intVersionA < intVersionB){
            return -1;
        }else{
            return 0;
        }
    };

    return helperFunctions;
});