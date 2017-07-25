(function () {

    // Localize jQuery variable
    var jQuery;
    var carminURL;
    var carminUserName;
    var carminPassword;
    var carminAPIKey;

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
    
    function doFilter() {
        var valid = true;
        allFields.removeClass( "ui-state-error" );
   
        // to fill up with validations and remote calls/filters
        
        return valid;
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

            var tabs = $("#carmin-widget-tabs").tabs();

            /******* Load HTML *******/
            var dialog = $("#carmin-widget-container").dialog({
            	autoOpen: false,
                modal: true,
            	height: 520,
                width: 400,
                buttons: {
                	"Start pipeline execution": doFilter,
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
            if (typeof(Storage) !== "undefined") {
            	carminURL = localStorage.getItem("carminURL");
            	$("#carminURL").val(carminURL);
            	carminUserName = localStorage.getItem("carminUserName");
            	$("#carminUserName").val(carminUserName);
            	carminPassword = localStorage.getItem("carminPassword");
            	$("#carminPassword").val(carminPassword);
            	carminAPIKey = localStorage.getItem("carminAPIKey");
            	$("#carminAPIKey").val(carminAPIKey);
            } else {
                // Sorry! No Web Storage support..
            	alert("Sorry! The CARMIN widget will not work in your browser," +
            			"as your browser has no Web Storage support. Please switch to a more recent browser version.");
            }
            
            $("#carminSaveSettings").click(function () {
            	localStorage.setItem("carminURL", $("#carminURL").val());
            	localStorage.setItem("carminUserName", $("#carminUserName").val());
            	localStorage.setItem("carminPassword", $("#carminPassword").val());
            	localStorage.setItem("carminAPIKey", $("#carminAPIKey").val());
            	alert("Your settings have been saved.");
            });
            
            $("#open-dialog").button().on("click", function() {
                dialog.dialog("open");
            });
            
        });
    }

})();  // We call our anonymous function immediately