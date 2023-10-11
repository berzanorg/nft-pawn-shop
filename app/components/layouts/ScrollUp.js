import { useEffect, useState } from "react";
const ScrollUp = () => {
  const [visible, setVisible] = useState(false);
  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 300) {
        setVisible(true);
      } else if (scrolled <= 300) {
        setVisible(false);
      }
    });
  });

  return (
    <a
      id="scrollUp"
      href=""
      onClick={scrollUp}
      className={visible ? "visible" : ""}
    >
      <i className="uk-icon uk-icon-small unicon-chevron-up"></i>
      <span uk-icon="heart"></span>
    </a>
  );
};

export default ScrollUp;