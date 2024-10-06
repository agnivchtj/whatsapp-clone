import styled from 'styled-components';
import { db, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import ChatDisplay from '../../components/ChatDisplay';

const Chat = ({ messages, chat }) => {
  const [user] = useAuthState(auth);
  const contact = chat.users?.filter(i => i !== user?.email)[0];

  return (
    <Container>
      <Head>
        <title>Chat with {contact}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatDisplay messages={messages} contactEmail={contact} />
      </ChatContainer>
    </Container>
  );
}

/** Styled components */
const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

export default Chat;

// Server-side rendering
export async function getServerSideProps(context) {
  const ref = db.collection('chats').doc(context.query.id);

  // Prep messages on server
  const messageResponse = await ref.collection('messages').orderBy('timestamp', 'asc').get();

  const messagesData = messageResponse?.docs.map(
    doc => ({
      id: doc.id, 
      ...doc.data()
    })
  );

  const messages = messagesData.map(
    data => ({
      ...data, 
      timestamp: data.timestamp.toDate().getTime()
    })
  );

  // Prep the chats
  const chatResponse = await ref.get();

  const chat = {
    id: chatResponse.id, 
    ...chatResponse.data()
  }

  return (
    {
      props: {
        messages: JSON.stringify(messages), chat: chat
      }
    }
  );
}
