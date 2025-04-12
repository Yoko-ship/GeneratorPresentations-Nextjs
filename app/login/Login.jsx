"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { LoginHandler } from "@/lib/action";
import { useRouter } from "next/navigation";
function Login() {
  const [status, formAction] = useActionState(LoginHandler, null);

  const router = useRouter()
  useEffect(() =>{
    if(status && status.token){
      localStorage.setItem("token",status?.token)
      window.dispatchEvent(new Event("storage"));
    }
    if(status?.success){
      router.push("/")
    }
  },[status])
  


  return (
    <div className="form">
      <form action={formAction}>
        <label>Почта</label>
        <input type="email" required name="email" />
        <label>Пароль</label>
        <input type="password" required minLength={8} name="password" />
        <button>Войти</button>
        {status?.error && (
          <ul id="error">
            {status.error.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        )}
        {status?.success && (
          <ul id="success">
            <li>{status.success}</li>
          </ul>
        )}
        <div className="register">
          <Link href="/register">Регистрация</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
