import styled from 'styled-components';
import Head from 'next/head';
import Image from 'next/image';
import { auth, provider } from '../firebase';
import { Button } from '@material-ui/core';
import logo from '../public/logo.png';

const Login = () => {
    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert);
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                <Image 
                    src={logo} 
                    height={200} 
                    width={200} 
                    style={{ marginBottom: 50 }}
                />
                <Button onClick={signIn} variant='outlined'>Sign In with Google</Button>
            </LoginContainer>
        </Container>
    )
}


/** Styled components */
const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;

const LoginContainer = styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px;
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;

export default Login;