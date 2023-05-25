import { useState } from "react";
import cssStyles from "../styles/navbar.module.scss";
import Logo from "../assets/logo.png";
import ConnectWalletBtn from "./ConnectWalletBtn";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const links = ["Home", "Stake", "FAQs"];
  const [activeNav, setaActiveNav] = useState("home");
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const styles = {
    navbar:
      "py-[40px] px-[5%] flex flex-wrap md:flex-nowrap justify-between items-center md:relative z-10",
    imageContainer: "h-[60px]",
    linksContainer: `h-[100%] md:h-[initial] bg-[rgba(0,0,0,1)] md:bg-transparent md:border-none border border-[rgba(255,255,255,0.3)] z-10 w-[95%]  ${
      showNavbar ? "block" : "hidden"
    } md:flex flex-col md:flex-row fixed p-5 md:p-0 top-0 right-0 md:static md:w-[initial] flex-wrap md:flex-nowrap justify-between items-center gap-[50px]`,
    logo: "h-[190%]",
    active: "text-[color:var(--red)]",
    link: "text-[2em] my-8 md:my-0 md:text-[2em] block md:inline-block parisienne",
    closeNav: "md:hidden text-white cursor-pointer absolute top-10 right-10",
  };

  return (
    <div className={`${cssStyles.navbar} ${styles.navbar}`}>
      {/* responsive */}
      <div className={styles.imageContainer}>
        <img src={Logo} className={styles.logo} alt="logo" />
      </div>
      <div className={"md:hidden"}>
        <FaBars onClick={handleShowNavbar} size={"40px"} />
      </div>
      <div className={styles.linksContainer}>
        {links.map((link) => (
          <a
            href={`${
              link.toLowerCase() != "medium"
                ? "#" + link.toLowerCase()
                : "https://medium.com"
            }`}
            key={link}
            className={`${styles.link} ${
              activeNav === link.toLowerCase() && styles.active
            }`}
            onClick={() => setaActiveNav(link.toLowerCase())}
          >
            {link}
          </a>
        ))}
        <ConnectWalletBtn />
        <FaTimes
          className={styles.closeNav}
          size={"30px"}
          onClick={handleShowNavbar}
        />
      </div>
    </div>
  );
}
