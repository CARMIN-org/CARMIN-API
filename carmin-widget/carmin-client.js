function CarminClient(baseUrl, apiKey, opts) {
  this.apiKey = apiKey;
  this.baseUrl = baseUrl;
  this.opts = opts || {};
  this.statusOK = [200, 201, 202, 203, 204];
}

function isJson(data) {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
}

// Global function to send the request
CarminClient.prototype.doRequest = function(path, method, opts) {
  var promiseObject = new Promise(function (resolve, reject) {
    opts = opts || {};
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == XMLHttpRequest.DONE) {
        if (this.statusOK.indexOf(xmlHttp.status) != -1) {
          var reponse;
          if (opts.noJson)
            response = xmlHttp.responseText;
          else if (opts.responseTypeBuffer)
            response = xmlHttp.response;
          else if (isJson(xmlHttp.responseText))
            response = JSON.parse(xmlHttp.responseText);
          else
            response = xmlHttp.responseText;

          resolve(response);
        }
        else {
          reject(xmlHttp.status);
        }
      }
    }.bind(this);

    xmlHttp.open(method, this.baseUrl + "/" + path, opts.async);

    if (!opts.noApiKey) {
      if (this.opts.useAuthorizationHeader)
        xmlHttp.setRequestHeader("Authorization", "apikey" + " " + this.apiKey);
      else
        xmlHttp.setRequestHeader("apikey", this.apiKey);
    }

    if (opts.postContent)
      xmlHttp.setRequestHeader("Content-type", opts.contentType);

    if (opts.responseTypeBuffer)
      xmlHttp.responseType = "arraybuffer";

    if (opts.postContent)
      xmlHttp.send(opts.requestNoJSON ? opts.postContent : JSON.stringify(opts.postContent));
    else
      xmlHttp.send(null);

  }.bind(this));

  return promiseObject;
}

// Request with a body
CarminClient.prototype.doRequestBody = function(path, method, content, opts) {
  var opts = opts || {};
  opts.postContent = content;
  return this.doRequest(path, method, opts);
}

// Get platform properties
CarminClient.prototype.getPlatformProperties = function() {
  var opts = {};
  opts.async = true;
  opts.contentType = "application/json";
  return this.doRequest("platform", "GET", opts);
}

// Get the pipelines allowed for the user
CarminClient.prototype.listPipelines = function() {
  var opts = {};
  opts.contentType = "application/json";
  opts.async = true;
  return this.doRequest("pipelines", "GET", opts);
}

// Get the description of a pipeline
CarminClient.prototype.describePipeline = function(pipelineIdentifier) {
  var opts = {};
  opts.contentType = "application/json";
  opts.async = true;
  return this.doRequest("pipelines/" + pipelineIdentifier, "GET", opts);
}

// initialize an execution of a pipeline
CarminClient.prototype.initAndStart = function(executionName, pipelineIdentifier, inputValues) {
  var content = {"name" : executionName,"pipelineIdentifier" : pipelineIdentifier, "inputValues" : inputValues};
  var opts = {};

  opts.contentType = "application/json";
  opts.async = true;
  return this.doRequestBody("executions", "POST", content, opts);
}

// Get the details of an execution
CarminClient.prototype.getExecution = function(executionIdentifier) {
  var opts = {};
  opts.contentType = "application/json";
  opts.async = true;
  return this.doRequest("executions/" + executionIdentifier, "GET", opts);
}

// Get the results paths of an finished execution
CarminClient.prototype.getExecutionResults = function(executionIdentifier) {
  var opts = {};
  opts.contentType = "application/json";
  opts.async = true;
  return this.doRequest("executions/" + executionIdentifier + '/results', "GET", opts);
}

// Create a folder in a path given
CarminClient.prototype.createFolder = function(completePath) {
  var opts = {};
  opts.contentType = "application/json";
  opts.async = true;
  return this.doRequest("path" + completePath, "PUT", opts);
}

// Senf a file's content
CarminClient.prototype.uploadData = function(completePath, fileData) {
  var content = fileData;
  var opts = {};

  opts.contentType = "application/octet-stream";
  opts.requestNoJSON = true;
  opts.async = true;
  return this.doRequestBody("path" + completePath, "PUT", content, opts);
}

// Get a file's content
CarminClient.prototype.downloadFile = function(filePath) {
  var opts = {};
  opts.contentType = "application/json";
  opts.responseTypeBuffer = true;
  opts.async = true;
  return this.doRequest("path" + filePath + "?action=content", "GET", opts);
}

// Delete a path and transitively delete all its content if it is a directory
CarminClient.prototype.deletePath = function(path) {
  var opts = {};
  opts.contentType = "application/json";
  opts.async = true;
  return this.doRequest("path" + path, "DELETE", opts);
}

// Get a folder's content
CarminClient.prototype.getFolderDetails = function(folderPath) {
  var opts = {};
  opts.contentType = "application/json";
  opts.async = true;
  return this.doRequest("path" + folderPath + "?action=list", "GET", opts);
}

// Check if a file or a path exists
CarminClient.prototype.fileExists = function(completePath) {
  var opts = {};
  opts.contentType = "application/json";
  opts.async = true;
  return this.doRequest("path" + completePath + "?action=exists", "GET", opts);
}
