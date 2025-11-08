import imageOne from "@/public/background/pexels-pixabay-235985.jpg"
import imageSecond from "@/public/background/freepik__adjust__49966.jpeg";
import imageThird from "@/public/background/pexels-padrinan-19670.jpg"
import imageFourth from "@/public/background/pexels-suzyhazelwood-1629236.jpg"


export function getRandomImages() {
  const images = [imageOne,imageSecond,imageThird,imageFourth]
  const randomedImages = Math.floor(Math.random() * images.length)
  return images[randomedImages].src
}
export function SlideConfig(x, y, fontSize, pres) {
  return {
    x: x,
    y: y,
    w: "80%",
    color: "363636",
    fill: { color: "F1F1F1" },
    fontFace: "Times New Roman",
    fontSize: fontSize,
    align: pres.AlignH.center,
  };
}
export function ImageConfig(url){
    return{
        path:url,
        type:"png",
          x: 2.5,
          y: 3.5,
          w: 4,
          h: 2,
    }
}