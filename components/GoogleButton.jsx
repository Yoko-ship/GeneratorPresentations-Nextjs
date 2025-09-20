'use client'
import React from 'react'
import classes from "@/app/signIn/page.module.css"
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
function GoogleButton() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/profile"

  return (
    <div className={classes.googleBtn}>
        <button onClick={() => signIn("google",{callbackUrl})}>Sign in with Google</button>
    </div>
  )
}

export default GoogleButton