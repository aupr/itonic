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
        modal= {},
        modalSelector = {
            modal: $("#itonicModal"),
            loadSpinner: $("#iM_loadspinner"),
            loadMsg: $("#iM_-msg"),
            content: $("#iM_-content"),
            header: $("#iM_-header"),
            closeSpan: $("#iM_-close"),
            h3Text: $("#iM_-header h3"),
            body: $("#iM_-body"),
            footer: $("#iM_-footer"),
            footerButton: function (nthChild) {
                return $("#iM_-footer button:nth-child("+(nthChild+1)+")");
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
        //aeris                 =>boolean value ture or false
        //action:               =>Make a function with a variable. variable will return the value of button text at onClick button. Calcel button will return boolean false.


        if(typeof propertyObject !== 'object') propertyObject = {};

        var obj = {
            headerText: typeof propertyObject.headerText === "string"?propertyObject.headerText:"",
            headerTextColor: itonic.isColor(propertyObject.headerTextColor)?propertyObject.headerTextColor:"",
            headerColor: itonic.isColor(propertyObject.headerColor)?propertyObject.headerColor:"",
            footerColor: itonic.isColor(propertyObject.footerColor)?propertyObject.footerColor:"",
            color: itonic.isColor(propertyObject.color)?propertyObject.color:"",
            crossButtonColor: itonic.isColor(propertyObject.crossButtonColor)?propertyObject.crossButtonColor:"",
            bodyHtml: typeof propertyObject.bodyHtml === "string"?propertyObject.bodyHtml:"",
            bodyColor: itonic.isColor(propertyObject.bodyColor)?propertyObject.bodyColor:"",
            width: itonic.isPixel(propertyObject.width)?propertyObject.width:"",
            createButton: typeof propertyObject.createButton === "string"?propertyObject.createButton:"",
            buttonColor: itonic.isColor(propertyObject.buttonColor)?propertyObject.buttonColor:"",
            buttonTextColor: itonic.isColor(propertyObject.buttonTextColor)?propertyObject.buttonTextColor:"",
            backLayerColor: itonic.isColor(propertyObject.backLayerColor)?propertyObject.backLayerColor:"",
            draggable: typeof propertyObject.draggable === "boolean"?propertyObject.draggable:true,
            aeris: typeof propertyObject.aeris === "boolean"?propertyObject.aeris:false,
            action: typeof propertyObject.action === "object"?propertyObject.action:""
        };

        obj.headerText = typeof propertyObject.headerText === "string"?propertyObject.headerText:"";

        {
            var n_ = $('#iM_-content');
            var h_ = $('#iM_-header');
            var ht_ = $('#iM_-header h3');
            var f_ = $('#iM_-footer');
            var b_ = $('#iM_-footer button');
        }

        // Controlling buttons
        if(typeof obj.createButton === 'string'){
            var btnAll = obj.createButton.split(',').reverse();
            btnAll.forEach(function(b,i){
                if(modalSelector.footerButton(i).length){
                    modalSelector.footerButton(i).text(b.trim()).css({
                        'display':'block'
                    });
                }
            });
        }


        // Add Custom Header
        if (typeof obj.headerText == 'string') ht_.html(obj.headerText);
        else console.log('Warning: headerText is undefined or not string!');
        // Add custom Boday
        if (typeof obj.bodyHtml == 'string') $('#iM_-body').html(obj.bodyHtml);
        else console.log('Warning: bodyHtml is undefined or not string!');

        // setup width of the modal
        if (typeof obj.width == 'string' && itonic.isColor(obj.width)) {
            n_.css({
                'width': obj.width
            });
        } else {
            n_.css({
                'width': '400px'
            });
        }
        // setup color of the modal
        {
            if(typeof obj.backLayerColor == 'string' && itonic.isColor(obj.backLayerColor)){
                $('#itonicModal').css({
                    'background-color': obj.backLayerColor
                });
            }else{
                $('#itonicModal').css({
                    'background-color': 'rgba(0,0,0,0.4)'
                });
            }
            if(typeof obj.bodyColor == 'string' && itonic.isColor(obj.bodyColor)){
                n_.css({
                    'background-color': obj.bodyColor
                });
            }else{
                n_.css({
                    'background-color': 'white'
                });
            }
            if(typeof obj.color == 'string' && itonic.isColor(obj.color)){
                h_.css({
                    'background-color': obj.color
                });
                f_.css({
                    'background-color': obj.color
                });
            }else{
                if(typeof obj.headerColor == 'string' && itonic.isColor(obj.headerColor)){
                    h_.css({
                        'background-color': obj.headerColor
                    });
                }else{
                    h_.css({
                        'background-color': 'gray'
                    });
                }
                if(typeof obj.footerColor == 'string' && itonic.isColor(obj.footerColor)){
                    f_.css({
                        'background-color': obj.footerColor
                    });
                }else{
                    f_.css({
                        'background-color': 'gray'
                    });
                }
            }
            if(typeof obj.crossButtonColor == 'string' && itonic.isColor(obj.crossButtonColor)){
                $('#iM_-close').css({
                    'color': obj.crossButtonColor
                });
            }else{
                $('#iM_-close').css({
                    'color': 'white'
                });
            }
            if(typeof obj.buttonColor == 'string' && itonic.isColor(obj.buttonColor)){
                b_.css({
                    'background-color': obj.buttonColor
                });
            }else{
                b_.css({
                    'background-color': 'white'
                });
            }
            if(typeof obj.buttonTextColor == 'string' && itonic.isColor(obj.buttonTextColor)){
                b_.css({
                    'color': obj.buttonTextColor
                });
            }else{
                b_.css({
                    'color': '#444'
                });
            }
            if(typeof obj.headerTextColor == 'string' && itonic.isColor(obj.headerTextColor)){
                ht_.css({
                    'color': obj.headerTextColor
                });
            }else{
                ht_.css({
                    'color': 'white'
                });
            }
        }
        // aeris design
        if (obj.aeris == true){
            n_.css({
                'border-radius':'7px'
            });
            h_.css({
                'border-top-left-radius':'6px',
                'border-top-right-radius':'6px'
            });
            f_.css({
                'border-bottom-left-radius':'6px',
                'border-bottom-right-radius':'6px'
            });
            b_.css({
                'border-radius':'4px'
            });
        }
        // Making Draggable the modal section
        if (obj.draggable == true){
            if(typeof $.fn.draggable == 'function') n_.draggable({cancel : '#iM_-body'});
            else console.log('Error: Required jquery-ui with draggable function!');
        }

        // Display the Modal Bacground
        {
            $('#itonicModal').css({
                'display': 'block'
            });
            n_.css({
                'display': 'block'
            });
            $('#iM_-loadspinner').css({
                'display': 'none'
            });
            $('#iM_-msg').css({
                'display': 'none'
            });
        }

        $('#iM_-close').unbind('click');
        $('#iM_-close').click(function () {
            var rv_;
            if( !(rv_ = it_modal_close()) && typeof(obj.action)=='function') obj.action(rv_);
        });
        b_.unbind('click');
        b_.click(function () {
            if(typeof(obj.action)=='function') obj.action($(this).text());
            else console.log('Error: action function is not defined!');
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