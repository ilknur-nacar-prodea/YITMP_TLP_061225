sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";
	var userData = {},
		sicil;
	var oModel, oUserData;
	return Controller.extend("app.YITMP_TLP.controller.login", {

		onInit: function () {
			debugger;
			this.getOwnerComponent().getRouter().getRoute("login").attachMatched(this._onRouteMatched, this);
			// userData.Username = sap.ushell.Container.getService("UserInfo").getId();//com
			// userData.Username = "XILKNURN";//com
			// userData.Username = "ILKNURN";//com
			// userData.Username = "SIMGEG_PY";//com
			// userData.Username = "SIMGEG_CUST";//com
			// userData.Username = "CIGDEMB";//com

			var y = "/sap/bc/ui2/start_up";

			var xmlHttp = null;
			xmlHttp = new XMLHttpRequest();
			xmlHttp.onreadystatechange = function () {
				if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
					oUserData = JSON.parse(xmlHttp.responseText);
					//	console.log(oUserData);
					//	console.log(oUserData.id);
					sicil = oUserData.id;
					// sicil = "SIMGE_PY"; //com
				}
			};
			xmlHttp.open("GET", y, false);
			xmlHttp.send(null);
			oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/sap/bc/ui2/start_up");
			// sicil = "SIMGEG_PY" //com
			// pass = "Prodea2021";
			// sicil = "ILKNURN"//com
			// sicil = "SIMGEG_PY";//com
			// sicil = "SIMGEG_CUST";//com
			// sicil = "CIGDEMB";//com
			// var pass = "TEST";
			var pass;
			// pass = "Prodea2024.";
			// pass = "Prodea12**";
			// pass = "Sap12**";
			this.GetKontrol(sicil, pass);
		},
		_onRouteMatched: function (oEvent) {

		},
		onLogon: function () {
			var sicil = this.byId("idUser").getValue().toUpperCase();
			var pass = this.byId("isPass").getValue().toUpperCase();
			this.GetKontrol(sicil, pass);

		},
		GetKontrol: function (sicil, pass) {
			var that = this;
			var oDataModel = this.getOwnerComponent().getModel();
			sap.ui.core.BusyIndicator.show();
			oDataModel.read("/UserAuthSet(IUser='" + sicil + "',IPassword='" + pass + "')", {
				success: function (data, response) {
					var Return = data.EReturn.split("-")[1];
					var Role = data.ERole;
					var Userdesc = data.EUserdesc;
					var company = data.ECompany;
					var companyd = data.ECompanyd;
					if (data.EReturn.split("-")[0] === "S") {
						that.getOwnerComponent().getRouter().navTo("MasterDetail", {
							sicil: sicil,
							role: Role,
							userdesc: Userdesc,
							company: company,
							companyd: companyd
						});
					} else {
						MessageBox.warning(Return);
					}
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (data, response) {
					sap.m.MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçiniz.");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		}

	});

});