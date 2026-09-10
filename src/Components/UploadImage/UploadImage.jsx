import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import Cropper from "react-easy-crop";

export default function UploadImage({ imageSrc, photoRef, setimageSrc }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const query = useQueryClient();

  function handlePhoto() {
    if (!photoRef.current.files[0]) return;
    const formData = new FormData();
    formData.append("photo", photoRef.current.files[0]);
    mutate(formData);
  }

  function uploadProfilePhoto(formData) {
    return axios.put(
      `https://route-posts.routemisr.com/users/upload-photo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const { mutate, error } = useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["myProfile"] });
      setimageSrc(null);
    },
    onError: () => {
      console.log("Erorr");
    },
  });

  function onClose() {
    setimageSrc(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-[350px] rounded-2xl bg-white p-4">
        <h2 className="text-lg font-bold mb-2">Adjust profile photo</h2>

        {/* Cropper Container */}
        <div className="relative h-[300px] w-full bg-slate-200 rounded-xl overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={true}
            onCropChange={setCrop}
            onZoomChange={setZoom}
          />
        </div>

        {/* Zoom Control Slider */}
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full mt-3"
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={onClose}
            className="px-3 cursor-pointer py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePhoto}
            className="px-3 py-1 cursor-pointer rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
