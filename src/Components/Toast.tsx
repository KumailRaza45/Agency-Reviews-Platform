import React from 'react'
import toast, { Toaster } from 'react-hot-toast';


export const successNotify = () =>{

    console.log("first")
    return(

        toast.success("Submitted")
    )
} 
    