"use client";
import React, { useActionState, useEffect } from "react";
import { useState } from "react";
import Names from "./Names";
import { cardOptions } from "./options";
import { textManners } from "./options";
import "@/css/create_page.css";
import WritePrompt from "@/lib/presentHanlder";
import Presentation from "./Presentation";
import { getAuthToken, tokenLoader} from "@/lib/auth";
import Link from "next/link";
function CreatePage() {
  const [state, formAction, isPending] = useActionState(WritePrompt, null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const initalToken = getAuthToken()
    setToken(initalToken)
    const syncLogout = () =>{
      const token = getAuthToken();
      setToken(token);
    }
    window.addEventListener("storage",syncLogout)
    return () =>{
      window.removeEventListener("storage",syncLogout)
    }
  }, []);



  
  return (
    <div className="container">
      {!state?.data ? (
        <div className="widget">
          <div className="name">
            <h2>Генерировать</h2>
          </div>
          <form action={formAction}>
            <div className="select-div">
              <select name="card">
                {cardOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select name="manners">
                {textManners.map((manner) => (
                  <option value={manner.value} key={manner.value}>
                    {manner.label}
                  </option>
                ))}
              </select>
            </div>
            <Names />
            <div></div>
            {state?.message && (
              <div className="errors">
                <p>{state.message}</p>
              </div>
            )}
            {!token && (
              <div className="errors">
                <Link href="/login">Пожалуста войдите в аккаунт</Link>
              </div>
            )}

            <div className="input-div">
              <input
                type="text"
                placeholder="Опишите что вы хотите создать"
                name="prompt"
                required
              />
              {token && (
                <div className="div-btn">
                  <button disabled={isPending}>
                    {isPending ? "Загрузка..." : "Генерировать"}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      ) : (
        <Presentation state={state} />
      )}
    </div>
  );
}

export default CreatePage;
