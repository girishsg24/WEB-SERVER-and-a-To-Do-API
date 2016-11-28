var express=require('express');
var app=express();
var PORT=process.env.PORT||3000;
var todos=[
			{
				id:1,
				description:'Call mom in the morning.',
				completed:false

			},
			{
				id:2,
				description:'Be Batman & save somebody!',
				completed:false
			},
			{
				id:3,
				description:'Be Awesome!',
				completed:true
			}


		];

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
app.listen(PORT,
			function()
			{
				console.log("Running Express at port number: "+PORT+'!');
			}
		);