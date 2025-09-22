import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export  async function POST(req){
    const body  = await req.json()
    const {name,email,password} = body

    if (!name || !email || !password){
        return NextResponse.json({error:"Пожалуста заполните все данные"},{status:402})
    }
    const queryCheck = `SELECT * FROM presentation WHERE email = $1`
    const emailCheckRes = await pool.query(queryCheck,[email])
    if (emailCheckRes.rows.length > 1){
        return NextResponse.json({error:"Пользователь с такой почтой уже существует"},{status:402})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const saveUserQuery = 'INSERT INTO presentation(name,email,password) VALUES($1,$2,$3)'
    await pool.query(saveUserQuery,[name,email,hashedPassword])
    return NextResponse.json({success:"Вы успешно авторизовались"},{status:202})
}