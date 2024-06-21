import React from 'react'
import Cam from '@/components/Cam';
import Header from "@/components/Nav";
import Columns from "@/components/Colums";
import Sensors from "@/components/Sensors";
import Actuators from "@/components/Actuators";
import Button from '@/components/Button';
import Link from 'next/link';




const page = () => {
  return (
   <main>
    <div className="container">
      <div className="row h-100">
        <div className="col-4">
          <Link href="/">Home</Link>
        </div>
        <div className="col-4">
          <Link href="/cam"><Cam /></Link>
      </div>
      <div className='row h-100'>
      <Columns/>
      </div>
    </div>
    </div>
        {/*<Sensors />*/}
        {/*<Actuators />*/}
        {/*<Button />*/}
        </main>
);
}

export default page;