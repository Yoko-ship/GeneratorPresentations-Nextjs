import classes from "@/app/make-present/page.module.css"
function Names() {
  return (
   <div className={classes.names}>
    <input type="text" placeholder="Имя" name="firstName"/>
    <input type="text" placeholder="Фамилия" name="lastName"/>
  </div>
  )
}

export default Names