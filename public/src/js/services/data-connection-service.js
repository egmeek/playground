let DataConnectionService =
ng.core.Injectable({

})
.Class({
  constructor: [ng.http.Http, function(http){
    this.http = http;
    this.dataConnections;
  }],
  getDataConnections: function(callbackFn){
    if(this.dataConnections){
      callbackFn(this.dataConnections);
    }
    else{
      this.http.get('/server/dataconnections').subscribe(response => {
        if(response._body!==""){
          this.dataConnections = JSON.parse(response._body);
          callbackFn(JSON.parse(response._body));
        }
        else{
          callbackFn();
        }
      });
    }
  },
  getConnectionDictionary: function(index, callbackFn){
    if(this.dataConnections){
      var dictionaryUrl = this.dataConnections[index].dictionary;
      this.http.get(dictionaryUrl).subscribe(response => {
        callbackFn(JSON.parse(response._body));
      });
    }
    else{
      this.getDataConnections((response)=>{
        var dictionaryUrl = this.dataConnections[index].dictionary;
        this.http.get(dictionaryUrl).subscribe(response => {
          callbackFn(JSON.parse(response._body));
        });
      });
    }
  },
  authoriseConnection: function(connectionId, callbackFn){
    this.http.post("/server/authorise/"+connectionId).subscribe(response => {
      callbackFn(JSON.parse(response._body));
    });
  }
});
