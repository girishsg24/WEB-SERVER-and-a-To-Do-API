 var Sequelize=require('sequelize');
 var env=process.env.NODE_ENV||'devlocal';

 if (env==='production')
 	var sequelize=new Sequelize(PROCESS.env.DATABASE_URL,{dialect:'postgres'});
 else
 		var sequelize=new Sequelize(undefined,undefined,undefined,{
 		'dialect':'sqlite',
 		'storage':__dirname+'/data/dev-gir-database.sqlite'
	 });
 var db={
 		sequelize:sequelize,
 		Sequelize:Sequelize,
 		todo:sequelize.import(__dirname+'/models/todo.js')
 		};
module.exports=db;