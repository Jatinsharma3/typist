import React from 'react'
import { useForm } from 'react-hook-form'
import './form.css'

const Form = () => {
    
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm()

  const delay = async(d)=>{
    return new Promise((rsolve,reject)=>{
      setTimeout(() => {
        rsolve()
      }, d*1000);
    })
  }
  
  const onSubmit = async(data) => {
    await delay(1)
    let r = await fetch("http://localhost:3000/",{method: "POST", headers: {
      "Content-Type": "application/json"}, body: JSON.stringify(data)})
    let res = await r.text()
    console.log(data,res)
  }
  return (
    <>
    
      <div className="container">
        <form action="" onSubmit={handleSubmit(onSubmit)}>
   
          
          <input {...register("username", { required: {value:true,message:"This field is required"} ,minLength: {value:3,message:"Minlength is 3"} , maxLength:{value:8,message:"Maxlength is 8"}})} 
         placeholder='username' type="text" />
          {errors.username && <span className='red'>{errors.username.message}</span>}
          <br/>
          <br/>


          
          <input {...register("email", { required: {value:true,message:"This field is required"}, minLength:{value:10,message:"Minlength is 10"}})} placeholder='email' type="email" />
          {errors.email && <span className='red'>{errors.email.message}</span>}
          <br/>
          <br/>
          <input {...register("password", { required: {value:true,message:"This field is required"}, minLength:{value:3,message:"Minlength is 3"}})} placeholder='password' type="password" />
          {errors.password && <span className='red'>{errors.password.message}</span>}
          <br/>
          <br/>
          <input disabled={isSubmitting} type="submit" value="submit" />
          {isSubmitting && <div>Loading..</div> }
          <br/>
        </form>
      </div>
      </>
  )
}

export default Form