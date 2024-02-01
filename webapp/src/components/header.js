import {useEffect} from 'react';
import '../App.css';

function Header({index}) {
    useEffect(() => {
        const pageList = document.getElementById('page-list');
        if (pageList) {
            const pages = pageList.getElementsByTagName('h3');
            if (pages) {
                for (let i = 0; i < pages.length; i++) {
                    if (i === index) {
                        pages[i].classList.add('font-bold');
                    } else {
                        pages[i].classList.remove('font-bold');
                    }
                }
            }
        }
    }, [index]);

    return (
        <div className="grid md:grid-cols-4 grid-cols-3 p-3 bg-green-400 fixed w-full top-0">
            <div>
                <h2>Pi-Serra</h2>
            </div>
            <div className='md:col-span-2'></div>
            <div className='flex flex-row place-content-end gap-4 text-right' id='page-list'>
                <h3><a href='/'>Home</a></h3>
                <h3><a href='/panel'>Panel</a></h3>
                <h3><a href='/graph'>Graph</a></h3>
            </div>
        </div>
    );
}

export default Header;