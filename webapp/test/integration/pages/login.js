sap.ui.define(["sap/ui/test/Opa5"],function(e){"use strict";var i="login";e.createPageObjects({onTheAppPage:{actions:{},assertions:{iShouldSeeTheApp:function(){return this.waitFor({id:"app",viewName:i,success:function(){e.assert.ok(true,"The login view is displayed")},errorMessage:"Did not find the login view"})}}}})});