

const model = require('./model');
const {log, biglog, errorlog, colorize} = require('./out');



exports.helpCmd = (rl) => {
	log('Comandos:');
	log('h|help - Listado de comandos');
	log("list - muestra todas las preguntas con su identificador");
	log("show<id> - muestra la pregunta y la respuesta asociada al identificador");
	log("add - añade un nuevo quiz al programa");
	log("delete <id> - elimina del programa el quiz asociado al identificador");
	log("edit <id> - edita la pregunta y la respuesta asociada al identificador");
	log("test <id> - prueba el quiz asociado al identificador");
	log("p|play - permite responder a todas las preguntas hasta que se falla una");
	log("credits - muestra el nombre del/los autor/es");
	log("q|quit - termina la ejecución del programa");
	rl.prompt();
};

exports.quitCmd = rl => {
	rl.close();
	rl.prompt();
};

exports.addCmd = rl => {
	rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
		rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {
			model.add(question, answer);
			log(` ${colorize(' Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
			rl.prompt();
		});
	});
	
};

exports.listCmd = rl => {

	model.getAll().forEach((quiz, id) => {
		log(`  [${colorize(id, 'magenta')}]: ${quiz.question}`);
	});
	rl.prompt();
};

exports.showCmd = (rl, id) => {
	
	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
	}else {
		try {
			const quiz = model.getByIndex(id);
			log(`  [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		} catch(error) {
			errorlog(error.message);
		}
	}

	rl.prompt();
};

exports.deleteCmd = (rl,id) => {
	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
	}else {
		try {
			model.deleteByIndex(id);
			
		} catch(error) {
			errorlog(error.message);
		}
	}
	rl.prompt();
};

exports.editCmd = (rl,id) => {
	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	} else {
		try {

			const quiz = model.getByIndex(id);

			process.stdout.isTYY && setTimeout (() => {rl.write(quiz.question)}, 0);

			rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

				process.stdout.isTYY && setTimeout (() => {rl.write(quiz.answer)}, 0);

				rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {
					model.update(id, question, answer);
					log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
					rl.prompt();
				});
			});
		} catch(error) {
			errorlog(error.message);
			rl.prompt();
		}
	}
};

exports.testCmd = (rl,id) => {
	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	} else {
		try {
			const quiz = model.getByIndex(id);
			rl.question(colorize(`${quiz.question}? `,'red'), resp => {
				
				resp.trim();
				quiz.answer = quiz.answer.replace(/á/gi,"a");
				quiz.answer = quiz.answer.replace(/é/gi,"e");
				quiz.answer = quiz.answer.replace(/í/gi,"i");
				quiz.answer = quiz.answer.replace(/ó/gi,"o");
				quiz.answer = quiz.answer.replace(/ú/gi,"u");
			   	//quiz.answer = quiz.answer.replace(/ñ/gi,"n");

			   	if(resp === quiz.answer.toLowerCase()){
			   		log("Su respuesta es correcta");
			   		biglog('CORRECTO', 'green');


			   	} else {
			   		log("Su respuesta es incorrecta");
			   		biglog('INCORRECTO', 'red');
			   	}

			   	rl.prompt();
			   });

		} catch(error){
			errorlog(error.message);
			rl.prompt();
		}
		
	}

};

exports.playCmd = rl => {
	let score = 0;


	let toBeResolve = [];

	let numPreguntas = model.count();
	let i;
	const playOne = () => {
		for (i=0; i<numPreguntas; i++){

			toBeResolve[i]=i;
			i++;


		}


		if (toBeResolve.lenght === 0 ){
			log("Ninguna pregunta para mostrar");
			log(`Llevas '${socre}' puntos`);
			rl.prompt();
		} else {


		//Elige id al azar
		var idAzar = Math.floor(Math.random()*(toBeResolve)); 
		var id = toBeResolve[idAzar];

		var quiz = model.getByIndex(id);
		//quitarla del array 
		//let elimina = toBeResolve[idAzar];
		toBeResolve.splice(idAzar, 1);


		if (typeof id === "undefined") {

			errorlog(`Falta el parámetro id.`);
			rl.prompt();
		} else {	
			try { 

				rl.question(colorize(`${quiz.question}? `,'red'), resp => {

					resp.trim();
					quiz.answer = quiz.answer.replace(/á/gi,"a");
					quiz.answer = quiz.answer.replace(/é/gi,"e");
					quiz.answer = quiz.answer.replace(/í/gi,"i");
					quiz.answer = quiz.answer.replace(/ó/gi,"o");
					quiz.answer = quiz.answer.replace(/ú/gi,"u");

					if(resp === quiz.answer.toLowerCase()){
						score += 1;
						log('CORRECTO', 'green');
						log(`Llevas'${socre}' puntos`);
						playOne();

					} else {
						log('INCORRECTO', 'red');
						log(`Has conseguido'${socre}' puntos. Puedes volver a empezar`);
					}

				});
			} catch (error) {
				errorlog(error.message);
				rl.prompt();

			}

		}
		
	}

	
}

playOne();

};

exports.creditsCmd = rl => {
	log("Mostrar los autores:");
	log('Beatriz Esteban Navarro');
	rl.prompt();
};


