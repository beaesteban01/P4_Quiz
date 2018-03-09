const figlet = require('figlet');
const chalk = require('chalk');
/** 
 * Dar color a un string
 *
 *@param blabla
*/
const colorize = (msg, color) => {
	if (typeof color!== "undefined"){
		//msg = chalk[color].bold(msg);
		msg = chalk[color].bold(msg);
	}
	return msg;
};

/** 
 * Escribe el mensaje de log
 *
 *@param blabla
*/
const log =(msg, color) => {
	console.log(colorize(msg, color));
};

/** 
 * Texto grande
 *
 *@param blabla
*/
const biglog = (msg, color) => {
	log(figlet.textSync(msg, { horizontalLayout: 'full'}), color);
};

/** 
 * Mensaje de error
 *
 *@param blabla
*/
const errorlog =(emsg) => {
	console.log(`${colorize("Error", "red")}:${colorize(colorize(emsg, ""), "bgYellowBright")}`);
};

exports = module.exports = {
	colorize,
	log,
	biglog,
	errorlog
};