import { Button, Grid, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../Socket';
import { SocketContext } from '../SocketContext';
import '../index.css';

export const Home = () => {

    const { username, setUsername } = useContext(SocketContext);

    const [roomId, setRoom] = useState('');
    const [isCreatingRoom, setisCreatingRoom] = useState(false);

    const navigate = useNavigate();

    const codeMirrorRef = useRef<HTMLDivElement>();

    console.log(username);
    

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
        <>
            {!isCreatingRoom && <div className="p-2">
                <TextField id="outlined-basic" label="Room Id" variant="outlined" value={roomId} onChange={event => setRoom(event.target.value)} />
            </div>}

            <div className="p-2">
                <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={event => setUsername(event.target.value)} />
            </div>
            {
                !isCreatingRoom && <div className="p-2"><Button variant="contained" onClick={joinRoom}>Join Room</Button></div>
            }
            {
                isCreatingRoom && <div className="p-2"><Button className="p-2" variant="contained" onClick={createRoom}>Create Room</Button></div>
            }

            <Button variant="outlined" onClick={() => setisCreatingRoom(prev => !prev)}>{isCreatingRoom ? 'Join an existing room' : 'Create a new room'}</Button>

        </>
    )
}