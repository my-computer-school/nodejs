// express middleware 사용
// router 만들기
// /page /routes/page.js로 이동
// router 변수 만들기

var express = require('express');
var app = express();
var port = 5000;
var fs = require('fs');
var template = require('./lib/template_01.js');
var qs = require('querystring');
var bodyparser = require('body-parser');
var compression = require('compression');
var router_page = require('./routes/page');

app.use(bodyparser.urlencoded({extended:false}));
app.use(compression());
app.use(express.static('public'));
app.get('*', function(request,response,next){
	fs.readdir('./data', function(error, filelist){
		request.list = filelist;
		next();
	});
});

app.use('/page', router_page);

app.get('/', function(request,response){    
	var title = 'welcome';
	var description = 'welcome home';
	var list = template.list(request.list);
	var html = template.Html(title, 
		`<a href="/page/create">create</a>`, 
		list, 
		`<h2>${title}</h2>${description}
		<img src="/images/possa.png" style="width:100%">`   
	);
	response.send(html);
});

app.use(function(request,response,next){
	response.status(404).send('sorry cant find that!');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
