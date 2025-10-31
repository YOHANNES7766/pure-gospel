"use client";

import { useState } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Ministries from "../components/Ministries";
import Events from "../components/Events";
import Sermons from "../components/Sermons";
import CallToAction from "../components/CallToAction";
import Contact from "../components/Contact";
import Blog from "../components/Blog"; // ✅ capitalize (React components must start with uppercase)
import LoginModal from "../components/LoginModal"; 
import SignupModal from "../components/SignupModal"; 

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
      <Hero />
      <About />
      <Ministries />
      <Events />
      <Sermons />
      <Blog /> {/* ✅ Fixed */}
      <CallToAction />
      <Contact />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onOpenLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}
