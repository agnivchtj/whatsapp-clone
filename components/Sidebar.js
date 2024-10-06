import styled from 'styled-components';
import { useState } from 'react';
import * as EmailValidator from 'email-validator';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Avatar, Button, IconButton } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import Chat from './Chat';

const Sidebar = () => {
    const [user] = useAuthState(auth);
    const [userChats] = useCollection(
        db
          .collection('chats')
          .where('users', 'array-contains', user.email)
    );

    const [searchInput, setSearchInput] = useState('');
    const searchChats = userChats?.docs.filter(
        chat => chat.data().users.find(user_ID => user_ID !== user.email && user_ID.includes(searchInput))
    );


    // Add chats
    const createChat = () => {
        const input = prompt('Please enter the email address of the user you wish to chat with.');

        if (!input) return null;

        // If the entered input is valid
        if (EmailValidator.validate(input) && !checkChat(input) && input !== user.email) {
            // If its a new chat, we add it to 'chats' collection in DB
            db
              .collection('chats')
              .add({
                  users: [user.email, input]
              });
        }
    }

    // Sign out function
    const signOut = () => {
        auth.signOut();
        window.location.href = '/';
    }

    // Check if 1-1 chat already exists
    const checkChat = (id) => {
        return !!userChats?.docs.find(
            chat => chat.data().users.find(user_ID => user_ID === id)?.length > 0
        );
    }

    
    // Show chats
    const displayChats = () => {
        if (searchInput.length > 0) {
            return (
                <div>
                    {/** Filtered chats */}
                    {
                        searchChats?.map(chat => (
                            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                        ))
                    }
                </div>
            );
        } else {
            return (
                <div>
                    <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

                    {/* List of chats */}
                    {
                        userChats?.docs.map(chat => (
                            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                        ))
                    }
                </div>
            );
        }
    }

    return (
        <Container>
            <Header>
                <UserIcon src={user?.photoURL} onClick={signOut} />

                <IconList>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconList>

            </Header>

            <Search>
                <SearchIcon />
                <SearchInput 
                    placeholder="Search in chat..." 
                    type="text" 
                    onChange={(e) => setSearchInput(e.target.value)}
                    required
                />
            </Search>

            {displayChats()}
        </Container>
    );
}


/** Styled components */
const Container = styled.div``;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserIcon = styled(Avatar)`
    margin: 10px;
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

const IconList = styled.div``;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

const SidebarButton = styled(Button)`
    width: 100%;

    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;

export default Sidebar;