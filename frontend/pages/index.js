import Footer from "./components/Footer"
import Header from "./components/Header"
import TextArea from "./components/TextArea"


export default function Home() {
  return (
    <div className="bg-slate-800 text-gray-400 font-open-sans h-screen">
      <Header />
      <TextArea />
      <Footer />
    </div>

  )
}
