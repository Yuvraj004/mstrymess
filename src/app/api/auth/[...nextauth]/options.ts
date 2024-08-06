import { NextAuthOptions} from 'next-auth';
import UserModel from '@/model/userModel';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/connectDB';
import Credentials from 'next-auth/providers/credentials';


export const  authOptions: NextAuthOptions={
    providers:[
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email:{ 
                    label:"Email",
                    type:"text",
                    placeholder: "wkane",
                },
                password:{
                    label:"Password",
                    type:"password"
                }
            },
            authorize: async function (credentials: any): Promise<any> {
                await dbConnect();
                //extraction done using credentials.identifier 
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('No user found.');
                    }
                    if(user.isVerified){
                        throw new Error('Verify your account.');
                    }

                    const isPasswordCorrect =await bcrypt.compare(credentials.password,user.password)

                    if(isPasswordCorrect){
                        return user
                    }
                    else{
                        throw new Error('Icorrect Password.');
                    }
                    
                } catch (error) {
                    throw new Error('Db connection failed.');
                }
                
            }
        })
    ],
    callbacks:{
        async jwt({user,token}){
            if(user){
                token._id=user._id?.toString();
                token.isVerified=user.isVerified;
                token.isAcceptingMessages=user.isAcceptingMessages;
                token.username=user.username
            }
            return token
        },
        async session({session,user,token}){
            if(token){
                session.user._id=token._id
                session.user.isVerified=token.isVerified
                session.user.isAcceptingMessages=token.isAcceptingMessages
                session.user.username=token.username
            }
            return session
        }
    },
    pages:{
        //assigning pages
        signIn: '/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXT_AUTH_SECRET
}

