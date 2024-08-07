import UserModel from "@/model/userModel";
import dbConnect from "@/lib/connectDB";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";



const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(req:Request) {

    //checking the requrest method used
    if (req.method !== 'GET'){
        return Response.json({
            success: false,
            message:'You can use only GET request with this route.'
        },{status:405})
    }
    // no need for the above code in nextjs
    await dbConnect();
    
    try {
        //url: localhost:3000/api/(verify?username=yuvraj?...)->searchParams
        const {searchParams} = new URL(req.url)
        const queryParam = {
            username:searchParams.get('username')
        }
        //validate with zod
        const result  = UsernameQuerySchema.safeParse(queryParam)
        console.log(result) //todo:remove
        if (!result.success){
            const userErrors = result.error.format().username?._errors || [];
            return Response.json({
                success:false,
                message: userErrors?.length>0 ? userErrors.join(', '):'Invalid query parameters',
            },{status:400})
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})

        if (existingVerifiedUser){
            return Response.json({
                success:false,
                message: 'Username already Verified and taken',
            },{status:400})
        }
        return Response.json({
            success:true,
            message: 'Username is unique and added to db',
        },{status:200})
        
    } catch (error) {
        console.error("Error checking username",error)
        return Response.json({
            success:false,
            message:"Error Checking Username"
        },{status:500})
    }
}