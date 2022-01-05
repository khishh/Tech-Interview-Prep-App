import { AppBar, Box, Button, Container, IconButton, Link, Menu, Toolbar, Typography } from '@mui/material';
import React from 'react';

const RoomHeader = (props: RoomHeaderProps) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar>
                <Toolbar>
                    <Typography>
                        Tech Interview Online App
                    </Typography>
                    <Button style={{ color: 'white' }} onClick={props.startScreenShare}>Screen Record</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

type RoomHeaderProps = {
    startScreenShare: () => void;
}

export default RoomHeader;
