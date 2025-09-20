import React from 'react'
import classes from "./page.module.css"
import { getServerSession } from 'next-auth'

async function page() {
    const session = await getServerSession()
    const userName = session.user.name
  return (
    <div className={classes.profile}>
        <h1>Profile of {userName}</h1>
        {session?.user?.image && (
            <img src={session.user.image} alt='user-image'></img>
        )}
    </div>
  )
}

export default page