import { resend } from "@/lib/resend";
import VerificationEmail from '../../emails/VerificationEmail';

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username: string,
    verifyCode: string,
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from:'Acme <onboarding@resend.dev>',
            to:[email],
            subject:'Mystry Verification Code',
            react:VerificationEmail({username,otp:verifyCode}),
        });

        return {success:true,message:'Verification Done Succresfully',status:200}
    } catch (emailError) {
        console.error('Error sending verification Email',emailError);
        return {success:false,message:'Verification Failed',status:500}
    }
}