import { Button, Grid, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '../Socket';
import { SocketContext } from '../SocketContext';
import '../index.css';

export const Home = () => {

    const { roomId: _roomId } = useParams();

    const { username, setUsername } = useContext(SocketContext);

    const [roomId, setRoom] = useState(() => _roomId ? _roomId : '');
    const [isCreatingRoom, setisCreatingRoom] = useState(false);

    const navigate = useNavigate();

    console.log(username);
    console.log(_roomId);

    // const screenShareRef = useRef<HTMLVideoElement | null>(null);

    // navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    //     .then(stream => {
    //         if (screenShareRef.current) {
    //             screenShareRef.current.srcObject = stream;
    //         }
    //     });

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
        <>
            <h1 className="text-2xl p-3">Online Tech Interview Prep App</h1>

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

// type HomeProps = {
//     roomId? : string
// }