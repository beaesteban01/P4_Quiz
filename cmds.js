const Sequelize = require('sequelize');

const {models} = require('./model');
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

const makeQuestion = (rl, text) => {
	return new Sequelize.Promise((resolve, reject) => {
		rl.question(colorize(text, 'red'), answer => {
			resolve(answer.trim());
		});
	});

};


exports.addCmd = rl => {
	makeQuestion(rl, 'Introduzca una pregunta: ')
	.then(q => { //Q es como si hicieramos un metodo que recibe (string q)
		return makeQuestion(rl, 'Introduzca una respuesta: ')
		.then(a => {
			return {question: q, answer: a};
		});
	})
	.then(quiz => {
		return models.quiz.create(quiz);
	})
	.then(quiz => {
		log(`${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
	})
	.catch(Sequelize.ValidationError, error => {
		errorlog('El quiz no es valido');
		error.errors.forEach(({message}) => errorlog(message));
	})
	.catch(error => {
		errorlog(error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

exports.listCmd = rl => {

	models.quiz.findAll() //voy a models y cojo el quizz y llamo a la promesa findall
	.then(quizzes =>  { //Tomo como parametro todos los quizzes que he cogido
		quizzes.forEach(quiz => {
			log(` [${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
		});
	})
	.catch(error => {
		errorlog(error.message);
	})
	.then(() => {
		rl.prompt();
	})
};



const validateId = id => {
	return new Promise((resolve, reject) => {
		if(typeof id === "undefined") {
			reject(new Error(`Falta el parametro <id>.`));
		} else {
			id = parseInt(id); // coge la parte entera
			if(Number.isNaN(id)) {
				reject(new Error(`El valor del parametro <id> no es un mumero`));
			} else {
				resolve(id);
			}
		}
	});
};
exports.showCmd = (rl, id) => {
	
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if(!quiz) { //compruebo que me han pasado un quiz de verdad
			throw new Error(`No existe quiz asociado a id=${id}`);
		}
		log(` [${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`)
	})
	.catch(error => {
		errorlog(error.message);
	})
	.then(() => {
		rl.prompt();
	}); 
	
};

exports.deleteCmd = (rl,id) => {
	validateId(id)
	.then(id => models.quiz.destroy({where: {id}}))
	.catch(error => {
		errorlog(error.message);
	})
	.then (() => {
		rl.prompt();
	});
};

exports.editCmd = (rl,id) => {
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if(!quiz) {
			throw new Error(`No existe quiz asociado a id=${id}`);
		}
			process.stdout.isTYY && setTimeout (() => {rl.write(quiz.question)}, 0);
			return makeQuestion(rl, 'Introduca la pregunta: ')
			.then (q => {
				process.stdout.isTYY && setTimeout (() => {rl.write(quiz.answer)}, 0);
				return makeQuestion(rl, 'Introduzca la respuesta: ')
				.then (a => {
					quiz.question = q;
					quiz.answer = a;
					return quiz;
				});
			});
	})
	.then (quiz => {
		return quiz.save();
	})
	.then(quiz => {
		log(` Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`)
	})
	.catch(Sequelize.ValidationError, error => {
		errorlog('El quiz no es valido');
		error.errors.forEach(({message}) => errorlog(message));
	})
	.catch (error => {
		errorlog(error.message); 
	})
	.then(() => {
		rl.prompt();
	});


			
};

exports.testCmd = (rl,id) => {

	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if(!quiz) {
			throw new Error(`No existe quiz asociado a id = ${id}`);
		}
		return makeQuestion(rl, `${quiz.question}?` )
		.then (a => {

			if(a.toLowerCase() === quiz.answer.toLowerCase()){
		   		log("Su respuesta es correcta");
		   		biglog('CORRECTO', 'green');
		   	} else {
		   		log("Su respuesta es incorrecta");
		   		biglog('INCORRECTO', 'red');
		   	}
		});
	})
	.catch (error => {
		errorlog(error.message); 
	})
	.then(() => {
		rl.prompt();
	});	
};

exports.playCmd = rl => {
	// Cargar todas las preguntas en un array
	// eliminarlas del array segun se pregunta
	// promesas



	let score = 0;
	let toBeResolve = [];
	let numPreguntas = 0;
		// //let i;


	models.quiz.findAll() //Paso todos los quizzes
		.then (quizzes => {
			quizzes.forEach((quiz, id) => {
					++numPreguntas;
			 toBeResolve.lenght = numPreguntas;

			 //console.dir(toBeResolve[1]);
			 //console.log(toBeResolve.lenght);

	    	toBeResolve.push(quiz.id);
			})
		 
		})
		.then (() => {
			if(toBeResolve.lenght === 0){
				log('No hay preguntas', 'red');
			}else{
				playOne();
			}
		})
		.catch (error => {
			errorlog(error.message);
		})
		.then (() => {
			rl.prompt();
		});

			const playOne = () => {

				
					var idAzar = Math.floor(Math.random()*(toBeResolve.lenght-score));
					//console.log(idAzar);
					
					//validateId(idAzar)
					let quiz = toBeResolve[idAzar];

					models.quiz.findById(toBeResolve[idAzar])
					.then(quiz => {
						// if(!quiz) {
						// 	throw new Error(`No existe quiz asociado a id = ${id}`);
						// }
						return makeQuestion(rl, `${quiz.question}?` )
						.then (a => {

							if(a.toLowerCase() === quiz.answer.toLowerCase()){
						   		score += 1;
								log(`CORRECTO - Llevas ${score} puntos`, 'green');

								toBeResolve.splice(idAzar, 1);
								playOne();
								if(toBeResolve.lenght === 0){
									log(`Fin. Has ganado. Preguntas acertadas: ${colorize(score, "yellow")}`, "green");
          							rl.prompt();
								}
						   	} else {
						   		log(`INCORRECTO - FIN DEL JUEGO. Has conseguido'${score}' puntos. Puedes volver a empezar`, 'red');
					  			rl.prompt();
						   	}
						})
						.catch (error => {
							errorlog(error.message);
							rl.prompt();
	            		})
						.then(() => {
	               			rl.prompt();
						});
				});
				
			}
			//playOne();
		




	// models.quiz.findAll()
	// 	.then (quizzes => {
	// 		quizzes.forEach((quiz, id) => {
 //        	toBeResolve[id] = quiz;
	// 		});
		
	// 	//});
		
		
	// 	//.then (() => {
	// 		const playOne = () => {

	// 		if (toBeResolve.lenght === 0 ){
	// 		log("Ninguna pregunta para mostrar, has ganado");
	// 		//log(`Llevas '${score}' puntos`);
	// 		rl.prompt();
	// 		} else {
	// 		let idAzar = Math.floor(Math.random()*(toBeResolve.lenght-score));
	// 		let quiz = toBeResolve[idAzar];
	// 		toBeResolve.splice(idAzar, 1);
	// 		//var id = toBeResolve[idAzar];
	// 		//let quiz = models.quiz.findById(id);
	// 		return makeQuestion(rl, quiz.question)
	// 			//.then(id => models.quiz.findById(id)){
	// 				// .then(quiz => {
	// 				// if(!quiz) {
	// 				// 	throw new Error(`No existe quiz asociado a id = ${id}`);
	// 				// }
	// 				// return makeQuestion(rl, `${quiz.question}?` )
	// 				.then (a => {
	// 					// quiz.answer = quiz.answer.replace(/á/gi,"a");
	// 					// quiz.answer = quiz.answer.replace(/é/gi,"e");
	// 					// quiz.answer = quiz.answer.replace(/í/gi,"i");
	// 					// quiz.answer = quiz.answer.replace(/ó/gi,"o");
	// 					// quiz.answer = quiz.answer.replace(/ú/gi,"u");
	// 					if(a.toLowerCase() === quiz.answer.toLowerCase()){
	// 				   		score += 1;
	// 						log(`CORRECTO - Llevas ${score} puntos`, 'green');
	// 						playOne();

	// 				  //  		if(score===numPreguntas){
	// 						// 	log('Has ganado', 'green');
	// 						// 	biglog(' :)   HAS   GANADO!!!!', 'green');
								
	// 						// 		rl.prompt();
								
	// 						// // } else {
	// 				  // //  			toBeResolve.splice(idAzar, 1);
	// 						// // 	playOne();
	// 				  // //  		} 
	// 				  //  	} else {
	// 				  	 }else {
	// 						log(`INCORRECTO - FIN DEL JUEGO. Has conseguido'${score}' puntos. Puedes volver a empezar`, 'red');
	// 				  		rl.prompt();
				
	// 					}
	// 				})
	// 				// })
	// 					.catch (error => {
	// 					errorlog(error.message);
	// 					rl.prompt();
 //            		})
	// 				.then(() => {
 //               			rl.prompt();
	// 				});
	// 		}


			
	// 			//};	
	// 		}
		
	// 	playOne();

	// 	});

};

exports.creditsCmd = rl => {
	log("Mostrar los autores:");
	log('Beatriz Esteban Navarro');
	rl.prompt();
};
