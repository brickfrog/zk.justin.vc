/*\
Macro to output tiddlers matching a filter as atom entries.
http://www.ietf.org/rfc/rfc4287.txt
\*/

(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "atom-entries";

exports.params = [
	{name: "filter"}
];

exports.run = function(filter) {
	var data = [], lines=[],
		server = $tw.wiki.getTiddlerText("$:/.tb/templates/atom/server",""),
		tiddlers = this.wiki.filterTiddlers(this.wiki.getTextReference(filter,""));
	for(var t=0; t < tiddlers.length; t++) {
		var tiddler = this.wiki.getTiddler(tiddlers[t]);
		if(tiddler) {
			var title = tiddler.getFieldString("title"),
				modified = tiddler.getFieldString("modified"),
				summary = tiddler.getFieldString("description"),
				url = server + "#" + encodeURIComponent(title);
			lines.push("`<entry>`");
			lines.push("&nbsp;&nbsp;`<title>`[[" + title + "]]`</title>`");
			lines.push("&nbsp;&nbsp;`<id>`<$text text='" + url + "'/>`</id>`");
			lines.push("&nbsp;&nbsp;`<link href='`" + url + "`'/>`");
			if (modified) {
				lines.push("&nbsp;&nbsp;`<updated>`" +
					$tw.utils.formatDateString(
						$tw.utils.parseDate(modified),
						"YYYY-0MM-0DDT0hh:0mm:0ss+02:00") +
					"`</updated>`");
			}
			summary = $tw.wiki.renderText(
				"text/plain",
				"text/vnd.tiddlywiki",
				summary || "",
				{
					parseAsInline: true,
					variables: {
						currentTiddler: title
				}
			});
			if(!tiddler.getFieldString("summary")) {
				summary = ""
			} else {
				summary = summary.replace(/\</mg,"").replace(/\>/mg,"");
			}
			summary = summary;
			lines.push("&nbsp;&nbsp;`<summary>`<$text text=\"\"\"" + summary + "\"\"\"/>`</summary>`");
			lines.push("`</entry>`");
		};
	}
	return "&nbsp;&nbsp;" + lines.join("&#10;&nbsp;&nbsp;");
};

})();