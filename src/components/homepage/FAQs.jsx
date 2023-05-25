import Collapsible from "../Collapsible";

const styles = {
  faqs: "bg-black text-center py-10",
  h1: "text-white text-[3em] parisienne",
  fdesc: "text-white mt-2 mb-5",
  faqsContainer: "my-14",
};

export default function FAQs() {
  const faqs = [
    {
      trigger: "What is Pepe's jackpot?",
      content:
        "Pepe's jackpot is a cryptocurrency project aiming to give away as much ETH to $777 token holders as possible through our weekly lottery drawings.",
    },
    {
      trigger: "How is the weekly lottery funded?",
      content:
        "A portion of the taxes go directly into the lottery smart contract. These taxes are automatically sent to the lottery contract and can only ever be claimed by the winning wallet address.",
    },
    {
      trigger: "How can I enter the weekly lottery?",
      content:
        "Simply buy some $777 tokens and stake them in our non-custodial smart contract. Staked tokens are subject to a 7-day lockup period, which is designed to discourage short-term speculation and promote more stable, long-term growth.",
    },
    {
      trigger: "How can I purchase $777 tokens?",
      content:
        "$777 tokens can be purchased either on Uniswap or through an aggregator like Voltichange or 1inch, where you can swap Ethereum (ETH) or other ERC-20 tokens for $777. Make sure to use the official contract address provided on our website to avoid scams and counterfeit tokens.",
    },
    {
      trigger: "Is Pepe's jackpot safe?",
      content:
        "The $777 token was completely fair-launched, with 100% of the tokens being made available to the public in our IDO and 0 team tokens. Additionally, the team has no access to the funds in the lottery pool because of the renounced ownership of the smart contracts and our code is completely open-source so anyone can verify the safety of the protocol.",
    },
    {
      trigger: "On which blockchain is Pepe's jackpot built?",
      content:
        "Pepe's jackpot is built on the Ethereum blockchain, leveraging the security and superior liquidity provided by the Ethereum network.",
    },
    {
      trigger:
        "How can I stay updated on the latest news and developments about Pepe's jackpot?",
      content:
        "To stay updated on the latest news and developments, follow our official social media channels, such as Twitter and Telegram. You can also visit our website.",
    },
  ];
  return (
    <div className={styles.faqs} id="faqs">
      <h1 className={styles.h1}>FAQs</h1>
      <div className={styles.faqsContainer}>
        {faqs.map((faq, index) => (
          <Collapsible
            key={index}
            trigger={faq.trigger}
            content={faq.content}
          />
        ))}
      </div>
    </div>
  );
}
