import React from "react";
import FaqSection from "./FaqSection";
import Footer from "../menu/Footer";

const LandingFooterStack = () => {
  return (
    <div className="landing-footer-stack">
      <FaqSection />
      <Footer isStatic={true} />
    </div>
  );
};

export default LandingFooterStack;
