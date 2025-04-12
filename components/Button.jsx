import React from 'react'
import {useFormStatus } from 'react-dom'

function Button({dowload}) {
    const {pending} = useFormStatus()
  return (
    <button onClick={dowload} disabled={pending} className='btn-dowload'>
    {pending ? "Идет скачивания" : "Скачать"}
  </button>
  )
}

export default Button