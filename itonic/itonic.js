(function (global, require, factory, helper) {

    "use strict";

    if (helper().compareVersion(require.fn.jquery,"3.0.0")>-1) {
        factory(global, require);
    } else {
        console.error("Minimum version of jQuery 3.0.0 is required");
    }

})(window, jQuery, function (window, $) {

    "use strict";

    var
        itonic = {
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
    itonic.getURIQuery = function (considerArray, urlWithQuery) {
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

            if(considerArray){
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
        $("body").append('<div id="itonicModal"><div id="iM_-loadspinner"></div><div id="iM_-msg"></div>' +
            '<div id="iM_-content"><div id="iM_-header"><span id="iM_-close">&#10006;</span><h3></h3></div>' +
            '<div id="iM_-body"></div><div id="iM_-footer">' +
            '<button></button><button></button><button></button><button></button><button></button>' +
            '<button></button><button></button><button></button><button></button><button></button>' +
            '</div></div></div>');
    });


    var
        modal = {},
        modalSelector = {
            modal: function () {
                return $('#itonicModal');
            },
            loadSpinner: function () {
                return $("#iM_loadspinner");
            },
            loadMsg: function () {
                return $("#iM_-msg");
            },
            content: function () {
                return $("#iM_-content");
            },
            header: function () {
                return $("#iM_-header");
            },
            closeSpan: function () {
                return $("#iM_-close");
            },
            headerH3: function () {
                return $("#iM_-header h3");
            },
            body: function () {
                return $("#iM_-body");
            },
            footer: function () {
                return $("#iM_-footer");
            },
            footerButton: function () {
                return $("#iM_-footer button");
            },
            footerButtonChild: function (nthChild) {
                return $("#iM_-footer button:nth-child("+nthChild+")");
            }
        };

    modal.execute = function (propertyObject) {

        //headerText:           =>Header text
        //headerTextColor:      =>Header Text Color
        //headerColor:          =>Header Color only
        //footerColor:          =>Footer Color only
        //color:                =>Header Footer Combinedly set same Color
        //crossButtonColor:     =>Cancel button color
        //bodyHtml:             =>Body html content
        //bodyColor:            =>Modal background color
        //width:                =>modal size in pixel. ie: "400px"
        //createButton:         =>Write button names you want with comma saparated.
        //buttonColor:          =>Button background color
        //buttonTextColor:      =>Button text color
        //backLayerColor:       =>Modal back layer color
        //draggable:            =>boolean value true or false
        //aeris                 =>boolean value ture or false --(deprecated)
        //action:               =>Make a function with a variable. variable will return the value of button text at onClick button. Calcel button will return boolean false.


        if(typeof propertyObject !== 'object') propertyObject = {};

        var defaultObj = {
            headerText: "Dialog Form.",
            headerTextColor: "#FFFFFF",
            headerColor: "#919191",
            footerColor: "#919191",
            crossButtonColor: "#FFFFFF",
            bodyHtml: "",
            bodyColor: "#FFFFFF",
            width: "400px",
            createButton: "",
            buttonColor: "#FFFFFF",
            buttonTextColor: "#444444",
            backLayerColor: "rgba(0,0,0,0.4)",
            draggable: true
            };

        var obj = {
            headerText: typeof propertyObject.headerText === "string"?propertyObject.headerText:defaultObj.headerText,
            headerTextColor: itonic.isColor(propertyObject.headerTextColor)?propertyObject.headerTextColor:defaultObj.headerTextColor,
            headerColor: itonic.isColor(propertyObject.headerColor)?propertyObject.headerColor:defaultObj.headerColor,
            footerColor: itonic.isColor(propertyObject.footerColor)?propertyObject.footerColor:defaultObj.footerColor,
            color: itonic.isColor(propertyObject.color)?propertyObject.color:"",
            crossButtonColor: itonic.isColor(propertyObject.crossButtonColor)?propertyObject.crossButtonColor:defaultObj.crossButtonColor,
            bodyHtml: typeof propertyObject.bodyHtml === "string"?propertyObject.bodyHtml:defaultObj.bodyHtml,
            bodyColor: itonic.isColor(propertyObject.bodyColor)?propertyObject.bodyColor:defaultObj.bodyColor,
            width: itonic.isPixel(propertyObject.width)?propertyObject.width:defaultObj.width,
            createButton: typeof propertyObject.createButton === "string"?propertyObject.createButton:defaultObj.createButton,
            buttonColor: itonic.isColor(propertyObject.buttonColor)?propertyObject.buttonColor:defaultObj.buttonColor,
            buttonTextColor: itonic.isColor(propertyObject.buttonTextColor)?propertyObject.buttonTextColor:defaultObj.buttonTextColor,
            backLayerColor: itonic.isColor(propertyObject.backLayerColor)?propertyObject.backLayerColor:defaultObj.backLayerColor,
            draggable: typeof propertyObject.draggable === "boolean"?propertyObject.draggable:defaultObj.draggable
        };

        // Controlling buttons
        if(typeof obj.createButton === 'string'){
            var btnAll = obj.createButton.split(',').reverse();
            btnAll.forEach(function(b,i){
                if(modalSelector.footerButtonChild(i+1).length){
                    modalSelector.footerButtonChild(i+1).text(b.trim()).css({
                        'display':'block'
                    });
                }
            });
        }

        modalSelector.headerH3().html(obj.headerText);
        modalSelector.body().html(obj.bodyHtml);
        modalSelector.content().css({'width': obj.width});
        modalSelector.modal().css({"background-color": obj.backLayerColor});
        modalSelector.content().css({"background-color": obj.bodyColor});
        if (obj.color === ""){
            modalSelector.header().css({"background-color": obj.headerColor});
            modalSelector.footer().css({"background-color": obj.footerColor});
        } else {
            modalSelector.header().css({"background-color": obj.color});
            modalSelector.footer().css({"background-color": obj.color});
        }
        modalSelector.headerH3().css({"color": obj.headerTextColor});
        modalSelector.closeSpan().css({"color": obj.crossButtonColor});
        modalSelector.footerButton().css({'background-color': obj.buttonColor, 'color': obj.buttonTextColor});

        // Making draggable the modal section
        if (obj.draggable === true){
            if(typeof $.fn.draggable === 'function') modalSelector.content().draggable({cancel : '#iM_-body'});
            else console.warn('Missing jQuery-ui draggable function!');
        }

        modalSelector.modal().css({'display': 'block'});
        modalSelector.content().css({'display': 'block'});
        modalSelector.loadSpinner().css({'display': 'none'});
        modalSelector.loadMsg().css({'display': 'none'});

        modalSelector.closeSpan().unbind('click');
        modalSelector.closeSpan().click(function () {
            if(typeof obj.action === 'function') obj.action(false);
            else console.error('Action method has not been defined!');
        });

        modalSelector.footerButton().unbind('click');
        modalSelector.footerButton().click(function () {
            if(typeof obj.action === 'function') obj.action($(this).text());
            else console.error('Action method has not been defined!');
        });
    };


    itonic.modal = itonic.dialog = modal;
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