'use client'
import React from 'react'
import classes from '@/app/page.module.css'
import {useRouter} from "next/navigation"
function Main() {
  const router = useRouter()
  return (
    <main className={classes.main}>
        <div className={classes.left}>
          <h1>Making presentations easy 😃</h1>
        </div>
        <div className={classes.right}>
          <span>Выберите шаблон, добавьте текст, <br/>и получите стильную презентацию за несколько минут.</span>
          <div className={classes.buttons}>
          <button onClick={() => router.push('/make-present')}>START FOR FREE</button>
            <button onClick={() => router.push("/contacts")}>LEARN MORE</button>
          </div>
        </div>
    </main>
  )
}

export default Main