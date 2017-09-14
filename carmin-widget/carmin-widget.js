(function () {

    // Localize jQuery variable
    var jQuery;
    var tabsEl;
    var choosePipelineTab;
    var startPipelineTab;
    var settingsTab;

    var carminClient;
    var pipelines;
    var currentPipeline;

    /******** Load jQuery if not present *********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '3.2.1') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src", "/Shanoir/scripts/jquery-jquery-ui.min.js");
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () { // For old versions of IE
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    scriptLoadHandler();
                }
            };
        } else {
            script_tag.onload = scriptLoadHandler;
        }
        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        main();
    }

    /******** Called once jQuery has loaded ******/
    function scriptLoadHandler() {
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict(true);
        // Call our main function
        main();
    }
    
    /******** Our main function ********/
    function main() {
        jQuery(document).ready(function ($) {
        	
        	/******* Load JQuery UI on using JQuery: this should be used outside Shanoir old
        	var js_link_jqueryui = $("<script>", {
                type: "text/javascript",
                src: "https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"
            });
        	js_link_jqueryui.appendTo('head');*******/
        	
            /******* Load CSS for JQuery UI *******/
            var css_link = $("<link>", {
                rel: "stylesheet",
                type: "text/css",
                href: "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"
            });
            css_link.appendTo('head');
            
            var pipeline = $('input[type="radio"]').checkboxradio({
            	icon: false
        	});

            tabsEl = $("#carmin-widget-tabs");
            $("#carmin-widget-tabs").tabs(); // init tabs
            choosePipelineTab = {"index": 0, "element" : $("#listPipelineTab")};
            startPipelineTab = {"index": 1, "element" : $("#startPipelineTab")};
            settingsTab = {"index": 3, "element" : $("#settingsTab")};

            /******* Load HTML *******/
            var dialog = $("#carmin-widget-container").dialog({
            	autoOpen: false,
                modal: true,
            	height: 520,
                width: 600,
                buttons: {
                	Cancel: function() {
                		dialog.dialog("close");
                	}
                },
                open: function() {
                	// do some important styling here
                	$(".ui-dialog").css("position","absolute");
                	$(".ui-dialog").css("overflow","hidden");
                	$(".ui-checkboxradio-label").css("width", "240");
                }
            });
            
            /******* Check if HTML 5 Local Storage is supported, if not display error. *******/
            if (typeof(Storage) === "undefined") {
                // Sorry! No Web Storage support..
            	alert("Sorry! The CARMIN widget will not work in your browser," +
            			"as your browser has no Web Storage support. Please switch to a more recent browser version.");
                return;
            }
            
            $("#carminSaveSettings").click(function () {
                localStorage.setItem("carminURL", $("#carminURL").val());
                localStorage.setItem("carminUserName", $("#carminUserName").val());
                localStorage.setItem("carminPassword", $("#carminPassword").val());
            	localStorage.setItem("carminAPIKey", $("#carminAPIKey").val());
                showInfo("Your settings have been saved.");
                initCarminClient();
                manageTab("hide", startPipelineTab);
                manageTab("active", choosePipelineTab);
            });
            
            // info box messages
            $("#carminError").click(function () { $("#carminError").hide(); });
            $("#carminInfo").click(function () { $("#carminInfo").hide(); });

            // start pipeline tab buttons
            $("#changePipeline").button().click(function() { goBackToPipelineSelection(); });
            $("#launchExecution").button().click(function() { launchExecution(); });

            $("#open-dialog").button().click(function() { dialog.dialog("open"); });

            initCarminClient();
            
        });
    }

    function showError(errorText) {
        $("#carminError").text(errorText);
        $("#carminError").show();
    }
    function showInfo(infoText) {
        $("#carminInfo").text(infoText);
        $("#carminInfo").show();
    }

    function initCarminClient() {
        var carminURL = localStorage.getItem("carminURL");
        $("#carminURL").val(carminURL);
        var carminUserName = localStorage.getItem("carminUserName");
        $("#carminUserName").val(carminUserName);
        var carminPassword = localStorage.getItem("carminPassword");
        $("#carminPassword").val(carminPassword);
        var carminAPIKey = localStorage.getItem("carminAPIKey");
        $("#carminAPIKey").val(carminAPIKey);

        if (!carminURL || !carminAPIKey) {
            showError("Please configure an URL and an API key.");
            manageTab("active", settingsTab);
            return;
        }

        carminClient = new CarminClient(carminURL, carminAPIKey, {
            "errorCallback": function(error) {
                    showError(error.message);
                }
        });
        carminClient.listPipelines(updatePipelines);
    }

    function updatePipelines(pipelineList) {
        pipelines=pipelineList;
        var pipelineListEl = $("#pipelines");
        pipelineListEl.empty();
        pipelineListEl.append("<legend>Select a pipeline:</legend>");
        for (var i = 0; i < pipelines.length; i++) {
            pipelineListEl.append(
                "<label for=\"radio-" + i + "\">" + pipelines[i].name + "</label>",
                "<input type=\"radio\" name=\"pipeline\" id=\"radio-" + i + "\" value=\""+ i + "\"/>",
                "<br/>"
            );
        }
        $('input[type="radio"]').checkboxradio({
            icon: false
        });

        $("[name='pipeline']").on( "change", function(e) {
            currentPipeline = pipelines[$(e.target).val()];
            startPipeline();
            // deselect pipeline
            $("#pipelines .ui-state-active").removeClass("ui-checkboxradio-checked ui-state-active");
            $("#pipelines input:checked").prop("checked", false);
        });
    }

    // tabs manipulation

    function manageTab(action, tab) {
        switch (action) {
        case "show":
            tab.element.show();
            break;
        case "hide":
            tab.element.hide();
            break;
        case "enable":
            tabsEl.tabs("enable", tab.index);
            break;
        case "disable":
            tabsEl.tabs("disable", tab.index);
            break;
        case "active":
            tabsEl.tabs("option", "active", tab.index);
            break;
        default:
            showError("Internal error : unknown tabs action ("+action+")");
        }
    }

    function startPipeline() {
        manageTab("show", startPipelineTab);
        manageTab("disable", choosePipelineTab);
        var startPipelinePaneEl = $("#startPipelinePane");
        startPipelinePaneEl.empty();
        startPipelinePaneEl.append("<p>Starting pipeline "+ currentPipeline.name +".</p>");
        var formEl = $("#startPipelineForm");
        formEl.empty();
        carminClient.describePipeline(currentPipeline.identifier, showPipelineForm);
        manageTab("active", startPipelineTab);
    }

    function goBackToPipelineSelection() {
        manageTab("hide", startPipelineTab);
        manageTab("enable", choosePipelineTab);
        manageTab("active", choosePipelineTab);
    }

    function showPipelineForm(pipeline) {
        currentPipeline = pipeline;
        var formEl = $("#startPipelineForm");
        for (var i=0; i<currentPipeline.parameters.length; i++) {
            var parameter = currentPipeline.parameters[i];
            formEl.append("<label for=\"" + parameter.name + "\">" + parameter.name + " : </label>");
            formEl.append("<input type=\"text\" name=\"" + parameter.name + "\" id=\""+ parameter.name +"\" />");
            formEl.append("<br />");
        }
    }

    function launchExecution() {
        var inputValues = {}
        for (var i=0; i<currentPipeline.parameters.length; i++) {
            var parameter = currentPipeline.parameters[i];
            var value = $("#startPipelineForm input#" + parameter.name).val();
            inputValues[parameter.name] = value;
        }
        carminClient.initAndStart("carminWidget", currentPipeline.identifier, inputValues, function(execution) {
            showInfo("Execution " + execution.identifier + " started !");
        });
    }

})();  // We call our anonymous function immediately
