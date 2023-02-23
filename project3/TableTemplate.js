'use strict';

class TableTemplate {
	static fillIn(id, dict, columnName) {
      var table = document.getElementById(id);
      table.style.visibility = "visible";
      var i; var temp;

      var rowElements = table.getElementsByTagName("tr");
      console.log(rowElements);
      var head = rowElements[0];
		temp = new Cs142TemplateProcessor(head.innerHTML);
		head.innerHTML = temp.fillIn(dict);

      if (columnName === undefined) {
         temp = new Cs142TemplateProcessor(table.innerHTML);
         table.innerHTML = temp.fillIn(dict);
      }
      else {
         var columns = head.getElementsByTagName("td");
         var cols = 0;

         for (i=0; i < columns.length; i++) {
            if (columns[i].innerHTML === columnName) {
               cols = i;
            }
         }

         for (i=1; i < rowElements.length; i++) {
            var cells = rowElements[i].getElementsByTagName("td");
            temp = new Cs142TemplateProcessor(cells[cols].innerHTML);
            cells[cols].innerHTML = temp.fillIn(dict);
         }

      }
	}
}


