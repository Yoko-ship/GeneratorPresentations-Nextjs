"use client";
import { getAuthToken, removeToken } from "@/lib/auth";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Profile() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const syncLogout = () =>{
      const token = getAuthToken();
      setToken(token);
    }
    syncLogout()
    window.addEventListener("storage",syncLogout)
    return () =>{
      window.removeEventListener("storage",syncLogout)
    }
  }, []);

  const handleLogout = () =>{
    removeToken()
    setToken(null)
  }

  return (
    <>
      {token ? (
        <li onClick={handleLogout}>Выйти</li>
      ) : (
        <li>
          <Link href="/login">Войти</Link>
        </li>
      )}
    </>
  );
}

export default Profile;
