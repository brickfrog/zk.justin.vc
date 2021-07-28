/*\

type: application/javascript
module-type: widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var FloatManagerWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
}

FloatManagerWidget.prototype = new Widget();

FloatManagerWidget.prototype.floats = {};

FloatManagerWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	$tw.floatManager = this;
	$tw.rootWidget.addEventListener("tm-float",function(event) {
		$tw.floatManager.addFloat(event.param,event.paramObject,event);
	});
	this.addEventListener("tm-close-float",function(event) {
		$tw.floatManager.closeFloat(event.param);
	});
	//this.renderChildren(parent,nextSibling);
	this.loadFloats();
}

FloatManagerWidget.prototype.execute = function() {
	this.managerState = this.getAttribute("state");
	this.persistFloats = this.getAttribute("persist") == "yes" ? true : false;
	//this.makeChildWidget();
}

FloatManagerWidget.prototype.makeFloatParseTree = function(title,options) {
	return {
		type: "float",
		attributes: {
			contentTiddler: {
				type: "string", 
				value: title
			},
			state: {
				type: "string",
				value: options.state
			},
			template: {
				type: "string",
				value: options.template
			},
			"class": {
				type: "string",
				value: options["class"]
			},
			subtitle: {
				type: "string",
				value : options.subtitle
			}
			
		}
	}
}


FloatManagerWidget.prototype.saveFloats = function() {
	if(this.persistFloats) {
		this.wiki.setText(this.managerState,"text",undefined,JSON.stringify(this.floats));
	}	
}

FloatManagerWidget.prototype.loadFloats = function() {
	if(!this.persistFloats && this.managerState)
		return;
	
	var stateTiddler = this.wiki.getTiddler(this.managerState);
	if(stateTiddler) {
		var floats = JSON.parse(this.wiki.getTiddlerText(this.managerState));
		for(var n in floats) {
			this.addFloat(floats[n].title,floats[n].options,null,false);
		}
	}
}

FloatManagerWidget.prototype.findFloat = function(stateTitle) {
	for(var i=0; i<this.children.length; i++) {
		if(this.children[i].parseTreeNode.attributes.state.value === stateTitle) {
			//return this.children[i];
			return i;
		}
	}
	return undefined;
}

FloatManagerWidget.prototype.closeFloat = function(stateTitle) {
	var index = this.findFloat(stateTitle);
	var widget = this.children[index];
	if(widget) {
		widget.removeChildDomNodes();
		this.children.splice(index,1);
		delete this.floats[stateTitle];
		this.saveFloats();
	}
}

FloatManagerWidget.prototype.addFloat = function(title,options,event,saveState) {
	if(this.findFloat(options.state) === undefined) {
		var parseTree = this.makeFloatParseTree(title,options);
		var widget = this.makeChildWidget(parseTree);
		widget.parentDomNode = this.parentDomNode;
		if(!this.children) {
			this.children = [];
		}
		this.children.push(widget);
		//var nextSibling = widget.findNextSiblingDomNode();
		widget.render(this.parentDomNode,null);
		
		this.floats[options.state] = {
			"title": title,
			"options" : options
		}
		if(saveState != false) {
			this.saveFloats();
		}
	}
}

//XX refresh handling for persist and state for FM

exports.floatmanager = FloatManagerWidget;

})();