"use server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sql, { insertIntoTable } from "./db";
import { checkEmail, isValid, minLength } from "./checkValues";
const SECRET_CODE = process.env.NEXT_PUBLIC_SECRET_CODE;




export async function RegisterHandler(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const secondPassword = formData.get("confirmPassword");
  const firstName = formData.get("first-name");
  const lastName = formData.get("last-name");

  const errors = [];
  if (!checkEmail(email)) {
    errors.push("Пожалуста введите корректный эмейл");
  }
  if (!minLength(password) || password !== secondPassword) {
    errors.push("Пароли должны совпадать");
  }
  if (!isValid(firstName) || !isValid(lastName)) {
    errors.push("Пожалуста заполните поле 'Имя // Фамилия' ");
  }

  if (email && password === secondPassword && firstName && lastName) {
    const checkEmail =
      await sql`SELECT email FROM presentation WHERE email = ${email}`;
    if (checkEmail.length > 0) {
      errors.push("Данный эмейл уже существует");
      return { error: errors };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await insertIntoTable(
      firstName,
      lastName,
      email,
      hashedPassword
    );
    if (result) {
      const token = jwt.sign(
        { id: result.id, email: result.email },
        SECRET_CODE,
        {
          expiresIn: "24h",
        }
      );
      return { success: "Вы успешно зарегистрировались", token: token };
    }
  }

  return { error: errors };
}

export async function LoginHandler(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const errors = [];
  if (!checkEmail(email)) {
    errors.push("Пожалуста введите корректный эмейл");
  }
  if (!password) {
    errors.push("Пароль отсутствует");
  }

  if (email && password) {
    const query = await sql`SELECT * FROM presentation WHERE email = ${email}`;
    if (query.length === 0) {
      errors.push("Такой пользователь не найден");
      return { error: errors };
    }
    const user = query[0];
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      errors.push("Пароль не совпадает");
      return { error: errors };
    }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_CODE, {
      expiresIn: "24h",
    });
    return { token: token, success: "Вы успешно вошли в аккаунт" };
  }
  return { error: errors };
}
