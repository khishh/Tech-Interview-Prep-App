import { Button, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../Socket';
import { SocketContext } from '../SocketContext';

export const Home = () => {

    const {username, setUsername} = useContext(SocketContext);

    const [roomId, setRoom] = useState('');
    const [isCreatingRoom, setisCreatingRoom] = useState(false);

    const navigate = useNavigate();

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
        if(username.length > 0) {
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
            {!isCreatingRoom && <div>
                <TextField id="outlined-basic" label="Room Id" variant="outlined" value={roomId} onChange={event => setRoom(event.target.value)} />
                <br />
            </div>}

            <div>
                <TextField id="outlined-basic" label="Username" variant="outlined" onChange={event => setUsername(event.target.value) }/>
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