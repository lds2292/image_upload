import React, { useState, useContext } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
  const DEFAULT_MESSAGE = "이미지 파일을 업로드 해주세요";
  const [files, setFiles] = useState(null);

  const [previews, setPreviews] = useState([]);

  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true);

  const imageSelectHandler = async (event) => {
    const imageFiles = event.target.files;
    setFiles(imageFiles);

    const imagePreviews = await Promise.all(
      [...imageFiles].map((imageFile) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.onload = (e) =>
              resolve({ imgSrc: e.target.result, fileName: imageFile.name });
          } catch (err) {
            reject(err);
          }
        });
      })
    );

    setPreviews(imagePreviews);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    for (let file of files) {
      formData.append("image", file);
    }

    formData.append("public", isPublic);
    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round(100 * e.progress));
        },
      });
      if (isPublic) setImages([...images, ...res.data]);
      else setMyImages([...myImages, ...res.data]);
      toast.success("이미지 업로드 성공");
      setTimeout(() => {
        setPercent(0);
        setPreviews([]);
      }, 2000);
    } catch (err) {
      toast.error(err.response.data.message);
      setPercent(0);
      setPreviews([]);
    }
  };

  const previewImages = previews.map((preview, index) => (
    <img
      key={index}
      alt=""
      style={{ width: 200, height: 200, objectFit: "cover" }}
      src={preview.imgSrc}
      className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
    />
  ));

  const fileName =
    previews.length === 0
      ? "사진을 선택하세요"
      : previews.reduce((a, b) => a + `${b.fileName},`, "");

  return (
    <form onSubmit={onSubmit}>
      <div className="preview-container">{previewImages}</div>
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input
          id="image"
          type="file"
          multiple
          accept="image/*"
          onChange={imageSelectHandler}
        />
      </div>
      <input
        type="checkbox"
        id="public-check"
        value={!isPublic}
        onChange={() => setIsPublic(!isPublic)}
      />
      <label htmlFor="public-check">비공개</label>
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
