'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios,{AxiosError} from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
const page = () => {
  //fields create krne hain
  

  const [username, setusername] = useState('');
  const [usernameMessage, setusernameMessage] = useState('');
  //loader to manage state
  const [isCheckingUsername,setIsCheckingUsername]=useState(false);

  //submit state management
  const [isSubmitting,setIsSubmitting]=useState(false);

  //thodi thodi der mein mein check krenge ki username valid h ki nhi using APIs
  //isi ko debouncing kaha jata h
  //ye function username ko har letter change pr API request krne ki bajae 300 ms baad DB pr request bhejega
  const debouncedUsername = useDebounceValue(username, 300);
  const { toast } = useToast();
  //for navigation
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    //using zod resolver and signupschema
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'one',
      email:'',
      password:''
    }
    
  })

  useEffect(() => {
    const checkUsernameUnique = async () =>{
      if (debouncedUsername){
        setIsCheckingUsername(true)
        setusernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
          setusernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setusernameMessage(axiosError.response?.data.message ?? "Error checking username")
        } finally{
          setIsCheckingUsername(false)
        }
      }

    }
    checkUsernameUnique()
  }, [debouncedUsername])
  

  
  return (
    <div>page</div>
  )
}

export default page