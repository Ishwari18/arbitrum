import FAQs from "../components/homepage/FAQs";
import Section1 from "../components/homepage/Section1";
import Section2 from "../components/homepage/Section2";
import Section3 from "../components/homepage/Sections3";

const styles = {
  landingScreen: "w-[90%] py-40px bg-black mx-auto",
};

export default function LandingScreen() {
  return (
    <div className={styles.landingScreen}>
      <Section1 />
      <Section2 />
      <Section3 />
      <FAQs />
    </div>
  );
}
