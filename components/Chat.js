import styled from 'styled-components';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import { Avatar } from '@material-ui/core';


const Chat = ({ id, users }) => {
    const router = useRouter();
    const [user] = useAuthState(auth);


    const contactEmail = users?.filter(i => i !== user?.email)[0];
    const [contactData] = useCollection(
        db
          .collection('users')
          .where('email', '==', contactEmail)
    );
    const contact = contactData?.docs?.[0]?.data();


    const seeChat = () => {
        router.push(`/chat/${id}`);
    }


    return (
        <Container onClick={seeChat}>
            {
                contact ? (
                    <UserIcon src={contact?.photoURL} />
                ) : (
                    <UserIcon>{ contactEmail[0] }</UserIcon>
                )
            }
            <p>{ contactEmail }</p>
        </Container>
    );
}



/** Styled components */
const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
    :hover {
        background-color: #e9eaeb;
    }
`;

const UserIcon = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;


export default Chat;