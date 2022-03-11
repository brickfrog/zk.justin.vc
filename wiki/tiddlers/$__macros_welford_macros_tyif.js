/*\
title: $:/macros/welford/macros/tyif.js
type: application/javascript
module-type: macro

creates a youtube iframe, uses tiddler data if possible 
\*/

(function(){

"use strict";

exports.name = "yt";

exports.params = [
	{ name: "code" },
	{ name: "start" }
];

var seconds = function(time) {
	var hms = time || "00:00:00";
	var bits = hms.split(":");
	var h = +bits[0], m = +bits[1], s = +bits[2];
	return h*60*60 + m*60 + s;
}

exports.run = function(code, start) {	
	start = seconds(start);
	var tiddler = this.wiki.getTiddler(this.getVariable("currentTiddler"));
	if(tiddler) {
		if("yt-name" in tiddler.fields && !name){
			name = tiddler.fields["yt-name"];
		}		
		if("yt-code" in tiddler.fields && !code){
			code = tiddler.fields["yt-code"];
		}
	}	
	name = name || "default-iframe";
	code = code || "jNQXAC9IVRw";
	var output = ["<iframe class='yt' name='",name,"' frameborder='0' theme=light  src='https://www.youtube.com/embed/", code, "?start=", start,"&theme=dark&color=red&wmode=opaque' allowfullscreen/>\n\n"];
	return output.join("");
};


})();