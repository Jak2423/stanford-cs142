'use strict';

function Cs142TemplateProcessor(template) {
  this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function (dictionary) {
    var template = this.template;
    for (var key of Object.keys(dictionary)) {
      template = template.replace(`{{${key}}}`, dictionary[key]);
    }

    return template.replace(/\{\{\w+\}\}/g, "");
  };