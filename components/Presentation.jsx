import React from "react";
import PptxGenJS from "pptxgenjs";
import Button from "./Button";
import classes from "@/app/make-present/page.module.css"
import { getRandomImages } from "./presentationConfig";
import { SlideConfig } from "./presentationConfig";
import { ImageConfig } from "./presentationConfig";

function Presentation({ state }) {
  let pres = new PptxGenJS();
  pres.theme = { headFontFace: "Arial Light", bodyFontFace: "Arial" };
  console.log(state.images[0])
  
  const dowload = async () => {
    const firstSlide = pres.addSlide();
    let background = { path: getRandomImages() };
    firstSlide.background = background;
    firstSlide.addText(
      state.data.presentationTitle,
      SlideConfig(1.5, 0.5, 23, pres)
    );
    firstSlide.addText(
      `${state.lastName} ${state.firstName}`,
      SlideConfig(2.5, 5, 23, pres)
    );

    state.data.slides.forEach((slide, index) => {
      let slides = pres.addSlide();
      slides.background = background;
      slides.addText(slide.title, SlideConfig(1.5, 0.5, 23, pres));
      slides.addText(slide.description, SlideConfig(1.5, 2, 17, pres));
      console.log(state.images[0])
      if (index === 1) {
        slides.addImage(ImageConfig(state.images[0]))
      }
      if (index === 3) {
        slides.addImage(ImageConfig(state.images[1]));
      }
      if (index === 5) {
        slides.addImage(ImageConfig(state.images[2]));
      }
    });
    await pres.writeFile({ fileName: "Presentation.pptx" });
  };

  const backHandler = () => {
    window.location.reload();
  };
  return (
    <>
      <form
        action={async () => {
          await new Promise((res) => setTimeout(res, 1000));
        }}
        className={classes.dowload}
      >
        <h2>Ваш слайд готов</h2>
        <div className={classes.btns}>
          <button className={classes.back} onClick={backHandler} type="button">
            Назад
          </button>
          <Button dowload={dowload} />
        </div>
      </form>
    </>
  );
}

export default Presentation;
