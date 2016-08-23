app.APIContent = ng.core.Component({
  selector: 'playground-api-content',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/apis/api-content.html'
}).Class({
  constructor: [ng.router.ActivatedRoute, app.ResourceCenterService, function(route, resourceCenterService){
    this.route = route;
    this.resourceCenterService = resourceCenterService;
    this.api = this.route.parent.url.value[0].path;
    route.params.subscribe((route)=>{
      let resourceSubject = route.subject;
      this.getResourceContent(resourceSubject);
    });
  }],
  getResourceContent: function(subject){
    let resourceId = null;
    this.resourceTitle = "";
    this.content = "";
    switch (this.api) {
      case "engine":
        switch (subject) {
          case "overview":
            resourceId = "57bc65dc99eaed947c8e58c4";
            break;
          case "authenticating":
            resourceId = "57bc4c2482583d70eba9ef60";
            break;
          case "connecting":
            resourceId = "57bc6bdd99eaed947c8e5918";
            break;
          case "hypercube":
            resourceId = "57bc71b3b2f5fb393a3480d6";
            break;
          case "listobject":

            break;
          case "filtering":

            break;
          default:

        }
        break;
      case "capability":
        switch (subject) {
          case "overview":
            resourceId = "57b195052fe227f95f07cba4";
            break;
          case "authenticating":
            resourceId = "57bb1b4c9a9e3798414d5113";
            break;
          case "connecting":
            resourceId = "57a356c6a3c42710c3f23c1c";
            break;
          case "visualizations":
            resourceId = "57b1dd7dc3416b4035de71bc";
            break;
          case "filtering":

            break;
          default:

        }
        break;
      default:

    }
    if(resourceId){
      this.resourceCenterService.getResource(resourceId, (resource)=>{
        resource = JSON.parse(resource);
        if(resource && resource.data && resource.data.length > 0){
          resource = resource.data[0];
          this.resourceTitle = resource.title;
          console.log(resource);
          this.content = marked(this.arrayBufferToBase64(resource.content.data));
          setTimeout(function(){
            $('pre code').each(function(i, block) {
              hljs.highlightBlock(block);
            });
          }, 100);
        }
      });
    }
  },
  arrayBufferToBase64: function( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return binary ;
  }
});
