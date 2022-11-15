sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, FilterOperator, Filter, MessageToast) {
        "use strict";

        return Controller.extend("btp.academy.easyapp.controller.Main", {
            onInit: function () {
                this.oDialog = null;
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
            },
            apiCreate: function (oModel, sEntitySet, oRow) {
                var aReturn = {
                    returnStatus: false,
                    data: []
                };
                var that = this;
                return new Promise(function (resolve, reject) {
                    oModel.create(sEntitySet, oRow, {
                        success: function (oData) {
                            //debugger;
                            aReturn.returnStatus = true;
                            if (oData.results) {
                                aReturn.data = oData.results;
                            } else {
                                aReturn.data = oData;
                            }
                            resolve(aReturn.data);
                        },
                        error: function (e) {
                            //debugger;
                            that.oGlobalBusyDialog.close();
                            aReturn.returnStatus = false;
                            reject(e);
                        }
                    });
                });
            },
            onAddSimpleRow: function () {
                this.oGlobalBusyDialog.open();
                let sPath = this.getView().getModel().createEntry("/MovmentsMaster").getPath();
                this._createSimpleDialog(sPath);
            },
            _createSimpleDialog: function (sPath) {
                this.getView().getModel().setDefaultBindingMode("TwoWay");
                let ns = this.getOwnerComponent().getMetadata().getRootView().viewName.split("."),
                    namespace = ns[0] + "." + ns[1] + "." + ns[2],
                    oView = this.getView();
                if (!this.oDialog) {
                    this.oDialog = Fragment.load({
                        id: oView.getId(),
                        name: namespace + ".view.Simple",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        this.byId("idSmartForm").bindElement(sPath);
                        return oDialog;
                    }.bind(this));
                }
                this.oDialog.then(function (oDialog) {
                    oDialog.open();
                });

            },
            onDialogAfterOpen: function () {
                this.oGlobalBusyDialog.close();
            },
            onSimpleSave: async function () {
                let nErrori = this.byId("idSmartForm").check().length;
                if (nErrori === 0) {
                    let sData = (new Date(this.byId("idFieldAccountingDate").getContent().getDateValue()));
                    sData.setHours(sData.getHours() - sData.getTimezoneOffset() / 60);
                    let oRow = {
                        "Account_IdAccount": this.byId("idFieldPosizione").getValue(),
                        "AccountingDate": sData.toISOString().split('T')[0],
                        "VATRate": this.byId("idFieldVATRate").getValue() ? this.ParseNumero(this.byId("idFieldVATRate").getValue()) : this.byId("idFieldVATRate").getValue(),
                        "ImportoLordo": this.ParseNumero(this.byId("idFieldImportoLordo").getValue()),
                    };
                    this.getView().getModel().create("/MovmentsMaster", oRow, {
                        success: () => {
                            sap.m.MessageToast.show("Salvato");
                            this.byId("idSmartForm").unbindElement();
                            this.getView().getModel().resetChanges();
                            this.byId("newDialog").close();
                            this.getView().getModel().refresh();
                        }, error: () => {
                            sap.m.MessageBox.show("Errore, riprovare");
                        }
                    });
                } else {
                    sap.m.MessageToast.show("Compile all mandatory fields");
                }
            },
            onAfterCloseDialog: function () {
                this.getView().getModel().refresh();
                this.byId("newDialog").destroy();
                this.oDialog = null;
            },
            onSimpleClose: function () {
                this.byId("idSmartForm").unbindElement();
                this.getView().getModel().resetChanges();
                this.byId("newDialog").close();
            },
            onAddWizardRow: function () {
                this.oGlobalBusyDialog.open();
                let sPath = this.getView().getModel().createEntry("/MovmentsMaster").getPath();
                this._createWizardDialog(sPath);
            },
            _createWizardDialog: function (sPath) {
                this.getView().getModel().setDefaultBindingMode("TwoWay");
                let ns = this.getOwnerComponent().getMetadata().getRootView().viewName.split("."),
                    namespace = ns[0] + "." + ns[1] + "." + ns[2],
                    oView = this.getView();
                if (!this.oDialog) {
                    this.oDialog = Fragment.load({
                        id: oView.getId(),
                        name: namespace + ".view.Wizard",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        this.byId("CreateWizard").bindElement(sPath);
                        return oDialog;
                    }.bind(this));
                }
                this.oDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },
            disableNavigationBar: function () {
                this.getView().byId("CreateWizard").mAggregations._progressNavigator.ontap = function () { };
            },
            onNextStep: async function () {
                let nStep = this.byId("CreateWizard").getProgress();
                switch (nStep) {
                    case 1:
                        this.disableNavigationBar();
                        let nErrorifirst = this.byId("ObligatoryForm").check().length;
                        if (nErrorifirst === 0) {
                            this.getView().byId("CreateWizard").nextStep();
                        }
                        else {
                            MessageToast.show("Please fill the fields with correct values!");
                        }
                        break;
                    case 2:
                        let nErrorisecond = this.byId("SecondForm").check().length;
                        if (nErrorisecond === 0) {
                            this.getView().byId("CreateWizard").nextStep();
                        }
                        else {
                            MessageToast.show("Please fill the fields with correct values!");
                        }
                        break;
                }
            },
            onBack: async function () {
                this.getView().byId("CreateWizard").previousStep();
            },
            onSave: async function () {
                let that = this;
                let nErrorilast = this.byId("LastForm").check().length;
                let oModel = this.getView().getModel();
                let successCreate;
                let successGet;

                if (nErrorilast === 0) {
                    let sData = (new Date(this.byId("idFieldAccountingDate").getContent().getDateValue()));
                    sData.setHours(sData.getHours() - sData.getTimezoneOffset() / 60);
                    let oRow = {
                        "Account_IdAccount": this.byId("idFieldPosizione").getValue(),
                        "AccountingDate": sData.toISOString().split('T')[0],
                        "ImportoLordo": this.ParseNumero(this.byId("idFieldImportoLordo").getValue()),
                    };
                    successCreate = await this.apiCreate(oModel, "/MovmentsMaster", oRow).catch((e) => successCreate = false);
                    if (successCreate) {
                        sap.m.MessageToast.show("Salvato");
                        this.byId("CreateWizard").unbindElement();
                        this.getView().getModel().resetChanges();
                        this.byId("newDialog").close();
                        this.getView().getModel().refresh();
                    } else {
                        sap.m.MessageBox.show("Error during creation of movment, retry");
                    }
                }
            },
            callVATRateService: function (oRow) {
                return new Promise((resolve, reject) => {
                    let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id"),
                        appPath = appId.replaceAll(".", "/"),
                        appModulePath = jQuery.sap.getModulePath(appPath);
                    $.ajax({
                        url: appModulePath + "/v4/app-movimentazioni-manuali/VATRate(Posizione='" + oRow.Posizione + "',TipoDiritto='" + oRow.TipoDiritto + "')",
                        method: "GET",
                        success: (oData) => {
                            if (oData.value.message.includes("Errore")) {
                                reject(oRow);
                            } else {
                                oRow.VATRate = oData.value;
                                oRow.VATRate.CodiceRitenuta = oData.value.CausaleRitenuta.substring(0, 3)
                                resolve(true);
                            }
                        }, error: () => {
                            reject(oRow);
                        }
                    });
                });
            },
            onWizardClose: function () {
                this.byId("CreateWizard").unbindElement();
                this.getView().getModel().resetChanges();
                this.byId("newDialog").close();
            },
            ParseNumero: function (valor) {
                var decimalSeparator = 1.1,
                    sLanguage = sap.ui.getCore().getConfiguration().getLanguage();
                decimalSeparator = decimalSeparator.toLocaleString(sLanguage).substring(1, 2);
                var pattern = "([" + decimalSeparator + "])(?=.*\\1)";
                var formatted = valor.replace(new RegExp(pattern, "g"), "");
                formatted = formatted.replace(new RegExp("[^0-9" + decimalSeparator + "]", "g"), '');
                return Number(formatted.replace(decimalSeparator, "."));
            }
        });
    });
