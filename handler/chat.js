// Import modules for SQLite database
const { Database } = require('sqlite3')
const { open } = require('sqlite')

const irisnative = require('intersystems-iris-native')

// Connect to InterSystems IRIS
const connection = irisnative.createConnection({host: '20.190.99.50', port: 1972, ns: 'RUOQI', user: 'yuki', pwd: 'sys'});
const iris = connection.createIris();
console.log("Connected to InterSystems IRIS")


// Function to handle a new client connecting
const joinChat = async (io, socket, username) => {
    io.emit('new user', username) // Send the username to all clients

    // Create a message to inform everyone of the new user
    const message = {
        username: "SERVER",
        content: `${username} has joined the chat`
    }



    await getChatLog(socket) // Send the chat log history to the new client
    await sendMessage(io, message) // Send the join message to all clients
}

// Function to send the last 300 entries of the chat log to the new client
const getChatLog = async (socket) => {
    // Open chat database

    //Fetch from IRIS    
		globalValue = iris.get("^testglobal", "1");
		console.log("The value of ^testglobal(1) is " + globalValue);

    


    socket.emit('receive chatlog', globalValue) // Send the messages to the new client
}

// Function to handle a user sending a message
const sendMessage = async (io, message) => {
    const { username, content } = message // Get the user who sent the message and its content

    iris.set("Test message", "^testglobal", "1");


    io.emit('receive message', {
        username: username,
        content: content
    }) // Send the message to all clients
}

// Function to handle a client disconnecting
const leaveChat = async (io, socket, username) => {
    // Create a message to inform everyone the user left
    const message = {
        username: "SERVER",
        content: `${username} has left the chat`
    }

    await sendMessage(io, message) // Send the leave message

    socket.broadcast.emit('user left', username) // Inform clients the user left, giving their username
}

module.exports = {
    joinChat,
    sendMessage,
    leaveChat
}
