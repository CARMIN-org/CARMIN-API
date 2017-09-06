function setup() {
  var initButton = document.getElementById("validateInit");
  initButton.onclick = function() {
    var opts = {"useAuthorizationHeader" : document.getElementById("useAuthorizationHeader").checked };
    var apikey = document.getElementById("apikey").value;
    var url = document.getElementById("url").value;
    carminClient = new Carmin(apikey, url,opts); // must be in the global scope
    carminClient.getPlatformProperties(initThings);
    return false;
  }.bind(this);
}
function initThings(properties) {
  document.getElementById("initDiv").style.display = 'none';
  document.getElementById("pipelineListDiv").style.display = 'block'; 
  document.getElementById("platformName").innerHTML = properties.platformName;
  carminClient.listPipelines(insertPipelines);
}
function insertPipelines(pipelines) {
  for (var i = 0; i < pipelines.length; i++) {
    var pipelineNode = document.createElement("button");
    pipelineNode.innerHTML = pipelines[i].name;
    pipelineNode.onclick = function() {executePipeline(this);}.bind(pipelines[i]);
    document.getElementById("pipelineList").appendChild(pipelineNode);
    document.getElementById("pipelineList").appendChild(document.createElement("br"));
  }
}
function executePipeline(pipeline) {
  document.getElementById("pipelineListDiv").style.display = 'none';
  document.getElementById("pipelineExecDiv").style.display = 'block'; 
  document.getElementById("pipelineName").innerHTML = pipeline.name;
  carminClient.describePipeline(pipeline.identifier, describePipeline);
}
function describePipeline(pipeline) {
  for (var i=0; i<pipeline.parameters.length; i++) {
    var parameter = pipeline.parameters[i];
    document.getElementById("pipelineDescription").appendChild(document.createTextNode(parameter.name));
    var parameterInput = document.createElement("input");
    parameterInput.type = "text";
    parameterInput.id = parameter.name;
    parameterInput.value = parameter.defaultValue;
    document.getElementById("pipelineDescription").appendChild(parameterInput);
    document.getElementById("pipelineDescription").appendChild(document.createElement("br"));
  }
  var launchButton = document.createElement("button");
  launchButton.innerHTML = "Execute";
  launchButton.onclick = function() {launchExecution(this);}.bind(pipeline);
  document.getElementById("pipelineDescription").appendChild(launchButton);
}
function launchExecution(pipeline) {
  var inputValues = {};
  for (var i=0; i<pipeline.parameters.length; i++) {
    var parameter = pipeline.parameters[i];
    inputValues[parameter.name] = document.getElementById(parameter.name).value;
  }
  carminClient.initAndStart("execTest", pipeline.identifier, inputValues, 
    function(execution) {startExecutionWaiting(execution);}
  );
}
function startExecutionWaiting(execution) {
  document.getElementById("pipelineExecDiv").style.display = 'none';
  document.getElementById("execWaitingDiv").style.display = 'block'; 
  document.getElementById("executionIdentifier").innerHTML = execution.identifier;
  checkExecutionStatus(execution);
}
function checkExecutionStatus(execution) {
  if (execution.status === "running") {
    // still processing, recheck later
    setTimeout(function() {carminClient.getExecution(execution.identifier, checkExecutionStatus);}, 1000);
  } else if (execution.status === "finished") {
    // great ! its over
    displayResults(execution.returnedFiles);
  } else {
    // :( not OK
    alert("unexpected error");
  }
}
function displayResults(returnedFiles) {
  document.getElementById("execWaitingDiv").style.display = 'none';
  document.getElementById("execResultDiv").style.display = 'block'; 
  for (var key in returnedFiles) {
    var files = returnedFiles[key];
    document.getElementById("execResult").appendChild(document.createTextNode(key + " :"));
    for (var i=0; i<files.length; i++) {
      var downloadButton = document.createElement("button");
      downloadButton.innerHTML = "Print";
      downloadButton.onclick = function() {printFileContent(this);}.bind(files[i]);
      document.getElementById("execResult").appendChild(downloadButton);
    }
    document.getElementById("execResult").appendChild(document.createElement("br"));
  }
}
function printFileContent(filePath) {
  document.getElementById("fileContent").innerHTML = "Loading...";
  // replace home dir because of vip bug
  var filePath = filePath.replace(/\/+vip\/+Users\/+\w+/, "/vip/Home");
  carminClient.downloadFile(filePath, function(res) {
    document.getElementById("fileContent").innerHTML = atob(res);
  });
}
window.onload = setup;
















