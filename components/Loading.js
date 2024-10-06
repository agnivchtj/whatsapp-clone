import Image from 'next/image';
import { Circle } from 'better-react-spinkit';
import logo from '../public/logo.png';

const Loading = () => {
    return (
        <center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
            <div>
                <Image 
                    src={logo} 
                    alt=""
                    style={{ marginBottom: 10 }}
                    height={90}
                />
                <Circle color="#3CBC28" size={45} />
            </div>
        </center>
    );
}

export default Loading;