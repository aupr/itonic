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
        if (pixel === "undefined") {
            return false;
        }
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
        if (color === "undefined") {
            return false;
        }
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
    itonic.CCToEntity = function(text) {
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
    itonic.getURIQuery = function (considerArray, url) {
        if(typeof url !== 'string') url = window.location.href;
        var queryStart = url.indexOf("?") + 1;
        var queryEnd = url.indexOf("#") + 1 || url.length + 1;
        var query = url.slice(queryStart, queryEnd - 1);

        if (query + '#' === url || query === url || query === "") return;

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
        modalElements = {
            modal: function () {
                return $("#itonicModal");
            },
            loadSpinner: function () {
                return $("#iM_-loadspinner");
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


        if(typeof propertyObject !== "object") propertyObject = {};

        var
            defaultObj = {
                headerText: "Dialog Form.",
                headerTextColor: "#FFFFFF",
                headerColor: "#919191",
                footerColor: "#919191",
                color: undefined,
                crossButtonColor: "#FFFFFF",
                bodyHtml: "",
                bodyColor: "#FFFFFF",
                width: "400px",
                createButton: undefined,
                buttonColor: "#FFFFFF",
                buttonTextColor: "#444444",
                backLayerColor: "rgba(0,0,0,0.4)",
                draggable: true
            },
            obj = {
                headerText: typeof propertyObject.headerText === "string"?propertyObject.headerText:defaultObj.headerText,
                headerTextColor: itonic.isColor(propertyObject.headerTextColor)?propertyObject.headerTextColor:defaultObj.headerTextColor,
                headerColor: itonic.isColor(propertyObject.headerColor)?propertyObject.headerColor:defaultObj.headerColor,
                footerColor: itonic.isColor(propertyObject.footerColor)?propertyObject.footerColor:defaultObj.footerColor,
                color: itonic.isColor(propertyObject.color)?propertyObject.color:defaultObj.color,
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
        if(typeof obj.createButton === "string"){
            var btnAll = obj.createButton.split(",").reverse();
            btnAll.forEach(function(b,i){
                if(modalElements.footerButtonChild(i+1).length){
                    modalElements.footerButtonChild(i+1).text(b.trim()).css({
                        "display":"block"
                    });
                }
            });
        }

        modalElements.headerH3().html(obj.headerText);
        modalElements.body().html(obj.bodyHtml);
        modalElements.content().css({"width": obj.width});
        modalElements.modal().css({"background-color": obj.backLayerColor});
        modalElements.content().css({"background-color": obj.bodyColor});
        if (itonic.isColor(obj.color)){
            modalElements.header().css({"background-color": obj.color});
            modalElements.footer().css({"background-color": obj.color});
        } else {
            modalElements.header().css({"background-color": obj.headerColor});
            modalElements.footer().css({"background-color": obj.footerColor});
        }
        modalElements.headerH3().css({"color": obj.headerTextColor});
        modalElements.closeSpan().css({"color": obj.crossButtonColor});
        modalElements.footerButton().css({"background-color": obj.buttonColor, "color": obj.buttonTextColor});

        // Making draggable the modal section
        if (obj.draggable === true){
            if(typeof $.fn.draggable === "function") modalElements.content().draggable({cancel : "#iM_-body"});
            else console.warn("Missing jQuery-ui draggable function!");
        }

        modalElements.modal().css({"display": "block"});
        modalElements.content().css({"display": "block"});
        modalElements.loadSpinner().css({"display": "none"});
        modalElements.loadMsg().css({"display": "none"});

        modalElements.closeSpan().unbind("click");
        modalElements.closeSpan().click(function () {
            if(typeof obj.action === "function") obj.action(false);
            else console.error("Action method has not been defined!");
        });

        modalElements.footerButton().unbind("click");
        modalElements.footerButton().click(function () {
            if(typeof obj.action === "function") obj.action($(this).text());
            else console.error("Action method has not been defined!");
        });

        return true;
    };
    
    modal.loading = function (propertyObject) {
        //message           =>Loading window message text in html format
        //messageColor      =>
        //graphics          =>Loading window animation graphics link
        //backLayerColor:   =>Modal back layer color

        if(typeof propertyObject !== "object") propertyObject = {};

        var
            defaultObj = {
                message: "Execution is in progress....<br/>Please Wait !",
                messageColor: "#FFFFFF",
                graphics: undefined,
                backLayerColor: "rgba(0,0,0,0.4)"
            },
            obj = {
                message: typeof propertyObject.message === "string"?propertyObject.message:defaultObj.message,
                messageColor: itonic.isColor(propertyObject.messageColor)?propertyObject.messageColor:defaultObj.messageColor,
                graphics: typeof propertyObject.graphics === "string"?propertyObject.graphics:defaultObj.graphics,
                backLayerColor: itonic.isColor(propertyObject.backLayerColor)?propertyObject.backLayerColor:defaultObj.backLayerColor
            };

        modalElements.modal().css({"background-color": obj.backLayerColor});
        modalElements.loadMsg().css({"color": obj.messageColor});

        modalElements.loadMsg().html(obj.message);

        if ((typeof obj.graphics) === 'string') {
            modalElements.loadSpinner().css({
                "border": "none",
                "border-radius": "0",
                "animation": "none",
                "background-image": "url(" + obj.graphics + ")"
            });
        } else {
            modalElements.loadSpinner().css({
                "border": "5px solid white",
                "border-top-color": "#ff7000",
                "border-radius": "100%",
                "background-image": "none",
                "animation": "iM_Round 2s linear infinite"
            });
        }

        modalElements.modal().css({"display": "block"});
        modalElements.content().css({"display": "none"});
        modalElements.loadSpinner().css({"display": "block"});
        modalElements.loadMsg().css({"display": "block"});

    };

    modal.close = function () {
        modalElements.headerH3().html("");
        modalElements.body().html("");

        modalElements.footerButton().css({"display":"none"});
        modalElements.modal().css({"display": "none"});
        modalElements.content().css({"display": "none"});
        modalElements.loadSpinner().css({"display": "none"});
        modalElements.loadMsg().css({"display": "none"});
        return false;
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