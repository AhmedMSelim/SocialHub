import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";


/*
  1- create inputs form {flowbite}
  2- i RHF Reat hook form ==> ref ==> useRef() after that import {useFrom}
  3- used const form = useForm({defaultValues:{values}, mode:"onChande"})
  4- let { register, handleSubmit, setError, getValues, formState }= form;
  5- every inputs {...register("name", required)}
  5- i zod to validation
  6- import * as zod from "zod"
  7- comparison Values with schema npm install @hookform/resolvers import {zodResolver} from "@hookform/resolvers/zod"
  8- call api from axios
*/
// const { name, onChange, ref, onBlur } = register("name");
/* Controlled vs Uncontrolled ==> (component, input, element) */

const schema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name is required")
      .min(3, "Min length is 3 chars")
      .max(30, "Max length is 30 chars"),
    email: zod
      .email("Invalid Email")
      .regex(
        /^(?:[\w\d\.-_])+@(?=.{4,64}$)(?:[\w\d]+[-]?[\w\d]+\.|[\w\d]\.)+(?:\w{2,})$/,
        "Not Match with Pattern",
      )
      .nonempty("Email is required"),
    password: zod
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password Must contains at least 1 spcial chars, 1 number, 1 capital chars, 1smal chars and min lengh is 8 chars",
      )
      .nonempty("Password is required"),
    rePassword: zod.string().nonempty("Password is required"),
    dateOfBirth: zod.string().refine((date) => {
      const userDate = new Date(date); // User Date
      const currentDate = new Date();
      return currentDate.getFullYear() - userDate.getFullYear() >= 10
        ? true
        : false;
    }, "Date must be at least 10 years ago."),
    gender: zod.enum(["male", "female"]),
  })
  .refine(
    (obj) => {
      return obj.password === obj.rePassword ? true : false;
    },
    {
      error: "Password and Confirmation password Not Match !",
      path: ["rePassword"],
    },
  );

export default function Register() {
  const navigate = useNavigate();
  const [apierror, setapiError] = useState(null);
  const [apisuccess, setapiSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  let { register, handleSubmit, setError, getValues, formState } = form; // register ==> Function register new field in RHF

  function handelRegister(values) {
    setIsLoading(true);
    // console.log(values);
    axios
      .post(`https://route-posts.routemisr.com/users/signup`, values)
      .then((res) => {
        // Go Login
        if (res.data.message === "account created") {
          setapiError(null);
          setapiSuccess(res.data.message);
          toast.success(res.data.message, {autoClose: 2000})
          setIsLoading(false);
          navigate("/login");
        }
      })
      .catch((err) => {
        // console.log(err.response.data.message)
        setapiError(err.response.data.message);
        toast.error(err.response.data.message, {autoClose: 2000})
        const errorMessage = setInterval(() => {
          setapiError(null);
          clearInterval(errorMessage);
        }, 3000);
        setIsLoading(false);
      });
  }

  return (
    <>
    <Helmet>
        <title>Register</title>
      </Helmet>
      {/* flowbite */}
      <div className="w-full min-h-screen bg-[#F1F5F9] flex justify-center items-center">
        <div className="flex w-[95%] justify-center md:justify-between items-center flex-wrap">
          <div className=" md:w-2/3 py-7">
            <h1 className="font-bold text-[3rem] md:text-8xl text-[#00298d]">
              SocialHub
            </h1>
            <p className="mt-1 text-2xl md:text-3xl font-medium text-slate-700">
              Connect with friends and the world around you on SocialHub.
            </p>
          </div>

        <div className="w-[95%] md:w-1/3 my-5 text-center  bg-[#FFFFFF] mx-auto shadow-2xl p-6 rounded-2xl">
                      <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d]">
                        SocialHub
                      </h1>
                              {apierror && <p className="bg-red-600 text-white p-2 m-2 rounded-sm mx-auto w-75">{apierror}</p>}
        {apisuccess && <p className="bg-green-600 text-white p-2 m-2 rounded-sm mx-auto w-75">{apisuccess}</p>}
                      <h4 className="text-center text-gray-500 my-5">
                        Connect with friends and the world around you
                      </h4>
                      <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                        <NavLink
                          to="/login"
                          className={({ isActive }) =>
                            `rounded-lg py-2 text-sm font-extrabold text-center transition ${
                              isActive
                                ? "bg-white text-[#00298d] shadow-sm"
                                : "text-slate-600 hover:text-slate-800"
                            }`
                          }
                        >
                          Login
                        </NavLink>
          
                        <NavLink
                          to="/register"
                          className={({ isActive }) =>
                            `rounded-lg py-2 text-sm font-extrabold text-center transition ${
                              isActive
                                ? "bg-white text-[#00298d] shadow-sm"
                                : "text-slate-600 hover:text-slate-800"
                            }`
                          }
                        >
                          Register
                        </NavLink>
                      </div>

                      <h2 className="text-2xl font-extrabold text-slate-900">
              Create a new account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              It is quick and easy.
            </p>

                      <form
          onSubmit={handleSubmit(handelRegister)}
          className="mt-10"
        >
          <div className="relative z-0 w-full mb-5 group">
            <input
              // onChange={}
              // value={}
              {...register("name", 
              //   {
              //   required: {value: true, message: "Name input is required"},
              //   minLength: {value: 3, message: "Min length is 3 chars"},
              //   maxLength: {value: 20, message: "Max length is 20 chars"},
              // }
            )}
              type="text"
              id="name"
              className="block text-center py-5 px-0 w-full text-sm text-heading placeholder:text-center bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder="Ahmed Magdy Selim"
            />
            <label
              htmlFor="name"
              className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Full Name
            </label>
            {formState.errors.name && formState.touchedFields.name ? <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">{formState.errors.name?.message}</p> : null}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              {...register("email", 
              //   {
              //   pattern: {value: /^(?:[\w\d\.-_])+@(?=.{4,64}$)(?:[\w\d]+[-]?[\w\d]+\.|[\w\d]\.)+(?:\w{2,})$/, message: "Invalid Email"}
              // }
            )}
              id="email"
              className="block text-center py-5 px-0 w-full text-sm placeholder:text-center text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder="ahmedMagdy@gmail.com"
            />
            <label
              htmlFor="email"
              className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Email Address
            </label>
            {formState.errors.email && formState.touchedFields.email ? <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">{formState.errors.email?.message}</p> : null}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              {...register("password", 
              //   {
              //   pattern: {value: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/, message: `
              //     password must contain 1 number (0-9)
              //     password must contain 1 uppercase letters
              //     password must contain 1 lowercase letters
              //     password must contain 1 non-alpha numeric number
              //     password is 8-16 characters with no space`}
              // }
            )}
              type="password"
              id="password"
              className="block text-center placeholder:text-center py-5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder="************"
            />
            <label
              htmlFor="password"
              className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Password
            </label>
            {formState.errors.password && formState.touchedFields.password ? <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">{formState.errors.password?.message}</p> : null}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              {...register("rePassword", 
              //   {
              //   validate: function(repasswordValue) {
              //     if(repasswordValue ===  getValues("rePassword")){
              //       //okay
              //       return true
              //     }else {
              //       return "Password & confirm password not match !"
              //     }
              //   }
              // }
            )}
              id="rePassword"
              className="block text-center py-5 px-0 placeholder:text-center w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder="************"
            />
            <label
              htmlFor="rePassword"
              className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Confirm Password
            </label>
            {formState.errors.rePassword && formState.touchedFields.rePassword ? <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">{formState.errors.rePassword?.message}</p> : null}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              {...register("dateOfBirth", 
              //   {
              //   required: {value: true, message: "Invalid Date To Accepy"},
              //   valueAsDate: true,
              //   validate: function(value) {
              //     const userDate = value.getFullYear()
              //     const currentDate = new Date().getFullYear()
              //     if(currentDate - userDate >= 10) {
              //         return true // Validation Oky
              //     }else {
              //         return "Date must be at least 10 years ago." // Validation error
              //     }
              //   }
              // }
            )}
              type="date"
              id="dateOfBirth"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="dateOfBirth"
              className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Date of Birth
            </label>
            {formState.errors.dateOfBirth && formState.touchedFields.dateOfBirth ? <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">{formState.errors.dateOfBirth?.message}</p> : null}
          </div>
          <div className="flex gap-4">
            <div className="flex items-center mb-4">
              <input
                {...register("gender"), {
                  pattern: {value: /^(male|female)$/, message: "Not Valid Gender"}
                }}
                id="male"
                type="radio"
                defaultValue="male"
                className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
                defaultChecked
              />
              <label
                htmlFor="male"
                className="select-none ms-2 text-sm font-medium text-heading"
              >
                Male
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                id="female"
                type="radio"
                {...register("gender")}
                defaultValue="female"
                className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
                defaultChecked
              />
              <label
                htmlFor="female"
                className="select-none ms-2 text-sm font-medium text-heading"
              >
                female
              </label>
            </div>
            {formState.errors.gender && formState.touchedFields.gender ? <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">{formState.errors.gender?.message}</p> : null}
          </div>
          <button
            disabled ={isLoading}
            type="submit"
            className="text-white disabled:cursor-not-allowed disabled:bg-blue-800 bg-blue-500 rounded-lg w-full hover:bg-blue-600 cursor-pointer box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            {isLoading ? <div className="flex justify-center items-center"><RotatingLines
                          visible={true}
                          height="20"
                          width="20"
                          color="white"
                          strokeWidth="5"
                          animationDuration="0.75"
                          ariaLabel="rotating-lines-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                          /></div> : "Create  New Account"}
            
          </button>
        </form>
        </div>

        
        </div>
      </div>
    </>
  );
}
