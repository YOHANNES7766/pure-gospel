"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token || user.role?.toLowerCase() !== "admin") {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Checking admin access...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <div>{children}</div>;
}
