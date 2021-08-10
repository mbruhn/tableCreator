/*global location */
sap.ui.define([
		"creator/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"creator/model/formatter",
		"sap/m/MessageToast"
	], function (BaseController, JSONModel, formatter, MessageToast) {
		"use strict";

		return BaseController.extend("creator.controller.Detail", {

			formatter: formatter,
           
			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
				});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
                
				this.setModel(oViewModel, "detailView");

				this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			},

			onDrop : function (oInfo) {
			// Dropping on the field list 
	
			   
				var oDragged = oInfo.getParameter("draggedControl"),
				oDropped = oInfo.getParameter("droppedControl"),
				sInsertPosition = oInfo.getParameter("dropPosition"),
				oDragContainer = oDragged.getParent(),
				oDropContainer = oInfo.getSource().getParent(),
				oDragModel = oDragContainer.getModel(),
				oDropModel = oDropContainer.getModel(),
				iDragPosition = oDragContainer.indexOfItem(oDragged),
				iDropPosition = oDropContainer.indexOfItem(oDropped);

                 // correct context - field is taken
                var oDragContext = oDragged.getBindingContext();
                var oDraggedRow = oDragContext.getModel().getProperty(oDragContext.sPath);
                var draggedPos  = oDragContext.getModel().getProperty(oDragContext.sPath+"/data.pos");
                
                
                //Drop context
                var oDropContext = oDropped.getBindingContext();
                var oDroppedRow = oDropContext.getModel().getProperty(oDropContext.sPath);
                var droppedPos  = oDropContext.getModel().getProperty(oDropContext.sPath+"/data.pos");
                
                /* drag , drop 
                1    -    3    - dragdown   ( move all 1 up position - 1  )
                3    -    1    - dragg  up ( move all 1 down position + 1  )
                */ 
                
                var dragDirection = (draggedPos < droppedPos ? "DragDown" : "DragUp");
                
      
                
                
            	var oTable = this.byId("lineItemsList");
        	    var gModel = oTable.getModel();
                
                // get all rows between drop (startt) and drag (end)
                var numberOfTableItems = oTable.getItems().length;
                var oTableItems = oTable.getItems();
                //var oSingleTableRow = gModel.getProperty(oTableItems[1].getBindingContext().getPath());
     
                for(var i = 0; i < numberOfTableItems;i++) {
                   var row = gModel.getProperty(oTableItems[i].getBindingContext().getPath());
                   
                   
                   // drag down
                   // 1 to 3
                   /*
                      1 A     -> 3     
                      2 A     -> up - 1 
                      3 A     -> up -1     
                   */
                   
                   
                   
                   // re set data position + 1 for records between drag and drop position
                   if ( row["data.pos"] >= droppedPos  && row["data.pos"] <= draggedPos) {
                   
                     if (dragDirection === "DragDown" ) {
                    	gModel.setProperty(oTableItems[i].getBindingContext().getPath()+"/data.pos", row["data.pos"]-1) ; 	
                     }
                     else {
                    	gModel.setProperty(oTableItems[i].getBindingContext().getPath()+"/data.pos", row["data.pos"]+1) ;
                     }
                    
                     
                     }
                     
                }
                
                // Finally set the dragged position to the number of the dropped 
                
            // validate that update will happen 
            //oDropContext.getModel().setProperty(oDropContext.sPath+"/data.pos", draggedPos);
            
            oDragContext.getModel().setProperty(oDragContext.sPath+"/data.pos", droppedPos);
            
                
                
                
                
                
                
                
                
                // is there a get parent 
                // var oDraggedRow1 = oDragContext.getModel().getObject(oDragContext.sPath); 
              
            
            /*
            Change value 
            bindingContext.getModel().setProperty("/tablefields(key.tableName='YAA_2020112601_backward_sarimax_features_best_models',key.fieldName='aic')/data.dataLength", 25);     
            */ 
            
                
                           // wron context  var b  = oDragContainer.getBindingContext();
          
			// refresh
			//var sPath = oTable.getBindingPath("items");
		
		
		     // Link to table id and items binding for the table fields 
        	 var oBinding = this.byId("lineItemsList").getBinding("items");
        	 // refresh the table entries
        	//   oBinding.refresh(true);
        	//   
        	
        	
        	//use rerendere ?? 
        	var oTable = this.byId("lineItemsList");
        	
            // Waht ?
        	//  this.byId("lineItemsList").setBindingContext(undefined);
        	 
        	 
        	 /*Redo sorter*/
        //	 var oSorter = new Sorter({ path: 'data.pos'});
        	 //read oTable sorter 
        	 
        	 // manual sorting
        	 // use the sorting 
        	 // now really working 
             oBinding.sort(oBinding.aSorters[0]);
             
           
        	 // sorter : { path : 'data.pos' }}
             // <Table id="defectsTable" growing="true" growingThreshold="10" items="{ path : '/Defects' ,sorter: {path: 'SEQUENCE'}}" mode="SingleSelectMaster" >
           /*
           
           oTable.getBinding("rows").refresh();
else if you have used sap.m.Table then try this:
 */
           // 	var oTable = this.byId("lineItemsList");
           oTable.getBinding("items").refresh();
          
           // not  oTable.getBinding("rows").refresh();
           var gModel = oTable.getModel();
           
           // All items of the model 
           var numberOfTableItems = oTable.getItems().length;
           
           var oTableItems = oTable.getItems();
           
           var oSingleTableRow = gModel.getProperty(oTableItems[1].getBindingContext().getPath());
  
           // create entry      
     
           gModel.refresh();
           oTable.getBinding("items").refresh();
       
           // todo : fire to the database
          // gModel.submitChanges();
   
           /*
             dropindex Take index of drop
             dragindex Take index of drag
             Renumber all entries inbetween 
             1 dropindex     =  currentindex+1 -> 2
             2 dropindex +1  =  currentindex+1 -> 3
             3 dropindex +2  =  currentindex+1 -> 4
             4 dragindex +3  =  dropindex      -> 1 
             
             reignate sorter - on table 
             
           */
           
  
        
        
        // 	oTable.rerender();  
             
		  	// var oTableFieldsData = oBinding.oModel.oData;
		  	 
		  	 
		  	 // refresh model?? 
		  
		  	 
		  	 
		  	 
		  	 
		  	 
            // var oTableFieldsoModel = oBinding.oModel('tablefields');
		  	 
		  	 // get drop record 	 
		  	 //var droprec = oTableFieldsData[iDropPosition];
		  	 
		  	 // get drag record
		  	 //var dragrec = oTableFieldsData[iDragPosition];
		  	 
		  	 
		  
             // getRows -
             // getItems
             // getData
             
           //  this.getView().setModel(tableModel, "tableModel");
            //var table = this.getView().byId("uiTable");
            /*var tableLength = tableModel.getData().Sheet1.length;
            var tableData = tableModel.getData().Sheet1;
            var aRows = table.getRows();
table.onAfterRendering = function () {
                sap.ui.table.Table.prototype.onAfterRendering.apply(this, arguments);
                for (var i = 0; i < tableLength; i++) {
                    if (tableData[i].Region === "AP") {
                        var pRow = aRows[i];
                        $("#" + pRow.getId() + "-col" + i).addClass("mystyle");
                    }
                }
            }*/
		  	 
		  	 
		  	 
		  	 // this.getView().byId("TabId").bindRows(path+'/PlantToSLoc');
		  	 
		  	 // get all records after drop 
		  	 
		  	 // get 
		  	 // update UI 
		  	 
			
			  /*
			jQuery.each(rowItems,function(id,value){
items = items +" " + value.getCells()[0].getText();
});

*/


		  //	  var oItem = oDragModelData[iDragPosition];
    		},


			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

    		// Create new field added - edit  
			handleTableFieldAdd  : function (oEvent) {
			// Basuc getters 
			    var oTable = this.byId("lineItemsList");
			    
				var oViewModel = this.getModel("detailView"),
			    	pressedButtonID = oEvent.getSource().getId(),
			    	oBinding = this.byId("lineItemsList").getBinding("items");
			    	
			    // read the odataobject direct.. not best approach - but for debug only	
			    // var noData = oBinding.getModel().oData;
             
			   // get binding context ie selected table 
				var bindingContext = this.getView().getBindingContext();
				var path = bindingContext.getPath();
				var object = bindingContext.getModel().getProperty(path);
                
                // "/tables('YAA_2020112601_backward_sarimax_features_best_models')"
            
				
            
             //based on path get the table name - from path remove unwanted chars 
             var sTablePath = path.substring(path.lastIndexOf("('") + 1, path.lastIndexOf("')"));
		     var sTableName = sTablePath.split("'").pop().split("'")[0];                
                
                
            var tabnameInContextModel = bindingContext.getModel().getProperty(path +"/key.tableName");
            
         //   var tablefieldinfo = bindingContext.getModel().getProperty("/tablefields(key.tableName='YAA_2020112601_backward_sarimax_features_best_models',key.fieldName='aic')/data.dataLength");     
     
     /*Change value */
        //    bindingContext.getModel().setProperty("/tablefields(key.tableName='YAA_2020112601_backward_sarimax_features_best_models',key.fieldName='aic')/data.dataLength", 25);     
     
                
            // not working var fields = bindingContext.getModel().getProperty("/tablefields");
     
            // reads the object on the selected table 
            var filledOutEntityFields = bindingContext.getObject();
            // var tabelname = filledOutEntityFields("key.tableName");
            var tabelname = filledOutEntityFields["key.tableName"];
     
     
            
             //  noData["tablefields(key.tableName='YAA_2020112601_backward_sarimax_features_best_models',key.fieldName='aic')"]
                
                
            //    var testerigen = oBinding.getModel().getProperty(path);
                
                // not working var fields = bindingContext.getModel().getProperty(path).tablefields;
                // invoke read fiedls 
                
                
               // not working  var tablefields = bindingContext.getModel().getProperty(path+"/tablefields"); 
             //   var nytest = object.getProperty("data.realName");

			// based on current binding this provides the oData (table fields)
            // not the way var oData = bindingContext.getModel().oData; 
             

			
			
			
			// var oTable = this.byId("lineItemsList");
            var gModel = oTable.getModel();
           
           // All items of the model 
           var numberOfTableItems = oTable.getItems().length;
        
           //var oTableItems = oTable.getItems();
           
           //var oSingleTableRow = gModel.getProperty(oTableItems[1].getBindingContext().getPath());
  
			// test case
			/*
			    /tablefields path + "/tablefields";
			    spath + 
			 */
       
            // creating an entity object 
            /* var oContext = bindingContext.oModel.createEntry(path + "/tablefields",{
			      		properties: {	"key.tableName"     : sTableName,
										"key.fieldname"     : "",
									    "data.dataLength"   : 0,
										"data.dataScale"    : 0,
										"data.dataType"     : "",
										"data.description"  : "",
										"data.isKey"        : 0, 
										"data.pos"          : numberOfTableItems + 1 }});             
      */
      //    not working :   oTable.setBindingContext(oContext);
            // oContext. 
            // oContext.
            
  
     // create field 
     
     // Bind field to table entity
     
     // /tables() / tablefienldæs 
     
              gModel.createEntry(path + "/tablefields",{
              //gModel.createEntry(path + "/tablefields",{
              	
             // gModel.createEntry("/tablefields(key.tableName='YAA_2020112601_backward_sarimax_features_best_models',key.fieldName='zzaic')",{
			      		properties: {	"key.tableName"     : sTableName,
										"key.fieldname"     : "zzaic",
									    "data.dataLength"   : 0,
										"data.dataScale"    : 0,
										"data.dataType"     : "",
										"data.description"  : "",
										"data.isKey"        : 0, 
										"data.pos"          : numberOfTableItems + 1 }});    
              
          
          
             gModel.refresh();
             oTable.getBinding("items").refresh();
             gModel.submitChanges();
        
            // now bind the created context 
           // todo   oForm.setBindingContext(oContext);    
       // var oModel = bindingContext.getModel();
	   // var propertyPath = path + "/tablefields";
			   

			   
			   /*
			   
			   that.contextCursoIniciativaEmpregadoASerCriada = that.getView().getModel().createEntry('/CursoIniciativaEmpregadoSet');
                that.fragmentCriacaoDadosInicEmpregado.bindElement(that.contextCursoIniciativaEmpregadoASerCriada.sPath);
                  that.fragmentCriacaoDadosInicEmpregado.open();
			   
			   */
			   
			   
			   
			   
			   
			 //  https://hxehost:51058/tablefields.xsodata/tables('YAA_2020112601_backward_sarimax_features_best_models')/tablefields
             //  https://hxehost:51056/tablefields.xsodata/tablefields(key.tableName='YAA_2020112601_backward_sarimax_features_best_models',key.fieldName='aic')"
          
    
		 
			   
// var oTable =	this.getView().byId("lineItemsList");
  // var items = oTable.getItems(); // [i].getCells()[i].getText();
   // var noOfRecords = oTable.getItems().length;
    
   //
   //for(var i=0,i<items.length;i++) {
 //    var nvalue = items[2].getCells()[3].getText();		   
     // a = items[i].getProperty();

// }	   
			   
			   // create an entry of the Products collection with the specified properties and values
// var oContext = oModel.createEntry("/Products", { properties: { ID:99, Name:"Product", Description:"new Product", ReleaseDate:new Date(), Price:"10.1", Rating:1} });
// binding against this entity
// oForm.setBindingContext(oContext);
			   
			   
			},
	
			// new acl entry
			handleAclTableAdd : function (oEvent) {
		 	  var oViewModel = this.getModel("detailView"),
			      pressedButtonID = oEvent.getSource().getId(),
			      oBinding = this.byId("aclItemsList").getBinding("items");
			   
			     		// get binding table name 	    
			    var sPathBinding = this.byId("lineItemsList").getBinding("items").oContext.sPath,
			        sTablePath = sPathBinding.substring(sPathBinding.lastIndexOf("('") + 1, sPathBinding.lastIndexOf("')")),
			        sTableName = sTablePath.split("'").pop().split("'")[0];
			     
			     
			 	var bindingContext = this.getView().getBindingContext();
				var path = bindingContext.getPath();
			    var propertyPath = path; // + "/tableAcls";
			     
			     
			     
			     
			     
			     
			     
			     
			     // propertyPath
			      // which bindings exists ?? / rather than using create we create the 
			      // entry in the odata model - only submit changes when saving
			      //var oContext = oBinding.oModel.createEntry(propertyPath, {
			      	
			      var oContext = oBinding.oModel.createEntry( propertyPath, {
			      		properties: {	"key.tableName" : sTableName,
										"key.teamID"    : "",
									    "flags.owner"         : formatter.fieldBool2Int(false),
										"flags.insertData"    : formatter.fieldBool2Int(false),
										"flags.readData"      : formatter.fieldBool2Int(true),
										"flags.updateData"    : formatter.fieldBool2Int(false),
										"flags.deleteData"    : formatter.fieldBool2Int(false),
										"flags.lockAndUnlock" : formatter.fieldBool2Int(false),
										"flags.exposeView"    : formatter.fieldBool2Int(false)}});
			     // Please use modelTab.setProperty("/", oData.results)
			      this.byId("aclItemsList").setBindingContext(oContext);
			      
			     // this.byId("aclItemsList").goViewModel.setBindingContext(oContext);
                  // setBindingContex
                /* this.getView().setBindingContext(this.getModel("detailView").createEntry("/MyEntitySet",  { properties: {	"key.tableName" : sTableName,
			    								    	"key.teamID"    : "",
													    "flags.owner"         : formatter.fieldBool2Int(false),
													    "flags.insertData"    : formatter.fieldBool2Int(false),
											      	    "flags.readData"      : formatter.fieldBool2Int(true),
											      	    "flags.updateData"    : formatter.fieldBool2Int(false),
											      	    "flags.deleteData"    : formatter.fieldBool2Int(false),
											      	    "flags.lockAndUnlock" : formatter.fieldBool2Int(false),
											      	    "flags.exposeView"    : formatter.fieldBool2Int(false)}}));
               */
              // this.byId("aclItemsList").setBindingContext(oContext);
               
               // oBinding.oModel.refresh(true);
                // no effect 
				// no effect this.getView().setBindingContext(oContext, "detailView");
               // this.byId("aclItemsList").bindRows("/rows"); not a function 
                  
               //this.getView().setBindingContext(oContext, "detailView");
                  
               // no good - no function oBinding.setBindingContext(oContext);
               // no good - no function oViewModel.setBindingContext(oContext);
               // no good this.byId("aclItemsList").setBindingContext(oContext);    gives a binding error 
               
				// 
			  	//  oBinding.oModel.submitChanges();  
				 	
		      /*
		           var oModel = this.getView().getModel();
    				var that = this;
    		
    			oModel.attachMetadataLoaded(function(){
			var oContext = oModel.createEntry("/CustomerSet", {
				success: that._fnEntityCreated.bind(this),
				error: that._fnEntityCreationFailed.bind(this)
			});
			that.getView().setBindingContext(oContext);
   
   
     });
		      
*/		      
		      
		      
		      
		      
			},
			 
		    /**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */ 
			onShareEmailPress : function () {
				var oViewModel = this.getModel("detailView");

				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			},

        	onSemanticButtonPress: function (oEvent) {

				var oViewModel = this.getModel("detailView"),
			        pressedButtonID = oEvent.getSource().getId();
		// get binding table name 	    
			    var sPathBinding = this.byId("lineItemsList").getBinding("items").oContext.sPath,
			        sTablePath = sPathBinding.substring(sPathBinding.lastIndexOf("('") + 1, sPathBinding.lastIndexOf("')")),
			        sTableName = sTablePath.split("'").pop().split("'")[0];
			    /*sAction = oEvent.getSource().getMetadata().getName(),
				sAction = sAction.replace(oEvent.getSource().getMetadata().getLibraryName() + ".", "");
				*/
				
			//	id: "__component0---detail--detailsSave"
				
				
				
				// Edit pressed 
				if (pressedButtonID.includes("detail--detailsEdit")) {
					//MessageToast.show("Pressed: " + pressedButtonID);
					// Toggle edit mode
					if (oViewModel.getProperty("/uiEditable") === true) {
						oViewModel.setProperty("/uiEditable", false);
						oViewModel.setProperty("/uiDisplay", true);
					}
					else {
						oViewModel.setProperty("/uiEditable", true);
						oViewModel.setProperty("/uiDisplay", false);
					}
				} 
				// Save pressed 
				else if (pressedButtonID.includes("detail--detailsSave")) {
					//MessageToast.show("Pressed: " + pressedButtonID);
					// Toggle edit mode
					if (oViewModel.getProperty("/uiEditable") === true) {
						oViewModel.setProperty("/uiEditable", false);
						oViewModel.setProperty("/uiDisplay", true);
					}
					else {
						oViewModel.setProperty("/uiEditable", true);
						oViewModel.setProperty("/uiDisplay", false);
					}
				} 				
				else	{
			      //  Something else pressed 	
			  	  MessageToast.show("not edit Pressed: " + pressedButtonID);
        		}
		    },
		

			/**
			 * Updates the item count within the line item table's header
			 * @param {object} oEvent an event containing the total number of items in the list
			 * @private
			 */
			onListUpdateFinished : function (oEvent) {
				var sTitle,
					iTotalItems = oEvent.getParameter("total"),
					oViewModel = this.getModel("detailView");

				//	this.getView().getModel("detailView").createEntry('/items', {/* new invoice data */});
				//	this.getView().getModel("detailView").submitChanges();


				// only update the counter if the length is final
				if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
					}
					oViewModel.setProperty("/lineItemListTitle", sTitle);
				}
				
				// Should be changed so that it holds the ACL model count 
				// only update the counter if the length is final
				if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
					}
					oViewModel.setProperty("/lineItemListTitle", sTitle);
				}
				
				// Default closed for edit and save btn not opened
				oViewModel.setProperty("/uiEditable", false);
				oViewModel.setProperty("/uiDisplay", true);
				
		 
				
				
			},

			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Binds the view to the object path and expands the aggregated line items.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("tables", {
						"key.tableName" :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path. Makes sure that detail view displays
			 * a busy indicator while data for the corresponding element binding is loaded.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound to the view.
			 * @private
			 */
			_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					// if object could not be found, the selection in the master list
					// does not make sense anymore.
					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = decodeURI(oElementBinding.getPath()),
					oResourceBundle = this.getResourceBundle(),
					oObject = oView.getModel().getObject(sPath),
					sObjectId = oObject["key.tableName"],
					sObjectName = oObject["key.tableName"],
					oViewModel = this.getModel("detailView");

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);

				oViewModel.setProperty("/shareSendEmailSubject",
					oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
					oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},

			_onMetadataLoaded : function () {
				// Store original busy indicator delay for the detail view
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView"),
					oLineItemTable = this.byId("lineItemsList"),
					iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

				// Make sure busy indicator is displayed immediately when
				// detail view is displayed for the first time
				oViewModel.setProperty("/delay", 0);
				oViewModel.setProperty("/lineItemTableDelay", 0);

				oLineItemTable.attachEventOnce("updateFinished", function() {
					// Restore original busy indicator delay for line item table
					oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
				});

				// Binding the view will set it to not busy - so the view is always busy if it is not bound
				oViewModel.setProperty("/busy", true);
				// Restore original busy indicator delay for the detail view
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			}

		});

	}
);