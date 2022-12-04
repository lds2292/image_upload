import React, { useContext } from "react";
import UploadForm from "../component/UploadForm";
import ImageList from "../component/ImageList";
import { AuthContext } from "../context/AuthContext";

const MainPage = () => {
  const [me, setMe] = useContext(AuthContext);

  return (
    <>
      <h2>사진첩</h2>
      {me && <UploadForm />}
      <ImageList />
    </>
  );
};

export default MainPage;
