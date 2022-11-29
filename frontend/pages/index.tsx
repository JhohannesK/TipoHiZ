import Head from 'next/head';
import HomePage from '../components/HomePage';
import TextArea from '../components/HomePage';

export default function Home() {
   return (
      <div className="">
         <div>
            <Head>
               <title>TipoHiZ</title>
            </Head>
         </div>

         <HomePage />
      </div>
   );
}
