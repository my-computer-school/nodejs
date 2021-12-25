var template = {                        // 객체 template
	Html:function (title, control, list, body){
		return `
			<!doctype html>
			<html>
			<head>
				<title>${title}</title>
				<meta charset="utf-8">
				<link rel="stylesheet" href="/css/style.css">
			</head>
			<body>
				<h1>
					<a href="/">home</a>
				</h1>
				${control}
				${list}
				${body}
			</body>
			</html>
			`
		;
	},
	list:function (filelist){
		var list = '<ul>';
		var i = 0;
		while(i < filelist.length){
			list = list + `<li><a href="/page/${filelist[i]}">${filelist[i]}</a></li>`;
			i = i + 1;
		}
		list = list + '</ul>';
		return list;
	}
}

module.exports = template;
