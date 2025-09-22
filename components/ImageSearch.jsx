'use client'
import React, { useState } from 'react'
import { searchImage } from '@/lib/unsplash'

function ImageSearch() {
    const [query,setQuery] = useState("")
    const [images,setImages] = useState([])

    const handleSearch = async(e)=>{
        e.preventDefault()
        const results = await searchImage(query)
        setImages(results) 
    }
    return (
        <div className="p-4">
        <form onSubmit={handleSearch} >
          <input
            type="text"
            placeholder="Введите запрос..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
          >
            Искать
          </button>
        </form>
  
        <div>
          {images.map((img) => (
            <img
              key={img.id}
              src={img.urls.small}
              alt={img.alt_description}
            />
          ))}
        </div>
      </div>
  )
}

export default ImageSearch