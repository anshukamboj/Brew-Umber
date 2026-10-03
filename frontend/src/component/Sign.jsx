import React, { useState } from 'react'

const Sign = () => {
    const [sign,setsign]=useState(true)
    const [formData,setformData]= useState(
        {
            name:"",
            email:"",
            password:"",
            confirmpassword:"",
        });
        
        const handleclick=()=>{
            setsign=(!sign)
        }

        const handlechange=(e)=>{
            const{name,value}=e.target;
        
        setformData((prev)=>(
            {
                ...prev,[name]:value,
            }
        ));
    };

    const handlesubmit=async(e)=>{
        e.preventDefault();
    
    if (sign){
        if(
            !formData.name ||
            !formData.email ||
            !formData.password||
            !formData.confirmpassword 
        ){
            alert("please fill all the fields")
            return;
        }
    }
    }

  return (
    <div>
      
    </div>
  )
}

export default Sign
