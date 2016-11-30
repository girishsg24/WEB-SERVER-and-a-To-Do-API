module.exports=function(sequelize,DataTypes)
{
	return sequelize.define('todo/',
			{
				description:
				{
					type:DataTypes.STRING,
					allowNull:false,
					notEmpty:true
				},

				completed:
				{
					type:DataTypes.BOOLEAN,
					allowNull:false,
					defaultValue:false
				}
			}
		);
}