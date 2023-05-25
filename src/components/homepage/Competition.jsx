const styles = {
  Competition: "w-full p-9 rounded-3xl relative bg-[color:var(--dark-red)]",
  h1: "text-[1.5em]",
  p: "text-[1.5em] mt-5",
};

export default function Competition() {
  return (
    <div className={styles.Competition}>
      <h1 className={styles.h1}>Competition</h1>
      <p className={styles.p}>1,243 Wallets</p>
    </div>
  );
}
