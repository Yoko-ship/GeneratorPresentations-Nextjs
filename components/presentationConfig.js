import imageOne from "@/public/background/freepik__adjust__50812.png";
import imageSecond from "@/public/background/freepik__adjust__49966.jpeg";
import imageThird from "@/public/background/freepik__adjust__85555.jpeg";
import imageFourth from "@/public/background/freepik__adjust__68802.jpeg";

export function getRandomImages() {
  const images = [imageOne, imageSecond, imageThird, imageFourth];
  const randomImage = Math.floor(Math.random() * 4);
  return images[randomImage].src;
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