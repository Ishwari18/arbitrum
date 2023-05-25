import { useCollapse } from "react-collapsed";
import { FaMinus, FaPlus } from "react-icons/fa";

const styles = {
  faqContainer:
    "border border-[rgba(255,255,255,0.4)] py-6 px-5 my-5 mx-auto md:w-[80%] bg-[rgba(255,255,255,0.03)]",
  trigger:
    "flex flex-wrap md:flex-nowrap justify-between items-center cursor-pointer font-medium text-[1.2em]",
  content: "mt-5 p-0 m-0 text-left text-[0.9em]",
};

export default function Collapsible({ trigger, content }) {
  const config = {
    duration: 300,
    easing: "linear",
  };
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse(config);
  return (
    <div className={styles.faqContainer}>
      <div className={styles.trigger} {...getToggleProps()}>
        {trigger}
        {isExpanded ? <FaMinus size={"25px"} /> : <FaPlus size={"25px"} />}
      </div>
      <div {...getCollapseProps()}>
        <p className={styles.content}>{content}</p>
      </div>
    </div>
  );
}
