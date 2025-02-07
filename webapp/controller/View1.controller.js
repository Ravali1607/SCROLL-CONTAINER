sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    var that;
    return Controller.extend("scrollcontainer.controller.View1", {
        onInit() {
            that=this;
            var oModel = that.getOwnerComponent().getModel('SalesJSONModel');
            that.getView().setModel(oModel);
        }
    });
});