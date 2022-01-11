import { Button, Grid, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '../Socket';
import { SocketContext } from '../SocketContext';
import '../index.css';
import Footer from '../components/Footer';

export const Home = () => {

    const { roomId: _roomId } = useParams();

    const { username, setUsername } = useContext(SocketContext);

    const [roomId, setRoom] = useState(() => _roomId ? _roomId : '');
    const [isCreatingRoom, setisCreatingRoom] = useState(false);

    const navigate = useNavigate();

    if (!socket.connected) {
        console.log('reconnecting socket');
        socket.connect();
    }

    useEffect(() => {
    }, [])

    const joinRoom = () => {
        if (roomId.length > 0 && username.length > 0) {
            console.log(`${roomId} ${username}`);
            navigate(`/room/${roomId}`, {
                state: {
                    username: username
                }
            });
        }
    }

    const createRoom = () => {
        if (username.length > 0) {
            console.log(`create new Room by ${username}`);
            socket.emit('createRoom', username, (roomId) => {
                navigate(`/room/${roomId}`, {
                    state: {
                        username: username
                    }
                });
            });
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: '100vh', alignItems: 'center'}}>
            <div style={{ flex: 1 }}>
                <h1 className="text-2xl p-3">Online Tech Interview Prep App</h1>

                {!isCreatingRoom && <div className="p-3">
                    <TextField style={{width: "100%"}} id="outlined-basic" label="Room ID" variant="outlined" value={roomId} onChange={event => setRoom(event.target.value)} />
                </div>}

                <div className="p-3" style={{ alignItems: 'center' }}>
                    <TextField style={{width: "100%"}} id="outlined-basic" label="Username" variant="outlined" value={username} onChange={event => setUsername(event.target.value)} />
                </div>
                {
                    !isCreatingRoom && <Button variant="contained" style={buttonStyle} onClick={joinRoom}>Join Room</Button>
                }
                {
                    isCreatingRoom && <Button style={buttonStyle} variant="contained" onClick={createRoom}>Create Room</Button>
                }

                <Button style={buttonStyle} variant="outlined" onClick={() => setisCreatingRoom(prev => !prev)}>{isCreatingRoom ? 'Join an existing room' : 'Create a new room'}</Button>
            </div>

            <Footer />

        </div>
    )
}

const buttonStyle = {
    margin: '1rem auto',
    display: "block"
}
