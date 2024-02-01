import '../App.css';
import Header from '../components/header';

function Panel() {

    return (
        <div>
            <Header index={1} />
            <div className='grid md:grid-cols-4 mt-16 p-1'>
                <div></div>
                <div className='md:col-span-2'>
                    <div className='p-3 rounded-md bg-sky-400 shadow-md flex flex-col gap-2 ' id='temperature'>
                        <div className='flex flex-col gap-1'>
                            <h4>Temperatura attivazione: </h4>
                            <input type='number' id='temperature-input' className='rounded-md p-1 w-full focus:outline-none' />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <h4>Frequenza aggiornamento: </h4>
                            <input type='number' id='temperature-input' className='rounded-md p-1 w-full focus:outline-none' />
                        </div>
                        
                        <div className='text-center'>
                            <button className='px-3 py-2 rounded-md text-white font-semibold bg-green-600'>Salva</button>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
}

export default Panel;