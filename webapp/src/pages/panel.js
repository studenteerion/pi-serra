import '../App.css';
import Header from '../components/header';
import { useEffect, useState } from 'react';

function Panel() {
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');

    const handleSave = async () => {
        const data = {
            description: description,
            url: url
        };

        try {
            const response = await fetch('http://localhost:8080/controls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Header index={1} />
            <div className='grid md:grid-cols-4 mt-16 p-1'>
                <div></div>
                <div className='md:col-span-2'>
                    <div className='p-3 rounded-md bg-sky-400 shadow-md flex flex-col gap-2 ' id='temperature'>
                        <div className='flex flex-col gap-1'>
                            <h4>Nome dispositivo: </h4>
                            <input type='text' className='rounded-md p-1 w-full focus:outline-none' value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <h4>Indirizzo: </h4>
                            <input type='text' className='rounded-md p-1 w-full focus:outline-none' value={url} onChange={e => setUrl(e.target.value)} />
                        </div>

                        <div className='text-center'>
                            <button className='px-3 py-2 rounded-md text-white font-semibold bg-green-600' onClick={handleSave}>Aggiungi</button>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
}

export default Panel;
