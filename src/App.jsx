import { ThirdwebProvider } from "@thirdweb-dev/react";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import LandingScreen from "./screens/LandingScreen";

const activeChain = "ethereum";

function App() {
  return (
    <ThirdwebProvider activeChain={activeChain}>
      <>
        <Navbar />
        <LandingScreen />
        <Footer />
      </>
    </ThirdwebProvider>
  );
}

export default App;
