from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import datetime

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, event_type: str, payload: Dict[str, Any]):
        event = {
            "type": event_type,
            "ts": datetime.datetime.utcnow().isoformat() + "Z",
            "payload": payload
        }
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(event)
            except Exception:
                disconnected.append(connection)
        for conn in disconnected:
            self.disconnect(conn)

ws_manager = ConnectionManager()

@router.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Heartbeat / ping-pong
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)

