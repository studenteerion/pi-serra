import '../App.css';
import Header from '../components/header';

function Home() {
    return (
        <div>
            <Header index={0}/>
            <div className='grid md:grid-cols-4 mt-16 p-1'>
                <div></div>
                <div className='md:col-span-2 grid md:grid-cols-2 gap-1'>
                    <div className=' bg-sky-600 card'>
                        <h3>Temperatura attuale:</h3>
                        <h2>35°</h2>
                    </div>
                    <div className=' bg-orange-400 card'>
                        <h3>Umidità aria</h3>
                        <h2>50%</h2>
                    </div>
                    <div className=' bg-emerald-600 card'>
                        <h3>Umidità Terreno</h3>
                        <h2>--</h2>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
}

export default Home;