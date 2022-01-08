import { Container, Typography } from '@mui/material';
import React from 'react';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from "react-share";

const SocialMediaShare = (props: SocialMediaShareProps) => {
    const endpoint = process.env.NODE_ENV === 'production' ? 'https://tech-interview-prep-app.herokuapp.com/' : 'http://localhost:8080/';
    const shareUrl = `${endpoint}${props.roomId}`;

    return (
        <div>
            <Typography variant='h6' textAlign="center">Share with your friends🤝</Typography>
            <Container style={{
                display: "flex",
                flexFlow: "row wrap",
                justifyContent: "center",
                alignItems: "flex-start"
            }}>
                <FacebookShareButton url={shareUrl} title='' style={{ padding: "0 1rem" }} >
                    <FacebookIcon round size="36px" />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title='' style={{ padding: "0 1rem" }} >
                    <TwitterIcon round size="36px" />
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl} title='' style={{ padding: "0 1rem" }} >
                    <WhatsappIcon round size="36px" />
                </WhatsappShareButton>
                <EmailShareButton url={shareUrl} title='' style={{ padding: "0 1rem" }} >
                    <EmailIcon round size="36px" />
                </EmailShareButton>
            </Container>
        </div>
    )
}

type SocialMediaShareProps = {
    roomId: string
};

export default SocialMediaShare
