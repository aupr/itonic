$(function () {

    //URI query parser

    var $_get = it.getURIQuery();
    if (typeof $_get.key3 === "string"){
        $("#uri-query-view").text(JSON.stringify($_get));
        $("#uri-query-code").text("it.getURIQuery()");
    }
    else {
        $("#uri-query-view").text(JSON.stringify(it.getURIQuery(true)));
        $("#uri-query-code").text("it.getURIQuery(true)");
    }

    $("#parse-uri-custom").click(function () {
        if ($("#uri-query-consider-array").is(":checked")) {
            $("#uri-query-view").text(JSON.stringify(it.getURIQuery(true, $("#custom-url").val())));
            $("#uri-query-code").text("it.getURIQuery(true, "+$("#custom-url").val()+")");
        } else {
            $("#uri-query-view").text(JSON.stringify(it.getURIQuery(false, $("#custom-url").val())));
            $("#uri-query-code").text("it.getURIQuery(false, "+$("#custom-url").val()+")");
        }

    });

    //Modal Example section
    var modalExecuteBodyHtml = "code:<br><code>it.dialog.execute({<p style='padding-left: 20px;'>" +
        "headerText: \"iTonic Dialog\",<br>" +
        "headerTextColor: \"#FFFFFF\",<br>" +
        "headerColor: undefined,<br>" +
        "footerColor: undefined,<br>" +
        "hfColor: \"blueviolet\",<br>" +
        "crossButtonEnable: true,<br>" +
        "crossButtonColor: \"orange\",<br>" +
        "bodyHtml: modalExecuteBodyHtml,<br>" +
        "bodyColor: \"#FFFFFF\",<br>" +
        "width: \"600px\",<br>" +
        "createButton: \"key1, key2, key3\",<br>" +
        "buttonColor: \"#FFFFFF\",<br>" +
        "buttonTextColor: \"#444444\",<br>" +
        "backLayerColor: \"rgba(0,0,0,0.4)\",<br>" +
        "draggable: true,<br>" +
        "action: function (reply) {<span style='display: inherit; padding-left: 20px;'>alert(reply);<br>it.modal.close();</span>}</p>});</code>";

    $("#modal-execute").click(function () {
        it.dialog.execute({
            headerText: "iTonic Dialog \"execute\" example",
            headerTextColor: "#FFFFFF",
            headerColor: undefined,
            footerColor: undefined,
            hfColor: "blueviolet",
            crossButtonEnable: true,
            crossButtonColor: "orange",
            bodyHtml: modalExecuteBodyHtml,
            bodyColor: "#FFFFFF",
            width: "600px",
            createButton: "key1, key2, key3",
            buttonColor: "#FFFFFF",
            buttonTextColor: "#444444",
            backLayerColor: "rgba(0,0,0,0.4)",
            draggable: true,
            action: function (reply) {
                alert(reply);
                it.modal.close();
            }
        });
    });

    var dialogOpenBodyHtml = "Code:<br><code>it.dialog.open(\"Dialog Open Example\", dialogOpenBodyHtml, \"red\", \"500px\", \"Ok, Cancel\", function (res) {\n" +
        "alert(res);it.dialog.close(););</code>";

    $("#modal-open").click(function () {
        it.dialog.open("Dialog Open Example", dialogOpenBodyHtml, "red", "500px", "Ok, Cancel", function (res) {
            alert(res);
            it.dialog.close();
        });
    });

    var dialogWarningBodyHtml = "Code:<br><code>it.dialog.warning(dialogWarningBodyHtml, function () {" +
        "alert(\"execution for true command\");});</code>";

    $("#modal-warning").click(function () {
        it.dialog.warning(dialogWarningBodyHtml, function () {
            alert("execution for true command");
        });
    });

    $("#modal-error").click(function () {
        it.dialog.error("Code:<br><code>it.dialog.error(\"error text\");</code>");
    });

    $("#modal-success").click(function () {
        it.dialog.success("Code:<br><code>it.dialog.success(\"success text\");</code>");
    });

    $("#modal-info").click(function () {
        it.dialog.info("Code:<br><code>it.dialog.info(\"info text\");</code>");
    });

});


