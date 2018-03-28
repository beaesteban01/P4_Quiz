const readline = require('readline');


const model = require('./model');
const {log, biglog, errorlog, colorize} = require('./out');
const cmds = require('./cmds');

const net = require("net"); //usar sockets


net.createServer(socket => { //toma como parametro el socket qe llegue del cliente


	console.log("Se ha conectado un cliente desde " +socket.remoteAddress);
//Mensaje inicial
biglog(socket, 'CORE QUIZ', 'green'); //quiero que lo escriba por el socket


const rl = readline.createInterface({
	input: socket, //nos sale el quiz por cada cliente (pero no los mensajes)
	output: socket,
	prompt: colorize("quiz > ", "blue"),
	completer: (line) => {
	  const completions = 'h help q quit add list show delete edit test p play credits '.split(' ');
	  const hits = completions.filter((c) => c.startsWith(line));
	  // show all completions if none found
	  return [hits.length ? hits : completions, line];
	}
});

socket
.on("end" , () => { rl.close()}) //para que cierre la conexion (readline)
.on("error" , () => { rl.close()}) //si hay error tn cierra

rl.prompt();

rl
.on('line', (line) => {
		
	let args = line.split(" ");
	let cmd = args[0].toLowerCase().trim();


		switch (cmd  ) {
			case '':
				rl.prompt(socket, rl);
				break;

			case 'h':
			case 'help':
				cmds.helpCmd(socket, rl);
				break;

			case 'quit':
			case 'q':
				cmds.quitCmd(socket, rl);
				break;
			
			case 'add':
				cmds.addCmd(socket, rl);
				break;
			
			case 'list':
				cmds.listCmd(socket, rl);
				break;
			
			case 'show':
				cmds.showCmd(socket, rl, args[1]);
				break;
			
			case 'delete':
				cmds.deleteCmd(socket, rl, args[1]);
				break;
			
			case 'edit':
				cmds.editCmd(socket, rl, args[1]);
				break;
			
			case 'test':
				cmds.testCmd(socket, rl, args[1]);
				break;
			
			case 'play':
			case 'p':
				cmds.playCmd(socket, rl);
				break;
			
			case 'credits':
				cmds.creditsCmd(socket, rl);
				break;
			
			default:
				log(socket,`Comando desconocido: '${colorize(cmd, 'red')}'`);
				log(socket,`Use '${colorize('help', 'green')}' para ver todos los comandos disponibles`);
				rl.prompt();
				break;
		}
		
	})

.on('close', () => {
	console.log(socket, 'Adiós!');
	
	process.exit(0);
});


})
.listen(3030); //Que escuche del puerto 3030 






