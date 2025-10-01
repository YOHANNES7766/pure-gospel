export async function getSession() {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (token && user) {
        return { user, token };
      }
    } catch (e) {
      console.error("Failed to parse session:", e);
    }
  }
  return null;
}
