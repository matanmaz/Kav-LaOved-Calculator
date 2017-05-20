function Form(id) {
	this.id = id;
	this.dom = $("#form"+id);
}

Form.prototype = {
	addInput : function(label, type, id, defaultValue, onClickActions, other){
		var formElement;
		switch(type){
			case "textarea":
				formElement = sprintf("<tr><td>%s:</td><td><textarea id='formElement%d-%d' value='%s' onClick='%s' %s/></td></tr>", 
				label, id, this.id, defaultValue, onClickActions, other);
				break;
			default:	
				formElement = sprintf("<tr><td>%s:</td><td><input type='%s' id='formElement%d-%d' value='%s' onClick='%s' %s/></td></tr>", 
				label, type, id, this.id, defaultValue, onClickActions, other);
		} 
		this.dom.append(formElement);
		$("#formElement"+id+"-"+this.id).val = defaultValue;
	},

	addButton : function(label, id, onClickActions){
		var formElement;
		formElement = sprintf("<tr><td><input type='button' value='%s' id='formElement%d-%d' onClick='%s'/></td><td></td></tr>",
			label, id, this.id, onClickActions);
		this.dom.append(formElement);
	},

	addDropdown : function(label, id, listItems, onChange) {
		var formElement;
		formElement = sprintf("<tr><td>%s</td><td><select id='formElement%d-%d' onChange="+onChange+">",
			label, id, this.id);
		for (let i in listItems){
			formElement += "<option value='" + i + "'>" + listItems[i] + "</option>";
		}
		formElement += "</select></td></tr>";
		this.dom.append(formElement);
	}
}