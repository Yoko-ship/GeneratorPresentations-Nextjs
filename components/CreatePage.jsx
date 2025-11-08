"use client";
import React, { useActionState, useEffect } from "react";
import { useState } from "react";
import Names from "./Names";
import { cardOptions } from "./options";
import { textManners } from "./options";
import classes from "@/app/make-present/page.module.css";
import WritePrompt from "@/lib/presentHanlder";
import Presentation from "./Presentation";
function CreatePage() {
  const [state, formAction, isPending] = useActionState(WritePrompt, null);

  return (
    <div className={classes.container}>
      {!state?.data ? (
        <div className={classes.widget}>
          <div className={classes.name}>
            <h2>Генерировать</h2>
          </div>
          <form action={formAction}>
            <div className={classes.select_div}>
              <select name={classes.card}>
                {cardOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select name={classes.manners}>
                {textManners.map((manner) => (
                  <option value={manner.value} key={manner.value}>
                    {manner.label}
                  </option>
                ))}
              </select>
            </div>
            <Names />
            <div>
              {state?.message && (
                <div className={classes.errors}>
                  <p>{state.message}</p>
                </div>
              )}
            </div>

            <div className={classes.input_div}>
              <input
                type="text"
                placeholder="Опишите что вы хотите создать"
                name="prompt"
                required
              />
              <button disabled={isPending}>{isPending ? "Загрузка...":"Генерировать"}</button>
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
