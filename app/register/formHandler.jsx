"use client"
import Field from "@/components/Field";
import React, { useEffect } from "react";
import { RegisterHandler } from "@/lib/action";
import { useActionState } from "react";
import "../login/authorization.css"
import { useRouter } from "next/navigation";
export default function RegisterPage() {
  const [status,formAction,isPending] = useActionState(RegisterHandler, null);
  const router = useRouter()
  useEffect(() =>{
    localStorage.setItem("token",status?.token)
    window.dispatchEvent(new Event("storage"));
    if(status?.success){
      router.push("/")
    }
  },[status])
  
  return (
    <div className="form">
      <form action={formAction}>
        <div className="info">
          <h2>Добро пожаловать</h2>
          <p>Нам нужно собрать некоторую информацию прежде чем начать</p>
        </div>
        <div className="first-sector">
          <Field label="Email" type="email" name="email" />
          <div className="information">
            <Field
              label="Пароль"
              type="password"
              name="password"
              minLength="8"
            />
            <Field
              label="Подтвердить пароль"
              type="password"
              name="confirmPassword"
              minLength="8"
            />
          </div>
          <hr></hr>
          <div className="information">
            <Field label="Имя" type="text" name="first-name" />
            <Field label="Фамилия" type="text" name="last-name" />
          </div>
          <div className="register-div">
            <button className="register-btn">{isPending ? "Ожидания":"Регистрация"}</button>
          </div>

          {status?.success && (
            <ul id="success">
              <li>{status.success}</li>
            </ul>
          )}
          
          {status?.error && (
            <ul id="error">
                {status.error.map((err,index) =>(
                    <li key={index}>{err}</li>
                ))}
            </ul>
          )}
          
        </div>
      </form>
    </div>
  );
}
