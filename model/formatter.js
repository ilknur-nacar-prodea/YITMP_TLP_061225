sap.ui.define(["sap/ui/core/format/NumberFormat"],function(r){"use strict";return{currencyValue:function(r){if(!r){return""}return parseFloat(r).toFixed(0)},statuFormat:function(r){if(r==="01"){return"Error"}else if(r==="04"){return"Warning"}else{return"Success"}}}});