import mongoose,{Schema,Document} from "mongoose";
import { Waiting_for_the_Sunrise } from "next/font/google";
import { string } from "zod";

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
    isVerified:boolean;
    isAcceptingMessage: boolean;
    messages:Message[];
    image:string;
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
        required:[true,"Password is required"],
        // validate: {
        //     validator: function(v) {
        //       return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{8,}$/.test(v);
        //     },
        //     message: 'Password must be at least 8 characters and contain at least one letter and one number.'
        // }
    },
    verifyCode:{
        type:String, 
        required:[true,"VerifyCode is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verification Expiry is required"],
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        
        default:true,
    },
    messages:[MessageSchema],
    image:{
        type:String,
        default:'https://unsplash.com/photos/a-man-with-a-goat-skull-mask-covering-his-face-JQ-lkX4_JUA'
    }

})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User',UserSchema);

export default UserModel;