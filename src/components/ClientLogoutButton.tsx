"use client";

import { useAuth } from "@/context/AuthContext";
import Logout from "@/components/Logout";

const ClientLogoutButton = () => {
  const { user } = useAuth();

  if (user) {
    return <Logout />;
  }

  return null;
};

export default ClientLogoutButton;