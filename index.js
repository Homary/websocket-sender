const http = require('http');
const WebSocketServe = require('ws').Server;
const fs = require('fs');

let port = process.argv[process.argv.length -1];

let server = http.createServer((req, res) => {
	if(req.url === '/'){
		let data = fs.readFileSync(__dirname + '/index.html', 'utf-8');

		res.write(data.replace('{{ip}}', `localhost:${port}`));
		res.end();
	}
})


server.listen(port)

console.log('Now server is listening at \033[70mlocalhost: ' + port + '!\033[39m');

let wss = new WebSocketServe({
	server: server
})

let total = 0;

wss.on('connection', ws => {

	total++;
	console.log('新连接 +1');

	ws.on('message', msg => {
		broadcast(JSON.parse(msg));
		console.log(JSON.parse(msg))
	})

	ws.send(JSON.stringify({
		total: total
	}))

	ws.on('close', () => {
		total--;
		console.log('连接 -1')
	})
})

function broadcast(msg) {
	wss.clients.forEach(client => {
		client.send(JSON.stringify(msg))
	})
}