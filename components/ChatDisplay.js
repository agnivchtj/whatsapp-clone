import styled from 'styled-components';
import firebase from 'firebase/compat/app';
import { useRef, useState } from 'react';
import { db, auth } from '../firebase';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import TimeAgo from 'timeago-react';
import Message from './Message';
import { useEffect } from 'react';


const ChatDisplay = ({ messages, contactEmail }) => {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const endOfMsgRef = useRef(null);

    const [contactData] = useCollection(
        db
          .collection('users')
          .where('email', '==', contactEmail)
    );
    const contact = contactData?.docs?.[0]?.data();


    const [messagesData] = useCollection(
        db
          .collection('chats')
          .doc(router.query.id)
          .collection('messages')
          .orderBy('timestamp', 'asc')
    );


    // Display messages
    const displayMessages = () => {
        if (messagesData) {
            return messagesData?.docs.map(message => (
                <Message 
                    key={message.id} 
                    contact={message.data().user} 
                    message={{ ...message.data(), timestamp: message.data().timestamp?.toDate().getTime() }} 
                />
            ));
        } else {
            return JSON.parse(messages).map(message => (
                <Message 
                    key={message.id} 
                    contact={message.user} 
                    message={message} 
                />
            ));
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, messagesData]);

    const scrollToBottom = () => {
        endOfMsgRef.current.scrollIntoView({
            behavior: 'smooth', 
            block: 'start', 
        });
    }

    
    // Send message...
    const sendMessage = (e) => {
        e.preventDefault();

        // Update known last active
        db.collection('users').doc(user.uid).set({
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Add message to database
        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(), 
            message: input, 
            user: user?.email, 
            photoURL: user?.photoURL
        });

        // Empty out input & scroll to bottom
        setInput('');
    }

    return (
        <Container>
            <Header>
                {
                    contact ? (
                        <UserIcon src={contact?.photoURL} />
                    ) : (
                        <UserIcon>{contactEmail[0]}</UserIcon>
                    )
                }

                <HeaderInfo>
                    <h3>{ contactEmail }</h3>
                    {
                        contactData ? (
                            <p>
                                Last active: {` `}
                                {
                                    contact?.lastActive?.toDate() ? (
                                        <TimeAgo datetime={contact?.lastActive?.toDate()} />
                                    ) : (
                                        "Unavailable"
                                    )
                                }
                            </p>
                        ) : (
                            <p>Loading Last active...</p>
                        )
                    }
                </HeaderInfo>

                <IconList>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconList>

            </Header>

            <MessageContainer>
                {/** Display messages */}
                {displayMessages()}
                <MessageEnd ref={endOfMsgRef} />
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon />
                <Input value={input} onChange={(event) => setInput(event.target.value)} />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
                <MicIcon />
            </InputContainer>

        </Container>
    );
}



/** Styled components */
const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const UserIcon = styled(Avatar)``;

const HeaderInfo = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-top: 5px;
        margin-bottom: -12px;
    }

    > p {
        font-size: 14px;
        color: gray;
    }
`;

const IconList = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const MessageEnd = styled.div``;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`;


export default ChatDisplay;