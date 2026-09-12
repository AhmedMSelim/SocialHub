import React, { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { AuthContext } from "../../Context/AuthContext";
import { FaLongArrowAltRight } from "react-icons/fa";
import { UserAuthContext } from "../../Context/UserAuthContext";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const schema = zod.object({
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
});

export default function Login() {
  const navigate = useNavigate();
  const [apierror, setapiError] = useState(null);
  const [apisuccess, setapiSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userToken, setUserToken } = useContext(AuthContext);
  const { userData, setUserData } = useContext(UserAuthContext);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  let { register, handleSubmit, setError, getValues, formState } = form; // register ==> Function register new field in RHF

  function handelLogin(values) {
    setIsLoading(true);
    // console.log(values);
    axios
      .post(`https://route-posts.routemisr.com/users/signin`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // Go Login
        if (res.data.message === "signed in successfully") {
          localStorage.setItem("user", JSON.stringify(res.data.data.user));
          setUserData(res.data.data.user);
          setIsLoading(false);
          localStorage.setItem("userToken", res.data.data.token);
          setUserToken(res.data.data.token);
          navigate("/");
          // setapiSuccess(res.data.message);
          toast.success(res.data.message, { autoClose: 2000 });
        }
      })
      .catch((err) => {
        // setapiError(err.response.data.message);
        toast.error(res.data.message, { autoClose: 2000 });
        const errorMessage = setInterval(() => {
          setapiError(null);
          clearInterval(errorMessage);
        }, 3000);
        setIsLoading(false);
      });
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      {/* flowbite */}
      <div className="w-full min-h-screen bg-[#F1F5F9] flex justify-center items-center">
        <div className="flex w-[95%] justify-center md:justify-between items-center flex-wrap">
          <div className=" md:w-2/3 py-7">
            <h1 className="font-bold text-[3rem] md:text-8xl text-[#00298d]">
              SocialHub
            </h1>
            <p className="mt-1 text-2xl md:text-3xl font-medium text-slate-700">
              Connect with friends and the world around you
            </p>
          </div>

          <div className="w-[95%] md:w-1/3 my-5 text-center  bg-[#FFFFFF] mx-auto shadow-2xl p-6 rounded-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d]">
              SocialHub
            </h1>
            {apierror && (
              <p className="bg-red-600 text-center text-white p-2 m-2 rounded-sm mx-auto w-[300px]">
                {apierror}
              </p>
            )}
            {apisuccess && (
              <p className="bg-green-600 text-center text-white p-2 m-2 rounded-sm mx-auto w-[300px]">
                {apisuccess}
              </p>
            )}
            <h4 className="text-center text-gray-500 my-5">
              We are really happy to see you again!
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
              Logto SocialHub
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Log and continue your social journey.
            </p>

            <form onSubmit={handleSubmit(handelLogin)} className="mt-10">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="email"
                  {...register(
                    "email",
                    //   {
                    //   pattern: {value: /^(?:[\w\d\.-_])+@(?=.{4,64}$)(?:[\w\d]+[-]?[\w\d]+\.|[\w\d]\.)+(?:\w{2,})$/, message: "Invalid Email"}
                    // }
                  )}
                  id="email"
                  className="block py-5 px-0 w-full text-center text-sm placeholder:text-center text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                  placeholder="Enter Your Email"
                />
                <label
                  htmlFor="email"
                  className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Email Address
                </label>
                {formState.errors.email && formState.touchedFields.email ? (
                  <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">
                    {formState.errors.email?.message}
                  </p>
                ) : null}
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  {...register(
                    "password",
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
                  className="block text-center placeholder:text-center py-5 px-0 w-full text-sm text-heading bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                  placeholder="Enter Your Password"
                />
                <label
                  htmlFor="password"
                  className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Password
                </label>
                {formState.errors.password &&
                formState.touchedFields.password ? (
                  <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">
                    {formState.errors.password?.message}
                  </p>
                ) : null}
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className="text-white disabled:cursor-not-allowed disabled:bg-blue-800 bg-blue-500 rounded-lg w-full hover:bg-blue-600 cursor-pointer box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <RotatingLines
                      visible={true}
                      height="20"
                      width="20"
                      color="white"
                      strokeWidth="5"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                ) : (
                  <div className="flex gap-2 items-center justify-center">
                    Sign in <FaLongArrowAltRight />
                  </div>
                )}
              </button>
              <div className="flex gap-2 justify-center items-center mx-auto pt-3 text-blue-800 hover:text-blue-950 transition-colors">
                <Link to="forget"> Forgot Password ?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
