/*global history */
sap.ui.define([
		"creator/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/GroupHeaderListItem",
		"sap/ui/Device",
		"creator/model/formatter",
		"sap/m/MessageToast"
		
	], function (BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, formatter, MessageToast) {
 	"use strict";

		return BaseController.extend("creator.controller.Master", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
			 * @public
			 */
			onInit : function () {
				// Control state model
				var oList = this.byId("list"),
					oViewModel = this._createViewModel(),
					// Put down master list's original value for busy indicator delay,
					// so it can be restored later on. Busy handling on the master list is
					// taken care of by the master list itself.
					iOriginalBusyDelay = oList.getBusyIndicatorDelay();


				this._oList = oList;
				// keeps the filter and search state
				this._oListFilterState = {
					aFilter : [],
					aSearch : []
				};

				this.setModel(oViewModel, "masterView");
				// Make sure, busy indication is showing immediately so there is no
				// break after the busy indication for loading the view's meta data is
				// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
				oList.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for the list
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				});

				this.getView().addEventDelegate({
					onBeforeFirstShow: function () {
						this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
					}.bind(this)
				});

				this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
				this.getRouter().attachBypassed(this.onBypassed, this);
			},

	        onSemanticButtonPress: function (oEvent) {
				var oViewModel = this.getModel("masterView"),
			        pressedButtonID = oEvent.getSource().getId();
			    
			    /*sAction = oEvent.getSource().getMetadata().getName(),
				sAction = sAction.replace(oEvent.getSource().getMetadata().getLibraryName() + ".", "");
				*/
				
			//	id: "__component0---detail--detailsSave"
				if (pressedButtonID.includes("action1")) {
					MessageToast.show("Pressed add: " + pressedButtonID);
					
					  this._addTableDialog().open();
				}
			      //  Something else pressed 	
			  	 MessageToast.show("not edit Pressed: " + pressedButtonID);
        	
		    },
    		
    		//sap.ui.getCore().byId("inputAmount").getValue()
    		onAddTableDialogOK : function (oEvent) {
        		var	cTableName  = sap.ui.getCore().byId("input-tablename").getValue(),
        			cTableDesc  = sap.ui.getCore().byId("input-tabledesc").getValue(),
        			cTableTempl = sap.ui.getCore().byId("input-tabletempl").getValue(),
        			cTableOwner = sap.ui.getCore().byId("input-tableowner").getValue(),
        			cCanBeExposed = sap.ui.getCore().byId("input-tableexposable").getSelected(),
        			msgText = "",
        			bundle = this.getModel("i18n").getResourceBundle();

        			
        			if (cTableName.length === 0) {
						msgText += bundle.getText("addTableNameIsMissing");
        			}
        			if (cTableDesc.length === 0) {
						msgText += bundle.getText("addTableDescIsMissing");
        			}        			
        			if (cTableTempl.length === 0) {
						msgText += bundle.getText("addTableTemplIsMissing");
        			}
        			if (cTableOwner.length === 0) {
						msgText +=bundle.getText("addTableOwnerIsMissing");
        			}
        			
        			// Alert if something is missing
        			if (msgText.length !== 0) {
        				MessageToast.show(msgText);
        			}
        			
        			// All elements are entered 
        			// Try to save
        			 if (msgText.length === 0) {

                        this._addTableDialog().close(); 
					//	var oViewModel = this.getModel("masterView"),
			            var oBinding = this.byId("list").getBinding("items");
	  
			      // which bindings exists ?? / rather than using create we create the 
			      // entry in the odata model - only submit changes when saving
			    		oBinding.oModel.create("/tables", 
										{	"key.tableName" 		: cTableName,
											"data.schemaName"   	: "LAKE",
											"data.realName"     	: "LAKE" + "." + cTableName,
											"data.description"  	: cTableDesc,
											"flags.canBeExposed"	: formatter.fieldBool2Int(cCanBeExposed),
											"flags.exposed"     	: formatter.fieldBool2Int(false),
											"flags.locked"      	: formatter.fieldBool2Int(false) }, 
										null,
										function()  // Success
										{	MessageToast.show("Table Created");  },
										function()  // Failure 
										{	MessageToast.show("Table Couldnt be saved created");   });
										
					// Create Owner group ACL already when creating definition
						oBinding.oModel.create("/tableAcls", 
											{	"key.tableName" 		: cTableName,
												"key.teamID"    		: cTableOwner,
												"flags.owner"       	: formatter.fieldBool2Int(true),
												"flags.insertData"  	: formatter.fieldBool2Int(true),
												"flags.readData"    	: formatter.fieldBool2Int(true),
												"flags.updateData"  	: formatter.fieldBool2Int(true),
												"flags.deleteData"  	: formatter.fieldBool2Int(true),
												"flags.lockAndUnlock"	: formatter.fieldBool2Int(true),
												"flags.exposeView"  	: formatter.fieldBool2Int(true)});
					
        			 }

    		},
    		
    		onAddTableDialogCancel : function (oEvent) {
				/*Clear old stuff out*/	 
				sap.ui.getCore().byId("input-tablename").setValue("");
				sap.ui.getCore().byId("input-tabledesc").setValue("");
				sap.ui.getCore().byId("input-tabletempl").setValue("");
				sap.ui.getCore().byId("input-tableowner").setValue("");
        			
				// Close
				this._addTableDialog().close();
    		},  
    		
    		_addTableDialog : function () {
        		if (!this._oDialog) {
            		this._oDialog = sap.ui.xmlfragment("creator.view.AddTableDialog",this);
            		this.getView().addDependent(this._oDialog);
        		}
        		return this._oDialog;
    		},
    		
    		
    		/*
    		      _getDialog : function () {
         // create dialog lazily
         if (!this._oDialog) {
            // create dialog via fragment factory
            this._oDialog = sap.ui.xmlfragment("sap.ui.demo.wt.view.HelloDialog", this);
            // connect dialog to view (models, lifecycle)
            this.getView().addDependent(this._oDialog);
         }
         return this._oDialog;
      },
    		
    		*/


			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * After list data is available, this handler method updates the
			 * master list counter and hides the pull to refresh control, if
			 * necessary.
			 * @param {sap.ui.base.Event} oEvent the update finished event
			 * @public
			 */
			onUpdateFinished : function (oEvent) {
				// update the master list object counter after new data is loaded
				this._updateListItemCount(oEvent.getParameter("total"));
				// hide pull to refresh if necessary
				this.byId("pullToRefresh").hide();
			},

			/**
			 * Event handler for the master search field. Applies current
			 * filter value and triggers a new search. If the search field's
			 * 'refresh' button has been pressed, no new search is triggered
			 * and the list binding is refresh instead.
			 * @param {sap.ui.base.Event} oEvent the search event
			 * @public
			 */
			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
					return;
				}

				var sQuery = oEvent.getParameter("query");
                
                // Search requires upper on both sides 
                // caseSensitive
               //new Filter({ path: 'name',caseSensitive: false,operator: FilterOperator.Contains,value1: sQuery})
                
                
                
				if (sQuery) {
				// 	this._oListFilterState.aSearch = [new Filter("key.tableName", FilterOperator.Contains, sQuery)];
					this._oListFilterState.aSearch = [new Filter({path : 'key.tableName', operator: FilterOperator.Contains, value1:sQuery, caseSensitive : false})];
				} else {
					this._oListFilterState.aSearch = [];
				}
				this._applyFilterSearch();

			},

			/**
			 * Event handler for refresh event. Keeps filter, sort
			 * and group settings and refreshes the list binding.
			 * @public
			 */
			onRefresh : function () {
				this._oList.getBinding("items").refresh();
			},



			/**
			 * Event handler for the list selection event
			 * @param {sap.ui.base.Event} oEvent the list selectionChange event
			 * @public
			 */
			onSelectionChange : function (oEvent) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			},

			/**
			 * Event handler for the bypassed event, which is fired when no routing pattern matched.
			 * If there was an object selected in the master list, that selection is removed.
			 * @public
			 */
			onBypassed : function () {
				this._oList.removeSelections(true);
			},

			/**
			 * Used to create GroupHeaders with non-capitalized caption.
			 * These headers are inserted into the master list to
			 * group the master list's items.
			 * @param {Object} oGroup group whose text is to be displayed
			 * @public
			 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
			 */
			createGroupHeader : function (oGroup) {
				return new GroupHeaderListItem({
					title : oGroup.text,
					upperCase : false
				});
			},

			/**
			 * Event handler for navigating back.
			 * We navigate back in the browser historz
			 * @public
			 */
			onNavBack : function() {
				history.go(-1);
			},

			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */


			_createViewModel : function() {
				return new JSONModel({
					isFilterBarVisible: false,
					filterBarLabel: "",
					delay: 0,
					title: this.getResourceBundle().getText("masterTitleCount", [0]),
					noDataText: this.getResourceBundle().getText("masterListNoDataText"),
					sortBy: "key.tableName",
					groupBy: "None"
				});
			},

			/**
			 * If the master route was hit (empty hash) we have to set
			 * the hash to to the first item in the list as soon as the
			 * listLoading is done and the first item in the list is known
			 * @private
			 */
			_onMasterMatched :  function() {
				this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
					function (mParams) {
						if (mParams.list.getMode() === "None") {
							return;
						}
						var sObjectId = mParams.firstListitem.getBindingContext().getProperty("key.tableName");
						this.getRouter().navTo("object", {objectId : sObjectId}, true);
					}.bind(this),
					function (mParams) {
						if (mParams.error) {
							return;
						}
						this.getRouter().getTargets().display("detailNoObjectsAvailable");
					}.bind(this)
				);
			},

			/**
			 * Shows the selected item on the detail page
			 * On phones a additional history entry is created
			 * @param {sap.m.ObjectListItem} oItem selected Item
			 * @private
			 */
			_showDetail : function (oItem) {
				var bReplace = !Device.system.phone;
				this.getRouter().navTo("object", {
					objectId : oItem.getBindingContext().getProperty("key.tableName")
				}, bReplace);
			},

			/**
			 * Sets the item count on the master list header
			 * @param {integer} iTotalItems the total number of items in the list
			 * @private
			 */
			_updateListItemCount : function (iTotalItems) {
				var sTitle;
				// only update the counter if the length is final
				if (this._oList.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
					this.getModel("masterView").setProperty("/title", sTitle);
				}
			},

			/**
			 * Internal helper method to apply both filter and search state together on the list binding
			 * @private
			 */
			_applyFilterSearch : function () {
				var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
					oViewModel = this.getModel("masterView");
				this._oList.getBinding("items").filter(aFilters, "Application");
				// changes the noDataText of the list in case there are no filter results
				if (aFilters.length !== 0) {
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
				} else if (this._oListFilterState.aSearch.length > 0) {
					// only reset the no data text to default when no new search was triggered
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
				}
			},

			/**
			 * Internal helper method to apply both group and sort state together on the list binding
			 * @param {sap.ui.model.Sorter[]} aSorters an array of sorters
			 * @private
			 */
			_applyGroupSort : function (aSorters) {
				this._oList.getBinding("items").sort(aSorters);
			},

			/**
			 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
			 * @param {string} sFilterBarText the selected filter value
			 * @private
			 */
			_updateFilterBar : function (sFilterBarText) {
				var oViewModel = this.getModel("masterView");
				oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
				oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
			}

		});

	}
);