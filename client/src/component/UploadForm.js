import React, { useState } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import ProgressBar from "./ProgressBar";

const UploadForm = () => {
  const DEFAULT_MESSAGE = "이미지 파일을 업로드 해주세요";
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(DEFAULT_MESSAGE);
  const [percent, setPercent] = useState(0);

  const imageSelectHandler = (event) => {
    const imageFile = event.target.files[0];
    setFile(imageFile);
    setFileName(imageFile.name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    try {
      await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round(100 * e.progress));
        },
      });
      toast.success("success!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      setTimeout(() => {
        setPercent(0);
        setFileName(DEFAULT_MESSAGE);
      }, 2000);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
      setPercent(0);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input id="image" type="file" onChange={imageSelectHandler} />
      </div>
      <button
        type="submit"
        style={{
          width: "100%",
          borderRadius: "3px",
          height: 40,
          cursor: "pointer",
        }}
      >
        제출
      </button>
    </form>
  );
};

export default UploadForm;
