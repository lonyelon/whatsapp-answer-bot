//                                                                      INCLUDES
////////////////////////////////////////////////////////////////////////////////

const venom = require( 'venom-bot' );
const fs = require( "fs" );

//                                                                      SETTINGS
////////////////////////////////////////////////////////////////////////////////

const FILE = "chats.json";			// File where the joined chats will be kept and read from
const CHANCES = 5;					// Chances that the bot will answer a random message
const COMMAND_START = "!bot";		// Command that makes the bot join a chat
const SETUP_MSG = "Vale, hecho";	// Message that is sent when the bot joins a chat
const TRIGGERS = [					// Triggers that make the bot always answer
	"ergio", "?"
];

const ANSWERS = [ 					// Answers that the bot is going to give when receiving a message
	"Si", "si", "No", "no",
	"no se", "puede", "Puede", "No se", "A lo mejor si", "A lo mejor no", "mmmmmm",
	"Si? venga ya",
	"No me digas", "Que buen mensaje", 
	"jajajajaj", "jeje",
	"Grande!", "grande!!!!" 
];

//                                                                          CODE
////////////////////////////////////////////////////////////////////////////////

// Read chats stored in file
const data = fs.readFileSync( FILE, "utf-8" );
const chats = JSON.parse( data );

// Start venom bot
venom.create( ).then( ( client ) => start( client ) ).catch( ( erro ) => {
	console.log( erro );
} );

// Returns a random number in [min,max)
function rand( min, max ) {
	return Math.floor( Math.random( ) * max ) + min;
}

// Checks if a string contains any of the elements of words
function contains( string, words ) {
	for ( var i = 0; i < words.length; i++ ) {
		if ( string.includes( words[i] ) ) {
			return true;
		}
	}
	return false;
}

// Bot start function
function start( client ) {
	client.onMessage( ( message ) => {

		// If someone says "!bot" then the bot is activated in that chat
		if ( message.body === COMMAND_START && !contains( chats, message.from ) ) {

			// Add chat to the chat list and store it for later
			chats.push( message.from );
			fs.writeFile( FILE, JSON.stringify( chats ), "utf8", ( err ) => {} );

			// Notify the group with a message
			client.sendText( message.from, SETUP_MSG ).catch( ( erro ) => {
				console.error( "Error when sending: ", erro );
			} );
			return;
		}

		// Answer messages
		if ( contains( message.from, chats ) && ( rand( 0, CHANCES ) === 0 || contains( message.body, triggers ) ) ) {
			client.sendText( message.from, respuestas[rand( 0, respuestas.length )] ).catch( ( erro ) => {
				console.error( "Error when sending: ", erro );
			} );
		}
	} );
}
