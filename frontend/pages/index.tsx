import Head from 'next/head';
import TextArea from '../components/TextArea';

export default function Home() {
   return (
      <div className="">
         <div>
            <Head>
               <title>TipoHiZ</title>
            </Head>
         </div>

         <TextArea />
      </div>
   );
}
