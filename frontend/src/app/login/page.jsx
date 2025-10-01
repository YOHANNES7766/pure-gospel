"use client";

import { useState } from "react";
import LoginModal from "../components/LoginModal";

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onOpenSignup={() => alert("Open signup modal here")}
      />
    </div>
  );
}
