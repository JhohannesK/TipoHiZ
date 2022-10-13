import Header from '../components/Header';
import TextArea from '../components/TextArea';
import Footer from '../components/Footer';

export default function Home() {
   return (
      <div className="2xl:max-w-7xl mx-auto bg-slate-800 text-gray-400 font-open-sans h-screen">
         <Header />
         <TextArea />
         <Footer />
      </div>
   );
}
