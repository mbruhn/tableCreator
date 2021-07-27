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

			
			//var sPath = oTable.getBindingPath("items");
		
		
		     // Link to table id and items binding for the table fields 
        	 var oBinding = this.byId("lineItemsList").getBinding("items");
		  	 var oTableFieldsData = oBinding.oModel.oData;
            // var oTableFieldsoModel = oBinding.oModel('tablefields');
		  	 
		  	 // get drop record 	 
		  	 //var droprec = oTableFieldsData[iDropPosition];
		  	 
		  	 // get drag record
		  	 //var dragrec = oTableFieldsData[iDragPosition];
		  	 
		  	 
		  	 var tableModel = this.getOwnerComponent().getModel("tablefields");
             var table = this.byId("lineItemsList");
             var aRows = table.getItems();
             
             aRows.forEach(function(item){
    // log to the console for debugging only:        
    var acell = item.getCells()[1];
    console.log("scheduledTask.xsjs:create: ");
    		   MessageToast.show(acell);
});
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

	
			// new acl entry
			handleAclTableAdd : function (oEvent) {
		 	  var oViewModel = this.getModel("detailView"),
			      pressedButtonID = oEvent.getSource().getId(),
			      oBinding = this.byId("aclItemsList").getBinding("items");
			      
			     		// get binding table name 	    
			    var sPathBinding = this.byId("lineItemsList").getBinding("items").oContext.sPath,
			        sTablePath = sPathBinding.substring(sPathBinding.lastIndexOf("('") + 1, sPathBinding.lastIndexOf("')")),
			        sTableName = sTablePath.split("'").pop().split("'")[0];
			     
			     
			      // which bindings exists ?? / rather than using create we create the 
			      // entry in the odata model - only submit changes when saving
			      var oContext = oBinding.oModel.createEntry("/tableAcls", 
			    										 { properties: {	"key.tableName" : sTableName,
			    											"key.teamID"    : "",
													    "flags.owner"         : formatter.fieldBool2Int(false),
													    "flags.insertData"    : formatter.fieldBool2Int(false),
											      	    "flags.readData"      : formatter.fieldBool2Int(true),
											      	    "flags.updateData"    : formatter.fieldBool2Int(false),
											      	    "flags.deleteData"    : formatter.fieldBool2Int(false),
											      	    "flags.lockAndUnlock" : formatter.fieldBool2Int(false),
											      	    "flags.exposeView"    : formatter.fieldBool2Int(false)}});
			      
			      
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