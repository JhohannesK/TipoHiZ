import Header from '../components/Header';
import TestArea from '../components/TextArea';
import Footer from '../components/Footer';

export default function Home() {
   return (
      <div className="bg-slate-800 text-gray-400 font-open-sans h-screen">
         <Header />
         <TestArea />
         <Footer />
      </div>
   );
}
