import { Rocket } from "@gravity-ui/icons";
import { Button, Label, Modal } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { FaImage } from "react-icons/fa";
import { toast } from "react-toastify";

export function EditModel({ id, image, body }) {
  const [imagePreview, setImagePreview] = useState(image);
  const [text, setText] = useState(body);
  const query = useQueryClient();
  const textRef = useRef(null);
  const fileRef = useRef(null);
  const removeImage = () => {
    setImagePreview(null);
    fileRef.current.value = "";
  };
  function handleImage(e) {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  }

  function handelEdit() {
    const formData = new FormData();
    if (textRef.current.value) {
      formData.append("body", textRef.current.value);
    }
    if (fileRef.current.files[0]) {
      formData.append("image", fileRef.current.files[0]);
    }
    mutate(formData);
  }

  function editPost(formData) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, mutate, error } = useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["myProfile"] });
      query.invalidateQueries({ queryKey: ["myPosts"] });
      toast.success("Post Updated Successfully ✅", { autoClose: 2000 });
    },
    onError: () => {
      toast.error("Failed to update post. Please try again.", {
        autoClose: 2000,
      });
    },
  });
  console.log(error);

  return (
    <div className="flex flex-wrap gap-4">
      <Modal>
        <Button className="bg-transparent p-0 w-full" variant="secondary">
          <div className="flex items-start justify-center pt-px">
            <Pencil className="size-4 shrink-0 text-muted" />
          </div>
          <div className="flex flex-col">
            <Label>Edit</Label>
          </div>
        </Button>
        <Modal.Backdrop className="z-999999">
          <Modal.Container>
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <h1 className="font-bold text-3xl">Edit Your Post</h1>
              </Modal.Header>
              <Modal.Body>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  ref={textRef}
                  className="w-full text-black bg-slate-300 p-3 rounded-sm"
                ></textarea>
                {imagePreview && (
                  <div className="relative mt-3">
                    <img
                      src={imagePreview}
                      className="rounded-xl w-full object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute cursor-pointer top-2 right-2 bg-black/70 text-white rounded-full px-2"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer className="flex items-center justify-between px-2">
                <label>
                  <FaImage size={30} className="cursor-pointer" />
                  <input
                    ref={fileRef}
                    type="file"
                    hidden
                    onChange={handleImage}
                  />
                </label>
                <div className="flex gap-2">
                  <Button slot="close" variant="secondary">
                    Cancel
                  </Button>
                  <Button onClick={handelEdit} slot="close">
                    Edit
                  </Button>
                </div>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
