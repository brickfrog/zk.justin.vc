/*\
title: $:/macros/welford/macros/tylnk.js
type: application/javascript
module-type: macro

updates an existing YT iframe's time
\*/

(function(){

"use strict";

exports.name = "ytlnk";

exports.params = [
	{ name: "start" },
	{ name: "name" },
	{ name: "code" }
	
];

//stolen from Rich Shumaker http://www.richshumaker.com/tw5/TiddlyWiki-Hangouts.html#%24%3A%2F.rich%2Fmacros%2Fyoutube-embed.js
//might change this......
var seconds = function(time) {
	var hms = time || "00:00:00";
	var bits = hms.split(":");
	var h = +bits[0], m = +bits[1], s = +bits[2];
	return h*60*60 + m*60 + s;
}

exports.run = function(start, name, code) {	
	start = start || "0:00:00";
	var ms_start = seconds(start);
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
	var output = ["<a target='",name,"' href='https://www.youtube.com/embed/", code, "?start=", ms_start,"&autoplay=1&theme=dark&color=red&wmode=opaque'>",start,"</a>"];
	//<a href=<<video 2037>> target="chandler">@t=2037</a>
	return output.join("");
};

})();