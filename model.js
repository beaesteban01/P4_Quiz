
const fs = require("fs");


//Fichero que voy a crear con todos los quizzes
const DB_FILENAME = "quizzes.json";
//Modelo de datos
//
// En esta variable se mantienen todos los quizzes necesarios
// Es un array de objetos donde cada objeto tiene los atributos question y answer
let quizzes =[
	{
		question: "Capital de Italia",
		answer: "Roma"
	},
	{
		question: "Capital de Francia",
		answer: "París"	
	},
	{
		question: "Capital de España",
		answer: "Madrid"
	},
	{
		question: "Capital de Portugal",
		answer: "Lisboa"
	}
];


const load = () => {
	fs.readFile(DB_FILENAME, (err, data) => {
		 if (err) {

		 	//La primera vez no existe el ficher
		 	if (err.code ===  "ENOENT"){
		 		save(); //valores iniciales
		 		return;
		 	}
		 	throw err;
		 }

		 let json = JSON.parse(data);

		 if (json){
		 	quizzes=json;
		 }
	});
};

const save = () => {
	fs.writeFile(DB_FILENAME, 
		JSON.stringify(quizzes),
		err => {
			if(err) throw err;
		});
};
//Devuelve el numero total de preguntas
exports.count = () => quizzes.length;

//Añade un nuevo quiz
exports.add = (question, answer) => {
	quizzes.push({
		question: (question || " ").trim(),
		answer: (answer || " ").trim()
	});
	save();
};

//Actualiza el quiz situado en la posicion del index
//Si el id no existe, mando un error
exports.update = (id, question, answer) => {
	const quiz = quizzes[id];
	if(typeof quiz === "undefined"){
		throw new Error(`El valor del parámetro id no es válido`);
	}
	quizzes.splice(id, 1 ,{
		question: (question || " ").trim(),
		answer: (answer || " ").trim()
	});
	save();
};

//Devuelve todos los quizzes existentes
//Hago una copia del JSON pora no modificar nada
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

//Devolver un clon del quiz almacenado en la posicion dada
exports.getByIndex = id => {

	const quiz = quizzes[id];
	if(typeof quiz ==="undefined"){
		throw new Error(`El valor del parámetro id no es válido`);
	}
	return JSON.parse(JSON.stringify(quiz));
};

//Elimina el quiz situado en la posicion dada
exports.deleteByIndex = id => {
	const quiz = quizzes[id];
	if(typeof quiz === "undefined"){
		throw new Error(`El valor del parámetro id no es válido`);
	}
	quizzes.splice(id, 1);
	save();
};

//Carga los quizzes almacenados en el fichero
load();