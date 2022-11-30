import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ImageContext = createContext();

export const ImageProvider = (props) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get("/images")
      .then((result) => setImages(result.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <ImageContext.Provider value={[images, setImages]}>
      {props.children}
    </ImageContext.Provider>
  );
};
