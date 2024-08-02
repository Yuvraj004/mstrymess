import {z} from 'zod';

export const usernameValidation = z
.string()
.min(2,'Short Username')
.max(20,'Too Large Username')
.regex(/^[a-zA-z0-9_]+$/,'No special characters in Username')

export const signUpSchema = z.object({
    username:usernameValidation,
    email: z.string().email({message:'invalid Email Address'}),
    password: z.string().min(5,{message:'Atleast 5 chars'})
})
