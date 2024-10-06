import styled from 'styled-components';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from 'moment';

const Message = ({ contact, message }) => {
    const [user] = useAuthState(auth);
    const MessageElement = (user.email === contact) ? Sender : Receiver;

    return (
        <Container>
            <MessageElement>
                { message.message }
                <Timestamp>
                    {
                        message.timestamp ? moment(message.timestamp).format('LT') : '...'
                    }
                </Timestamp>
            </MessageElement>
        </Container>
    );
}


/** Styled components */
const Container = styled.div``;

const MessageItem = styled.p`
    width: fit-content;
    padding: 15px;
    border-radius: 5px;
    margin: 10px;
    min-width: 10px;
    padding-bottom: 25px;
    position: relative;
    text-align: right;
`;

const Sender = styled(MessageItem)`
    margin-left: auto;
    background-color: #dcf8c6;
`;

const Receiver = styled(MessageItem)`
    text-align: left;
    background-color: whitesmoke;
`;

const Timestamp = styled.span`
    padding: 10px;
    position: absolute;
    font-size: 9px;
    bottom: 0;
    text-align: right;
    right: 0;
    color: gray;
`;

export default Message;