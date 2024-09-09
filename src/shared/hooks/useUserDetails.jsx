/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { logout as logoutHandler } from "./useLogout";

const getUserDetails = () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }
  return null;
};

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState(getUserDetails());
  const [report, setReport] = useState(false);


  useEffect(() => {
    const details = getUserDetails();
    setUserDetails(details);
  }, []);

  const logout = () => {
    logoutHandler();
    setUserDetails(null);
    localStorage.removeItem("token");
  };

  return {
    id: userDetails?.id || "Id no encontrado",
    username: userDetails?.username || "Guest",
    email: userDetails?.email || "Guest",
    role: userDetails?.role || "404NotFound",
    unidadId: userDetails?.unidadId || "Unidad Id no encontrada",
    report,
    userDetails,
    setReport,
    logout,
  };
};
