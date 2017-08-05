//Interactive Tonic (itonic) for interactive web application with Javascript
(function (global, require, factory, helper) {

    "use strict";

    if (helper().compareVersion(require.fn.jquery,"3.0.0")>-1) {
        factory(global, require);
    } else {
        console.error("Minimum version of jQuery 3.0.0 or higher is required!");
    }

})(window, jQuery, function (window, $) {

    "use strict";

    var
        itonic = {
            version: "1.0.0",
            location: "https://github.com/aupr/itonic"
        };

    /*
    pixel verification
    */
    itonic.isPixel = function (pixel) {
        if (!pixel) {
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

    /*
    Color verification
    */
    itonic.isColor = function (color) {
        if (!color) {
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

    /*
    String code character to entity conversion
    */
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
     @customUrl: Don't need give any url as input for current location.
     @considerArray: it should be true if there is any array in the uri query otherwise skip it or put false
     */
    itonic.getURIQuery = function (considerArray, customUrl) {
        if(typeof customUrl !== 'string') customUrl = window.location.href;
        var queryStart = customUrl.indexOf("?") + 1;
        var queryEnd = customUrl.indexOf("#") + 1 || customUrl.length + 1;
        var query = customUrl.slice(queryStart, queryEnd - 1);

        if (query + '#' === customUrl || query === customUrl || query === "") return;

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

    /*
    Appending the existing html document body as per library requirement
    */
    $(function () {
        $("body").append('<div id="itonicModal"><div id="itonicModalLoadSpinner"></div><div id="itonicModalLoadMsg"></div>' +
            '<div id="itonicModalContent"><div id="itonicModalHeader"><span id="itonicModalCloseSpan">&#10006;</span><h3></h3></div>' +
            '<div id="itonicModalBody"></div><div id="itonicModalFooter">' +
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
                return $("#itonicModalLoadSpinner");
            },
            loadMsg: function () {
                return $("#itonicModalLoadMsg");
            },
            content: function () {
                return $("#itonicModalContent");
            },
            header: function () {
                return $("#itonicModalHeader");
            },
            closeSpan: function () {
                return $("#itonicModalCloseSpan");
            },
            headerH3: function () {
                return $("#itonicModalHeader h3");
            },
            body: function () {
                return $("#itonicModalBody");
            },
            footer: function () {
                return $("#itonicModalFooter");
            },
            footerButton: function () {
                return $("#itonicModalFooter button");
            },
            footerButtonChild: function (nthChild) {
                return $("#itonicModalFooter button:nth-child("+nthChild+")");
            }
        };

    /*
    dialog/modal executor
    */
    modal.execute = function (propertyObject) {

        /*
         headerText:            =>Header text
         headerTextColor:       =>Header Text Color
         headerColor:           =>Header Color only
         footerColor:           =>Footer Color only
         hfColor:               =>Header Footer Combinedly set same Color
         crossButtonEnable:     =>
         crossButtonColor:      =>Cancel button color
         bodyHtml:              =>Body html content
         bodyColor:             =>Modal background color
         width:                 =>modal fileSizeMax in pixel. ie: "400px"
         createButton:          =>Write button names you want with comma saparated.
         buttonColor:           =>Button background color
         buttonTextColor:       =>Button text color
         backLayerColor:        =>Modal back layer color
         draggable:             =>boolean value true or false
                                =>boolean value ture or false --(deprecated)
         action:                =>Make a function with a variable. variable will return the value of button text at onClick button. Calcel button will return boolean false.
         */


        if(typeof propertyObject !== "object") propertyObject = {};

        var
            defaultObj = {
                headerText: "Dialog Form.",
                headerTextColor: "#FFFFFF",
                headerColor: "#919191",
                footerColor: "#919191",
                hfColor: undefined,
                crossButtonEnable: true,
                crossButtonColor: "#FFFFFF",
                bodyHtml: "",
                bodyColor: "#FFFFFF",
                width: "400px",
                createButton: undefined,
                buttonColor: "#FFFFFF",
                buttonTextColor: "#444444",
                backLayerColor: "rgba(0,0,0,0.4)",
                draggable: true,
                action: undefined
            },
            obj = {
                headerText: typeof propertyObject.headerText === "string"?propertyObject.headerText:defaultObj.headerText,
                headerTextColor: itonic.isColor(propertyObject.headerTextColor)?propertyObject.headerTextColor:defaultObj.headerTextColor,
                headerColor: itonic.isColor(propertyObject.headerColor)?propertyObject.headerColor:defaultObj.headerColor,
                footerColor: itonic.isColor(propertyObject.footerColor)?propertyObject.footerColor:defaultObj.footerColor,
                hfColor: itonic.isColor(propertyObject.hfColor)?propertyObject.hfColor:defaultObj.hfColor,
                crossButtonEnable: typeof propertyObject.crossButtonEnable === "boolean"?propertyObject.crossButtonEnable:defaultObj.crossButtonEnable,
                crossButtonColor: itonic.isColor(propertyObject.crossButtonColor)?propertyObject.crossButtonColor:defaultObj.crossButtonColor,
                bodyHtml: typeof propertyObject.bodyHtml === "string"?propertyObject.bodyHtml:defaultObj.bodyHtml,
                bodyColor: itonic.isColor(propertyObject.bodyColor)?propertyObject.bodyColor:defaultObj.bodyColor,
                width: itonic.isPixel(propertyObject.width)?propertyObject.width:defaultObj.width,
                createButton: typeof propertyObject.createButton === "string"?propertyObject.createButton:defaultObj.createButton,
                buttonColor: itonic.isColor(propertyObject.buttonColor)?propertyObject.buttonColor:defaultObj.buttonColor,
                buttonTextColor: itonic.isColor(propertyObject.buttonTextColor)?propertyObject.buttonTextColor:defaultObj.buttonTextColor,
                backLayerColor: itonic.isColor(propertyObject.backLayerColor)?propertyObject.backLayerColor:defaultObj.backLayerColor,
                draggable: typeof propertyObject.draggable === "boolean"?propertyObject.draggable:defaultObj.draggable,
                action: typeof propertyObject.action === "function"?propertyObject.action:defaultObj.action
            },
            invokeAction = function (reply) {
                if(obj.action) obj.action(reply);
                else console.error("Action method has not been defined!");
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
        if (itonic.isColor(obj.hfColor)){
            modalElements.header().css({"background-color": obj.hfColor});
            modalElements.footer().css({"background-color": obj.hfColor});
        } else {
            modalElements.header().css({"background-color": obj.headerColor});
            modalElements.footer().css({"background-color": obj.footerColor});
        }
        modalElements.headerH3().css({"color": obj.headerTextColor});
        if (obj.crossButtonEnable) {
            modalElements.closeSpan().css({
                "display": "block",
                "color": obj.crossButtonColor
            });
        } else {
            modalElements.closeSpan().css({"display": "none"});
        }
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
            invokeAction(false);
        });

        modalElements.footerButton().unbind("click");
        modalElements.footerButton().click(function () {
            invokeAction($(this).text());
        });

        return true;
    };

    /*
    dialog/modal onDuty/Loading viewer
    */
    modal.onDuty = function (propertyObject) {
        //message           =>Loading window message text in html fileExtensions
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
                "animation": "itonicModalRound 2s linear infinite"
            });
        }

        modalElements.modal().css({"display": "block"});
        modalElements.content().css({"display": "none"});
        modalElements.loadSpinner().css({"display": "block"});
        modalElements.loadMsg().css({"display": "block"});

    };

    /*
    dialog/modal execution close
    */
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

    /*
     dialog/modal execution exit
    */
    modal.exit = modal.close;

    /*
     dialog/modal open
    */
    modal.open = function (headerText, bodyHtml, hfColor, width, buttons, callback) {
        modal.execute({
            headerText: headerText,
            headerTextColor: "#FFFFFF",
            hfColor: hfColor,
            crossButtonEnable: true,
            crossButtonColor: "#FFFFFF",
            bodyHtml: bodyHtml,
            bodyColor: "#FFFFFF",
            width: width,
            createButton: buttons,
            buttonColor: "#FFFFFF",
            buttonTextColor: "#444444",
            backLayerColor: "rgba(0,0,0,0.4)",
            draggable: true,
            action: callback
        });
    };

    /*
     dialog/modal view
    */
    modal.view = modal.open;

    /*
     dialog/modal warning view
    */
    modal.warning = function (bodyHtml, callback) {
        modal.execute({
            headerText: "Warning!",
            headerTextColor: "#FFFFFF",
            hfColor: "#FF8800",
            crossButtonEnable: true,
            crossButtonColor: "#FFFFFF",
            bodyHtml: bodyHtml,
            bodyColor: "#FFFFFF",
            width: "400px",
            createButton: "Yes, No",
            buttonColor: "#FFFFFF",
            buttonTextColor: "#444444",
            backLayerColor: "rgba(0,0,0,0.4)",
            draggable: true,
            action: function (ret) {
                if (ret === "Yes") {
                    if (typeof callback === "function") callback();
                }
                else it.modal.close();
            }
        });
    };

    /*
     dialog/modal success view
    */
    modal.success = function (bodyHtml) {
        modal.execute({
            headerText: "Success!",
            headerTextColor: "#FFFFFF",
            hfColor: "#007E33",
            crossButtonEnable: true,
            crossButtonColor: "#FFFFFF",
            bodyHtml: bodyHtml,
            bodyColor: "#FFFFFF",
            width: "400px",
            createButton: "Ok",
            buttonColor: "#FFFFFF",
            buttonTextColor: "#444444",
            backLayerColor: "rgba(0,0,0,0.4)",
            draggable: true,
            action: function () {
                it.modal.close();
            }
        });
    };

    /*
     dialog/modal info view
    */
    modal.info = function (bodyHtml) {
        modal.execute({
            headerText: "Info!",
            headerTextColor: "#FFFFFF",
            hfColor: "#0099CC",
            crossButtonEnable: true,
            crossButtonColor: "#FFFFFF",
            bodyHtml: bodyHtml,
            bodyColor: "#FFFFFF",
            width: "400px",
            createButton: "Ok",
            buttonColor: "#FFFFFF",
            buttonTextColor: "#444444",
            backLayerColor: "rgba(0,0,0,0.4)",
            draggable: true,
            action: function () {
                it.modal.close();
            }
        });
    };

    /*
     dialog/modal error view
    */
    modal.error = function (bodyHtml) {
        modal.execute({
            headerText: "Error!",
            headerTextColor: "#FFFFFF",
            hfColor: "#CC0000",
            crossButtonEnable: true,
            crossButtonColor: "#FFFFFF",
            bodyHtml: bodyHtml,
            bodyColor: "#FFFFFF",
            width: "400px",
            createButton: "Ok",
            buttonColor: "#FFFFFF",
            buttonTextColor: "#444444",
            backLayerColor: "rgba(0,0,0,0.4)",
            draggable: true,
            action: function () {
                it.modal.close();
            }
        });
    };

    /*
     dialog/modal loading view
    */
    modal.loading = function (loadingMessage, loadingImageLink, msgColor, backLayerColor) {
        modal.onDuty({
            message: loadingMessage,
            messageColor: msgColor,
            graphics: loadingImageLink,
            backLayerColor: backLayerColor
        });
    };

    var
        upload = {};

    /*
    upload executor
    */
    upload.execute = function (propertyObject) {
        //targetUrl:                  => target upload url
        //inputFileId:                 => file input field id (only id is accepable no class or element)
        //inputName:                 => the pass name.. ie: $_FILE['name']
        //fileExtensions:               => define acceptable file formats in a string with comma saparation.
        //fileSizeMax:                 => give maximum file fileSizeMax in bytes.
        //filesMax:
        //progress:             => progress function return (0 to 100 parcent value, file fileSizeMax loaded, total file fileSizeMax, remaining file fileSizeMax)
        /*
            => event.progress property list
            single:
            loaded:
            total:
            remaining:
            multi:
            fileTotal:
            fileFlying:
            fileLoaded:
            fileRemaining:
        */
        //success:              => evaluate function return (evaluate number, evaluate comment/description)
        //done:
        //evaluate:
        //fail:                 => response function return the oupu from target upload url as text fileExtensions.

        if (typeof propertyObject !== "object") propertyObject = {};

        var
            defaultObj = {
                targetUrl: undefined,
                inputFileId: undefined,
                inputName: "file",
                fileExtensions: undefined,
                fileSizeMax: 100000000,
                filesMax: 20,
                progress: undefined,
                success: undefined,
                done: undefined,
                evaluate: undefined,
                fail: undefined
            },
            obj = {
                targetUrl: typeof propertyObject.targetUrl === "string"?propertyObject.targetUrl:defaultObj.targetUrl,
                inputFileId: typeof propertyObject.inputFileId === "string"?propertyObject.inputFileId:defaultObj.inputFileId,
                inputName: typeof propertyObject.inputName === "string"?propertyObject.inputName:defaultObj.inputName,
                fileExtensions: typeof propertyObject.fileExtensions === "string"?propertyObject.fileExtensions:defaultObj.fileExtensions,
                fileSizeMax: typeof propertyObject.fileSizeMax === "number"?propertyObject.fileSizeMax:defaultObj.fileSizeMax,
                filesMax: typeof propertyObject.filesMax === "number"?propertyObject.filesMax:defaultObj.filesMax,
                progress: typeof propertyObject.progress === "function"?propertyObject.progress:defaultObj.progress,
                success: typeof propertyObject.success === "function"?propertyObject.success:defaultObj.success,
                done: typeof propertyObject.done === "function"?propertyObject.done:defaultObj.done,
                evaluate: typeof propertyObject.evaluate === "function"?propertyObject.evaluate:defaultObj.evaluate,
                fail: typeof propertyObject.fail === "function"?propertyObject.fail:defaultObj.fail
            },
            invokeProgress = function (event) {
                if (obj.progress) obj.progress(event);
            },
            invokeSuccess = function (event) {
                if (obj.success) obj.success(event);
            },
            invokeDone = function (eventStack) {
                if (obj.done) obj.done(eventStack);
            },
            invokeEvaluate = function (statusCode, comment) {
                if (obj.evaluate) obj.evaluate(statusCode, comment);
                else console.warn("Upload execution terminated. Evaluate function undefined!")
            },
            invokeFail = function (event) {
                if (obj.fail) obj.fail(event);
            },
            invokeUploadSingle = function (file, inputName,cbProgress, cbSuccess, cbFail) {
                var formdata = new FormData();
                formdata.append(inputName, file);
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (event) {
                    if (event.total > 145) {
                        var progress = {
                            single: Math.round((event.loaded / event.total) * 100),
                            loaded: event.loaded,
                            total: event.total,
                            remaining: (event.total - event.loaded)
                        };
                        cbProgress(progress, event);
                    }
                }, false);
                xhr.addEventListener("load", function (event) {
                    cbSuccess(event);
                }, false);
                xhr.addEventListener("error", function (event) {
                    cbFail(event);
                }, false);
                xhr.addEventListener("abort", function (event) {
                    cbFail(event);
                }, false);
                xhr.open("POST", obj.targetUrl);
                xhr.send(formdata);
            },
            currentFileIndex = 0,
            doneEventStack = [],
            invokeUploadMulti = function (fileIndex, files, inputName) {
                invokeUploadSingle(files.files[fileIndex], inputName, function(progress, event){
                    var totalFile = files.files.length;
                    var liveSingle = 1;
                    if (fileIndex/totalFile === 1) liveSingle = 0;
                    progress.multi = ((fileIndex/totalFile)*100)+((1/totalFile)*progress.single*liveSingle);
                    progress.fileTotal = totalFile;
                    progress.fileFlying = fileIndex;
                    progress.fileLoaded = fileIndex;
                    progress.fileRemaining = totalFile - fileIndex;
                    event.progress = progress;
                    invokeProgress(event);
                }, function (event) {
                    if (typeof files.files[fileIndex] === "undefined") {
                        currentFileIndex = 0;
                        invokeDone(doneEventStack);
                    } else {
                        invokeSuccess(event);
                        doneEventStack.push(event);
                        currentFileIndex++;
                        invokeUploadMulti(currentFileIndex, files, inputName);
                    }
                }, invokeFail);
            };

        if (obj.targetUrl && obj.inputFileId) {
            //alert(file.name+" | "+file.fileSizeMax+" | "+file.type);

            var allFiles = document.getElementById(obj.inputFileId);
            var numberOfFiles = allFiles.files.length;

            if (numberOfFiles === 0) {
                invokeEvaluate(3, "Empty field!");
            } else if (numberOfFiles > obj.filesMax) {
                invokeEvaluate(6, "Files limit exceeded!");
            } else {
                var isAcceptable = true;
                for (var i=0; i<numberOfFiles; i++) {
                    if (allFiles.files[i].size > obj.fileSizeMax) {
                        invokeEvaluate(5, "Maximum file fileSizeMax exceeded!");
                        isAcceptable = false;
                        break;
                    }else if (typeof obj.fileExtensions === "string" && obj.fileExtensions !== "") {
                        var validExtension = false;
                        var fileExtensions = obj.fileExtensions.split(",");
                        fileExtensions.forEach(function (extension) {
                            if (extension.toLowerCase().trim() === allFiles.files[i].name.split('.').pop().toLowerCase()) {
                                validExtension = true;
                            }
                        });
                        if (!validExtension) {
                            invokeEvaluate(4, "Invalid file extension!");
                            isAcceptable = false;
                            break;
                        }
                    }
                }
                if (isAcceptable) {
                    invokeUploadMulti(currentFileIndex,allFiles, obj.inputName);
                }
            }
        } else {
            console.error("targetUrl or inputFileId missing!");
        }
    };

    /*
    full screen toggle
    */
    itonic.fullScrToggle = function (element) {
        if(!element) element = window.document.body;
        if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
            if (element.requestFullScreen) {
                element.requestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
            return true;
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            return false;
        }
    };

    itonic.upload = upload;
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