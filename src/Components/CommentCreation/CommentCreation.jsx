import { Input } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaCommentAlt } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";

export function CommentCreation({ id, queryKey }) {
  const form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });

  const query = useQueryClient(); // need reRender To Show

  const { handleSubmit, register, reset } = form;

  const formData = new FormData();

  function handlecreateComment(values) {
    if (!values.body && !values.image[0]) return;

    if (values.body) {
      formData.append("content", values.body);
    }

    if (values.image[0]) {
      formData.append("image", values.image[0]);
    }

    mutate();
  }

  function createComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${id}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: queryKey });
      query.invalidateQueries({ queryKey: ["myPosts"] });
      toast.success("Commnet Created Successfully ✅", { autoClose: 2000 });
      reset();
    },
    onError: () => {
      toast.error("Can't Create This Comment Now...! ❌", { autoClose: 2000 });
    },
  });

  return (
    <form onSubmit={handleSubmit(handlecreateComment)}>
      <div className="flex gap-1.5 justify-center items-center">
        <Input
          {...register("body")}
          type="text"
          aria-label="Enter Your Comment Here...."
          className="w-full rounded-xl border border-border/80 bg-default text-foreground placeholder:text-muted"
          placeholder="Enter The Comment Here...."
        />
        <button
          disabled={isPending}
          type="submit"
          className="bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-800 rounded cursor-pointer text-white p-2 "
        >
          {isPending ? (
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
            <FaCommentAlt size={20} />
          )}
        </button>
      </div>
      <label htmlFor="upload">
        <div className="bg-blue-500 cursor-pointer w-full p-2 flex justify-center text-white rounded my-1">
          <FaImage />
        </div>
      </label>
      <input {...register("image")} id="upload" type="file" hidden />
    </form>
  );
}
