import dbConnect from "@/lib/connectDB";
import UserModel from "@/model/userModel";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST (request:Request) {
    await dbConnect()
    try {
        const {username,email,password}=await request.json();
        const existingUserVerifyByUsername= await UserModel.findOne({
            username,
            isVerified: true
        })

        if(!existingUserVerifyByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:400})
        }
        const existingUserByEmail = await UserModel.findOne({email})
        //generating verifycode
        const verifyCode= Math.floor(100000 +Math.random()*900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exists"
                },{status:400})
            }else{
                const hsPass = await bcrypt.hash(password,10);
                existingUserByEmail.password = hsPass;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)

                await existingUserByEmail.save();
            }
        }else{
            const hashedPass= await bcrypt.hash(password,10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser = new UserModel({
                username,
                email ,
                password:hashedPass,
                verifyCode:verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage: true,
                messages:[]
            })
            await newUser.save();
        }
        //send verification mail
        const emailResponse = await sendVerificationEmail(email,username,verifyCode);

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }
        return Response.json({
            success:true,
            message:"User Registered Successfully. verify your email"
        },{status:201})


    } catch (error) {
        console.error('Error registering user',error)
        return Response.json({
            success: false,
            message: "Error registering User"
        },{status:500})
    }
}