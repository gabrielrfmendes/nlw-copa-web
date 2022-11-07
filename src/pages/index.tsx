import Image from 'next/image';
import logoImg from '../assets/logo.svg';
import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import userAvatarsExampleImg from '../assets/user-avatars-example.png';
import iconCheckImg from '../assets/icon-check.svg';
import { FormEvent, useState } from 'react';

interface HomeProps {
    poolsCount: number;
    guessesCount: number;
    usersCount: number;
}

export default function Home(props: HomeProps) {
    const [poolTitle, setPoolTitle] = useState('');

    async function createPool(event: FormEvent) {
        event.preventDefault();

        fetch('http://localhost:3333/pools', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: poolTitle
            })
        })
        .then((response) => response.json())
        .then((data) => {
            navigator.clipboard.writeText(data.code);

            setPoolTitle('');
            alert('Bolão criado com sucesso! O código foi copiado para a area de transferência.')
        })
        .catch((error) => {
            alert('Falha ao criar bolão, tente novamente!')
            console.error('Error:', error);
        });
    }

    return (
        <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
            <main className='mt-5'>
                <Image src={logoImg} alt='' />
                <h1 className='mt-14 text-white text-3xl font-bold leading-tight'>
                    Crie seu próprio bolão da copa e compartilhe entre amigos!
                </h1>

                <div className='mt-10 flex items-center gap-2'>
                    <Image src={userAvatarsExampleImg} alt='' />
                    <strong className='text-gray-100 text-xl'>
                        <span className='text-ignite-500'>
                            +{props.usersCount}
                        </span> pessoas já estão usando
                    </strong>
                </div>
                <form className='mt-5 flex gap-2' onSubmit={createPool}>
                    <input
                        className='flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-sm text-gray-100'
                        type="text" 
                        required 
                        placeholder='Qual nome do seu bolão?'
                        value={poolTitle}
                        onChange={event => setPoolTitle(event.target.value)}
                    />
                    <button 
                        className='px-6 py-4 rounded bg-yellow-500 text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700' 
                        type='submit'
                    >
                        Criar meu bolão
                    </button>
                </form>
                <p className='mt-5 text-sm text-gray-300 leading-relaxed'>
                    Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
                </p>
                <div className='mt-5 pt-5 border-t border-gray-600 text-gray-100 flex justify-between'>
                    <div className='flex items-center gap-6'>
                        <Image src={iconCheckImg} alt='' />
                        <div className='flex flex-col'>
                            <span className='font-bold text-2xl'>
                                +{props.poolsCount - 1} 
                            </span>
                            <span>
                                Bolões criados 
                            </span>
                        </div>
                    </div>

                    <div className='w-px h-14 bg-gray-600' /> 

                    <div className='flex items-center gap-6'>
                        <Image src={iconCheckImg} alt='' />
                        <div className='flex flex-col'>
                            <span className='font-bold text-2xl'>
                                +{props.guessesCount - 1} 
                            </span>
                            <span>
                                Palpites enviados 
                            </span>
                        </div>
                    </div>
                </div>
            </main>
            <Image src={appPreviewImg} alt='' quality={100} />
        </div>
    )
}

export async function getServerSideProps() {
    const [
        poolCountResponse, 
        guessCountResponse,
        userCountResponse
    ] = await Promise.all([
        fetch('http://localhost:3333/pools/count'),
        fetch('http://localhost:3333/guesses/count'),
        fetch('http://localhost:3333/users/count')
    ]);

    const poolData = await poolCountResponse.json();
    const guessData = await guessCountResponse.json();
    const usersCountData = await userCountResponse.json()


    return {
        props: {
            poolsCount: poolData.count,
            guessesCount: guessData.count,
            usersCount: usersCountData.count
        }
    }
}
