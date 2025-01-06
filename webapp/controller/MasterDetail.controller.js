sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "../model/formatter",
  "sap/ui/core/format/NumberFormat",
  'sap/ui/core/Fragment',
  'sap/ui/model/Filter',
  'sap/m/Token',
  'sap/ui/model/FilterOperator',
  'sap/m/library',
  'sap/ui/export/library',
  'sap/ui/export/Spreadsheet',
  "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, formatter, NumberFormat, Fragment, Filter, Token, FilterOperator, mobileLibrary,
  exportLibrary, Spreadsheet, MessageToast) {
  "use strict";
  var FormItem = [],
    TalepTipiBilgileri = [],
    OncelikBilgileri = [],
    ModulBilgileri = [],
    CompanyBilgileri = [],
    DepartmanBilgileri = [],
    tablemaster = [],
    tableStatu = [],
    tabledetail = [],
    tableproje = [],
    tabletiket = [],
    talepeden1 = [],
    tableDocShow = [],
    tableDocShow2 = [],
    talepMsg = [],
    siciller = [],
    StatuBilgileri = [],
    StatuBilgilerifilter = [],
    tableCallCenter = [];
  var sicilMulti = [];
  var izindandegis;
  var dandegis;
  var isatama;
  var moduleMulti = [];
  var sicil, userdesc, role, company, companyd, IstekNo, ekleneceksicil = "";
  var uniqeGuid = "";
  var oView;
  var isprojedegaday;
  var isprojedeg;
  var isstatudeg;
  var valueFeed = "";
  var DanDeg = "";
  var chatIndex = "";
  var indexradio = "";
  var URLHelper = mobileLibrary.URLHelper;
  var EdmType = exportLibrary.EdmType;
  return Controller.extend("app.YITMP_TLP.controller.MasterDetail", {

    onInit: function () {
      this.getOwnerComponent().getRouter().getRoute("MasterDetail").attachMatched(this._onRouteMatched, this);
      var oViewModel;
      oViewModel = new JSONModel({});
      this.getView().setModel(oViewModel, "InputModel");
      this.onInit2();

    },
    onInit2: function () {
      debugger;
      this.getOwnerComponent().getRouter().getRoute("MasterDetail").attachMatched(this._onRouteMatched2, this);
      var oViewModel;
      oViewModel = new JSONModel({});
      this.getView().setModel(oViewModel, "FormModel");
      this.getView().setModel(oViewModel, "InputModel");
    },
    _handleLogout1: function (oEvent) {
      window.location.href = "/sap/public/bc/icf/logoff";
    },
    _handleLogout: function (oEvent) {
      debugger;
      $.ajax({
        type: "GET",
        url: "/sap/public/bc/icf/logoff", //Clear SSO cookies: SAP Provided service to do that  
      }).done(function (data) { //Now clear the authentication header stored in the browser  
        if (!document.execCommand("ClearAuthenticationCache")) {
          //"ClearAuthenticationCache" will work only for IE. Below code for other browsers  
          $.ajax({
            type: "GET",
            url: "/sap/public/bc/icf/logoff", //any URL to a Gateway service  
            username: '', //dummy credentials: when request fails, will clear the authentication header  
            password: '',
            statusCode: {
              401: function () {
                //This empty handler function will prevent authentication pop-up in chrome/firefox  
              }
            },
            error: function () {
              //alert('reached error of wrong username password')  
            }
          });
        }
      });
      /*  var myVar = setInterval(function (oEvent) {
          window.location.replace("/sap/bc/ui5_ui5/sap/yitmp_istek/index.html");
        }, 100);*/
    },
      formatNextstatu: function (type) {
      if (type == "01")
        return "Yeni İstek Yaratıldı";
      else if (type == "02")
        return "Efor Bekleniyor";
      else if (type == "03")
        return "Atama Bekleniyor";
      else if (type == "04")
        return "Analiz";
      else if (type == "05")
        return "Yapılıyor";
      else if (type == "06")
        return "Test";
      else if (type == "07")
        return "Müşteri Onayı Bekleniyor";
          else if (type == "08")
        return "Müşteri Revize Talebi";
      else if (type == "09")
        return "İstek Reddedildi";
      else if (type == "10")
        return "Tamamlandı";
      else if (type == "20")
        return "TS Doküman Hazırlığı";
      else if (type == "21")
        return "Modül Uyarlama";
        else if (type == "22")
        return "Kod Geliştirme";
      else if (type == "30")
        return "Danışman Testi";
        else if (type == "31")
        return "Kullanıcı Testi";
      else
        return "None";
    },
    _onRouteMatched: function (oEvent) {
      sicil = oEvent.getParameter("arguments").sicil;
      userdesc = oEvent.getParameter("arguments").userdesc;
      role = oEvent.getParameter("arguments").role;
      company = oEvent.getParameter("arguments").company;
      companyd = oEvent.getParameter("arguments").companyd;
      // this.getView().getModel("InputModel").setProperty("/InputModelEdit", true);
      this.getView().getModel("InputModel").setProperty("/Role", role);
      // this.getView().getModel("InputModel").setProperty("/InputModelEdit1", false);
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled", false);
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabledEforOnay", false);
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled1Tm", false);
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled1Red", false);
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled2", false);
      this.getView().getModel("InputModel").setProperty("/ButtonsV", false);

      // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled3", false);
      // this.getView().getModel("InputModel").setProperty("/InputModelVisible", false);
      this.GetMasterList();
      this.getDomain("YITMP_DM_REQUISITIONTYPE");
      this.getDomain("YITMP_DM_PRIORITY");
      this.getDomain("YITMP_DM_MODULE");
      this.getDomain("YITMP_DM_ROLE");
      this.getDomain("YITMP_DM_STATU");
      this.getDomain("YITMP_DM_COMPANY");
      tableDocShow = [];
      this.bindView2();
      this.getView().byId("idIconTabBar").setSelectedKey("IList");
      debugger;
      if (role === "20") {
        // this.getView().getModel("InputModel").setProperty("/InputModelEdit1", true);
      }
      if (role === "01" || role === "09" || role === "02" || role === "90") {
        this.GetAuthorizationObjects();

        this.getView().getModel("InputModel").setProperty("/ButtonV", true);

        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);

        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit7", false);
        this.getView().getModel("InputModel").setProperty("/ButtonsV", false);
        // this.byId("inpCompany1").setVisible(false);

      } else {

        // this.byId("inpCompany1").setVisible(true);
        this.getView().getModel("InputModel").setProperty("/ButtonV", false);

        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit7", true);
        this.getView().getModel("InputModel").setProperty("/ButtonsV", false);

      }

    },
    GetMasterList: function (Modulmulti, ctrl) {
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();

      tablemaster = [];
      var filters = [];
      filters.push(new sap.ui.model.Filter("IvUname", sap.ui.model.FilterOperator.EQ, sicil));

      debugger;
      oDataModel.read("/GetTable3Set", {
        success: mySuccessHandler,
        filters: filters,
        error: myErrorHandler
      });

      function mySuccessHandler(data, response) {

        tablemaster = data.results;
        that.bindView();
        // sap.ui.core.BusyIndicator.hide();
      }

      function myErrorHandler(data, response) {
        sap.m.MessageBox.error("Veri Bulunamadı.");
        sap.ui.core.BusyIndicator.hide();
      }
    },
    GetAuthorizationObjects: function () {
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();

      var authorizationList = [];
      oDataModel.read("/AuthorizationObjSet", {
        success: mySuccessHandler,
        error: myErrorHandler
      });

      function mySuccessHandler(data, response) {
        authorizationList = data.results;
        var err;
        data.results.forEach(function (m) {
          try {
            that.getView().byId(m.UiField).setVisible(m.Visible);
            that.getView().byId(m.UiField).setEnabled(m.Visible);
          } catch (err) {}
        });
      }

      function myErrorHandler(data, response) {
        sap.m.MessageBox.error(response.responseText);
      }

    },
    RefreshMasterList: function (Modulmulti, ctrl, IstekNo) {
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();

      tablemaster = [];
      var filters = [];
      filters.push(new sap.ui.model.Filter("IvUname", sap.ui.model.FilterOperator.EQ, sicil));

      sap.ui.core.BusyIndicator.show();
      oDataModel.read("/GetTable3Set", {
        success: mySuccessHandler,
        filters: filters,
        error: myErrorHandler
      });

      function mySuccessHandler(data, response) {

        tablemaster = data.results;
        that.bindView();
        sap.ui.core.BusyIndicator.hide();
        that.onSelectionChange("", IstekNo);
      }

      function myErrorHandler(data, response) {
        sap.m.MessageBox.error("Veri Bulunamadı.");
        sap.ui.core.BusyIndicator.hide();
      }
    },
    GetProje: function () {
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();
      var filters = [];
      filters.push(new sap.ui.model.Filter("Musteri", sap.ui.model.FilterOperator.EQ, tabledetail[0].Company));
      tableproje = [];
      sap.ui.core.BusyIndicator.show();
      oDataModel.read("/GetProjeZAKTSet", {
        success: mySuccessHandler,
        filters: filters,
        error: myErrorHandler
      });

      function mySuccessHandler(data, response) {
        tableproje = data.results;
        that.bindView();
        sap.ui.core.BusyIndicator.hide();
      }

      function myErrorHandler(data, response) {
        sap.m.MessageBox.error("Veri Bulunamadı.");
        sap.ui.core.BusyIndicator.hide();
      }
    },
    onProje: function (oEvent) {
      /*  var Projead = oEvent.getParameters().selectedItem.mProperties.text.split("-")[0];
        var Modul = oEvent.getParameters().selectedItem.mProperties.text.split("-")[1];*/
      //  this.GetTiket(Projead, Modul);
      if (isprojedegaday === "X") {
        isprojedeg = "X";
      }
      tabledetail[0].Proje = oEvent.getParameters().selectedItem.mProperties.text;
      this.bindView();
    },
    onTalepTip: function (oEvent) {
      tabledetail[0].Requisitiontype = oEvent.getParameters().selectedItem.mProperties.key;
      this.bindView();
    },
    onDStatu: function (oEvent) {
      debugger;
      isstatudeg = "X";
      tabledetail[0].Statu = oEvent.getParameters().selectedItem.mProperties.key;
      this.bindView();
    },
    onTiket: function (oEvent) {
      var Actticket = oEvent.getParameters().selectedItem.mProperties.text.split("-")[1];
      tabledetail[0].Actticket = Actticket;
      this.bindView();
    },
    GetTiket: function (Projead, Modul) {
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();
      var filters = [];
      filters.push(new sap.ui.model.Filter("Musteri", sap.ui.model.FilterOperator.EQ, tabledetail[0].Company));
      filters.push(new sap.ui.model.Filter("Proje", sap.ui.model.FilterOperator.EQ, Projead));
      filters.push(new sap.ui.model.Filter("Modul", sap.ui.model.FilterOperator.EQ, Modul));
      tabletiket = [];

      sap.ui.core.BusyIndicator.show();
      oDataModel.read("/GetProjeSet", {
        success: mySuccessHandler,
        filters: filters,
        error: myErrorHandler
      });

      function mySuccessHandler(data, response) {
        tabletiket = data.results;
        that.bindView();
        sap.ui.core.BusyIndicator.hide();
      }

      function myErrorHandler(data, response) {
        sap.m.MessageBox.error("Veri Bulunamadı.");
        sap.ui.core.BusyIndicator.hide();
      }
    },
    parseDate: function (formattedDate) {
      if (formattedDate) {
        if (typeof formattedDate === 'string') {
          // Belirli bir formattaki tarihi ayrıştırmak için Intl.DateTimeFormat kullanın
          var dateParts = formattedDate.split('.');
          var day = parseInt(dateParts[0], 10);
          var month = parseInt(dateParts[1], 10) - 1; // JavaScript'te ay endeksleri 0'dan başlar
          var year = parseInt(dateParts[2], 10);

          // JavaScript Date nesnesini oluşturun
          var parsedDate = new Date(year, month, day);

          return parsedDate;
        }
      } else {
        return null; // Biçimlendirilmiş tarih yoksa null döndürün
      }
    },

    GetFilter: function () {
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();

      tablemaster = [];
      var filters = [];
      var sKeyIvType = "",
        sKeyIvStatu = "",
        sKeyIvModul = "",
        sKeyIvIstekNo = "",
        sKeyIvCompany = "",
        sKeyIvPriority = "",
        sKeyIvHeader = "",
        sKeyIvDate = "",
        sKeyIvDeadline = "";
         var selectedKeysString;
           selectedKeysString = "";
      if (this.getView().byId("idType").getSelectedItem() !== null) {
        sKeyIvType = this.getView().byId("idType").getSelectedItem().mProperties.key;
      }
      if (this.getView().byId("inpStatu").getSelectedItems().length !== 0) {
          var selectedItems1 = this.getView().byId("inpStatu").getSelectedItems();
        var selectedKeys = selectedItems1.map(function (item) {
          return item.getKey();
        });
         selectedKeysString = selectedKeys.join(",");
      }
      if (this.getView().byId("inpModul").getSelectedItem() !== null) {
        sKeyIvModul = this.getView().byId("inpModul").getSelectedItem().mProperties.key;
      }
      if (this.getView().byId("inpCompany").getSelectedItem() !== null) {
        sKeyIvCompany = this.getView().byId("inpCompany").getSelectedItem().mProperties.key;
      }
      if (this.getView().byId("inpIstekNo").getValue() !== null) {
        sKeyIvIstekNo = this.getView().byId("inpIstekNo").getValue();
      }
      if (this.getView().byId("inpHeader").getValue() !== null) {
        sKeyIvHeader = this.getView().byId("inpHeader").getValue();
      }
      if (this.getView().byId("inpPriority").getSelectedItem() !== null) {
        sKeyIvPriority = this.getView().byId("inpPriority").getSelectedItem().mProperties.key;
      }
      if (this.getView().byId("inpDate").getValue() !== null) {
        sKeyIvDate = this.getView().byId("inpDate").getValue();
      }
      if (this.getView().byId("inpDeadline").getValue() !== null) {
        sKeyIvDeadline = this.getView().byId("inpDeadline").getValue();
      }
      // sKeyIvDate = "07/08/2024";
      // var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
      //  pattern: "yyyy-MM-dd"
      // });
      // sKeyIvDate = oFormat.format(sKeyIvDate);
      // if (sKeyIvDeadline !== "") {
      var sKeyIvDeadline1 = this.parseDate(sKeyIvDeadline);
      // }
      // if (sKeyIvDate !== "") {
      var sKeyIvDate1 = this.parseDate(sKeyIvDate);
      // }
      filters.push(new sap.ui.model.Filter("IvUname", sap.ui.model.FilterOperator.EQ, sicil));
      filters.push(new sap.ui.model.Filter("IvType", sap.ui.model.FilterOperator.EQ, sKeyIvType));
      filters.push(new sap.ui.model.Filter("IvModule", sap.ui.model.FilterOperator.Contains, sKeyIvModul));
      filters.push(new sap.ui.model.Filter("IvCompany", sap.ui.model.FilterOperator.EQ, sKeyIvCompany));
      filters.push(new sap.ui.model.Filter("IvStatus", sap.ui.model.FilterOperator.EQ, selectedKeysString));
      filters.push(new sap.ui.model.Filter("IvReqid", sap.ui.model.FilterOperator.Contains, sKeyIvIstekNo));
      filters.push(new sap.ui.model.Filter("IvPriority", sap.ui.model.FilterOperator.EQ, sKeyIvPriority));
      filters.push(new sap.ui.model.Filter("IvDate", sap.ui.model.FilterOperator.EQ, sKeyIvDate1));
      sap.ui.core.BusyIndicator.show();
      oDataModel.read("/GetTable3Set", {
        success: mySuccessHandler,
        filters: filters,
        error: myErrorHandler
      });

      function mySuccessHandler(data, response) {
        tablemaster = data.results;
        that.bindView();
        sap.ui.core.BusyIndicator.hide();

        // that.getView().byId("idType").setValue("");
        // that.getView().byId("inpStatu").setValue("");
        // that.getView().byId("inpModul").setValue("");
        // that.getView().byId("inpCompany").setValue("");
        // that.getView().byId("inpIstekNo").setValue("");
      }

      function myErrorHandler(data, response) {
        sap.m.MessageBox.error("Veri Bulunamadı.");
        sap.ui.core.BusyIndicator.hide();
      }
    },
    onBeforeRebindTable: function (oEvent) {

      var IvReqid = "",
        binding = oEvent.getParameter("bindingParams"),
        oFilter;
      if (IstekNo !== null) {
        IvReqid = IstekNo
      }
      if (IvReqid !== null) {
        oFilter = new sap.ui.model.Filter("IvReqid", sap.ui.model.FilterOperator.EQ, IvReqid);
        binding.filters.push(oFilter);
      }

    },
    GetHistoryList: function (Modulmulti, ctrl) {
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();

      tableCallCenter = [];
      var filters = [];
      filters.push(new sap.ui.model.Filter("IvReqid", sap.ui.model.FilterOperator.EQ, IstekNo));

      sap.ui.core.BusyIndicator.show();
      oDataModel.read("/GetHistorySet", {
        success: mySuccessHandler,
        filters: filters,
        error: myErrorHandler
      });

      function mySuccessHandler(data, response) {
        tableCallCenter = data.results;
        that.bindView();
        sap.ui.core.BusyIndicator.hide();
      }

      function myErrorHandler(data, response) {
        sap.m.MessageBox.error("Veri Bulunamadı.");
        sap.ui.core.BusyIndicator.hide();
      }
    },
    getDomain: function (ivDomain) {
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();
      var filters = [];
      filters.push(new sap.ui.model.Filter("IvDomain", sap.ui.model.FilterOperator.EQ, ivDomain));

      oDataModel.read("/GetDomainSet", {
        success: mySuccessHandler,
        error: myErrorHandler,
        filters: filters
      });

      function mySuccessHandler(data, response) {
        if (ivDomain === "YITMP_DM_REQUISITIONTYPE") {
          TalepTipiBilgileri = [];
          TalepTipiBilgileri = data.results;
        }
        if (ivDomain === "YITMP_DM_PRIORITY") {
          OncelikBilgileri = []
          OncelikBilgileri = data.results;
        }
        if (ivDomain === "YITMP_DM_MODULE") {
          ModulBilgileri = []
          ModulBilgileri = data.results;
          ModulBilgileri.sort(function (a, b) {
            var nameA = a.DomvalueL.toUpperCase(); // ismin büyük harfli hali
            var nameB = b.DomvalueL.toUpperCase(); // ismin büyük harfli hali
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0; // isimler eşitse
          });
        }
        if (ivDomain === "YITMP_DM_ROLE") {
          DepartmanBilgileri = []
          DepartmanBilgileri = data.results;
        }
        if (ivDomain === "YITMP_DM_COMPANY") {
          CompanyBilgileri = []
          CompanyBilgileri = data.results;
          CompanyBilgileri.sort(function (a, b) {
            var nameA = a.DomvalueL.toUpperCase(); // ismin büyük harfli hali
            var nameB = b.DomvalueL.toUpperCase(); // ismin büyük harfli hali
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0; // isimler eşitse
          });
        }

        if (ivDomain === "YITMP_DM_STATU") {
          debugger;
          StatuBilgileri = [];
          StatuBilgilerifilter = data.results;
          StatuBilgilerifilter.sort(function (a, b) {
            var nameA = a.Ddtext.toUpperCase(); // ismin büyük harfli hali
            var nameB = b.Ddtext.toUpperCase(); // ismin büyük harfli hali
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0; // isimler eşitse
          });
          for (var a = 0; a < data.results.length; a++) {
            // if (data.results[a].DomvalueL === "04" || data.results[a].DomvalueL === "05" || data.results[a].DomvalueL === "06" || data.results[
            //    a].DomvalueL === "20" || data.results[a].DomvalueL === "07" || data.results[a].DomvalueL === "08" ||
            //  data.results[a].DomvalueL ===
            //  "21" || data.results[a].DomvalueL ===
            //  "22" || data.results[a].DomvalueL ===
            //  "30" || data.results[a].DomvalueL === "31" || data.results[a].DomvalueL === "32") {
            StatuBilgileri.push(data.results[a]);
            // }

          }

        }
        that.bindView1();
        sap.ui.core.BusyIndicator.hide();
      }

      function myErrorHandler(response) {
        MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
        sap.ui.core.BusyIndicator.hide();
      }
    },
    bindView1: function () {
      var oModel = new sap.ui.model.json.JSONModel();
      oModel.setData({
        TalepTipiBilgileri: TalepTipiBilgileri,
        OncelikBilgileri: OncelikBilgileri,
        ModulBilgileri: ModulBilgileri,
        CompanyBilgileri: CompanyBilgileri,
        DepartmanBilgileri: DepartmanBilgileri,
        StatuBilgileri: StatuBilgileri,
        StatuBilgilerifilter: StatuBilgilerifilter
      });

      this.getView().setModel(oModel, "oViewBindModel");
      this.getView().getModel("oViewBindModel").refresh(true);
    },
    onSelectionChange: function (oEvent, IstekNo1) {
      // this.byId("Danisman").setValue("");

      // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabledEforOnay", false);
      this.byId("Danisman").destroyTokens();
      isprojedegaday = "";
      isprojedeg = "";
      isstatudeg = "";
      isatama = "";
      dandegis = "";
      izindandegis = "";
      sap.ui.core.BusyIndicator.show();
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();
      debugger;
      tabledetail = [];
      var filters = [];
      talepeden1 = [];
      if (oEvent === "") {
        IstekNo = IstekNo1;
      } else {
        var err;
        try {
          IstekNo = oEvent.getSource().getSelectedItem().getBindingContext("oViewModel").getProperty("Requisitionid");
        } catch (err) {
          IstekNo = oEvent.getSource().getProperty("title").split("İstek No: ")[1];
          // IstekNo = this.getView().getModel("oViewModel").getProperty("/tablemaster")[0].Requisitionid;
          // } finally {
          // IstekNo = oEvent.mParameters.listItem.mProperties.title.split("İstek No: ")[1];
        }
        // IstekNo = this.getView().getModel("oViewModel").getProperty("/tablemaster")[0].Requisitionid;
        // IstekNo = oEvent.mParameters.listItem.mProperties.title.split("İstek No: ")[1];

      }
      var index = tablemaster.findIndex(x => x.Requisitionid === IstekNo);
      delete tablemaster[index].__metadata;
      talepeden1.push(tablemaster[index]);
      this.getView().byId("multiInput").removeAllTokens()
      tableDocShow = [];
      tableDocShow2 = [];
      this.bindView2();
      this.bindView3();
      this.getView().byId("idIconTabBar").setSelectedKey("IList");
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
      // // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit5", false);//commented
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit5", true); //added
      // // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit6", true); //added
      talepMsg = [];
      this.getPost();
      valueFeed = "";
      this.onDocShow2();
      //  this.GetHistory();
      //  TalepTipi = tablemaster[index].TalepTipi;
      debugger;
      if (tablemaster[index].Statu === "01") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled1Red", true);
        // this.getView().getModel("InputModel").setProperty("/InputModelEdit01", true);

      } else {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
        // this.getView().getModel("InputModel").setProperty("/InputModelEdit01", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", true);
      }
      // if ((tablemaster[index].Statu === "01" || tablemaster[index].Statu === "02") && role !== "01") {

      //  this.getView().byId("Oefor").setEditable(true);
      // } else {

      //  this.getView().byId("Oefor").setEditable(false);
      // }
      // if (tablemaster[index].Statu === "10") {

      //  this.getView().byId("Danisman").setEditable(false);
      //  this.getView().byId("DStatu").setEditable(false);
      //  this.getView().byId("Proje").setEditable(false);
      // } else {

      //  this.getView().byId("Danisman").setEditable(true);
      //  this.getView().byId("DStatu").setEditable(true);
      //  this.getView().byId("Proje").setEditable(true);
      // }
      // if (tablemaster[index].Statu === "02") {//added
      //  this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled", true);
      //  this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", true);
      //  this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled1Red", true);
      // } else {
      //  this.getView().getModel("InputModel").setProperty("/ButtonModelEnabledEforOnay", false);
      //  this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
      // }
      // role = "90";
      if (role !== "90") {
        this.getView().byId("TalepTip").setEnabled(false);
        this.getView().byId("Oncelik").setEnabled(false);
        this.getView().byId("header").setEditable(false);
        this.getView().byId("Aciklama").setEditable(false);
        this.getView().byId("dosyayukle").setVisible(false);
        this.getView().byId("PTanim").setEditable(false);
        this.getView().byId("multiInput").setEnabled(false);
        this.getView().byId("Proje").setEnabled(false);
        this.getView().byId("Oefor").setEditable(false);
        this.getView().byId("Termin").setEditable(false);
        this.getView().byId("Danisman").setEditable(false);
        this.getView().byId("DStatu").setEnabled(false);
        this.getView().byId("FormDisplay480_12120Dual4").setVisible(false);
        this.getView().byId("rbg3").setEnabled(false);
        this.getView().byId("radioefor").setVisible(false);
        // this.getView().getModel("InputModel").setProperty("/InputModelVisibleYeni", false);
      }

      if (role === "20") {
        if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "03") {

          this.getView().byId("TalepTip").setEnabled(true);
        } else {

          this.getView().byId("TalepTip").setEnabled(false);
        }
      } else {
        this.getView().byId("TalepTip").setEnabled(false);
      }
      if (role === "20") {
        if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "03" || tablemaster[index].Statu === "08") {

          this.getView().byId("Oncelik").setEnabled(true);
        } else {

          this.getView().byId("Oncelik").setEnabled(false);
        }
      } else {
        this.getView().byId("Oncelik").setEnabled(false);
      }
      if (role === "01" || role === "09") {
        if (tablemaster[index].Statu === "08") {

          this.getView().byId("Aciklama").setEditable(true);
          this.getView().byId("dosyayukle").setVisible(true);
        } else {

          this.getView().byId("Aciklama").setEditable(false);
          this.getView().byId("dosyayukle").setVisible(false);
        }
      } else {
        this.getView().byId("Aciklama").setEditable(false);
        this.getView().byId("dosyayukle").setVisible(false);
      }
      if (role === "20") {
        if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "03") {

          this.getView().byId("PTanim").setEditable(true);
        } else {

          this.getView().byId("PTanim").setEditable(false);
        }
      } else {
        this.getView().byId("PTanim").setEditable(false);
      }
      if (role === "20") {
        if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "02" || tablemaster[index].Statu === "08") {

          this.getView().byId("Oefor").setEditable(true);
        } else {

          this.getView().byId("Oefor").setEditable(false);
        }
      } else {
        this.getView().byId("Oefor").setEditable(false);
      }
      if (role === "20") {
        if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "02" || tablemaster[index].Statu === "08") {

          this.getView().byId("Termin").setEditable(true);
        } else {

          this.getView().byId("Termin").setEditable(false);
        }
      } else {
        this.getView().byId("Termin").setEditable(false);
      }
      if (role === "20") {
        if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "02" || tablemaster[index].Statu === "08" || tablemaster[
            index].Statu === "03") {

          this.getView().byId("multiInput").setEnabled(true);
        } else {

          this.getView().byId("multiInput").setEnabled(false);
        }
      } else {
        this.getView().byId("multiInput").setEnabled(false);
      }
      if (role === "20") {
        if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "02") {

          this.getView().byId("Proje").setEnabled(true);
        } else {

          this.getView().byId("Proje").setEnabled(false);
        }
      } else {
        this.getView().byId("Proje").setEnabled(false);
      }
      if (role === "20") {
        if (tablemaster[index].Statu === "03" || tablemaster[index].Statu === "04" || tablemaster[index].Statu === "08") {

          this.getView().byId("Danisman").setEditable(true);

          // this.getView().getModel("InputModel").setProperty("/InputModelVisibleYeni", true);
        } else {

          this.getView().byId("Danisman").setEditable(false);

          // this.getView().getModel("InputModel").setProperty("/InputModelVisibleYeni", false);
        }
      } else if (role === "12") {
        if (tablemaster[index].Statu === "04") {

          this.getView().byId("Danisman").setEditable(true);

          // this.getView().getModel("InputModel").setProperty("/InputModelVisibleYeni", true);
        } else {

          this.getView().byId("Danisman").setEditable(false);

          // this.getView().getModel("InputModel").setProperty("/InputModelVisibleYeni", false);
        }
      } else {

        this.getView().byId("Danisman").setEditable(false);

        // this.getView().getModel("InputModel").setProperty("/InputModelVisibleYeni", false);
      }
      if (role === "20") {
        if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "08") {

          this.getView().byId("rbg3").setEnabled(true);
          this.getView().byId("radioefor").setVisible(true);
          // this.getView().getModel("InputModel").setProperty("/InputModelVisibleYeni", true);
        } else {

          this.getView().byId("rbg3").setEnabled(false);
          this.getView().byId("radioefor").setVisible(false);
          // this.getView().getModel("InputModel").setProperty("/InputModelVisibleYeni", false);
        }
      } else {
        this.getView().byId("rbg3").setEnabled(false);
        this.getView().byId("radioefor").setVisible(false);

        // this.getView().getModel("InputModel").setProperty("/InputModelVisibleYeni", false);
      }
      if (role === "20" || role === "10" || role === "11" || role === "12") {
        if (tablemaster[index].Statu === "04" || tablemaster[index].Statu === "05" || tablemaster[index].Statu === "06" || tablemaster[
            index].Statu === "07") {

          this.getView().byId("DStatu").setEnabled(true);
          this.getView().byId("FormDisplay480_12120Dual4").setVisible(true);
        } else {

          this.getView().byId("DStatu").setEnabled(false);
          this.getView().byId("FormDisplay480_12120Dual4").setVisible(false);
        }
        if (role === "20" && tablemaster[index].Statu === "08") {
          this.getView().byId("DStatu").setEnabled(true);
          this.getView().byId("FormDisplay480_12120Dual4").setVisible(true);

        }
      } else {

        this.getView().byId("DStatu").setEnabled(false);
        this.getView().byId("FormDisplay480_12120Dual4").setVisible(false);
      }
      if (role === "90") {
        this.getView().byId("TalepTip").setEnabled(true);
        this.getView().byId("Oncelik").setEnabled(true);
        this.getView().byId("header").setEditable(true);
        this.getView().byId("Aciklama").setEditable(true);
        this.getView().byId("dosyayukle").setVisible(true);
        this.getView().byId("PTanim").setEditable(true);
        this.getView().byId("multiInput").setEnabled(true);
        this.getView().byId("Proje").setEnabled(true);
        this.getView().byId("Oefor").setEditable(true);
        this.getView().byId("Termin").setEditable(true);
        this.getView().byId("Danisman").setEditable(true);
        this.getView().byId("FormDisplay480_12120Dual4").setVisible(true);
        this.getView().byId("radioefor").setVisible(true);
        this.getView().byId("rbg3").setEnabled(true);
        this.getView().byId("DStatu").setEnabled(true);

        // this.getView().getModel("InputModel").setProperty("/InputModelVisibleYeni", true);
      }
      if (role !== "90") {
        this.getView().byId("eforGirBtnYeni").setVisible(false);
        this.getView().byId("eforGirBtnYeni").setEnabled(false);

        this.getView().byId("istegiReddetBtnYeni").setVisible(false);
        this.getView().byId("istegiReddetBtnYeni").setEnabled(false);

        this.getView().byId("idKaydetYeni").setVisible(false);
        this.getView().byId("idKaydetYeni").setEnabled(false);

        this.getView().byId("eforOnayBtnYeni").setVisible(false);
        this.getView().byId("eforOnayBtnYeni").setEnabled(false);

        this.getView().byId("revizeBtnYeni").setVisible(false);
        this.getView().byId("revizeBtnYeni").setEnabled(false);

        this.getView().byId("tamamlaBtnYeni").setVisible(false);
        this.getView().byId("tamamlaBtnYeni").setEnabled(false);
      }

      if (role === "20") {
        if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "08") {
          this.getView().byId("eforGirBtnYeni").setVisible(true);
          this.getView().byId("eforGirBtnYeni").setEnabled(true);
        } else {
          this.getView().byId("eforGirBtnYeni").setVisible(false);
          this.getView().byId("eforGirBtnYeni").setEnabled(false);
        }
      } else {
        this.getView().byId("eforGirBtnYeni").setVisible(false);
        this.getView().byId("eforGirBtnYeni").setEnabled(false);
      }

      if (role === "01" || role === "09" ) { //added
        if (tablemaster[index].Statu === "02") {
          this.getView().byId("eforOnayBtnYeni").setVisible(true);
          this.getView().byId("eforOnayBtnYeni").setEnabled(true);
        } else {
          this.getView().byId("eforOnayBtnYeni").setVisible(false);
          this.getView().byId("eforOnayBtnYeni").setEnabled(false);
        }
        if (tablemaster[index].Statu === "07") {
          this.getView().byId("tamamlaBtnYeni").setVisible(true);
          this.getView().byId("tamamlaBtnYeni").setEnabled(true);
          this.getView().byId("revizeBtnYeni").setVisible(true);
          this.getView().byId("revizeBtnYeni").setEnabled(true);
        } else {
          this.getView().byId("tamamlaBtnYeni").setVisible(false);
          this.getView().byId("tamamlaBtnYeni").setEnabled(false);
          this.getView().byId("revizeBtnYeni").setVisible(false);
          this.getView().byId("revizeBtnYeni").setEnabled(false);
        }

      } else {
        this.getView().byId("eforOnayBtnYeni").setVisible(false);
        this.getView().byId("eforOnayBtnYeni").setEnabled(false);

        this.getView().byId("tamamlaBtnYeni").setVisible(false);
        this.getView().byId("tamamlaBtnYeni").setEnabled(false);
        this.getView().byId("revizeBtnYeni").setVisible(false);
        this.getView().byId("revizeBtnYeni").setEnabled(false);
      }

      if (role === "01" || role === "09" || role === "20" ) { //added
        if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "03") {
          this.getView().byId("istegiReddetBtnYeni").setVisible(true);
          this.getView().byId("istegiReddetBtnYeni").setEnabled(true);
        } else if (tablemaster[index].Statu === "02" && (role === "01" || role === "09")) {

          this.getView().byId("istegiReddetBtnYeni").setVisible(true);
          this.getView().byId("istegiReddetBtnYeni").setEnabled(true);
        } else {
          this.getView().byId("istegiReddetBtnYeni").setVisible(false);
          this.getView().byId("istegiReddetBtnYeni").setEnabled(false);
        }

      } else {
        this.getView().byId("istegiReddetBtnYeni").setVisible(false);
        this.getView().byId("istegiReddetBtnYeni").setEnabled(false);
      }

      if (role !== "13") {
        if (role === "01" || role === "02" || role === "09") {
          if (tablemaster[index].Statu === "00" || tablemaster[index].Statu === "01" || tablemaster[index].Statu === "08") {
            this.getView().byId("idKaydetYeni").setVisible(true);
            this.getView().byId("idKaydetYeni").setEnabled(true);

          } else {
            this.getView().byId("idKaydetYeni").setVisible(false);
            this.getView().byId("idKaydetYeni").setEnabled(false);
          }
        } else if (role === "20") {
          if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "02" || tablemaster[index].Statu === "04" || tablemaster[
              index].Statu === "05" || tablemaster[index].Statu === "06" || tablemaster[index].Statu === "07" || tablemaster[index].Statu ===
            "03" || tablemaster[
              index].Statu === "08") {
            this.getView().byId("idKaydetYeni").setVisible(true);
            this.getView().byId("idKaydetYeni").setEnabled(true);

          } else {
            this.getView().byId("idKaydetYeni").setVisible(false);
            this.getView().byId("idKaydetYeni").setEnabled(false);
          }
        } else if (role === "10" || role === "11" || role === "12") {
          if (tablemaster[index].Statu === "04" || tablemaster[index].Statu === "05" || tablemaster[index].Statu === "06" || tablemaster[
              index].Statu === "07") {
            this.getView().byId("idKaydetYeni").setVisible(true);
            this.getView().byId("idKaydetYeni").setEnabled(true);

          } else {
            this.getView().byId("idKaydetYeni").setVisible(false);
            this.getView().byId("idKaydetYeni").setEnabled(false);
          }
        }
      } else {

        this.getView().byId("idKaydetYeni").setVisible(false);
        this.getView().byId("idKaydetYeni").setEnabled(false);
      }
      if (role === "90") {
        this.getView().byId("eforGirBtnYeni").setVisible(true);
        this.getView().byId("eforGirBtnYeni").setEnabled(true);

        this.getView().byId("istegiReddetBtnYeni").setVisible(true);
        this.getView().byId("istegiReddetBtnYeni").setEnabled(true);

        this.getView().byId("idKaydetYeni").setVisible(true);
        this.getView().byId("idKaydetYeni").setEnabled(true);

        this.getView().byId("eforOnayBtnYeni").setVisible(true);
        this.getView().byId("eforOnayBtnYeni").setEnabled(true);

        this.getView().byId("revizeBtnYeni").setVisible(true);
        this.getView().byId("revizeBtnYeni").setEnabled(true);

        this.getView().byId("tamamlaBtnYeni").setVisible(true);
        this.getView().byId("tamamlaBtnYeni").setEnabled(true);
      }

      if (role === "01" || role === "09" || role === "20" || role === "02" ) { //added
        if (tablemaster[index].Statu === "02") {
          // this.getView().byId("eforOnayBtn").setVisible(true);
          // this.getView().byId("eforOnayBtn").setEnabled(true);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", true);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabledEforOnay", true);
        }

      }

      if (tablemaster[index].Statu === "03") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled3", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled1Red", true);
      } else {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled3", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
      }
      if (tablemaster[index].Statu === "04") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled2", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
      } else {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled2", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
      }
      if (tablemaster[index].Statu === "05") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled2", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
      } else {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled2", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
      }
      if (tablemaster[index].Statu === "07") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled1Tm", true);
      } else {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled1Tm", false);
      }
      if ((role === "01" || role === "09") && tablemaster[index].Statu === "31") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled1Tm", true);
      } else {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled1Tm", false);
      }
      if (tablemaster[index].Statu === "10") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled1Red", false);
      } else {

      }
      if (role === "01" || role === "09") {
        if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "02" || tablemaster[index].Statu === "03" || tablemaster[
            index].Statu === "08") {
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabled1Red", true);
          // this.getView().getModel("InputModel").setProperty("/InputModelEdit", true);
        }
      }
      if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "02" ||
        tablemaster[index].Statu === "03" || tablemaster[index].Statu === "04" ||
        tablemaster[index].Statu === "05" || tablemaster[index].Statu === "08" ||
        tablemaster[index].Statu === "21" || tablemaster[index].Statu === "22" ||
        tablemaster[index].Statu === "30"
      ) {
        // izindandegis = "X"
      } else {
        // izindandegis = ""
      }
      if (tablemaster[index].Statu === "01" || tablemaster[index].Statu === "02" ||
        tablemaster[index].Statu === "03" || tablemaster[index].Statu === "04" ||
        tablemaster[index].Statu === "05" || tablemaster[index].Statu === "08" ||
        tablemaster[index].Statu === "21" || tablemaster[index].Statu === "22" ||
        tablemaster[index].Statu === "30" || role === "10" || role === "20"
      ) {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit7", true);

      } else {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit7", false);
      }
      if (role === "20" && tablemaster[index].Statu === "01") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", true);
        // this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
      } else if (role === "20" && tablemaster[index].Statu !== "03") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
        // this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
      } else if (role === "20" && tablemaster[index].Statu === "03") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
        // this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
      } else if (role === "20" && tablemaster[index].Statu === "10") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
        // this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
      } else if (role === "10" && tablemaster[index].Statu === "10") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
        // this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
      } else if (role === "10") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
        // this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
      } else if (role === "01" || role === "09") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
        // this.getView().getModel("InputModel").setProperty("/InputModelVisible", false);
      } else {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
        // this.getView().getModel("InputModel").setProperty("/InputModelVisible", false);
      }
      if (role === "20") {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit6", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", true);
      }
      filters.push(new sap.ui.model.Filter("IvReqid", sap.ui.model.FilterOperator.EQ, IstekNo));
      filters.push(new sap.ui.model.Filter(
        "IvUname", sap.ui.model.FilterOperator.EQ, sicil));

      sap.ui.core.BusyIndicator.show();
      oDataModel.read("/GetTable3Set", {
        success: mySuccessHandler,
        filters: filters,
        error: myErrorHandler
      });

      function mySuccessHandler(data, response) {
        if (data.results[0].Multiconsultant === "" || data.results[0].Multiconsultant === undefined) {
          isatama = "X"
        }
        if (data.results[0].Proje !== "" && data.results[0].Multiconsultant !== undefined) {
          isprojedegaday = "X"
        }
        tabledetail = data.results;
        tabledetail[0].Multiconsultant = tabledetail[0].Multiconsultant.replaceAll('-X', '(Yönetici)');
        tabledetail[0].Multiconsultant = tabledetail[0].Multiconsultant.replaceAll('-', '');
        if (tabledetail[0].Eforonay !== "") {
          // if (tabledetail[0].Eforonay.includes(",")) {
          //  baslangic = baslangic.replace(/\,/g, ",");

          // }
          tabledetail[0].Eforonay = parseFloat(tabledetail[0].Eforonay);
        } else {
          tabledetail[0].Eforonay = 0;
        }
        that.bindView();
        that.GetProje();
        that.GetHistoryList();
        /*  if (data.results[0].Proje !== "") {
            that.GetTiket(data.results[0].Proje.split("-")[0], data.results[0].Proje.split("-")[1]);
          }*/
        sap.ui.core.BusyIndicator.hide();
      }

      function myErrorHandler(data, response) {
        sap.m.MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
        sap.ui.core.BusyIndicator.hide();
      }
      sap.ui.core.BusyIndicator.hide();
      if (role === "01" || role === "09") {
        this.GetAuthorizationObjects();
      }
    },

    test: function (oEvent) {
      var Value = oEvent.getParameter("value");
      valueFeed = Value;
    },

    onOefor: function (oEvent) {
      var Value = oEvent.getParameter("value");
      tabledetail[0].Estimatedeffort1 = Value;
      this.bindView();
    },
    onFefor: function (oEvent) {
      var Value = oEvent.getParameter("value");
      tabledetail[0].Actualeffort1 = Value;
      this.bindView();
    },
    onTefor: function (oEvent) {
      var Value = oEvent.getParameter("value");
      /*  tabledetail[0].Deadline = Value;
        this.bindView();*/
    },
    onEforGir: function (oEvent) {
      var Buttontype = "EGIR";
      this.onButtonSave(Buttontype);
    },
    onEforOnay: function (oEvent) {
      var Buttontype = "EONAY";
      this.onButtonSave(Buttontype);
    },
    onDanDeg: function (oEvent) {
      var Buttontype = "SAVE";
      // var Buttontype = "EATAMA";
      this.onButtonSave(Buttontype);
    },
    onDanAta: function (oEvent) {
      var Buttontype = "EATAMA";
      this.onButtonSave(Buttontype);
    },
    onSave: function (oEvent) {
      var Buttontype = "SAVE";
      this.onButtonSave(Buttontype);
    },
    onSaveProje: function (oEvent) {
      var Buttontype = "PROJEDEG";
      this.onButtonSave(Buttontype);
    },
    onSaveStatu: function (oEvent) {
      var Buttontype = "STATUCHNG";
      this.onButtonSave(Buttontype);
    },
    onChangeIstkTp: function (oEvent) {
      var Buttontype = "REQTYPECHNG";
      this.onButtonSave(Buttontype);
    },
    onTamamla: function (oEvent) {
      var Buttontype = "OK";
      this.onButtonSave(Buttontype);
    },
    onRevize: function (oEvent) {
      var Buttontype = "REVIZE";
      this.onButtonSave(Buttontype);
    },

    onClear: function (oEvent) {
      var that = this;
      that.getView().byId("idType").setValue("");
      that.getView().byId("inpStatu").setValue("");
      that.getView().byId("inpModul").setValue("");
      that.getView().byId("inpCompany").setValue("");
      that.getView().byId("inpIstekNo").setValue("");
    },
    onopenRet: function (oEvent) {
      var Buttontype = "RED";
      this.onButtonSave(Buttontype);
    },

    onButtonSave: function (Buttontype) {
      debugger;
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();
      var IvAeffort, IvConsultant, IvDeadline, IvEeforrt, IvStatu, Onay, IvProje, IvReqType, IvPriority, IvTanim, IvActticket,
        IvConsultantsp = "",
        Module;
      var ctrl = 0;
      var actrl = 0;
      // DanDeg = " ";
      /*if (tabledetail[0].Estimatedeffort === "" || tabledetail[0].Estimatedeffort === "000000" || tabledetail[0].Estimatedeffort ===
        "0") {
        ctrl = 1;
      }*/
      /*  if (tabledetail[0].Actualeffort === "" || tabledetail[0].Actualeffort === "000000" || tabledetail[0].Actualeffort === "0") {
          ctrl = 1;
        }*/
      if (Buttontype !== "SAVE" && (tabledetail[0].Deadline === "" || tabledetail[0].Deadline === "000000" || tabledetail[0].Deadline ===
          "0" || tabledetail[0].Deadline ===
          undefined || tabledetail[0].Deadline === null)) {
        ctrl = 1;
      }
      if (Buttontype === "RED") {
        ctrl = 0;
      }
      if (ctrl === 0) {
        IvAeffort = tabledetail[0].Actualeffort1;
        if (tabledetail[0].Consultantuser === "") {
          IvConsultant = sicil;
        } else {
          IvConsultant = sicil;
          //  IvConsultant = tabledetail[0].Consultantuser;
        }

        if ((tabledetail[0].Statu === "04" || tabledetail[0].Statu === "05" || tabledetail[0].Statu === "06" || tabledetail[0].Statu ===
            "07" || tabledetail[0].Statu ===
            "08" || tabledetail[0].Statu === "20" || tabledetail[0].Statu === "21" || tabledetail[0].Statu === "22" || tabledetail[0].Statu ===
            "30" || tabledetail[0].Statu === "31" || tabledetail[0].Statu === "32") || (Buttontype === "SAVE")) {
          IvStatu = tabledetail[0].Statu;
        } else {
          IvStatu = "01";
        }
        //  IvDeadline = tabledetail[0].Deadline;
        IvEeforrt = tabledetail[0].Estimatedeffort1;
        if (Buttontype === "EGIR") {
          /*  var dt = sap.ui.core.format.DateFormat.getDateTimeInstance({
              pattern: "yyyy-MM-ddThh:mm:ss"
            });
            var splitdate = tabledetail[0].Deadline.split('.');

            var tarih = splitdate[2] + '-' + splitdate[1] + '-' + splitdate[0];
            IvDeadline = dt.format(new Date(tarih));*/
          IvProje = tabledetail[0].Proje;

          IvReqType = this.byId("TalepTip").getSelectedKey()
          IvPriority = this.byId("Oncelik").getSelectedKey();
          IvTanim = tabledetail[0].Tanim;
          IvActticket = tabledetail[0].Actticket;
          IvDeadline = tabledetail[0].Deadline;
          var Onay = this.getView().byId("rbg3").getSelectedIndex();
          Onay = Onay.toString();
          var moduleefor;
          if (that.getView().byId("multiInput").getTokens().length !== 0) {
            tabledetail[0].Modulmulti = "";
            for (var mt = 0; mt < that.getView().byId("multiInput").getTokens().length; mt++) {
              var gun = that.getView().byId("multiInput").getTokens()[mt].mProperties.key;
              if (mt === 0) {
                moduleefor = that.getView().byId("multiInput").getTokens()[mt].mProperties.text.split("-")[1];
                if (moduleefor === undefined) {
                  moduleefor = that.getView().byId("multiInput").getTokens()[mt].mProperties.text;
                  tabledetail[0].Modulmulti = moduleefor;
                } else {
                  moduleefor = moduleefor.split("(")[0];
                  tabledetail[0].Modulmulti = moduleefor + "-" + gun;
                }
              } else {
                moduleefor = that.getView().byId("multiInput").getTokens()[mt].mProperties.text.split("-")[1];
                if (moduleefor === undefined) {
                  moduleefor = that.getView().byId("multiInput").getTokens()[mt].mProperties.text;
                  tabledetail[0].Modulmulti = tabledetail[0].Modulmulti + "," + moduleefor;
                } else {
                  moduleefor = moduleefor.split("(")[0];
                  tabledetail[0].Modulmulti = tabledetail[0].Modulmulti + "," + moduleefor + "-" + gun;
                }

              }
            }
          }
        }
        // if (Buttontype === "PROJEDEG") {
        IvProje = tabledetail[0].Proje;
        // }
        // if (Buttontype === "STATUCHNG") {

        if (role === "20" || role === "10") {
          IvStatu = tabledetail[0].Statu;
        }
        // }
        // if (Buttontype === "SAVE") {
        // IvStatu = tabledetail[0].Statu;
        // }
        // if (Buttontype === "REQTYPECHNG") {
        // if (role === "20") {
        //  IvReqType = this.byId("TalepTip").getSelectedKey()
        // }

        IvReqType = this.byId("TalepTip").getSelectedKey()
        IvPriority = this.byId("Oncelik").getSelectedKey();
        // }
        if (Buttontype === "EONAY") {
          IvDeadline = tabledetail[0].Deadline;
        }
        if (Buttontype === "OK") {
          IvStatu = "10";
        }
        if (Buttontype === "REVIZE") {
          IvStatu = "08";
        }
        if (Buttontype === "RED") {
          IvStatu = "09";
        }
        debugger;
        if ((Buttontype === "EATAMA" || Buttontype === "SAVE") && dandegis === "X") {
          if (sicilMulti.length !== 0) {
            for (var a = 0; a < sicilMulti.length; a++) {
              if (a === 0) {
                IvConsultantsp = sicilMulti[a].Modulmulti + "-" + sicilMulti[a].Yonetici;
                Module = sicilMulti[a].Modulmulti.split("&")[1];
              } else {
                IvConsultantsp = IvConsultantsp + "," + sicilMulti[a].Modulmulti + "-" + sicilMulti[a].Yonetici;
                Module = Module + "," + sicilMulti[a].Modulmulti.split("&")[1];
              }
            }
          } else {
            actrl = 1;
          }
        }
        if ((Buttontype === "EATAMA" || Buttontype === "SAVE") && dandegis === "X") {
          if (isatama === "X") {
            Buttontype = "EATAMA";
          } else {

            Buttontype = "DANDEGIS";
          }
          if (IvConsultantsp === "" && this.byId("Danisman").getValue() !== "") {
            IvConsultantsp = this.byId("Danisman").getValue();
          }
          if (Module === "" && this.byId("multiInput").getValue() !== "") {
            Module = this.byId("multiInput").getValue();
          }
        }
        /*  if (actrl = 1) {
            sap.m.MessageBox.error("Danışman Seçimi Yapınız.");
            break;
          }*/
        sap.m.MessageBox.confirm("İşlemi onaylıyor musunuz?", {
          title: "Onayla",
          initialFocus: sap.m.MessageBox.Action.OK,
          onClose: function (sButton) {
            if (sButton === sap.m.MessageBox.Action.OK) {
              sap.ui.core.BusyIndicator.show();
              var obj = {
                Buttontype: Buttontype,
                IvReqid: IstekNo,
                IvDeadline: IvDeadline,
                IvPriority: IvPriority,
                IvAeffort: IvAeffort,
                IvEeforrt: IvEeforrt,
                IvStatu: IvStatu,
                IvConsultant: IvConsultant,
                IvOnay: Onay,
                IvModul: tabledetail[0].Modulmulti,
                IvProje: IvProje,
                IvReqtype: IvReqType,
                IvActticket: IvActticket,
                IvConsultantsp: IvConsultantsp,
                IvIsStatuDeg: isstatudeg,
                IvIsProjeDeg: isprojedeg,
                IvTanim: IvTanim
              };
              oDataModel.create("/Update2Set", obj, {
                success: mySuccessHandler,
                error: myErrorHandler
              });

              function mySuccessHandler(data, response) {
                debugger;

                // that.onSelectionChange("", IstekNo);
                sap.m.MessageBox.success("Kayıt Edildi.");
                // that.byId("Danisman").destroyTokens();
                // that.byId("multiInput").destroyTokens();
                // that.byId("Danisman").setValue(IvConsultantsp);
                // that.byId("multiInput").setValue(Module);
                that.GetFilter();
                that.getView().getModel("oViewModel").refresh();
                // that.GetMasterList();
                that.getView().byId("ddd").rerender();
                that.getView().byId("list").getBinding("items").refresh();
                // that.onSelectionChange("", IstekNo);
                // that.getView().byId("idType").setValue();
                // that.getView().byId("inpStatu").setValue();
                // that.getView().byId("inpModul").setValue();
                // that.getView().byId("inpCompany").setValue();
                // that.getView().byId("inpIstekNo").setValue();
                that.GetFilter();

                // that.RefreshMasterList("", "", IstekNo);

                // if (Buttontype === "DANDEGIS") {
                //  debugger;
                //  that.getView().byId("FormDisplay480_12120Dual2").getBinding("items").refresh();
                // }
                // that.getView().getModel("InputModel").setProperty("/ButtonModelEnabled", false);
                // that.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
                // that.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
                sap.ui.core.BusyIndicator.hide();
              }

              function myErrorHandler(response) {
                sap.m.MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçiniz.");
                sap.ui.core.BusyIndicator.hide();
              }

            }

            if (sButton === sap.m.MessageBox.Action.CANCEL) {
              sap.ui.core.BusyIndicator.hide();
            }
          }

        });
      } else {
        MessageBox.error("Tüm Alanları Doldurunuz.");
      }

    },
    getPost: function (oEvent) {
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();
      var filters = [];
      filters.push(new sap.ui.model.Filter("IvReqid", sap.ui.model.FilterOperator.EQ, IstekNo));
      sap.ui.core.BusyIndicator.show();
      oDataModel.read("/GetEntyMsgSet", {
        success: mySuccessHandler,
        error: myErrorHandler,
        filters: filters
      });

      function mySuccessHandler(data, response) {
        debugger;
        var tableDocShow3 = [];
        tableDocShow3.push({
          Icon: "sap-icon://delete",
          Docid: IstekNo,
          Guid: "",
          Doctext: "",
          Mimetype: "",
          Id: IstekNo,
          Fname: "DELETE"
        });
        tableDocShow3.push({
          Icon: 'sap-icon://edit',
          Docid: IstekNo,
          Guid: "",
          Doctext: "",
          Mimetype: "",
          Id: IstekNo,
          Fname: "EDIT"
        });
        for (var mt = 0; mt < data.results.length; mt++) {
          data.results[mt].Message = data.results[mt].Message + data.results[mt].Message2 + data.results[mt].Message3 +
            data.results[mt].Message4 + data.results[mt].Message5;
          data.results[mt].tableDocShow3 = tableDocShow3;
        }
        talepMsg = data.results;
        that.bindView();
        that.getView().byId("ddd").rerender();
        that.getView().byId("list").getBinding("items").refresh();
        sap.ui.core.BusyIndicator.hide();
      }

      function myErrorHandler(response) {
        MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
        sap.ui.core.BusyIndicator.hide();
      }
    },
    onPost: function (oEvent) {
      var sValue = oEvent.getParameter("value");
      if (sValue !== "" || sValue !== undefined) {
        var that = this;
        MessageBox.confirm("Mesajı kaydetmek istiyor musunuz?", {
          title: "Onayla",
          // initialFocus: MessageBox.Action.OK,
          initialFocus: "Mesajı Kaydet",
          actions: ["Mesajı Kaydet", MessageBox.Action.CANCEL],
          onClose: function (sButton) {
            // if (sButton === MessageBox.Action.OK) {
            if (sButton === "Mesajı Kaydet") {
              var oDataModel = that.getOwnerComponent().getModel();
              sap.ui.core.BusyIndicator.show();

              var oEntry = {
                Reqid: IstekNo,
                Userid: sicil,
                Username: userdesc,
                Message: sValue,
                Guid: uniqeGuid
              };
              oDataModel.create("/SaveMsgSet", oEntry, {
                success: mySuccessHandler,
                error: myErrorHandler
              });

              function mySuccessHandler(data, response) {
                that.getPost();
                that.onDocShow2();
                sap.ui.core.BusyIndicator.hide();
              }

              function myErrorHandler(response) {
                MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçiniz.");
                sap.ui.core.BusyIndicator.hide();
              }
            }
            if (sButton === MessageBox.Action.CANCEL) {
              sap.ui.core.BusyIndicator.hide();
            }
          }
        });
        MessageBox.confirm("Mesaja doküman yüklemek istiyor musunuz?", {
          title: "Onayla",
          initialFocus: "Evet",
          actions: ["Evet", "Hayır"],
          onClose: function (sButton) {
            // if (sButton === MessageBox.Action.OK) {
            if (sButton === "Evet") {
              that.RandomGuid();
              that.onDosyaYukle();
            }
            // if (sButton === MessageBox.Action.CANCEL) {
            if (sButton === "Hayır") {
              sap.ui.core.BusyIndicator.hide();
            }
          }
        });

      } else {
        sap.m.MessageBox.error("Mesajı doldurunuz.");
      }

    },
    bindView: function () {
      var oModel = new sap.ui.model.json.JSONModel();
      oModel.setData({
        tablemaster: tablemaster,
        tabledetail: tabledetail,
        tableproje: tableproje,
        tabletiket: tabletiket,
        talepMsg: talepMsg,
        siciller: siciller,
        tableCallCenter: tableCallCenter
      });

      this.getView().setModel(oModel, "oViewModel");
      // this.getView().getModel("oViewModel").refresh(true);
    },
    RandomGuid: function () {
      uniqeGuid = Math.floor((Math.random()) * 0x10000).toString(16);
    },
    onFilterSelect: function (oEvent) {
      this.onDocShow();
      this.onDocShow2();
      debugger;
      // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit5", true); 
      if (oEvent.getSource().mProperties.selectedKey === "IList") {

        this.byId("istekAcBtn1").setVisible(false);
        this.byId("iptalEtBtn").setVisible(false);
        this.getView().getModel("InputModel").setProperty("/ButtonsV", false);

        if (role === "20" && tabledetail[0].Statu === "01") {
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", true);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);//commented
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", true);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit5", false);//commented
          // this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
        }
        // else if (role === "20" && tabledetail[0].Statu === "02") {//added
        //  this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", true);
        //  this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
        //  this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
        //  this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", true);
        //  this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
        // } 
        else if (role === "20" && tabledetail[0].Statu !== "03") {
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", true);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);//commented
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit5", false);//commented
          // this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
        } else if (role === "20" && tabledetail[0].Statu === "03") {
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", true);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);//commented
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit5", true);//commented
          // this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
        } else if (role === "20" && tabledetail[0].Statu === "10") {
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);//commented
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit5", true);//commented
          // this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
        } else if (role === "10" && tabledetail[0].Statu === "10") {
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit5", false);//commented
          // this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
        } else if (role === "10") {
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", true);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit5", false);//commented
          // this.getView().getModel("InputModel").setProperty("/InputModelVisible", true);
        } else if (role === "01" || role === "09") {
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", true);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit5", false);//commented
          // this.getView().getModel("InputModel").setProperty("/InputModelVisible", false);
        } else {
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit5", false);//commented
          // this.getView().getModel("InputModel").setProperty("/InputModelVisible", false);
        }
        if (role === "20") {
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit6", true);
          // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", true);
        }
        if (role === "01" || role === "09" || role === "02" || role === "20") { //added
          if (tabledetail[0].Statu === "02") {
            // this.getView().byId("eforOnayBtn").setVisible(true);
            // this.getView().byId("eforOnayBtn").setEnabled(true);
            // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", true);
            // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabledEforOnay", true);
          }
        }

      } else if (oEvent.getSource().mProperties.selectedKey === "YForm") {

        this.getView().getModel("InputModel").setProperty("/ButtonsV", false);
        this.byId("istekAcBtn1").setVisible(true);
        this.byId("iptalEtBtn").setVisible(true);

        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit7", false);

      } else {
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit7", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit2", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit4", false);
        // this.getView().getModel("InputModel").setProperty("/InputModelVisible", false);
        this.getView().getModel("InputModel").setProperty("/ButtonsV", false);

        this.byId("istekAcBtn1").setVisible(false);
        this.byId("iptalEtBtn").setVisible(false);
        if (role === "01" || role === "09" || role === "02"  || role === "20") { //added
          if (tabledetail[0].Statu === "02") {
            // this.getView().byId("eforOnayBtn").setVisible(true);
            // this.getView().byId("eforOnayBtn").setEnabled(true);
            // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", true);
            // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabledEforOnay", true);
          }
        }
      }
      if (role === "01" || role === "09") {
        this.GetAuthorizationObjects();
      }
    },
    handleValueHelp: function (oEvent) {
      var sInputValue = oEvent.getSource().getValue(),
        oView = this.getView();

      // create value help dialog
      if (!this._pValueHelpDialog) {
        this._pValueHelpDialog = Fragment.load({
          id: oView.getId(),
          name: "app.YITMP_TLP.fragments.Dialog",
          controller: this
        }).then(function (oValueHelpDialog) {
          oView.addDependent(oValueHelpDialog);
          return oValueHelpDialog;
        });
      }

      this._pValueHelpDialog.then(function (oValueHelpDialog) {
        // create a filter for the binding
        oValueHelpDialog.getBinding("items").filter([new Filter(
          "Ddtext",
          FilterOperator.Contains,
          sInputValue
        )]);
        // open value help dialog filtered by the input value
        oValueHelpDialog.open(sInputValue);
      });
    },

    _handleValueHelpSearch: function (evt) {
      var sValue = evt.getParameter("value");
      var oFilter = new Filter(
        "Ddtext",
        FilterOperator.Contains,
        sValue
      );
      evt.getSource().getBinding("items").filter([oFilter]);
    },
    onInputAc: function (evt) {
      // evt.getSource().getItems()[0].getContent()[0].setEditable(true)
      var key = evt.getParameters("selectedItems").listItems[0].getSelected();
      if (key === true) {
        evt.getParameters("selectedItems").listItems[0].getContent()[0].setEditable(true)
      } else {
        evt.getParameters("selectedItems").listItems[0].getContent()[0].setEditable(false)

        evt.getParameters("selectedItems").listItems[0].getContent()[0].setValue("")
      }
    },

    _handleValueHelpClose: function (evt) {
      debugger;
      var that = this;
      // evt.preventDefault();
      var aSelectedItems = evt.getParameter("selectedItems");
      if (aSelectedItems.length === 0) {
        sap.m.MessageToast.show("Modül Seçilmedi");

      } else {
        var oMultiInput = this.byId("multiInput");
        var lngth = this.getView().getModel("oViewBindModel").getData().ModulBilgileri.length;
        var OEfor = tabledetail[0].Estimatedeffort1;
        var message = 'Seçilen Efor, mevcut Efor(' + OEfor + ') a eklenecektir.';
        var Modull = this.getView().getModel("oViewBindModel").getData().ModulBilgileri;
        sap.m.MessageBox.confirm(message, {
          title: "Efor Ekle/Sıfırla",
          initialFocus: sap.m.MessageBox.Action.OK,
          actions: ["Onayla", "Sıfırdan Ekle"],
          onClose: function (sButton) {
            if (sButton === "Onayla") {
              debugger;
              for (var mt = 0; mt < lngth; mt++) {
                if (Modull[mt].Gun !== undefined) {
                  if (Modull[mt].Gun.includes(",")) {
                    Modull[mt].Gun = Modull[mt].Gun.replace(/\,/g, ".");
                  }
                  OEfor = parseFloat(Modull[mt].Gun) + parseFloat(OEfor);
                }
              }
              tabledetail[0].Estimatedeffort1 = OEfor.toString();
              that.bindView();
              if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {

                  var mt = oItem.getBindingContextPath().split("/")[2];
                  if (Modull[mt].Gun === undefined) {
                    Modull[mt].Gun = "0"
                  }
                  oMultiInput.addToken(new Token({
                    text: oItem.getLabel() + " (" + Modull[mt].Gun + ")",
                    key: Modull[mt].Gun
                      //  text: oItem.getTitle()
                  }));
                });
              }
              for (var mt = 0; mt < lngth; mt++) {

                if (Modull[mt].Gun !== undefined) {

                  Modull[mt].Gun = undefined;

                }
                that.getView().getModel("oViewBindModel").refresh(true);

              }
            }
            if (sButton === "Sıfırdan Ekle") {
              OEfor = 0;
              // tabledetail[0].Estimatedeffort1 = 0;
              oMultiInput.destroyTokens();
              oMultiInput.setValue("");
              for (var mt = 0; mt < lngth; mt++) {
                if (Modull[mt].Gun !== undefined) {
                  if (Modull[mt].Gun.includes(",")) {
                    Modull[mt].Gun = Modull[mt].Gun.replace(/\,/g, ".");
                  }
                  OEfor = parseFloat(Modull[mt].Gun) + parseFloat(OEfor);
                }
              }
              tabledetail[0].Estimatedeffort1 = OEfor.toString();
              that.bindView();
              if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {

                  var mt = oItem.getBindingContextPath().split("/")[2];
                  if (Modull[mt].Gun === undefined) {
                    Modull[mt].Gun = "0"
                  }
                  oMultiInput.addToken(new Token({
                    text: oItem.getLabel() + " (" + Modull[mt].Gun + ")",
                    key: Modull[mt].Gun
                      //  text: oItem.getTitle()
                  }));
                });
              }
              for (var mt = 0; mt < lngth; mt++) {

                if (Modull[mt].Gun !== undefined) {

                  Modull[mt].Gun = undefined;

                }
                that.getView().getModel("oViewBindModel").refresh(true);

              }

            }
          }

        });

        // for (var mt = 0; mt < lngth; mt++) {
        //  if (Modull[mt].Gun !== undefined) {
        //    if (Modull[mt].Gun.includes(",")) {
        //      Modull[mt].Gun = Modull[mt].Gun.replace(/\,/g, ".");
        //    }
        //    OEfor = parseFloat(Modull[mt].Gun) + parseFloat(OEfor);
        //  }
        // }
        // tabledetail[0].Estimatedeffort1 = OEfor.toString();
        // this.bindView();

        // if (aSelectedItems && aSelectedItems.length > 0) {
        //  aSelectedItems.forEach(function (oItem) {

        //    var mt = oItem.getBindingContextPath().split("/")[2];
        //    if (Modull[mt].Gun === undefined) {
        //      Modull[mt].Gun = "0"
        //    }
        //    oMultiInput.addToken(new Token({
        //      text: oItem.getLabel() + " (" + Modull[mt].Gun + ")",
        //      key: Modull[mt].Gun
        //        //  text: oItem.getTitle()
        //    }));
        //  });
        // }
        // for (var mt = 0; mt < lngth; mt++) {

        //  if (Modull[mt].Gun !== undefined) {

        //    Modull[mt].Gun = undefined;

        //  }
        //  this.getView().getModel("oViewBindModel").refresh(true);

        // }
      }
    },
    _handleValueHelpClose1: function (evt) {
      var aSelectedItems = evt.getParameter("selectedItems");
    },
    _handleBeforeClose: function (evt) {
      if (aSelectedItems.length === 0) {
        sap.m.MessageToast.show("Modül Seçilmedi");

      }
    },

    onTokenChange: function (oEvent) {
      debugger;
      var oMultiInput = this.getView().byId("multiInput");
      var sType = oEvent.getParameter("type");
      var oToken = oEvent.getParameter("token");
      var aRemovedTokens = oEvent.getParameter("removedTokens");
      if (tabledetail[0] !== undefined) {

        var OEfor = tabledetail[0].Estimatedeffort1;
      }
      var message = 'Seçilen Efor, mevcut Efor(' + OEfor + ') a eklenecektir.';
      var i;
      var removedToken;
      var tokenKey;
      var that = this;

      if (sType !== "added") {
        if (aRemovedTokens && aRemovedTokens.length > 0) {
          for (var i = 0; i < aRemovedTokens.length; i++) {
            var removedToken = aRemovedTokens[i];
            var tokenKey = removedToken.getKey();
            OEfor = parseFloat(OEfor) - parseFloat(tokenKey);
          }
        }
        if (tabledetail[0] !== undefined) {

          tabledetail[0].Estimatedeffort1 = OEfor.toString();
        }
        this.bindView();
      }
    },
    onDosyaYukle: function () {
      if (!this.excelFrag) {
        this.excelFrag = sap.ui.xmlfragment("app.YITMP_TLP.fragments.docupload", this);
        this.getView().addDependent(this.excelFrag);
      }
      this.excelFrag.open();

    },
    onPressExit1: function () {
      sap.ui.getCore().byId("uploadColIkDokuman").destroyItems();
      this.excelFrag.close();
    },
    onBeforeUploadStarts: function (e) {
      var t = e.getSource();
      var regex = /[!"#$%&'()*+,.-/:;<=>?@[\]^_`{|}~]/g;
      var fullName = e.getParameter("fileName");
      var myArr = fullName.split("."),
        fileType = myArr[myArr.length - 1],
        fName = myArr[0].replace(regex, '');
      fName = fName.replace("Ü", "U");
      fName = fName.replace("ü", "u");
      fName = fName.replace("İ", "I");
      fName = fName.replace("ı", "i");
      fName = fName.replace("Ö", "O");
      fName = fName.replace("ö", "o");
      fName = fName.replace("Ç", "C");
      fName = fName.replace("ç", "c");
      fName = fName.replace("Ğ", "G");
      fName = fName.replace("ğ", "g");
      fName = fName.replace("Ş", "S");
      fName = fName.replace("ş", "s");
      var fileName = fName + "." + fileType;
      valueFeed = valueFeed + fileName;
      var s1 = new sap.m.UploadCollectionParameter({
        name: "slug",
        value: fileName
      });
      e.getParameters().addHeaderParameter(s1);
    },
    onFileSizeExceed: function (oEvent) {
      sap.m.MessageToast.show("Geçersiz dosya boyutu");
    },
    onTypeMissmatch: function (oEvent) {
      sap.m.MessageToast.show("Geçersiz dosya tipi.");
    },

    onChange: function (oEvent) {

      var t = oEvent.getSource();
      var i = this.getView().getModel().oHeaders["x-csrf-token"];

      var s = new sap.m.UploadCollectionParameter({
        name: "x-csrf-token",
        value: i
      });
      t.addHeaderParameter(s);

      var s2 = new sap.m.UploadCollectionParameter({
        name: "X-Requested-With",
        value: "XMLHttpRequest"
      });
      t.addHeaderParameter(s2);

      var url = "/sap/opu/odata/sap/YITMP_001_SRV/FileSet(IvGuid='" + uniqeGuid + "')/FILENP";
      t.setUploadUrl(url);
    },
    /*Dosya Görüntüleme*/
    onDocShow: function (oEvent) {
      var filter = [];
      var sServiceURL = this.getView().getModel().sServiceUrl;
      filter.push(new sap.ui.model.Filter("IvReqid", sap.ui.model.FilterOperator.EQ, IstekNo));
      var that = this;
      var oModel = this.getView().getModel();
      oModel.read("/DocListSet", {
        filters: filter,
        success: function (resp) {
          tableDocShow = [];
          if (resp.results.length === 0) {
            that.bindView2();
          } else {
            for (var mt = 0; mt < resp.results.length; mt++) {
              var url = sServiceURL + "/" + "FileUSet(IvReqid='" + resp.results[mt].Id +
                "',IvDocid='" + resp.results[mt].Docid + "')/$value";
              resp.results[mt].url = url;
              tableDocShow.push(resp.results[mt]);
            }
            that.bindView2();
          }
        },
        error: function () {}
      });
    },

    bindView2: function () {
      var oViewModel = new sap.ui.model.json.JSONModel();
      oViewModel.setData({
        tableDocShow: tableDocShow
      });
      this.getView().setModel(oViewModel, "DocList");
      this.getView().getModel("DocList").refresh(true);
    },
    /*Dosya Görüntüleme*/
    onDocShow2: function (oEvent) {
      var filter = [];
      var sServiceURL = this.getView().getModel().sServiceUrl;
      filter.push(new sap.ui.model.Filter("IvReqid", sap.ui.model.FilterOperator.EQ, IstekNo));
      var that = this;
      var oModel = this.getView().getModel();
      oModel.read("/DocList2Set", {
        filters: filter,
        success: function (resp) {
          debugger;
          tableDocShow2 = [];
          // if (resp.results.length === 0) {
          //  that.bindView2();
          // } else {
          var tableDocShow3 = [];
          for (var mt = 0; mt < resp.results.length; mt++) {
            var url = sServiceURL + "/" + "FileUSet(IvReqid='" + IstekNo +
              "',IvDocid='" + resp.results[mt].Docid + "')/$value";
            resp.results[mt].url = url;
            var Guid = resp.results[mt].Guid;
            if (tableDocShow3.length !== 0) {
              if (tableDocShow3.findIndex(x => x.Guid === Guid) === 0) {
                tableDocShow3.push(resp.results[mt]);
              } else {
                tableDocShow3 = [];
                tableDocShow3.push(resp.results[mt]);
              }
            } else {
              tableDocShow3.push(resp.results[mt]);
            }
            debugger;
            var index = talepMsg.findIndex(x => x.Guid === Guid);
            talepMsg[index].tableDocShow3 = tableDocShow3;

            tableDocShow2.push(resp.results[mt]);
          }
          tableDocShow3.push({
            Icon: "sap-icon://delete",
            Docid: IstekNo,
            Guid: "",
            Doctext: "",
            Mimetype: "",
            Id: IstekNo,
            Fname: "DELETE"
          });
          tableDocShow3.push({
            Icon: 'sap-icon://edit',
            Docid: IstekNo,
            Guid: "",
            Doctext: "",
            Mimetype: "",
            Id: IstekNo,
            Fname: "EDIT"
          });
          var talepMsgdata = that.getView().getModel("oViewModel").getData().talepMsg;
          talepMsgdata.forEach(function (m) {
            // m.tableDocShow3 = tableDocShow3;
            m.tableDocShow3 = tableDocShow2;
          });

          tableDocShow3 = tableDocShow2;
          tableDocShow3.push({
            Icon: "sap-icon://delete",
            Docid: IstekNo,
            Guid: "",
            Doctext: "",
            Mimetype: "",
            Id: IstekNo,
            Fname: "DELETE"
          });
          tableDocShow3.push({
            Icon: 'sap-icon://edit',
            Docid: IstekNo,
            Guid: "",
            Doctext: "",
            Mimetype: "",
            Id: IstekNo,
            Fname: "EDIT"
          });
          that.bindView3();
          that.bindView();
          // }
        },
        error: function () {}
      });
    },
    onPressDocSil: function (e) {
      // handleguncelle = "X";
      var filename = e.getSource().getBindingContext("oViewModel").getProperty("Fname");
      var id = e.getSource().getBindingContext("oViewModel").getProperty("Docid");
      // var filename = "AHMET";
      var encodedFilename = encodeURIComponent(filename);
      var oModel = this.getView().getModel();
      // var oTable = this.getView().byId("idProductsTableTaslak");
      // var oBinding = oTable.getBinding("items");
      var that = this;
      // var FormnoSil = IstekNo;
      var oTable = sap.ui.getCore().byId("idDosyalar");
      var oBinding = oTable.getBinding("items");
      // oBinding.refresh(true);

      // oModel.remove("/DocList2Set(Id='" + FormnoSil + "',Fname='" + filename + "')", {
      oModel.remove("/DocList2Set(Fname='" + encodedFilename + "',Id='" + IstekNo + "')", {

        method: "DELETE",
        success: function (data) {
          MessageToast.show("Dosya Silindi");
          // oBinding.refresh(true);
          var lengthd = that.getView().getModel("oViewModel").getData().talepMsg[0].tableDocShow3.length;
          var datas = that.getView().getModel("oViewModel").getData().talepMsg[0].tableDocShow3;
          var datasmodel = that.getView().getModel("oViewModel");
          var adaydosyadi;
          var aday;
          for (var i = 0; i < lengthd; i++) {

            aday = that.getView().getModel("oViewModel").getData().talepMsg[0].tableDocShow3[i];
            if (aday !== undefined) {

              adaydosyadi = that.getView().getModel("oViewModel").getData().talepMsg[0].tableDocShow3[i].Fname;
            }
            if (adaydosyadi === filename) {
              datas.splice(i, 1);
            }
          }
          datasmodel.setProperty("/tableDocShow3", datas); // Veriyi modele geri yükleyin
          datasmodel.refresh(true); // Modeli yenileyin
          // that.getView().getModel("DocList2").refresh(true);
        },
        error: function (e) {
          alert("error");
        }
      });

    },
    onTableRowSelectDosya: function (oEvent) {

      var sAction = oEvent.getParameter("listItem").getBindingContext("oViewModel").getProperty("url");
      // var sAction = item.getCustomData()[0].getValue();
      var sServiceURL = this.getView().getModel().sServiceUrl;
      URLHelper.redirect(sAction, true);

      var oTable = this.getView().byId("idDosyalar"); // Tablo nesnesini alın
      oTable.removeSelections(true); // true, tüm seçimleri kaldırmak için kullanılır

    },

    onActionPressed: function (oEvent) {
      if (oEvent.getSource().getProperty("text") === "EDIT") {
        this.getView().getModel("oViewModel").getData().talepMsg[0].tableDocShow3.pop();
        this.getView().getModel("oViewModel").getData().talepMsg[0].tableDocShow3.pop();
      }
      this.getView().getModel("oViewModel").refresh();
      debugger;
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();
      var index = oEvent.oSource.oBindingContexts.oViewModel.sPath.slice(10).split('/')[0];
      chatIndex = index;
      var list = this.getView().getModel("oViewModel").getData().talepMsg;
      var filters = [];
      var Reqid = list[index].Reqid;
      var Userid = list[index].Userid;
      var Username = list[index].Username;
      var Ydate = list[index].Ydate;
      Ydate = Ydate.toLocaleDateString().slice(6) + Ydate.toLocaleDateString().slice(3, 5) + Ydate.toLocaleDateString().slice(0, 2);
      var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
        UTC: true,
        pattern: "HH:mm:ss"
      });
      var useageTime = oTimeFormat.format(new Date(list[index].Ytime.ms));
      var Ytime = useageTime.slice(0, 2) + useageTime.slice(3, 5) + useageTime.slice(6, 8);

      if (oEvent.getSource().getProperty("text") === 'DELETE') {
        // oDataModel.remove("/DeleteMessageSet(Reqid='" + Reqid + "',Userid='" + Userid + "',Username='" + Username + "', Ydate='" + Ydate + "',Ytime='" + Ytime + "')", {
        // oDataModel.remove("/DeleteMessageSet(Reqid='" + Reqid + "',Userid='" + Userid + "',Username='" + Username + "', Ydate='" + Ydate + "')", {
        // // oDataModel.remove("/DeleteMessageSet(Reqid='" + Reqid + "',Userid='" + Userid + "',Username='" + Username + "')", {
        //             method: "DELETE",
        //  success: mySuccessHandler,
        //  error: myErrorHandler
        // });
        // function mySuccessHandler(data, response) {
        //  debugger;
        //  list.splice(index, 1);
        //  that.getView().getModel("oViewModel").setProperty("/talepMsg", list);
        // }
        // function myErrorHandler(response) {
        //  MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
        // }

        // oDataModel.remove("/DeleteMessageSet(Reqid='" + Reqid + "',Userid='" + Userid + "',Username='" + Username + "', Ydate='" + Ydate + "')", {
        //  success: function (oData) {
        //    debugger;
        //  },
        //  error: function (oError) {
        //    MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
        //    debugger;
        //  }
        // });

        oDataModel.read("/DeleteMessageSet(Reqid='" + Reqid + "',Userid='" + Userid + "',Username='" + Username + "',Ydate='" + Ydate +
          "',Ytime='" + Ytime + "')", {
            success: function (data, response) {
              var msgType = data.Message.split('-')[0];
              if (msgType === 'S') {
                list.splice(index, 1);
                that.getView().getModel("oViewModel").setProperty("/talepMsg", list);
              }
              sap.m.MessageBox.information(data.Message.split('-')[1]);
              debugger;
            },
            error: function (response) {
              sap.m.MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçiniz.");
              debugger;
            }
          });

        return;
      }
      if (oEvent.getSource().getProperty("text") === 'EDIT') {
        debugger;
        var oView = this.getView();
        var message = list[index].Message;

        if (!this._helpchatEdit) {
          this._helpchatEdit = sap.ui.xmlfragment("app.YITMP_TLP.fragments.ChatEdit", this);
          oView.addDependent(this._helpchatEdit);
          sap.ui.getCore().byId("chatInputId").setValue(message);
          this._helpchatEdit.open();
        } else {
          oView.addDependent(this._helpchatEdit);
          sap.ui.getCore().byId("chatInputId").setValue(message);
          this._helpchatEdit.open();
        }
        if (that.getView().getModel("oViewModel").getData().talepMsg[0].tableDocShow3.length === 0) {
          sap.ui.getCore().byId("idDosyalar").setVisible(false);
        } else {
          sap.ui.getCore().byId("idDosyalar").setVisible(true);
        }

        return;
      }
      var sAction = oEvent.getSource().getKey();
      var sServiceURL = this.getView().getModel().sServiceUrl;
      // URLHelper.redirect(sAction, true);
      window.open(sAction, "_blank");
    },
    onConfirmChatEdit: function () {
      debugger;
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();
      var list = this.getView().getModel("oViewModel").getData().talepMsg;
      var Reqid = list[chatIndex].Reqid;
      var Userid = list[chatIndex].Userid;
      var Username = list[chatIndex].Username;
      var Ydate = list[chatIndex].Ydate;
      Ydate = Ydate.toLocaleDateString().slice(6) + Ydate.toLocaleDateString().slice(3, 5) + Ydate.toLocaleDateString().slice(0, 2);
      var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
        UTC: true,
        pattern: "HH:mm:ss"
      });
      var useageTime = oTimeFormat.format(new Date(list[chatIndex].Ytime.ms));
      var Ytime = useageTime.slice(0, 2) + useageTime.slice(3, 5) + useageTime.slice(6, 8);
      var message = sap.ui.getCore().byId("chatInputId").getValue();
      // ,Message='" + message + "'
      var oData = {
        Reqid: Reqid,
        Userid: Userid,
        Username: Username,
        Ydate: Ydate,
        Ytime: Ytime,
        Message: message
      };
      // oDataModel.update("/EditMessageSet", oData, {success: mySuccessHandler, error: myErrorHandler});
      // update
      // oDataModel.update("/EditMessageSet(Reqid='" + Reqid + "',Userid='" + Userid + "',Username='" + Username + "',Ydate='" + Ydate +
      //          "',Ytime='" + Ytime + "')", oData, {
      //        success: function (data, response) {
      //          var msgType = data.Message.split('-')[0];
      //          if (msgType === 'S') {
      //            list[chatIndex].Message = message;
      //            that.getView().getModel("oViewModel").setProperty("/talepMsg", list);
      //          }
      //          sap.m.MessageBox.information(data.Message.split('-')[1]);
      //          that._helpchatEdit.close();
      //          debugger;
      //        },
      //        error: function (response) {
      //          sap.m.MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçiniz.");
      //          debugger;
      //        }
      //      });
      // update
      // create
      oDataModel.create("/EditMessageSet", oData, {
        success: function (data, response) {
          var msgType = data.Message.split('-')[0];
          if (msgType === 'S') {
            list[chatIndex].Message = message;
            that.getView().getModel("oViewModel").setProperty("/talepMsg", list);
          }
          sap.m.MessageBox.information(data.Message.split('-')[1]);
          that._helpchatEdit.close();
          debugger;
        },
        error: function (response) {
          sap.m.MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçiniz.");
          debugger;
        }
      });
      // create
    },
    onCloseChatEdit: function () {

      this.getView().getModel("oViewModel").getData().talepMsg[0].tableDocShow3.push({
        Icon: "sap-icon://delete",
        Docid: IstekNo,
        Guid: "",
        Doctext: "",
        Mimetype: "",
        Id: IstekNo,
        Fname: "DELETE"
      });

      this.getView().getModel("oViewModel").getData().talepMsg[0].tableDocShow3.push({
        Icon: 'sap-icon://edit',
        Docid: IstekNo,
        Guid: "",
        Doctext: "",
        Mimetype: "",
        Id: IstekNo,
        Fname: "EDIT"
      });
      this.getView().getModel("oViewModel").refresh();
      this._helpchatEdit.close();
    },
    bindView3: function () {
      var oViewModel = new sap.ui.model.json.JSONModel();
      oViewModel.setData({
        tableDocShow2: tableDocShow2
      });
      this.getView().setModel(oViewModel, "DocList2");
      this.getView().getModel("DocList2").refresh(true);
    },

    onPressRadioYonet: function (oEvent) {
      indexradio = sap.ui.getCore().byId("idTableSicilArama").indexOfItem(oEvent.getSource().getParent());
      if (sicilMulti.length !== 0) {
        var tblsc = sap.ui.getCore().byId("idTableSicilArama").getSelectedItems();
        var indxs = sap.ui.getCore().byId("idTableSicilArama").getSelectedItems().length;
        for (var mt = 0; mt < indxs; mt++) {
          var indx = sicilMulti.findIndex(o => o.Modulmulti == tblsc[mt].getAggregation("cells")[0].mProperties.text);
          if (indx !== -1 && indx !== undefined) {
            var select = tblsc[mt].getAggregation("cells")[3].mProperties.selected;
            if (select === true) {
              sicilMulti[indx].Yonetici = 'X';
            } else {
              sicilMulti[indx].Yonetici = '';
            }
          }
        }
      }
      /*  if (sap.ui.getCore().byId("idTableSicilArama").getItems()[index].getSelected() == true) {
          sap.ui.getCore().byId("idTableSicilArama").getItems()[index].setSelected(true);
        }*/
    },

    sActionsicil: function (oEvent) {
      var oTable = sap.ui.getCore().byId("idTableSicilArama");
      var List = oEvent.getParameter("listItems");
      var sicilMultiDelete = [];

      /*  if (oEvent.getParameter("selectAll")) {
          for (var mt = 0; mt < List.length; mt++) {
            var Yonetici = List[mt].mAggregations.cells[3].getSelected();
            if (Yonetici === true) {
              Yonetici = "X";
            } else {
              Yonetici = "";
            }
            sicilMulti.push({
              Modulmulti: List[mt].mAggregations.cells[0].getText(),
              Yonetici: Yonetici
            });
          }
        } else {
          if (oEvent.getParameter("selected") == true) {
            var Modulmulti = List[0].mAggregations.cells[0].getText();
            var Yonetici = List[0].mAggregations.cells[3].getSelected();
            var Yonetici = List[0].mAggregations.cells[3].getSelected();
            if (Yonetici === true) {
              Yonetici = "X";
            } else {
              Yonetici = "";
            }
            sicilMulti.push({
              Modulmulti: Modulmulti,
              Yonetici: Yonetici
            });
          } else {
            sicilMultiDelete = sicilMulti;
            sicilMulti = [];
            if (List.length === 1) {
              for (var mt = 0; mt < sicilMultiDelete.length; mt++) {
                if (sicilMultiDelete[mt].Modulmulti !== List[0].mAggregations.cells[0].getText()) {
                  sicilMulti.push(sicilMultiDelete[mt]);
                }
              }
            } else {
              for (var mt = 0; mt < sicilMultiDelete.length; mt++) {
                if (mt < List.length) {
                  if (sicilMultiDelete[mt].Modulmulti !== List[mt].mAggregations.cells[0].getText()) {
                    sicilMulti.push(sicilMultiDelete[mt]);
                  }
                }
              }
            }
          }
        }*/

    },

    sicilValueHelpSelected: function (evt) {
      var table = sap.ui.getCore().byId("idTableSicilArama");
      if (table.getSelectedItems().length === 0) {
        MessageToast.show("Danışman seçiniz.");
        return;
      }
      //  var sicildizi = sicilMulti;
      var sicildizi = [];
      var models = [];
      var aSelectedItems = table.getSelectedItems();
      aSelectedItems.forEach(function (oItem) {
        var oBindingContext = oItem.getBindingContextPath().split("/")[2];
        models.push(oItem.getBindingContext().getObject());
        var Yonetici = oItem.getBindingContext().getObject().Yonetici;
        if (Yonetici !== undefined) {
          if (Yonetici === true) {
            Yonetici = "X";
          } else {
            Yonetici = "";
          }
          sicildizi.push({
            Modulmulti: oItem.getBindingContext().getObject().Consultant + "&" + oItem.getBindingContext().getObject().Ymodul,
            Yonetici: Yonetici
          });

        } else {
          sicildizi.push({
            Modulmulti: oItem.getBindingContext().getObject().Consultant + "&" + oItem.getBindingContext().getObject().Ymodul,
            Yonetici: ""
          });

        }
      });
      this.byId("Danisman").destroyTokens();
      var aSelectedItems = sicildizi,
        oMultiInput = this.byId("Danisman");

      if (aSelectedItems && aSelectedItems.length > 0) {
        aSelectedItems.forEach(function (oItem) {
          oMultiInput.addToken(new Token({
            text: oItem.Modulmulti
          }));
        });
      }
      sicilMulti = sicildizi;
      this.SicilValueHelpClose();
      this.getView().byId("Danisman").setValueState("None");

    },

    siciltokenChange: function (oEvent) {
      debugger;
      dandegis = "X";
      var sicilMultiDelete = [];
      if (oEvent.getParameters().type === "removed") {
        var Prpdelete = oEvent.getParameters().token.mProperties.text
        var indx = sicilMulti.findIndex(o => o.Modulmulti == oEvent.getParameters().token.mProperties.text);
        sicilMultiDelete = sicilMulti;
        sicilMulti = [];
        for (var mt = 0; mt < sicilMultiDelete.length; mt++) {
          if (indx !== mt) {
            sicilMulti.push(sicilMultiDelete[mt]);
          }
        }
      }
      if (oEvent.getParameters().type === "removedAll") {
        this.byId("Danisman").destroyTokens();
        sicilMulti = [];
      }
    },
    handleTableSelectDialogPress: function (oEvent) {
      var oButton = oEvent.getSource(),
        oView = this.getView();

      if (!this._pDialog) {
        this._pDialog = Fragment.load({
          id: oView.getId(),
          name: "app.YITMP_TLP.fragments.sicilValueHelp",
          controller: this
        }).then(function (oDialog) {
          oView.addDependent(oDialog);
          return oDialog;
        });
      }

      this._pDialog.then(function (oDialog) {
        oDialog.open();
        this.getsicilData();
      }.bind(this));
    },
    handleSearch: function (oEvent) {
      var sValue = oEvent.getParameter("value");
      var oFilter = new Filter("Consultant", FilterOperator.Contains, sValue);
      var oBinding = oEvent.getSource().getBinding("items");
      oBinding.filter([oFilter]);
    },

    handleClose: function (oEvent) {
      // reset the filter
      debugger;
      var oBinding = oEvent.getSource().getBinding("items");
      oBinding.filter([]);

      var aContexts = oEvent.getParameter("selectedContexts");
      if (aContexts && aContexts.length) {
        var sicildizi = [];
        var sicilmodule = [];
        var models = [];
        // DanDeg = "X";
        this.byId("Danisman").setValue("");
        var module = this.byId("multiInput").getValue();
        if (role !== '20') {
          module.setValue("");
        }
        aContexts.map(function (oContext) {

          models.push(oContext.getObject());
          var Yonetici = oContext.getObject().Yonetici;
          if (Yonetici !== undefined) {
            if (Yonetici === true) {
              Yonetici = "X";
            } else {
              Yonetici = "";
            }
            sicildizi.push({
              Modulmulti: oContext.getObject().Consultant + "&" + oContext.getObject().Ymodul,
              Yonetici: Yonetici
            });
            sicilmodule.push({
              Module: oContext.getObject().Ymodul,
            });
          } else {
            sicildizi.push({
              Modulmulti: oContext.getObject().Consultant + "&" + oContext.getObject().Ymodul,
              Yonetici: ""
            });
            sicilmodule.push({
              Module: oContext.getObject().Ymodul,
            });
          }
        });

        this.byId("Danisman").destroyTokens();
        this.byId("multiInput").destroyTokens();
        var aSelectedItems = sicildizi,
          oMultiInput = this.byId("Danisman");
        var aSelectedModule = sicilmodule,
          oMultiInputModule = this.byId("multiInput");
        if (aSelectedItems && aSelectedItems.length > 0) {
          aSelectedItems.forEach(function (oItem) {
            oMultiInput.addToken(new Token({
              text: oItem.Modulmulti
            }));
          });
        }
        if (aSelectedModule && aSelectedModule.length > 0) {
          aSelectedModule.forEach(function (oModule) {
            oMultiInputModule.addToken(new Token({
              text: oModule.Module
            }));
          });
        }
        sicilMulti = sicildizi;
        moduleMulti = sicilmodule;
        this.getView().byId("Danisman").setValueState("None");
      } else {
        sap.m.MessageToast.show("Danışman seçimi yapılmadı.");
      }

    },
    sicilValueHelp: function (oEvent) {

      this._sicilValueHelp = sap.ui.getCore().byId("sicilValueHelp");
      if (!this._sicilValueHelp) {
        this._sicilValueHelp = sap.ui.xmlfragment("app.YITMP_TLP.fragments.sicilValueHelp", this);
      }

      jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._sicilValueHelp);
      this._sicilValueHelp.open();

      var sicilAraDialogModel = new sap.ui.model.json.JSONModel();
      sicilAraDialogModel.setData({
        filterData: {
          Consultant: "",
          Consultantdesc: "",
          Ymodul: ""
        },
        items: []
      });

      this._sicilValueHelp.setModel(sicilAraDialogModel);

    },

    handleSicilAra: function () {

      sap.ui.core.BusyIndicator.show();
      var oModelsicilArama = this._sicilValueHelp.getModel();
      var oDatasicilArama = oModelsicilArama.getData();
      var aFilters = [];

      if (oDatasicilArama.filterData.Consultant) {
        aFilters.push(new sap.ui.model.Filter("Consultant", sap.ui.model.FilterOperator.Contains, oDatasicilArama.filterData.Consultant));
      }

      if (oDatasicilArama.filterData.Consultantdesc) {
        aFilters.push(new sap.ui.model.Filter("Consultantdesc", sap.ui.model.FilterOperator.Contains, oDatasicilArama.filterData.Consultantdesc));
      }

      //  aFilters.push(new sap.ui.model.Filter("Ymodul", sap.ui.model.FilterOperator.Contains, tabledetail[0].Ymodule));

      if (tabledetail[0].Modulmulti.split(",").length !== 0) {
        for (var a = 0; a < tabledetail[0].Modulmulti.split(",").length; a++) {
          var M = tabledetail[0].Modulmulti.split(",")[a];
          aFilters.push(new sap.ui.model.Filter("Ymodul", sap.ui.model.FilterOperator.Contains, M.split("-")[0].split(" ")[1]));
        }
      }

      this.getsicilData(aFilters);

    },

    getsicilData: function (filters) {
      var that = this;
      siciller = [];
      var oDataModel = this.getOwnerComponent().getModel();
      var filters = [];
      //         debugger;
      // if (DanDeg !== "X") {
      // if (tabledetail[0].Modulmulti.split(",").length !== 0) {
      //  for (var a = 0; a < tabledetail[0].Modulmulti.split(",").length; a++) {
      //    var M = tabledetail[0].Modulmulti.split(",")[a];
      //    filters.push(new sap.ui.model.Filter("Ymodul", sap.ui.model.FilterOperator.Contains, M.split("-")[0].split(" ")[1]));
      //  }
      // }
      // }
      oDataModel.read("/YitmpSModulSet", {
        success: mySuccessHandler,
        error: myErrorHandler,
        filters: filters
      });

      function mySuccessHandler(data, response) {
        siciller = data.results;
        that.bindView();
        /*  var dialogData = that._sicilValueHelp.getModel().getData();
          dialogData.items = siciller;
          that._sicilValueHelp.getModel().refresh(true);*/

        sap.ui.core.BusyIndicator.hide();
      }

      function myErrorHandler(response) {
        MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
        sap.ui.core.BusyIndicator.hide();
      }
    },

    handleSicilSec: function (oEvent) {

      /*  ekleneceksicil = oEvent.getSource().getBindingContext().getObject();
        tabledetail[0].Consultantuser = ekleneceksicil.Consultant;
        this.bindView();
        this._sicilValueHelp.destroy();*/

    },

    SicilValueHelpClose: function () {
      this._sicilValueHelp.destroy();
    },
    onExport2Excel: function () {
      var aCols, oBinding, oSettings, oSheet, oTable;
      debugger;
      oTable = this.getView().getModel("oViewModel").getData("tablemaster").tablemaster;
      aCols = this.createColumnConfig();

      oSettings = {
        workbook: {
          columns: aCols
        },
        dataSource: tablemaster
      };

      oSheet = new Spreadsheet(oSettings);
      oSheet.build()
        .then(function () {
          MessageToast.show('Spreadsheet export has finished');
        }).finally(function () {
          oSheet.destroy();
        });
    },
    createColumnConfig: function () {
      return [{
        label: 'İstek No',
        property: 'Requisitionid',
        scale: 0
      }, {
        label: 'İstek Açan',
        property: 'Requisitionuser'
      }, {
        label: 'İstek Açan',
        property: 'Userdescription'
      }, {
        label: 'Tarih',
        property: 'Requisitiondate',
        type: exportLibrary.EdmType.Date
      }, {
        label: 'Saat',
        property: 'Requisitiontime',
        type: exportLibrary.EdmType.Time
      }, {
        label: 'Termin',
        property: 'Deadline',
        type: exportLibrary.EdmType.Date
      }, {
        label: 'Öngörülen Efor',
        property: 'Estimatedeffort'
          // width: '25'
      }, {
        label: 'Kapatılma Tarihi',
        property: 'Closingdate',
        type: exportLibrary.EdmType.Date
      }, {
        label: 'Kapatılma Saati',
        property: 'Closingtime',
        type: exportLibrary.EdmType.Time
      }, {
        label: 'Statü',
        property: 'Statu'
      }, {
        label: 'Modül',
        property: 'Modulmulti',
        width: '20'
      }, {
        label: 'Danışman',
        property: 'Multiconsultant',
        width: '25'
      }, {
        label: 'Ticket No',
        property: 'Actticket'
      }, {
        label: 'Müşteri İstek No',
        property: 'Customticket',
        // type: EdmType.String
        width: '18'
      }, {
        label: 'Açıklama',
        property: 'Description',
        width: '50'
      }];
    },
    onSearchReqId: function () {
      var oView = this.getView();
      if (!this._helpReqId) {
        this._helpReqId = sap.ui.xmlfragment("app.YITMP_TLP.fragments.ReqId", this);
        oView.addDependent(this._helpReqId);
        this._helpReqId.open();
      } else {
        oView.addDependent(this._helpReqId);
        this._helpReqId.open();
      }
    },
    onCloseReqIdValueHelp: function () {
      this._helpReqId.destroy();
      this._helpReqId = undefined;
      // this._helpReqId.close();
    },
    onConfirmReqIdValueHelp: function (oEvent) {
      var selectedSHitem = oEvent.getParameter("selectedContexts");
      var selectedReqId = selectedSHitem[0].getProperty("Requisitionid");

      this.getView().byId("inpIstekNo").setValue(selectedReqId);

      this._helpReqId.destroy();
      this._helpReqId = undefined;
    },
    onSearchReqIdValueHelp: function (oEvent) {
      debugger;
      var sQuery = oEvent.getParameter("value");
      var aFilter = [new Filter({
        filters: [new Filter("Requisitionid", FilterOperator.Contains, sQuery)]
      })];
      var oList = sap.ui.getCore().byId("reqIdSelectDialogID");
      var oBinding = oList.getBinding("items");
      oBinding.filter(aFilter);
    },
    _onRouteMatched2: function (oEvent) {
      debugger;
      sicil = oEvent.getParameter("arguments").sicil;
      userdesc = oEvent.getParameter("arguments").userdesc;
      role = oEvent.getParameter("arguments").role;
      company = oEvent.getParameter("arguments").company;
      companyd = oEvent.getParameter("arguments").companyd;
      FormItem = [];
      var obj = {
        Requisitionid: "",
        Requisitionuser: sicil,
        Userdescription: userdesc,
        /*  Requisitiondate: "",
          Requisitiontime: "",*/
        Requisitiontype: "",
        Priority: "",
        Description: "",
        /*        Actualeffort: "",
                Estimatedeffort: "",
                Closingdate: "",
                Closingtime: "",
        Statu: "",*/
        Ymodule: "",
        Evmessage: "",
        Guid: "",
        Company: companyd,
        Customticket: "",
        Customreqid: "",
        Actticket: ""

      };
      FormItem.push(obj);

      // this.getView().getModel("InputModel").setProperty("/ButtonModelEnabledEforOnay", false);
      this.getView().getModel("FormModel").setProperty("/RequestItems", FormItem);
      this.getView().getModel("InputModel").setProperty("/FormRole", role);
      // this.getView().getModel("InputModel").setProperty("/InputModelEdit", true);
      // this.getView().getModel("InputModel").setProperty("/InputModelEdit1", false);
      this.getView().getModel("InputModel").setProperty("/ButtonV", false);
      this.getView().getModel("InputModel").setProperty("/ButtonsV", false);

      this.RandomGuid();
      this.getDomainreq("YITMP_DM_REQUISITIONTYPE");
      this.getDomainreq("YITMP_DM_PRIORITY");
      this.getDomainreq("YITMP_DM_MODULE");
      this.getDomainreq("YITMP_DM_ROLE");
      this.getDomainreq("YITMP_DM_STATU");
      // this.getAnaTicketNo();
      if (role === "01" || role === "09" || role === "02" || role === "90") {
        this.GetAuthorizationObjects();

        this.getView().getModel("InputModel").setProperty("/ButtonV", true);

        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", false);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit7", false);
        this.getView().getModel("InputModel").setProperty("/ButtonsV", false);

      } else {

        this.getView().getModel("InputModel").setProperty("/ButtonV", false);

        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit1", true);
        // this.getView().getModel("InputModel").setProperty("/ButtonModelEdit7", true);
        this.getView().getModel("InputModel").setProperty("/ButtonsV", false);

      }
    },
    onSHAnaTicketNo: function () {
      var oView = this.getView();
      if (!this._helpAnaTicketNo) {
        this._helpAnaTicketNo = sap.ui.xmlfragment("app.YITMP_TLP.view.fragments.AnaTicketNo", this);
        oView.addDependent(this._helpAnaTicketNo);
        this._helpAnaTicketNo.open();
      } else {
        oView.addDependent(this._helpAnaTicketNo);
        this._helpAnaTicketNo.open();
      }
    },
    onCloseAnaTicketNoValueHelp: function () {
      this._helpAnaTicketNo.destroy();
      this._helpAnaTicketNo = undefined;
      // this._helpAnaTicketNo.close();
    },
    onConfirmAnaTicketNoValueHelp: function (oEvent) {
      var selectedSHitem = oEvent.getParameter("selectedContexts");
      var selectedAnaTakipNo = selectedSHitem[0].getProperty("AnaTakipNo");
      var selectedAltTakipNo = selectedSHitem[0].getProperty("AltTakipNo");

      selectedFilterValues.AnaTakipNo = selectedAnaTakipNo;
      this.getView().byId("idIstek").setValue(selectedAnaTakipNo);
      // this.getView().byId("idIstekDesc").setValue(selectedWgbez);

      this._helpAnaTicketNo.destroy();
      this._helpAnaTicketNo = undefined;
    },
    onSearchAnaTicketNoValueHelp: function (oEvent) {
      debugger;
      var sQuery = oEvent.getParameter("value");
      var aFilter = [new Filter({
        filters: [new Filter("Musteri", FilterOperator.EQ, sQuery)]
      })];
      var oList = sap.ui.getCore().byId("anaTicketNoSelectDialogID");
      var oBinding = oList.getBinding("items");
      oBinding.filter(aFilter);
    },

    // getAnaTicketNo: function () {
    //  var that = this;
    //  var oDataModel = this.getOwnerComponent().getModel();

    //  var anaTicketNoList = [];
    //  oDataModel.read("/AnaTicketNoSHSet", {
    //    success: mySuccessHandler,
    //    error: myErrorHandler
    //  });

    //  function mySuccessHandler(data, response) {
    //    anaTicketNoList = data.results;
    //    var err;
    //    data.results.forEach(function (m) {

    //    });
    //  }

    //  function myErrorHandler(data, response) {
    //    sap.m.MessageBox.error(response.responseText);
    //  }

    // },
    onCreateIptal: function (oEvent) {
      debugger;
      var that = this;
      MessageBox.confirm("Talebi iptal etmek istiyor musunuz?", {
        title: "Onayla",
        initialFocus: MessageBox.Action.OK,
        onClose: function (sButton) {
          if (sButton === MessageBox.Action.OK) {
            FormItem = [];
            var obj = {
              Requisitionid: "",
              Requisitionuser: sicil,
              Userdescription: userdesc,
              Requisitiontype: "",
              Priority: "",
              Description: "",
              Ymodule: "",
              Evmessage: "",
              Guid: "",
              Company: companyd,
              Customticket: "",
              Customreqid: "",
              Actticket: ""

            };
            FormItem.push(obj);
            that.getView().getModel("FormModel").setProperty("/RequestItems", FormItem);
            that.getView().getModel("InputModel").setProperty("/FormRole", role);
            // that.getView().getModel("InputModel").setProperty("/InputModelEdit", true);
            // that.getView().getModel("InputModel").setProperty("/InputModelEdit1", false);
            that.getView().getModel("InputModel").setProperty("/ButtonsV", false);

            // // this.byId("istekAcBtn").setVisible(false);
            // this.byId("iptalEtBtn").setVisible(false);
            that.RandomGuid();
            that.getDomainreq("YITMP_DM_REQUISITIONTYPE");
            that.getDomainreq("YITMP_DM_PRIORITY");
            that.getDomainreq("YITMP_DM_MODULE");
            that.getDomainreq("YITMP_DM_ROLE");
            that.getDomainreq("YITMP_DM_STATU");
            that.getView().byId("uploadColIkDokuman").removeAllItems();
            that.getView().getModel("InputModel").setProperty("/ButtonsV", true);

            // this.byId("istekAcBtn").setVisible(true);
            // this.byId("iptalEtBtn").setVisible(true);
          }
          if (sButton === MessageBox.Action.CANCEL) {
            sap.ui.core.BusyIndicator.hide();
          }
        }
      });
      debugger;
      if (role === "01" || role === "09") {
        this.GetAuthorizationObjects();
      }
    },
    onRemove: function (oEvent) {
      debugger;
      FormItem = [];
      var obj = {
        Requisitionid: "",
        Requisitionuser: sicil,
        Userdescription: userdesc,
        Requisitiontype: "",
        Priority: "",
        Description: "",
        Ymodule: "",
        Evmessage: "",
        Guid: "",
        Company: companyd,
        Customticket: "",
        Customreqid: "",
        Actticket: ""

      };
      FormItem.push(obj);
      this.getView().getModel("FormModel").setProperty("/RequestItems", FormItem);
      this.getView().getModel("InputModel").setProperty("/FormRole", role);
      // this.getView().getModel("InputModel").setProperty("/InputModelEdit", true);
      // this.getView().getModel("InputModel").setProperty("/InputModelEdit1", false);
      this.getView().getModel("InputModel").setProperty("/ButtonsV", false);

      // this.byId("istekAcBtn").setVisible(false);
      // this.byId("iptalEtBtn").setVisible(false);
      this.RandomGuid();
      this.getDomainreq("YITMP_DM_REQUISITIONTYPE");
      this.getDomainreq("YITMP_DM_PRIORITY");
      this.getDomainreq("YITMP_DM_MODULE");
      this.getDomainreq("YITMP_DM_ROLE");
      this.getDomainreq("YITMP_DM_STATU");
      this.getView().byId("uploadColIkDokuman").removeAllItems();
      this.getView().getModel("InputModel").setProperty("/ButtonsV", true);

      // this.byId("istekAcBtn").setVisible(true);
      // this.byId("iptalEtBtn").setVisible(true);
      debugger;
      if (role === "01" || role === "09") {
        this.GetAuthorizationObjects();
      }
    },

    onCreateTalep: function (oEvent) {
      debugger;
      var that = this;
      var header = this.getView().byId("Header").getValue();
      if (header === "") {
        this.getView().byId("Header").setValueState(sap.ui.core.ValueState.Error);
        MessageToast.show(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("Zorunlu Alanları Doldurunuz"));
        return;
      }
      this.getView().byId("Header").setValueState(sap.ui.core.ValueState.None);
      MessageBox.confirm("Talebi oluşturmak istiyor musunuz?", {
        title: "Onayla",
        initialFocus: MessageBox.Action.OK,
        onClose: function (sButton) {
          if (sButton === MessageBox.Action.OK) {
            var oDataModel = that.getOwnerComponent().getModel();
            sap.ui.core.BusyIndicator.show();
            var ModelForm = that.getView().getModel("FormModel").getData().RequestItems;
            /*  if (that.getView().byId("Modul").getSelectedItem() !== null) {
                ModelForm[0].Ymodule = that.getView().byId("Modul").getSelectedItem().mProperties.key;
              }*/

            ModelForm[0].Priority = that.getView().byId("Oncelik2").getSelectedItem().mProperties.key;
            ModelForm[0].Requisitiontype = that.getView().byId("TalepTip2").getSelectedItem().mProperties.key;
            /*    ModelForm[0].Customticket that.getView().byId("TalepTip").getSelectedItem().mProperties.key;*/
            ModelForm[0].Guid = uniqeGuid;
            oDataModel.create("/CreateRequest1Set", ModelForm[0], {
              success: mySuccessHandler,
              error: myErrorHandler
            });

            function mySuccessHandler(data, response) {
              MessageBox.success(data.Evmessage);
              that.onRemove();
              that.getView().byId("idIconTabBar").setSelectedKey("TList");
              sap.ui.core.BusyIndicator.hide();

              that.byId("istekAcBtn1").setVisible(false);
              that.byId("iptalEtBtn").setVisible(false);

            }

            function myErrorHandler(response) {
              MessageBox.error(response.responseText);
              // MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçiniz.");
              sap.ui.core.BusyIndicator.hide();
            }
          }
          if (sButton === MessageBox.Action.CANCEL) {
            sap.ui.core.BusyIndicator.hide();
          }
        }
      });
    },
    getDomainreq: function (ivDomain) {
      debugger;
      var that = this;
      var oDataModel = this.getOwnerComponent().getModel();
      var filters = [];
      filters.push(new sap.ui.model.Filter("IvDomain", sap.ui.model.FilterOperator.EQ, ivDomain));

      oDataModel.read("/GetDomainSet", {
        success: mySuccessHandler,
        error: myErrorHandler,
        filters: filters
      });

      function mySuccessHandler(data, response) {
        if (ivDomain === "YITMP_DM_REQUISITIONTYPE") {
          TalepTipiBilgileri = [];
          TalepTipiBilgileri = data.results;
        }
        if (ivDomain === "YITMP_DM_PRIORITY") {
          OncelikBilgileri = []
          OncelikBilgileri = data.results;
        }
        if (ivDomain === "YITMP_DM_MODULE") {
          ModulBilgileri = []
          ModulBilgileri = data.results;
        }
        if (ivDomain === "YITMP_DM_ROLE") {
          DepartmanBilgileri = []
          DepartmanBilgileri = data.results;
        }
        if (ivDomain === "YITMP_DM_STATU") {
          StatuBilgileri = [];
          StatuBilgileri = data.results;
        }
        that.bindViewreq();
        sap.ui.core.BusyIndicator.hide();
      }

      function myErrorHandler(response) {
        MessageBox.error(response.responseText);
        // MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
        sap.ui.core.BusyIndicator.hide();
      }
    },
    bindViewreq: function () {
      debugger;
      var oModel = new sap.ui.model.json.JSONModel();
      oModel.setData({
        TalepTipiBilgileri: TalepTipiBilgileri,
        OncelikBilgileri: OncelikBilgileri,
        ModulBilgileri: ModulBilgileri,
        DepartmanBilgileri: DepartmanBilgileri,
        StatuBilgileri: StatuBilgileri
      });

      this.getView().setModel(oModel, "oViewBindModel");
      this.getView().getModel("oViewBindModel").refresh(true);
    },
    onBeforeRebindTable2: function (oEvent) {
      debugger;
      var sKeyIvUname = sicil,
        sKeyIvType = "",
        sKeyRequisitionid = "",
        sKeyStatu = "",
        sKeyidCustomreqid = "",
        binding = oEvent.getParameter("bindingParams"),
        oFilter;
      if (this.getView().byId("idType").getSelectedItem() !== null) {
        sKeyIvType = this.getView().byId("idType").getSelectedItem().mProperties.key
      }
      if (this.getView().byId("idReq").getSelectedItem() !== null) {
        sKeyRequisitionid = this.getView().byId("idReq").getSelectedItem().mProperties.key
      }
      if (this.getView().byId("idCustomreqid").getSelectedItem() !== null) {
        sKeyidCustomreqid = this.getView().byId("idCustomreqid").getSelectedItem().mProperties.key
      }
      if (this.getView().byId("idStatu4").getSelectedItem() !== null) {
        sKeyStatu = this.getView().byId("idStatu4").getSelectedItem().mProperties.key
      }
      if (sKeyIvUname) {
        oFilter = new sap.ui.model.Filter("IvUname", sap.ui.model.FilterOperator.EQ, sKeyIvUname);
        binding.filters.push(oFilter);
      }
      if (sKeyIvType) {
        oFilter = new sap.ui.model.Filter("IvType", sap.ui.model.FilterOperator.EQ, sKeyIvType);
        binding.filters.push(oFilter);
      }
      if (sKeyRequisitionid) {
        oFilter = new sap.ui.model.Filter("IvReqid", sap.ui.model.FilterOperator.EQ, sKeyRequisitionid);
        binding.filters.push(oFilter);
      }
      if (sKeyidCustomreqid) {
        oFilter = new sap.ui.model.Filter("IvCreqid", sap.ui.model.FilterOperator.EQ, sKeyidCustomreqid);
        binding.filters.push(oFilter);
      }
      if (sKeyStatu) {
        oFilter = new sap.ui.model.Filter("IvStatu", sap.ui.model.FilterOperator.EQ, sKeyStatu);
        binding.filters.push(oFilter);
      }
    },

    onFileDeleted: function () {
      debugger;
    },

    onUploadComplete: function (e) {
      debugger;
      var item = new sap.m.UploadCollectionItem({
        fileName: e.getParameters().getParameters().fileName,
        enableEdit: false,
        enableDelete: true,
        visibleDelete: true,
        visibleEdit: false
      });
      this.getView().byId("uploadColIkDokuman").addItem(item);
      //  this.getView().byId("dosyaExitId").setEnabled(true);
    },
    onBeforeExport: function (oEvent) {
      debugger;
      var mExcelSettings = oEvent.getParameter("exportSettings");
      mExcelSettings.workbook.columns[7].type = sap.ui.export.EdmType.Date; //ExemptToDate
      mExcelSettings.workbook.columns[7].width = 10;
      // mExcelSettings.workbook.columns[7].inputFormat = "dd.MM.yyyy"; //Not Working
      // mExcelSettings.workbook.columns[7].format = "dd.MM.yyyy"; //Not Working
      mExcelSettings.workbook.columns[8].type = sap.ui.export.EdmType.Date;
      // mExcelSettings.workbook.columns[8].width = 10; 

      mExcelSettings.workbook.columns[9].type = sap.ui.export.EdmType.Time;
      mExcelSettings.workbook.columns[9].width = 8;

      mExcelSettings.workbook.columns[10].type = sap.ui.export.EdmType.Date;
      mExcelSettings.workbook.columns[10].width = 10;

      mExcelSettings.workbook.columns[11].type = sap.ui.export.EdmType.Time;
      mExcelSettings.workbook.columns[11].width = 8;

      // GW export
      if (mExcelSettings.url) {
        return;
      }
    },
    onDataReceived: function (oEvent) {
      debugger;
      var itemCount = oEvent.getParameters().getParameter('data')['results'].length;
    },
    onExcelExport: function (oEvent) {
      var aCols, oRowBinding, oSettings, oSheet, oTable;
      if (!this._oTable) {
        this._oTable = this.byId('smartCMMGiris');
      }
      oTable = this._oTable;
      oRowBinding = oTable.getBinding('items');
      aCols = this.createColumnConfig();

      oSettings = {
        workbook: {
          columns: aCols
        },
        dataSource: oRowBinding,
        fileName: 'Taleplerim.xlsx',
        worker: false // We need to disable worker because we are using a Mockserver as OData Service
      };

      oSheet = new Spreadsheet(oSettings);
      oSheet.build().finally(function () {
        oSheet.destroy();
      });

    },

  });
});