import 'bootswatch/dist/cosmo/bootstrap.min.css';
import "@/styles/globals.css";
import "../configureAmplify";
import Navbar from "./components/navbar";

export default function App({ Component, pageProps }) {
  return(
    <div>
		<Navbar></Navbar>
		<Component {...pageProps} />
	</div>
  ) 
}
