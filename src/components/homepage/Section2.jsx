import JackPot1 from "../JackPot1";
import Competition from "./Competition";
import LastWinner from "./LastWinner";
import NextRound from "./NextRound";
import Stake from "./Stake";

const styles = {
  section2:
    "relative bg-black md:flex flex-wrap md:flex-nowrap justify-between items-start my-10",
  mainContentContainer: "md:w-[50%]",
  competitionContainer:
    "w-[100%] mt-6 md:flex flex-wrap md:flex-nowrap justify-between items-start gap-6 flex-1",
  lastWinnerContainer: "md:w-[48%]",
  nextRoundCompetitionContainer:
    "md:w-[48%] md:flex flex-col flex-wrap md:flex-nowrap justify-between gap-6",
};

export default function Section2() {
  return (
    <section className={styles.section2} id="stake">
      <JackPot1
        p={
          "By staking your $777 tokens, you are entering yourself into our weekly jackpot. Every week one random staker will be selected to win the entirety of our weekly jackpot through our trustless smart contract. The more tokens you have staked, the more chances you have to win."
        }
        title={"Weekly Jackpot"}
      />
      <div className={styles.mainContentContainer}>
        <Stake />
        <div className={styles.competitionContainer}>
          <div className={styles.lastWinnerContainer}>
            <LastWinner />
          </div>
          <div className={styles.nextRoundCompetitionContainer}>
            <NextRound />
          </div>
        </div>
      </div>
    </section>
  );
}
