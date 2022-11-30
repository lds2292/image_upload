import React from "react";
import UploadForm from "./component/UploadForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageList from "./component/ImageList";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToastContainer />
      <h2>사진첩</h2>
      <UploadForm />
      <ImageList />
    </div>
  );
};

export default App;
