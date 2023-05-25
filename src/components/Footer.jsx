import { FaTelegramPlane, FaTwitter } from "react-icons/fa";

const styles = {
  footer:
    "w-full bg-black text-white text-[1.2em] flex flex-col flex-wrap md:flex-nowrap justify-between items-center relative bottom-0",
  miniFooter: " w-full text-center py-2 text-[0.8em]",
  about:
    "w-full flex flex-col flex-wrap md:flex-nowrap justify-center text-center items-center py-10 gap-8 bg-[#05030A]",
  p: "text-[0.8em]",
  h5: "text-[1em] font-bold text-[color:var(--light-green)]",
  accLinks:
    "text-[1.4em] flex flex-wrap md:flex-nowrap justify-center items-center gap-4",
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.about} id="about">
        <h5 className={styles.h5}>Privacy Policy</h5>
        <p className={styles.p}>@PepesJackpot</p>
        <p className={styles.p}>
          Passionate about what to do? <br />
          Join the community Telegram and contribute to the growth of Pepe's
          jackpot.
        </p>
        <p className={`${styles.p} ${styles.accLinks}`}>
          <a href="https://twitter.com/pepesjackpot">
            <FaTwitter />
          </a>
          <a href="https://t.me/pepesjackpot">
            <FaTelegramPlane />
          </a>
        </p>
      </div>
      <div
        className={styles.miniFooter}
        style={{ background: "var(--component-gradient-bg)" }}
      >
        Copyrights, 2022. All rights reserved.
      </div>
    </footer>
  );
}
