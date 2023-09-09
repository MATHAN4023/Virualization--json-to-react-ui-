import socketio
import time

sio = socketio.Client()

# if use in raspberry pi use pip3 install python-socketio


@sio.on('message-from-node')
def on_message(data):
    print('Received message from server:', data)
    if data is False:
        sio.emit('process-result', 'Hello from Python!')

@sio.on('connect')
def on_connect():
    print('Connected to the Socket.IO server')


@sio.on('disconnect')
def on_disconnect():
    print('Disconnected from the Socket.IO server')


sio.connect('http://localhost:5000/')



try:
    while True:
        pass
except KeyboardInterrupt:
    sio.disconnect()

