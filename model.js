 const Sequelize = require('sequelize'); //cargo modulo sequeloze
 const sequelize = new Sequelize("sqlite:quizzes.sqlite", {logging: false});

 sequelize.define('quiz', {
 	question:{
 		type: Sequelize.STRING,
 		unique: { msq: "Ya existe esta pregunta"}, //si se repite saca este msg
 		validate: {notEmpty: {msg: "La pregunta no puede estar vacía"}}
 	},
 	answer: {
 		type: Sequelize.STRING,
 		validate: {notEmpty: {msg: "La respuesta no puede estar vacía"}}
 	}
 });

sequelize.sync() //miro si estan las tablas en la base de datos
.then(()=> sequelize.models.quiz.count()) //paso funcion que cuenta cuantos hay
.then(count =>{ //toma como parametro el valor de la cuenta
	if(!count){ //si es cero, crea algunas preguntas
		return sequelize.models.quiz.bulkCreate([
			{ question: "Capital de Italia", answer: "Roma"},
			{ question: "Capital de España", answer: "Madrid"}
			]);
	}
})
.catch(error => {
	console.log(error);
});

module.exports = sequelize;