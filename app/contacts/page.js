import classes from "./page.module.css";

import { getRandomImages } from "@/components/presentationConfig";
export default function AboutUs() {
  return (
    <div className={classes.contacts}>
      <h2>Контакты</h2>
      <div>
        <p>
          По всем вопросам:{" "}
          <a href="mailto:yuko.brandon13@gmail.com">yuko.brandon13@gmail.com</a>
        </p>
      </div>

      {/* <button onClick={getRandomImages}>Test</button> */}
    </div>
  );
}
