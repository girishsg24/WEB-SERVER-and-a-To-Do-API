var express=require('express');
var app=express();
var PORT=process.env.PORT||3000;
var bodyParser=require('body-parser');
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
			res.json(todos);
		}
	);

app.get('/todos/:id',
		function(req,res)
		{
			var matchedTodoItem;
			todos.forEach(
				function(curTodo)
				{
					if (curTodo.id==req.params.id)
						matchedTodoItem=curTodo;
				}
			);
			if (matchedTodoItem)
				res.json(matchedTodoItem);
			else
				res.status(404).send('Page Not found Ya!');
		}
	);

app.post('/todos',
	function(req,res)
	{
		var body=req.body;
		body.id=id++;
		todos.push(body);
		res.json(body);
	}
);

app.listen(PORT,
			function()
			{
				console.log("Running Express at port number: "+PORT+'!');
			}
		);


