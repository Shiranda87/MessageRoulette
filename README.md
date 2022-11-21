# MessageRoulette

1. Download the code from GitHub: https://github.com/Shiranda87/MessageRoulette
2. In the root directory run: docker-compose up
3. Go to the client tool: http://amritb.github.io/socketio-client-tool/#
    - Add a listener to 'message-from-server' (used for messages from the server, not the other clients)
    - Connect to http://localhost:8080/
4. On conection you'll get a token from the server (in the 'message-from-server' listener).
5. You'll need to send this token on each API event to the server (you can see if the token is authenticated on each event in the 'message-from-server' listener).
6. If you are connected for more then 15 minutes, the token will be revoked. You can use the 'create-session-token' event to get a new token from the server. You'll see the new token in the 'message-from-server' listener.
6. API events:
    - create-session-token:
      - Generates a new token and returns the token in the 'message-from-server' listener.
      - The token is valid for 15 minutes.
      - No request fields required.
    - spin:
      - Sends a message to a random user.
      - Request fields JSON example:
        {
          "text": "test message",
          "token": "session-token-from-server"
        }
      - You can see the message that was sent in the 'message' listener of one of the online clients.
    - wild:
      - Sends a message to X random users.
      - Request fields JSON example:
        {
          "text": "test message",
          "numOfUsers": 2,
          "token": "session-token-from-server"
        }
      - You can see the message that was sent in the 'message' listener of X of the online clients.
    - blast:
      - Sends a message to all users.
      - Request fields JSON example:
        {
          "text": "test message",
          "token": "session-token-from-server"
        }
      - You can see the message that was sent in the 'message' listener of X of the online clients.
    
