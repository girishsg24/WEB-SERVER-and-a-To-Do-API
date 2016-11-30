var express=require('express');
var app=express();
var PORT=process.env.PORT||3000;
var bodyParser=require('body-parser');
var _=require('underscore');
app.use(bodyParser.json());
var id=1;
var todos=[];
app.get('/',
	function(req,res)
	{
		res.send("To-Do API Root");
	}
);

app.get('/todos',
		function(req,res)
		{
			var filteredToDos=todos;
			var queryParams=req.query;
			if(queryParams.hasOwnProperty('completed') && queryParams.completed==='true')
			{
				filteredToDos=_.where(filteredToDos,{completed:true});
			}
			else if(queryParams.hasOwnProperty('completed') && queryParams.completed==="false")
			{
				filteredToDos=_.where(filteredToDos,{completed:false});
			}
			if(queryParams.hasOwnProperty('q') && _.isString(queryParams.q)&&queryParams.q.length!=0)
			{

				filteredToDos=_.filter(filteredToDos,function(todo)
					{
						return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase())>-1;
					});
			}


		
			res.json(filteredToDos);
		
		}
	);

app.get('/todos/:id',
		function(req,res)
		{
			var matchedTodoItem=_.findWhere(todos,{id:parseInt(req.params.id)});
			if (matchedTodoItem)
				res.json(matchedTodoItem);
			else
				res.status(404).send('Page Not found Ya!');
		}
	);

app.post('/todos',
	function(req,res)
	{


		var body=_.pick(req.body,'description','completed');
		if (_.isBoolean(body.completed)&&_.isString(body.description)&& body.description.trim().length!=0)
		{
			body.description=body.description.trim();
			body.id=id++;
			todos.push(body);
			res.json(body);
		}
		else
			return res.status(400).send('Unable to create todos due to bad data');
	}
);

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

app.listen(PORT,
			function()
			{
				console.log("Running Express at port number: "+PORT+'!');
			}
		);


