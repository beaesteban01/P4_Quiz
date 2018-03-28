const figlet = require('figlet');
const chalk = require('chalk');

const net = require("net"); //usar sockets


/** 
 * Dar color a un string
 *
 *@param blabla
*/
const colorize = (msg, color) => {
	if (typeof color!== "undefined"){
		msg = chalk[color].bold(msg);
	}
	return msg;
};

/** 
 * Escribe el mensaje de log
 *
 *@param blabla
*/
const log =(socket, msg, color) => {
	socket.write(colorize(msg, color) +"\n");
};

/** 
 * Texto grande
 *
 *@param blabla
*/
const biglog = (socket, msg, color) => {
	log(socket, figlet.textSync(msg, { horizontalLayout: 'full'}), color);
};

/** 
 * Mensaje de error
 *
 *@param blabla
*/
const errorlog =(socket, emsg) => {
	socket.write(`${colorize("Error", "red")}:${colorize(colorize(emsg, "red"), "bgYellowBright")} +"\n"`);
};

exports = module.exports = {
	colorize,
	log,
	biglog,
	errorlog
};