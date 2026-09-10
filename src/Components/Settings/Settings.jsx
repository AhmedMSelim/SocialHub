import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import Loader from "./../Loader/Loader";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const schema = zod.object({
  password: zod
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password Must contains at least 1 spcial chars, 1 number, 1 capital chars, 1smal chars and min lengh is 8 chars",
    )
    .nonempty("Password is required"),
  newPassword: zod
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password Must contains at least 1 spcial chars, 1 number, 1 capital chars, 1smal chars and min lengh is 8 chars",
    )
    .nonempty("Password is required"),
});

export default function Settings() {
  const navigate = useNavigate();
  const [apierror, setapiError] = useState(null);
  const [apisuccess, setapiSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  let { register, handleSubmit, setError, getValues, formState } = form; // register ==> Function register new field in RHF

  function handelRegister(values) {
    setIsLoading(true);
    // console.log(values);
    axios
      .patch(
        `https://route-posts.routemisr.com/users/change-password`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        },
      )
      .then((res) => {
        console.log(res);
        if (res.data.message === "password changed successfully") {
          localStorage.setItem("userToken", res.data.data.token);
          setapiSuccess(res.data.message);
          toast.success(res.data.message, { autoClose: 2000 });
          const successMessage = setInterval(() => {
            setapiSuccess(null);
            clearInterval(successMessage);
          }, 3000);
          setapiError(null);
          setIsLoading(false);
          navigate("/");
        }
      })
      .catch((err) => {
        setapiError(err.response.data.message);
        toast.error(err.response.data.message, { autoClose: 2000 });
        const errorMessage = setInterval(() => {
          setapiError(null);
          clearInterval(errorMessage);
        }, 3000);
        setIsLoading(false);
      });
  }

  // if (isLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      {/* flowbite */}
      <div className="w-full min-h-screen bg-[#F1F5F9] flex justify-center items-center">
        <div className=" w-[90%]">
          {apierror && (
            <p className="bg-red-600 text-center text-white p-2 m-2 rounded-sm mx-auto w-75">
              {apierror}
            </p>
          )}
          {apisuccess && (
            <p className="bg-green-600 text-center text-white p-2 m-2 rounded-sm mx-auto w-75">
              {apisuccess}
            </p>
          )}
          <div className="md:w-2/4 my-5  bg-[#FFFFFF] mx-auto shadow-2xl p-6 rounded-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
                <KeyRound size={18} />
              </span>

              <div>
                <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  Change Password
                </h1>
                <p className="text-sm text-slate-500">
                  Keep your account secure by using a strong password.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(handelRegister)} className="mt-10">
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
                  className="block text-center placeholder:text-center py-5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                  placeholder="************"
                />
                <label
                  htmlFor="password"
                  className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Current password
                </label>
                {formState.errors.password &&
                formState.touchedFields.password ? (
                  <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">
                    {formState.errors.password?.message}
                  </p>
                ) : null}
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="password"
                  {...register(
                    "newPassword",
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
                  id="newPassword"
                  className="block text-center py-5 px-0 placeholder:text-center w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                  placeholder="************"
                />
                <label
                  htmlFor="newPassword"
                  className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  New Password
                </label>
                {formState.errors.newPassword &&
                formState.touchedFields.newPassword ? (
                  <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">
                    {formState.errors.newPassword?.message}
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
                  "Update Paswword"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
