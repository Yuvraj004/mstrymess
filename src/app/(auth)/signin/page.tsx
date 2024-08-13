"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {  useRouter } from "next/navigation";
import {signInSchema}  from "@/schemas/signInSchema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import {Loader2} from 'lucide-react';
import { signIn } from "next-auth/react";
import Link from "next/link";


const signin = () => {
  //submit state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  //for navigation
  const router = useRouter();
  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    //using zod resolver and signInSchema
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  
  //using zod to infer the type of data
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    //using nextauth
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if (result?.error) {
      if (result?.error == 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: "Credentials error",
          variant: "destructive"
        })
      } else {
        toast({
          title: 'Login Failed',
          description: result.error,
          variant: "destructive"
        })
      }
    }
    if (result?.url) {
      toast({
        title: 'Logged In',
        description: "You have successfully Logged In",
        variant:"default"
      })
      router.replace('/dashboard')
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            SignIn For Messaging
          </h1>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EmailId/Username</FormLabel>
                    <FormControl>
                      <Input placeholder="emailId/username" {...field}
                      /> 
                    </FormControl>
                    <FormDescription>
                      This can be your EmailId .
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                />
              <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="password" {...field}/>
                  </FormControl>
                  <FormDescription>
                    Add a good password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              />
              
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? (
                <>
                <Loader2 className="mr-3 h-4 w-4 animate-spin"/> Please Wait
                </>) : ("SignIn")}
              </Button>
            </form>
          </Form>
        </div>
        <div className="text-center mt-4">
          <p>
            Join us {' '}
            <Link href='/signup' className="text-blue-600 hover:text-blue-800" >Sign UP</Link>
          </p>
        </div>
      </div>
    </div>
    

  )
}

export default signin