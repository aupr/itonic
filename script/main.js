$(function () {
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
});


