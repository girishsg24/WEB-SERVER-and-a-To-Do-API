var express=require('express');
var app=express();
var PORT=process.env.PORT||3000;
var bodyParser=require('body-parser');
var _=require('underscore');
var db=require('./db.js');
app.use(bodyParser.json());

var todos=[];
app.get('/',
	function(req,res)
	{
		var line1="Welcome to SJSU Team-5's To-Do API, We help you manage you tasks better!";
		var line2="Save you to-do items in a jizzy!";
		var line3="All you need is to provide to-do JSON objects in the below format";
		var line4=JSON.stringify({
			description:'To-Do description Eg. walk the dog!',
			completed: true
		});
		res.send(line1+'\n'+line2+'\n'+line3+'\n'+line4);
	}
);

app.get('/todos',
		function(req,res)
		{
	
			var filteredToDos=todos;
			var filters={};



			if (req.query.hasOwnProperty('completed') && req.query.completed==='true')
				filters.completed=true;
			else if (req.query.hasOwnProperty('completed') && req.query.completed==='false')
				filters.completed=false;
			if(req.query.hasOwnProperty('q') && _.isString(req.query.q)&&req.query.q.length!=0)
			{
				filters.description={$like:'%'+req.query.q+'%'};
			}
			db.todo.findAll({where:filters}).then(
											function(todos)
											{
												if(todos.length!=0)
												{
													res.json(todos);
												}
												else
												{
													res.status(404).json('No matches Found');
												}
													
											},
											function(e)
											{
												res.status(500).send();
											}
											);
		}
	);

app.get('/todos/:id',
		function(req,res)
		{
			return db.todo.findById(parseInt(req.params.id)).then(
																function(todo)
																{
																	if (todo)
																		res.json(todo);
																	else
																		res.status(404).send("No such todo item exists");
																},
																function(e)
																{
																	res.status(500).send("Bad request made!");
																}
															);
		}
	);

app.post('/todos',
	function(req,res)
	{


		var validAttributes=_.pick(req.body,'description','completed');
		

		if (_.isBoolean(validAttributes.completed)&&_.isString(validAttributes.description)&& validAttributes.description.trim().length!=0)
		{
	
			db.sequelize.sync().then(function(){
				db.todo.create(validAttributes).then(
					function(todo){res.json(todo.toJSON() );},
					function(e){res.status(400).send('unable to create todo due to bad data')}
					);
			}).then(function(){console.log('Finished creating todo!')});

		}
});

app.delete('/todos/:id', function (req, res) {
	var matchedTodo = _.findWhere(todos, {id: parseInt(req.params.id)});

	if (!matchedTodo) {
		res.status(404).json({"error": "no todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

app.put('/todos/:id',function(req,res){
	var body=_.pick(req.body,'description','completed');
	var validAttributes={};
	var matchedTodo = _.findWhere(todos, {id: parseInt(req.params.id)});
	if(!matchedTodo)
	{
		return res.status(404).send('The todo item trying to update is not found');
	}
	if (body.hasOwnProperty('completed')&&_.isBoolean(body.completed))
	{
		validAttributes.completed=body.completed;
	}
	else if(body.hasOwnProperty('completed'))
	{
		return res.status(400).send();
	}
	
	if (body.hasOwnProperty('description')&&_.isString(body.description)&& body.description.trim().length!=0)
	{
		validAttributes.description=body.description;
	}
	else if(body.hasOwnProperty('description'))
	{
		return res.status(400).send();
	}
	
	_.extend(matchedTodo,validAttributes);
	return res.json(matchedTodo);


});

db.sequelize.sync().then(function(){
	app.listen(PORT,
			function()
			{
				console.log("Running Express at port number: "+PORT+'!');
			}
		);
});




