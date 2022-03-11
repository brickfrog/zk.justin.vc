(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;


var FloatWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
}

FloatWidget.prototype = new Widget();

FloatWidget.prototype.dragActive = false;

FloatWidget.prototype.coords = {
	offsetX: 0,
	offsetY: 0,
	currentX: 0,
	currentY: 0,
	startX: 0,
	startY: 0
}

FloatWidget.prototype.isWaitingForAnimationFrame = false;

FloatWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	var self = this;
	//this.parentWidget.setVariable("sq-floats-contentTiddler",this.contentTiddler);
	var wrapper = this.document.createElement("div");
	//$tw.utils.addClass(wrapper,"sq-float-wrapper");
	//wrapper.className = "sq-float-wrapper";
	
	var classes = this["class"].split(" ") || [];
	classes.push("sq-float-wrapper");
	
	var tiddler = this.wiki.getTiddler(this.contentTiddler);
	if(tiddler.fields && tiddler.fields.class) {
		//$tw.utils.addClass(wrapper,tiddler.fields.class);
		classes.push(tiddler.fields.class);
	}	
	wrapper.className = classes.join(" ");
	
	this.wrapper = wrapper;
	
	//either create header & body, and transclude content into body, 
	//		so I can add event listeners
	//or depend on the header having a given class.
	//var header = this.document.createElement("div");
		
	var widgetNode = this.wiki.makeTranscludeWidget(this.template,{
		mode: "inline",
		parentWidget: this,
		document: this.document,
		variables: {
			"sq-contentTiddler": this.contentTiddler,
			"sq-float-state": this.state,
			"sq-float-subtitle": this.subtitle
		},
		importPageMacros: true
	});
	widgetNode.render(wrapper,null);
	if(!this.children) {
		this.children = [];
	}
	this.children.push(widgetNode);
	
	parent.insertBefore(wrapper,nextSibling);
	
	this.dragItem = wrapper.querySelector(".sq-float-draggable");
	if(!this.dragItem) {
		return;
	}
	this.container = this.parentDomNode;
	
	this.wrapper.addEventListener("mousedown",this.setActive.bind(this),false);
	this.dragEnd = this.dragEnd.bind(this);
    this.drag = this.drag.bind(this);
	this.dragStart = this.dragStart.bind(this);
	this.container.addEventListener("mousedown",this.dragStart,false);
	this.container.addEventListener("touchstart",this.dragStart,false);
	
	this.readState();
	this.positionFloat();
	this.setActive();
	
	/* //uncomment to render content of widget
	this.makeChildWidgets();
	this.renderChildren(wrapper,null);
	*/
		
	this.domNodes.push(wrapper);
}

FloatWidget.prototype.setActive = function(event) {
	var floats = this.document.querySelectorAll(".sq-float-active");
	for(var i=0; i<floats.length; i++) {
		$tw.utils.removeClass(floats[i],"sq-float-active");
	}
	$tw.utils.addClass(this.wrapper,"sq-float-active");
}

FloatWidget.prototype.dragStart = function(event) {
	if(event.target === this.dragItem || $tw.utils.domContains(this.dragItem,event.target)) {
		
		var ctrls = this.dragItem.querySelector(".sq-float-header-ctrls");
		if(!ctrls || !$tw.utils.domContains(ctrls,event.target) ) {
			event.preventDefault();
		}
		
		var clientX = (event.type == "touchstart") ? event.touches[0].clientX : event.clientX;
		var clientY = (event.type == "touchstart") ? event.touches[0].clientY : event.clientY;
		
		this.coords.startX = clientX - this.coords.offsetX;
		this.coords.startY = clientY - this.coords.offsetY;
		this.dragActive = true;
		this.document.addEventListener("mouseup",this.dragEnd,false);
		this.document.addEventListener("touchend",this.dragEnd,false);
		this.document.addEventListener("mousemove",this.drag,false);
		this.document.addEventListener("touchmove",this.drag,false);
		$tw.utils.addClass(document.body,"sq-float-dragactive");
		//console.log("drag start");
	}	
}

FloatWidget.prototype.drag = function(event) {

	var self = this;

	var dragHandler = function(event) {
		if(this.dragActive) {
			
			var _window = this.document.defaultView;
			//var wrapperRect = this.wrapper.getBoundingClientRect();
			
			
			event.preventDefault();
			
			var clientX = (event.type == "touchmove") ? event.touches[0].clientX : event.clientX;
			var clientY = (event.type == "touchmove") ? event.touches[0].clientY : event.clientY;		
			
			if(clientX + this.wrapper.offsetWidth - this.coords.startX < 40 || clientX  + 40 - this.coords.startX > _window.innerWidth) {
				return false;
			} else if(clientY - this.coords.startY < 0 || clientY - this.coords.startY  + 40 > _window.innerHeight) {
				return false;
			}
			this.coords.currentX = clientX - this.coords.startX;
			this.coords.currentY = clientY - this.coords.startY;
			this.coords.offsetX = this.coords.currentX;
			this.coords.offsetY = this.coords.currentY;
			//console.log("dragging");
			this.positionFloat();
		}
	}
	
	dragHandler=dragHandler.bind(this);
	
	if(!this.isWaitingForAnimationFrame && this.dragActive) {
		window.requestAnimationFrame(function(){
			dragHandler(event);
			self.isWaitingForAnimationFrame = false;
		});
		this.isWaitingForAnimationFrame = true;
	}
	
}

/*


FloatWidget.prototype.drag = function(event) {
	if(this.dragActive) {
		
		var _window = this.document.defaultView;
		//var wrapperRect = this.wrapper.getBoundingClientRect();
		
		
		event.preventDefault();
		
		var clientX = (event.type == "touchmove") ? event.touches[0].clientX : event.clientX;
		var clientY = (event.type == "touchmove") ? event.touches[0].clientY : event.clientY;		
		
		if(clientX + this.wrapper.offsetWidth - this.coords.startX < 40 || clientX  + 40 - this.coords.startX > _window.innerWidth) {
			return false;
		} else if(clientY - this.coords.startY < 0 || clientY - this.coords.startY  + 40 > _window.innerHeight) {
			return false;
		}
		this.coords.currentX = clientX - this.coords.startX;
		this.coords.currentY = clientY - this.coords.startY;
		this.coords.offsetX = this.coords.currentX;
		this.coords.offsetY = this.coords.currentY;
		//console.log("dragging");
		this.positionFloat();
	}
}

*/

FloatWidget.prototype.dragEnd = function(event) {
	if(this.dragActive) {
		this.dragActive = false;
		this.coords.startX = this.coords.currentX;
		this.coords.startY = this.coords.currentY;
		//console.log("dragEnd",this.coords);
		this.document.removeEventListener("mouseup",this.dragEnd,false);
		this.document.removeEventListener("mousemove",this.drag,false);
		this.setState();
		$tw.utils.removeClass(this.document.body,"sq-float-dragactive");
	}
}

FloatWidget.prototype.positionFloat = function() {
	this.wrapper.style.transform = "translate3d(" + this.coords.currentX + "px, " + this.coords.currentY + "px, 0)";
}

FloatWidget.prototype.readState = function() {
	var stateTiddler = this.wiki.getTiddler(this.state);
	if(stateTiddler) {
		this.coords = JSON.parse(this.wiki.getTiddlerText(this.state));
	}
}

FloatWidget.prototype.setState = function() {
	if(this.state) {
		this.wiki.setText(this.state,"text",undefined,JSON.stringify(this.coords));
	}
}

FloatWidget.prototype.execute = function() {
	this.state = this.getAttribute("state");
	this.contentTiddler = this.getAttribute("contentTiddler");
	this.template = this.getAttribute("template","$:/plugins/sq/floats/float-template");
	this["class"] = this.getAttribute("class","");
	this.subtitle = this.getAttribute("subtitle");
}

FloatWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.state || changedAttributes.class || changedAttributes.subtitle || changedTiddlers[this.template]) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
}

exports.float = FloatWidget;

})();