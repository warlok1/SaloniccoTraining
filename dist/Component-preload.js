//@ui5-bundle btp/academy/easyapp/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"btp/academy/easyapp/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","btp/academy/easyapp/model/models"],function(e,t,i){"use strict";return e.extend("btp.academy.easyapp.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"btp/academy/easyapp/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("btp.academy.easyapp.controller.App",{onInit(){}})});
},
	"btp/academy/easyapp/controller/Main.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/Fragment","sap/ui/model/FilterOperator","sap/ui/model/Filter","sap/m/MessageToast"],function(e,t,i,o,a){"use strict";return e.extend("btp.academy.easyapp.controller.Main",{onInit:function(){this.oDialog=null;this.oGlobalBusyDialog=new sap.m.BusyDialog},apiCreate:function(e,t,i){var o={returnStatus:false,data:[]};var a=this;return new Promise(function(s,n){e.create(t,i,{success:function(e){o.returnStatus=true;if(e.results){o.data=e.results}else{o.data=e}s(o.data)},error:function(e){a.oGlobalBusyDialog.close();o.returnStatus=false;n(e)}})})},onAddSimpleRow:function(){this.oGlobalBusyDialog.open();let e=this.getView().getModel().createEntry("/MovmentsMaster").getPath();this._createSimpleDialog(e)},_createSimpleDialog:function(e){this.getView().getModel().setDefaultBindingMode("TwoWay");let i=this.getOwnerComponent().getMetadata().getRootView().viewName.split("."),o=i[0]+"."+i[1]+"."+i[2],a=this.getView();if(!this.oDialog){this.oDialog=t.load({id:a.getId(),name:o+".view.Simple",controller:this}).then(function(t){a.addDependent(t);this.byId("idSmartForm").bindElement(e);return t}.bind(this))}this.oDialog.then(function(e){e.open()})},onDialogAfterOpen:function(){this.oGlobalBusyDialog.close()},onSimpleSave:async function(){let e=this.byId("idSmartForm").check().length;if(e===0){let e=new Date(this.byId("idFieldAccountingDate").getContent().getDateValue());e.setHours(e.getHours()-e.getTimezoneOffset()/60);let t={Account_IdAccount:this.byId("idFieldPosizione").getValue(),AccountingDate:e.toISOString().split("T")[0],VATRate:this.byId("idFieldVATRate").getValue()?this.ParseNumero(this.byId("idFieldVATRate").getValue()):this.byId("idFieldVATRate").getValue(),ImportoLordo:this.ParseNumero(this.byId("idFieldImportoLordo").getValue())};this.getView().getModel().create("/MovmentsMaster",t,{success:()=>{sap.m.MessageToast.show("Salvato");this.byId("idSmartForm").unbindElement();this.getView().getModel().resetChanges();this.byId("newDialog").close();this.getView().getModel().refresh()},error:()=>{sap.m.MessageBox.show("Errore, riprovare")}})}else{sap.m.MessageToast.show("Compile all mandatory fields")}},onAfterCloseDialog:function(){this.getView().getModel().refresh();this.byId("newDialog").destroy();this.oDialog=null},onSimpleClose:function(){this.byId("idSmartForm").unbindElement();this.getView().getModel().resetChanges();this.byId("newDialog").close()},onAddWizardRow:function(){this.oGlobalBusyDialog.open();let e=this.getView().getModel().createEntry("/MovmentsMaster").getPath();this._createWizardDialog(e)},_createWizardDialog:function(e){this.getView().getModel().setDefaultBindingMode("TwoWay");let i=this.getOwnerComponent().getMetadata().getRootView().viewName.split("."),o=i[0]+"."+i[1]+"."+i[2],a=this.getView();if(!this.oDialog){this.oDialog=t.load({id:a.getId(),name:o+".view.Wizard",controller:this}).then(function(t){a.addDependent(t);this.byId("CreateWizard").bindElement(e);return t}.bind(this))}this.oDialog.then(function(e){e.open()})},disableNavigationBar:function(){this.getView().byId("CreateWizard").mAggregations._progressNavigator.ontap=function(){}},onNextStep:async function(){let e=this.byId("CreateWizard").getProgress();switch(e){case 1:this.disableNavigationBar();let e=this.byId("ObligatoryForm").check().length;if(e===0){this.getView().byId("CreateWizard").nextStep()}else{a.show("Please fill the fields with correct values!")}break;case 2:let t=this.byId("SecondForm").check().length;if(t===0){this.getView().byId("CreateWizard").nextStep()}else{a.show("Please fill the fields with correct values!")}break}},onBack:async function(){this.getView().byId("CreateWizard").previousStep()},onSave:async function(){let e=this;let t=this.byId("LastForm").check().length;let i=this.getView().getModel();let o;let a;if(t===0){let e=new Date(this.byId("idFieldAccountingDate").getContent().getDateValue());e.setHours(e.getHours()-e.getTimezoneOffset()/60);let t={Account_IdAccount:this.byId("idFieldPosizione").getValue(),AccountingDate:e.toISOString().split("T")[0],ImportoLordo:this.ParseNumero(this.byId("idFieldImportoLordo").getValue())};o=await this.apiCreate(i,"/MovmentsMaster",t).catch(e=>o=false);if(o){sap.m.MessageToast.show("Salvato");this.byId("CreateWizard").unbindElement();this.getView().getModel().resetChanges();this.byId("newDialog").close();this.getView().getModel().refresh()}else{sap.m.MessageBox.show("Error during creation of movment, retry")}}},callVATRateService:function(e){return new Promise((t,i)=>{let o=this.getOwnerComponent().getManifestEntry("/sap.app/id"),a=o.replaceAll(".","/"),s=jQuery.sap.getModulePath(a);$.ajax({url:s+"/v4/app-movimentazioni-manuali/VATRate(Posizione='"+e.Posizione+"',TipoDiritto='"+e.TipoDiritto+"')",method:"GET",success:o=>{if(o.value.message.includes("Errore")){i(e)}else{e.VATRate=o.value;e.VATRate.CodiceRitenuta=o.value.CausaleRitenuta.substring(0,3);t(true)}},error:()=>{i(e)}})})},onWizardClose:function(){this.byId("CreateWizard").unbindElement();this.getView().getModel().resetChanges();this.byId("newDialog").close()},ParseNumero:function(e){var t=1.1,i=sap.ui.getCore().getConfiguration().getLanguage();t=t.toLocaleString(i).substring(1,2);var o="(["+t+"])(?=.*\\1)";var a=e.replace(new RegExp(o,"g"),"");a=a.replace(new RegExp("[^0-9"+t+"]","g"),"");return Number(a.replace(t,"."))}})});
},
	"btp/academy/easyapp/i18n/i18n.properties":'# This is the resource bundle for btp.academy.easyapp\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=App Title\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=App Title\n\nflpTitle=easyapp\n\nflpSubtitle=\n',
	"btp/academy/easyapp/manifest.json":'{"_version":"1.42.0","sap.app":{"id":"btp.academy.easyapp","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.8.1","toolsId":"5acdcd95-a2e5-4963-8640-fd34b72edbcd"},"dataSources":{"mainService":{"uri":"sflight/","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"2.0"}}},"crossNavigation":{"inbounds":{"btp-academy-easyapp-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"easyapp","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.102.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"btp.academy.easyapp.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"btp.academy.easyapp.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteMain","pattern":":?query:","target":["TargetMain"]}],"targets":{"TargetMain":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Main","viewName":"Main"}}},"rootView":{"viewName":"btp.academy.easyapp.view.App","type":"XML","async":true,"id":"App"}},"sap.cloud":{"public":true,"service":"btp-academy-easyapp"}}',
	"btp/academy/easyapp/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"btp/academy/easyapp/utils/locate-reuse-libs.js":'(function(e){var t=function(e,t){var n=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];Object.keys(e).forEach(function(e){if(!n.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t};var n=function(e){var n="";if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=t(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=t(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=t(e["sap.ui5"].componentUsages,n)}}return n};var r=function(e){var t=e;return new Promise(function(r,a){$.ajax(t).done(function(e){r(n(e))}).fail(function(){a(new Error("Could not fetch manifest at \'"+e))})})};var a=function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}};e.registerComponentDependencyPaths=function(e){return r(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(a)}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");var bundleResources=function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")};sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(bundleResources);if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(bundleResources)}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"btp/academy/easyapp/view/App.view.xml":'<mvc:View controllerName="btp.academy.easyapp.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"></App></mvc:View>\n',
	"btp/academy/easyapp/view/Main.view.xml":'<mvc:View\n    controllerName="btp.academy.easyapp.controller.Main"\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:smartFilterBar="sap.ui.comp.smartfilterbar"\n    xmlns:smartTable="sap.ui.comp.smarttable"\n    xmlns:t="sap.ui.table"\n    xmlns:app="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"\n    xmlns:u="sap.ui.unified"\n    displayBlock="true"\n><Shell id="shell"><App id="app"><pages><Page id="page" title="{i18n>title}"><content><VBox id="_IDGenVBox1" fitContainer="true"><smartFilterBar:SmartFilterBar id="smartFilterBar" entitySet="MovmentsMaster" persistencyKey="SmartFilter_Explored" enableBasicSearch="true"><smartFilterBar:layoutData><FlexItemData id="_IDGenFlexItemData1" shrinkFactor="0" /></smartFilterBar:layoutData></smartFilterBar:SmartFilterBar><smartTable:SmartTable\n                                id="LineItemsSmartTable"\n                                initiallyVisibleFields="ID,Account_IdAccount,AccountingDate,ImportoLordo"\n                                entitySet="MovmentsMaster"\n                                smartFilterId="smartFilterBar"\n                                tableType="Table"\n                                useExportToExcel="true"\n                                useVariantManagement="true"\n                                useTablePersonalisation="true"\n                                header="Movimenti"\n                                showRowCount="true"\n                                persistencyKey="SmartTableAnalytical_Explored"\n                                enableAutoBinding="true"\n                                class="sapUiResponsiveContentPadding sapUiSizeCompact"\n                                editTogglable="false"\n                                app:useSmartField="true"\n                            ><smartTable:customToolbar><OverflowToolbar id="_IDGenOverflowToolbar1"><ToolbarSpacer id="_IDGenToolbarSpacer1" /><OverflowToolbarButton id="_IDGenOverflowToolbarButton1" icon="sap-icon://add" press="onAddSimpleRow" tooltip="Add Simple Row" /><OverflowToolbarButton id="_IDGenOverflowToolbarButton2" icon="sap-icon://add-activity" press="onAddWizardRow" tooltip="Add Wizard Row" /></OverflowToolbar></smartTable:customToolbar><smartTable:layoutData><FlexItemData id="_IDGenFlexItemData2" growFactor="1" baseSize="0%" /></smartTable:layoutData></smartTable:SmartTable></VBox></content></Page></pages></App></Shell></mvc:View>\n',
	"btp/academy/easyapp/view/Simple.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:smartForm="sap.ui.comp.smartform"\n    xmlns:smartField="sap.ui.comp.smartfield"><Dialog id="newDialog" showHeader="false" verticalScrolling="true" afterOpen="onDialogAfterOpen" afterClose="onAfterCloseDialog" contentHeight="90%" contentWidth="80%"><content><smartForm:SmartForm id="idSmartForm" editable="true"><smartForm:Group id="_IDGenGroup1"><smartForm:GroupElement id="_IDGenGroupElement1"><smartField:SmartField id="idFieldPosizione" mandatory="true" value="{Account_IdAccount}" change="onPosizione"/></smartForm:GroupElement><smartForm:GroupElement id="_IDGenGroupElement4"><smartField:SmartField id="idFieldDataContabile" mandatory="true" value="{AccountingDate}"/></smartForm:GroupElement><smartForm:GroupElement id="_IDGenGroupElement14"><smartField:SmartField enabled="true" id="idFieldImportoLordo" value="{ImportoLordo}" uomEditable="false" change="onImportoLordo"/></smartForm:GroupElement></smartForm:Group></smartForm:SmartForm></content><beginButton><Button id="_IDGenButton1" text="Annulla" press="onSimpleClose"/></beginButton><ToolbarSeparator id="_IDGenToolbarSeparator1"/><endButton><Button id="_IDGenButton2" text="Salva" type="Emphasized" press="onSimpleSave"/></endButton></Dialog></core:FragmentDefinition>',
	"btp/academy/easyapp/view/Wizard.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:smartForm="sap.ui.comp.smartform"\n    xmlns:smartField="sap.ui.comp.smartfield"\n    xmlns:form="sap.ui.layout.form"\n    xmlns:u="sap.ui.unified"\n    xmlns:f="sap.f"\n    xmlns:layout="sap.ui.layout"><Dialog id="newDialog" showHeader="false" verticalScrolling="true" afterOpen="onDialogAfterOpen" afterClose="onAfterCloseDialog" contentHeight="70%" contentWidth="60%"><NavContainer id="wizardNavContainer"><f:DynamicPage id="_IDGenDynamicPage1" stickySubheaderProvider="AggiungiRigaWizard" toggleHeaderOnTitleClick="false" class="sapUiNoContentPadding" showFooter="false"><f:title><f:DynamicPageTitle id="_IDGenDynamicPageTitle1"><f:heading><Title id="_IDGenTitle1" text="Aggiungi Riga"/></f:heading></f:DynamicPageTitle></f:title><f:content><Wizard id="CreateWizard" class="sapUiResponsivePadding--header sapUiResponsivePadding--content" complete="wizardCompletedHandler" enableBranching="true" showNextButton="false" renderMode="Page"><WizardStep id="ObligatoryFieldsStep" title="Campi Obbligatori" subsequentSteps= "SecondStep"><smartForm:SmartForm id="ObligatoryForm" editable="true"><smartForm:Group id="_IDGenGroup1"><smartForm:GroupElement id="_IDGenGroupElement1"><smartField:SmartField id="idFieldPosizione" mandatory="true" value="{Account_IdAccount}"/></smartForm:GroupElement></smartForm:Group></smartForm:SmartForm><FlexBox id="_IDGenFlexBox1" alignItems="Start" justifyContent="SpaceBetween"><Button id="_IDGenButton1" text="Annulla" press="onWizardClose"/><Button id="FirstNextStep" text="Avanti" press="onNextStep" type="Emphasized" enabled="true" /></FlexBox></WizardStep><WizardStep id="SecondStep" validated="false" activate="ThirdStepActivation" title="Ripartizione" subsequentSteps= "LastStep"><smartForm:SmartForm id="SecondForm" editable="true"><smartForm:Group id="_IDGenGroup2"><smartForm:GroupElement id="_IDGenGroupElement2"><smartField:SmartField id="idFieldAccountingDate" mandatory="true" value="{AccountingDate}"/></smartForm:GroupElement></smartForm:Group></smartForm:SmartForm><FlexBox id="_IDGenFlexBox2" alignItems="Start" justifyContent="SpaceBetween"><FlexBox id="_IDGenFlexBox3" alignItems="Start" justifyContent="Start"><Button id="ThirdBackStep" text="Indietro" press="onBack" type="Emphasized" enabled="true" /><Button id="_IDGenButton2" text="Annulla" press="onWizardClose"/></FlexBox><Button id="ThirdNextStep" text="Avanti" press="onNextStep" type="Emphasized" enabled="true" /></FlexBox></WizardStep><WizardStep id="LastStep" validated="false" activate="LastStepActivation" title="Importi"><smartForm:SmartForm id="LastForm" editable="true"><smartForm:Group id="_IDGenGroup3"><smartForm:GroupElement id="_IDGenGroupElement3"><smartField:SmartField enabled="true" id="idFieldVATRate" value="{VATRate}" uomEditable="false"/></smartForm:GroupElement><smartForm:GroupElement id="_IDGenGroupElement4"><smartField:SmartField enabled="true" id="idFieldImportoLordo" value="{ImportoLordo}" uomEditable="false"/></smartForm:GroupElement></smartForm:Group></smartForm:SmartForm><FlexBox id="_IDGenFlexBox4" alignItems="Start" justifyContent="SpaceBetween"><FlexBox id="_IDGenFlexBox5" alignItems="Start" justifyContent="Start"><Button id="LastBackStep" text="Indietro" press="onBack" type="Emphasized" enabled="true" /><Button id="_IDGenButton3" text="Annulla" press="onWizardClose"/></FlexBox><Button id="_IDGenButton4" text="Salva" type="Emphasized" press="onSave" /></FlexBox></WizardStep></Wizard></f:content></f:DynamicPage></NavContainer></Dialog></core:FragmentDefinition>'
}});
