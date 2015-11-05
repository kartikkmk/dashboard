sap.ui.controller("sample.V1", {
	G_ODATA : null,
	PAGE : null,
	updateC : null,
	TileArray : null,
	readM : null,
	ChangeC : null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf sample.V1
*/
	onInit: function() {
		//debugger;
		//EMPTY DATA	
		//var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		PAGE = this.byId("P");
		updateC = this.updateContent;
		TileArray = [];
		readM = this.readModel;
		ChangeC = this.changeColor;
		this.readModel();			
		this.loadView();				
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf sample.V1
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf sample.V1
*/
	onAfterRendering: function() {
		//this.loadView();	
		//debugger;
		this.changeColor();
		
//		var readM = this.readModel;		
//		var ChangeC = this.changeColor;

		setInterval(function(){
			try{
			
			readM();
			
			updateC();
			ChangeC();	
			}
			catch(e){
				alert(e.message);
			}
		},1000);
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf sample.V1
*/
//	onExit: function() {
//
//	}
    loadView : function(){
    					//debugger;
    					//PAGE.destroyContent();
    					//var PAGE1 = new sap.m.Page();
		   				var LOCATIONS = [];
		   				TileArray = [];
		    	  		for(var i = 0; i < G_ODATA.length; i++)
		    	  		{
		    	  			if(LOCATIONS.indexOf(G_ODATA[i].Location) == -1)
		    	  			{
		    	  					LOCATIONS.push(G_ODATA[i].Location);
		    	  			}		    	  			
		    	  		}
		    	  
		    	  		 for(var j =0; j < LOCATIONS.length; j++)
		    	  		 {
		    	  			 var Litem = new sap.m.StandardListItem({ 
		    	  				title : LOCATIONS[j]
		    	  			}).addStyleClass("Header");
		    	  			
		    	  			 PAGE.addContent(Litem);
		    	  			 var oGrid1 = new sap.ui.layout.Grid({
		 		    		    hSpacing: 1,
		 		    		    vSpacing: 1
		 		    		});	  
		    	  			 PAGE.addContent(oGrid1);
		    	  		 
			    	  		for(var i =0; i < G_ODATA.length; i++)
		    	  		    {
			    	  			 if(LOCATIONS[j] == G_ODATA[i].Location)
			    	  			 {	 
			    	  				var Id =  G_ODATA[i].Location + "_" + G_ODATA[i].Unit + "_" + i;
			    	  				 
					    	  		var Tile = new sap.m.StandardListItem(Id,{
					    	  			title : G_ODATA[i].Unit , 
					    	  			description : G_ODATA[i].Power,
					    	  			layoutData : new sap.ui.layout.GridData({
				    		                span : "L2 M3 S4"
				    		            })
					    	  		}).addStyleClass("CTile");
					    	  		oGrid1.addContent(Tile);
					    	  		//debugger;
					    	  		TileArray.push(Tile);
					    	  	 }
		    	  		    }
		    	  		 }
		    	  		 //G_ODATA = null; 
//		    	  		PAGE.destroyContent();
//		    	  		PAGE.addContent(PAGE1.getContent());
//		    	  		PAGE1 = null;
    
    },
    
    changeColor : function(){
    	
    	for(var i = 0; i < G_ODATA.length; i++)
  		{
    		var Id = "#" +  G_ODATA[i].Location + "_" + G_ODATA[i].Unit + "_" + i;
			var color = G_ODATA[i].Color;
			$(Id).css("background-color", color);			
  		}
    	//G_ODATA = null;
    },
    
    readModel : function(){
    	//debugger;
    	G_ODATA = null;
    	var serviceurl = "http://103.47.167.27:8081/Dashboard_V1/";		 
	 	var odatamodel = new sap.ui.model.odata.ODataModel(serviceurl,true);
	    odatamodel.setHeaders({"X-SMP-APPCID" : "79863032-c8b7-4ccd-bacc-7a85ab055837"});
	      
	    odatamodel.oHeader={		        
	        "DataServiceVersion":"1.0",
	        "MaxDataServiceVersion":"1.0"
	    };
	    
	    odatamodel.read("/PMISSet", null, null, false, 
                  function fnSuccess(oData)
                  {   
	    	  		G_ODATA = oData.results;
//	    	  		 if(updateC != null){
//		    	  			updateC();
//		    	  		 }
                  },
                  function fnError(response)
                  {
                      alert("Error" + response);
                  }
	      );
	    
	    odatamodel = null;
    },
    
    updateContent : function(){
    	//alert("1");
    	//UPDATE
    	//debugger;
    	for(var i =0; i < G_ODATA.length; i++)
		{
    		for(var j = 0; j< TileArray.length;j++)
    			{
	    			var Tile = TileArray[j];
	    			var Unit = Tile.getTitle();
	    			var id = Tile.getId().split("_");
	    			
	    			if(G_ODATA[i].Location == id[0])
	    			{
			    		if(G_ODATA[i].Unit == Unit)
			  			{
			    			Tile.setDescription(G_ODATA[i].Power);
			    			break;
			  			}	
	    			}
	    			
    			}
		}
    }
    
});