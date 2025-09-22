import SignInForm from '@/components/SignInForm'
import React from 'react'
import classes from "./page.module.css"

function page() {
  return (
    <div className={classes.signing}>
      <h1>Войти</h1>
      <SignInForm/>
    </div>
  )
}

export default page