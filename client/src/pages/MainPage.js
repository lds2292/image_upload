import React from "react";
import UploadForm from "../component/UploadForm";
import ImageList from "../component/ImageList";

const MainPage = () => {
  return (
    <>
      <h2>사진첩</h2>
      <UploadForm />
      <ImageList />
    </>
  );
};

export default MainPage;
