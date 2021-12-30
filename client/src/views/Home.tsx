import { Button, TextField } from '@mui/material';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { socket } from '../SocketContext';

export const Home = () => {

    const [roomId, setRoom] = useState('');
    const [username, setusername] = useState('');
    const [isCreatingRoom, setisCreatingRoom] = useState(false);

    useEffect(() => {
    }, [])

    const joinRoom = () => {
        if (roomId.length > 0 && username.length > 0) {
            console.log(`${roomId} ${username}`);
            socket.emit('joinRoom', roomId, username);
        }
    }

    const createRoom = () => {
        if(username.length > 0) {
            console.log(`create new Room by ${username}`);
            socket.emit('createRoom', username);
        }
    }

    return (
        <>
            {!isCreatingRoom && <div>
                <TextField id="outlined-basic" label="Room Id" variant="outlined" value={roomId} onChange={event => setRoom(event.target.value)} />
                <br />
            </div>}

            <div>
                <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={event => setusername(event.target.value)} />
                <br />
            </div>
            {
                !isCreatingRoom && <Button variant="contained" onClick={joinRoom}>Join Room</Button>
            }
            {
                isCreatingRoom && <Button variant="contained" onClick={createRoom}>Create Room</Button>
            }

            <br /><br />
            <Button variant="outlined" onClick={() => setisCreatingRoom(prev => !prev)}>{isCreatingRoom ? 'Join an existing room' : 'Create a new room'}</Button>
        </>
    )
}