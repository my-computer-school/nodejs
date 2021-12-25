var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizehtml = require('sanitize-html');
var template = require('../lib/template_01.js');

router.get('/create', function(request,response){
	var title = '새로만들기';
	var list = template.list(request.list);
	var html = template.Html(title,
		`
		<form action="/page/process-create" method="post">
		<p>
			<input type="text" name="title" placeholder="title">
		</p>
		<p>
			<textarea name="description"></textarea>
		</p>
		<p>
			<input type="submit">
		</p>
		</form>
		`,
		list,
		''
	);
	response.send(html);
});

router.post('/process-create', function(request,response){
	var post = request.body;
	var title = post.title;
	var description = post.description;
	fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
		response.redirect(`/page/${title}`);
	});
});

router.get('/update/:pageid', function(request,response){
	var filterid = path.parse(request.params.pageid).base;
	fs.readFile(`data/${filterid}`, 'utf-8', function(err,description){
		var title = request.params.pageid;
		var list = template.list(request.list);                                              
		var html = template.Html(title, 
			`
			<a href="/page/create">create</a> 
			<a href="/page/update/${title}">update</a>
			`,
			`
			<form action="/page/process-update" method="post">
			<input type="hidden" name="id" value="${title}">
			<p>
				<input type="text" name="title" placeholder="title" value="${title}">  
			</p>
			<p>
				<textarea name="description">${description}</textarea>
			</p>
			<p>
				<input type="submit">
			</p>
			</form>
			`,
			list, 
		);                        
		response.send(html);
	});
});

router.post('/process-update', function(request,response){
	var post = request.body;  
	var id = post.id;                                    
	var title = post.title;               
	var description = post.description; 
	fs.rename(`data/${id}`, `data/${title}`, function(error){
		fs.writeFile(`data/${title}`, description, 'utf-8', function(err){       
			response.redirect(`/page/${title}`);
		});
	});
});

router.post('/process-delete', function(request,response){
	var post = request.body; 
	var id = post.id;
	var filterid = path.parse(id).base;
	fs.unlink(`data/${filterid}`, function(error){ 
		response.redirect('/');
	});
});

router.get('/:pageid', function(request,response,next){    
	var filterid = path.parse(request.params.pageid).base;                     
	fs.readFile(`data/${filterid}`, 'utf-8', function(err, description){ 
		if(err){
			next(err);
		} else {
			var title = request.params.pageid;
			var sanitizedtitle = sanitizehtml(title);
			var sanitizeddescription = sanitizehtml(description);
			var list = template.list(request.list);
			var html = template.Html(sanitizedtitle,
				`
				<a href="/page/create">create</a>
				<a href="/page/update/${sanitizedtitle}">update</a>
				<form action="/page/process-delete" method="post">
					<input type="hidden" name="id" value="${sanitizedtitle}">
					<input type="submit" value="delete">
				</form>
				`,
				list,
				`<h2>${sanitizedtitle}</h2>${sanitizeddescription}`
			);
			response.send(html);
		}
	});
});

module.exports = router;
