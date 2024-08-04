export class Notifications {
	private sessions: Set<WebSocket>;

	constructor(private state: DurableObjectState) {
		this.sessions = new Set();
	}

	async fetch(request: Request) {
		if (request.headers.get('Upgrade') === 'websocket') {
			const pair = new WebSocketPair();
			this.handleSession(pair[1]);
			return new Response(null, { status: 101, webSocket: pair[0] });
		}
		return new Response('Expected a websocket', { status: 400 });
	}

	handleSession(webSocket: WebSocket) {
		this.sessions.add(webSocket);
		webSocket.addEventListener('close', () => this.sessions.delete(webSocket));
	}

	broadcast(message: string) {
		this.sessions.forEach((session) => session.send(message));
	}
}
