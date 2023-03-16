// @connect
// Connect to the websocket
let socket;
const connect = function() {

    document.writeln("server....");
    return new Promise((resolve, reject) => {
        const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
        const port = 5500;
        const socketUrl = `${socketProtocol}//${window.location.hostname}:${port}/`
       // const socketUrl = `${socketProtocol}//${"127.0.0.1"}:${port}/`
        
        // Define socket
        socket = new WebSocket(socketUrl);

        socket.onopen = (e) => {
            // Send a little test data, which we can use on the server if we want
            socket.send(JSON.stringify({ "loaded" : true }));
            // Resolve the promise - we are connected
            resolve();
        }

        socket.onmessage = (data) => {
            console.log(data);
            // Any data from the server can be manipulated here.
            let parsedData = JSON.parse(data.data);
            if(parsedData.append === true) {
                const newEl = document.createElement('p');
                newEl.textContent = parsedData.returnText;
                document.getElementById('websocket-returns').appendChild(newEl);
            }
        }

        socket.onerror = (e) => {
            // Return an error if any occurs
            console.log(e);
            resolve();
            // Try to connect again
            connect();
        }
    });
}

// @isOpen
// check if a websocket is open
const isOpen = function(ws) { 
    return ws.readyState === ws.OPEN 
}

// When the document has loaded
document.addEventListener('DOMContentLoaded', function() {
    // Connect to the websocket
    connect();
    // And add our event listeners
    document.getElementById('websocket-button').addEventListener('click', function(e) {
        if(isOpen(socket)) {
            socket.send(JSON.stringify({
                "data" : "this is our data to send",
                "other" : "this can be in any format"
            }))
        }
    });
});



componentDidMount = () => {
    this.ws = new WebSocket('ws://127.0.0.1:5500');

    this.ws.on('open', () => {
      this.ws.send(this.props.userName + ' has joined the Chat.');
    });

    this.ws.on('message', (message) => {
      const messages = this.state.messages;
      this.state.messages.push(message)
      this.setState({ messages: messages })
    });

    console.log('Component mounted.')
  }