function CarminClient(baseUrl, apiKey, opts) {
  this.apiKey = apiKey;
  this.baseUrl = baseUrl;
  this.opts = opts || {};
}

CarminClient.prototype.doRequest = function(path, callback, opts) {
    opts = opts || {};
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4) {
        // it's over
        if (xmlHttp.status == 200) {
          callback(opts.noJson ? xmlHttp.responseText : JSON.parse(xmlHttp.responseText));
	} else if (opts.errorCallback) {
          // error
          opts.errorCallback(JSON.parse(xmlHttp.responseText));
        }
      }
    }
    console.log(this.baseUrl);
    xmlHttp.open(opts.postContent ? "POST" : "GET", this.baseUrl + "/" + path, true);
    if (!opts.noApiKey) {
      if (this.opts.useAuthorizationHeader) {
        xmlHttp.setRequestHeader("Authorization", "apikey" + " " + this.apiKey);
      } else {
        xmlHttp.setRequestHeader("apikey", this.apiKey);
      }
    }
    if (opts.postContent) {
      xmlHttp.setRequestHeader("Content-type", "application/json");
    }
    if (opts.postContent) {
      xmlHttp.send(JSON.stringify(opts.postContent));
    } else {
      xmlHttp.send(null);
    }
}

CarminClient.prototype.doPostRequest = function(path, content, callback, opts) {
  opts = opts || {};
  opts.postContent = content;
  this.doRequest(path, callback, opts);
}

CarminClient.prototype.getPlatformProperties = function(callback) {
  this.doRequest("platform", callback);
}

CarminClient.prototype.listPipelines = function(callback) {
  this.doRequest("pipelines", callback);
}

CarminClient.prototype.describePipeline = function(pipelineIdentifier, callback) {
  this.doRequest("pipelines/" + pipelineIdentifier, callback);
}

CarminClient.prototype.initAndStart = function(executionName, pipelineIdentifier, inputValues, callback) {
  var content = {"name" : executionName,"pipelineIdentifier" : pipelineIdentifier, "inputValues" : inputValues};
  this.doPostRequest("/executions/create-and-start", content, callback);
}

CarminClient.prototype.getExecution = function(executionIdentifier, callback) {
  this.doRequest("executions/" + executionIdentifier, callback);
}

CarminClient.prototype.downloadFile = function(filePath, callback) {
  this.doRequest("path/download?uri=vip://vip.creatis.insa-lyon.fr" + filePath, callback, {"noJson":true});
}















