import mongoose,{Schema,Document} from "mongoose";
import { Waiting_for_the_Sunrise } from "next/font/google";

export interface Message extends Document{
    content:string; //in typescript
    createdAt : Date
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String, //in mongoose
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username:string; //in typescript
    email : string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isAcceptingMessage: boolean;
    message:Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String, //in mongoose
        required:[true,"Username Required"],
        trim: true,
        unique:true,
    },
    email:{
        type:String, 
        required:[true,"Email is required"],
        unique:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please use a valid email address']
    },
    password:{
        type:String, 
        required:true,
        match:[/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Minimum 8 characters ,atleast one Letter and one number'],
    },
    verifyCode:{
        type:String, 
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,
        default:Date.now
    }
})
