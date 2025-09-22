export async function searchImage(query){
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}`)
    if(!res.ok){
        throw new Error("Произошла ошибка при получении изображении")
    }
    const data = await res.json()
    return data.results[0].urls.full
}
