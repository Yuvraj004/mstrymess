"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Loader2} from 'lucide-react';

const verifyAccount = () => {
    const router = useRouter();//for directing on different page
    const param = useParams<{ username: string }>();//function to directly use params
    const  {toast} = useToast;
    
    //zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    //using zod resolver and signupschema
    resolver: zodResolver(verifySchema),
  });
    
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: param.username,
                code: data.code
            })
            
            toast({
                title: 'Success',
                description: response.data.message
            })
            
            router.replace('/signin')
        } catch (error) {
            console.error("Eror in signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }
  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
              <div className="text-center">
                  <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                      Verify Your Account
                  </h1>
                  <p className="mb-4">Enter the verification code sent to your email</p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                      name="code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                            <Input placeholder="Code" {...field}
                            onChange={(e) => {
                                field.onChange(e)
                                // debounced(e.target.value)
                            }}// onChange event was needed becoz we have to use setusername
                            /> 
                        </FormControl>
                        <FormDescription>
                            Provided over your email
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                      />
                      <Button type="submit"> Verify </Button>
                </form>
              </Form>
          </div>
      </div>
  )
}

export default verifyAccount