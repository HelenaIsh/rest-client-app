"use client";

import { useRouter } from "next/navigation";
import { logOut } from "@/firebase/auth";

const Logout: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push("/signin");
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;