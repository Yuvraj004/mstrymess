"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import {Loader2} from 'lucide-react';
const page = () => {
  //fields create krne hain

  const [username, setusername] = useState("");
  const [usernameMessage, setusernameMessage] = useState("");
  //loader to manage state
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  //submit state management
  const [isSubmitting, setIsSubmitting] = useState(false);

  //thodi thodi der mein mein check krenge ki username valid h ki nhi using APIs
  //isi ko debouncing kaha jata h
  //ye function username ko har letter change pr API request krne ki bajae 300 ms baad DB pr request bhejega
  const debounced = useDebounceCallback(setusername, 500);
  const { toast } = useToast();
  //for navigation
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    //using zod resolver and signupschema
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setusernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`,
          );
          let mess = response.data.message
          setusernameMessage(mess);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setusernameMessage(
            axiosError.response?.data.message ?? "Error checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  //using zod to infer the type of data
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      console.log(data);
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Eror in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Mesage
          </h1>
        </div>
        <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                    }}// onChange event was needed becoz we have to use setusername
                    /> 
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p className={`text-sm ${usernameMessage=="Username is unique"  ? "text-green-500" :"text-red-500"}`}>test {usernameMessage}</p>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display email.
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
              </>) : ("Signup")}</Button>
          </form>
        </Form>
        </div>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href='/sign-in' className="text-blue-600 hover:text-blue-800" >Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
