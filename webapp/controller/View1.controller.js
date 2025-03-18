sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/Label",
    "sap/m/Column",
    "sap/m/ColumnListItem"
],
function (Controller,Fragment,Label,Column,ColumnListItem) {
    "use strict";
    var that;
    return Controller.extend("scrollcontainer.controller.View1", {
        onInit() {
            that=this;
            
            var sampleModel = new sap.ui.model.json.JSONModel();
            that.getView().setModel(sampleModel,"sampleModel");

            var columnModel = new sap.ui.model.json.JSONModel();
            that.getView().setModel(columnModel,"columnModel");
            
        },
        onUploadDialog: function(){
            if(!that.upload){
                that.upload = sap.ui.xmlfragment("scrollcontainer.fragment.upload",that);
            }
            that.upload.open();
        },
        fileUpload: function(oEvent){
            var files = oEvent.getParameter("files");
            if(files.length>0){
                var oFiles = files[0];
                var reader = new FileReader();
                var tableData = {};
                console.log(window.XLSX);
                reader.onload = function(e){
                    var data = e.target.result;
                    var workbook = XLSX.read(data,{
                        type : "array"
                    });
                    console.log(window.XLSX);
                    // workbook.SheetNames.forEach(sheetName => {
                    //     var xl_row_data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    //     tableData = [...tableData,...xl_row_data]
                    // });
                    workbook.SheetNames.forEach(function (sheetName) {
                        tableData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    });
                    
                    that.getView().getModel("sampleModel").setData(tableData);
                }
                reader.onerror= function(ex){
                    console.log(ex);
                }
                reader.readAsArrayBuffer(oFiles);
            }
        },
        uploadExcel: function(){
            var oTable = that.getView().byId("tableInfo");
            var oModel = that.getView().getModel("sampleModel");
            var oModelData = oModel.getProperty("/");

            if (!oModelData || oModelData.length === 0) {
                sap.m.MessageToast.show("No data found in the uploaded file.");
                return;
            }    

            var oColumns = Object.keys(oModelData[0]);
            var oColumnNames = [];
            for(var i=0; i< oColumns.length; i++){
                oColumnNames.push({
                    Text: oColumns[i]
                    });
            }

            var columnmodel = that.getView().getModel("columnModel");
            columnmodel.setProperty("/", oColumnNames);
            var oTemplate = new sap.m.Column({
                header: new Label({
                text: "{columnModel>Text}"
                })
			});
            oTable.bindAggregation("columns", "columnModel>/", oTemplate);
    
            var oItemTemplate = new sap.m.ColumnListItem({
                cells: []
            });
            
            for (var i = 0; i < oColumns.length; i++) {
                var column = oColumns[i];
                var oText = new sap.m.Text({
                    text: "{sampleModel>" + column + "}"
                });
                oItemTemplate.addCell(oText);
            }

            // Bind items to the table
            oTable.bindAggregation("items", {
                path: "sampleModel>/",
                template: oItemTemplate
                });
            that.upload.close();
        }
    });
});