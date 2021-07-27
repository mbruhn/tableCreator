sap.ui.define([
	], function () {
		"use strict";

		return {
			/**
			 * Rounds the currency value to 2 digits
			 *
			 * @public
			 * @param {string} sValue value to be formatted
			 * @returns {string} formatted currency value with 2 digits
			 */
			currencyValue : function (sValue) {
				if (!sValue) {
					return "";
				}

				return parseFloat(sValue).toFixed(2);
			},
			lockedStatusIcon : function (sValue) {
	
				if (!sValue) {
					return "";
				}
				else if (sValue === 1)
				{
				 return "sap-icon://locked";
				}
				else 
				{
				 return "";
				}
			},
			lockedStatusText : function (sValue) {
	           	var bundle = this.getModel("i18n").getResourceBundle();
		         
				if (!sValue) {
					return "";
				}
				else if (sValue === 1)
				{
				 return bundle.getText("detailLockedStatusText");
				}
				else 
				{
				 return "";
				}
			},
			exposedStatusIcon : function (sValue) {
		
				if (!sValue) {
					return "";
				}
				else if (sValue === 1)
				{
				 return "sap-icon://status-critical";
				}
				else 
				{
				 return "";
				}
			},
			exposedStatusText : function (sValue) {
	           	var bundle = this.getModel("i18n").getResourceBundle();
		         
				if (!sValue) {
					return "";
				}
				else if (sValue === 1)
				{
				 return bundle.getText("detailExposedStatusText");
				}
				else 
				{
				 return "";
				}
			},
			fieldIsAKey2bool : function (sValue) {
              	if (!sValue) {
					return false;
				}
				else if (sValue === 1)
				{
				 return true;
				}
				else 
				{
				 return false;
				}
			},
			fieldBool2Int : function (sValue) {
              	if (!sValue) {
					return false;
				}
				else if (sValue === true)
				{
				 return 1;
				}
				else 
				{
				 return 0;
				}
			},
			enableEditButton : function (sLocked, sUiDisplay) {
              	
              	if (sLocked ===  1) {
					return false;
				}
				else 
				{
				 return sUiDisplay;
				}
			}
			
			

		};

	}
);