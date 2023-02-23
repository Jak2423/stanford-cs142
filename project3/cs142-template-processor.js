'use strict';

function Cs142TemplateProcessor(template) {
	this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function (dictionary) {
	var temp = this.template;
	for (var key of Object.keys(dictionary)) {
		temp = temp.replace(`{{${key}}}`, dictionary[key]);
	}

	return temp.replace(/\{\{\w+\}\}/g, '');
};
