import GoggleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs"


export const authConfig = {
    providers:[
        GoggleProvider({
            clientId:process.env.NEXT_PUBLIC_AUTH_CLIENT_ID,
            clientSecret:process.env.NEXT_PUBLIC_AUTH_CLIENT_SECRET
        }),
        Credentials({
            credentials:{
                email:{label:"email",type:"email",required:true},
                password:{label:"password",type:"password",required:true}
            },
            async authorize(credentials){
                if(!credentials.email || !credentials.password) return null;
                
                const checkQuery = "SELECT * FROM presentation WHERE email = $1"
                const isUser = await pool.query(checkQuery,[credentials.email])
                if (isUser.rows.length === 0){
                    throw new Error("Пользователя с такой почтой не существует")
                }
                const userPassword = isUser.rows[0].password
                const checkHassedPassword = await bcrypt.compare(credentials.password,userPassword)
                if(checkHassedPassword){
                    return {id:isUser.rows[0].id,email:isUser.rows[0].email,name:isUser.rows[0].name}
                }
                else{
                    throw new Error("Неверная почта или пароль")
                }
                
            }
        })
    ],
    //* Saving user's in database
    session:{
        strategy:"jwt"
    },
    callbacks:{
        async signIn({user,account}){
            if(account.provider === "google"){
                const checkUserQuery = "SELECT * FROM presentation WHERE email = $1"
                const res = await pool.query(checkUserQuery,[user.email])
                if(res.rows.length === 0){
                    const query = "INSERT INTO presentation(name,email,password) VALUES($1,$2,$3)"
                    await pool.query(query,[user.name,user.email,""])
                } 
            }
            return true
        },
        async jwt({token,user}){
            if(user) token.id = user.id
            return token
        },
        async session({session,token}){
            if(token.email && session.user){
                session.user.email = token.email
            }
            return session
        }
    },
    pages:{
        signIn:"/signIn"
    }
}