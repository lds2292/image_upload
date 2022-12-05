import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = (props) => {
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [imageUrl, setImageUrl] = useState("/images");
  const [me] = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(imageUrl)
      .then((result) => setImages((prevData) => [...prevData, ...result.data]))
      .catch((err) => console.error(err));
  }, [imageUrl]);

  useEffect(() => {
    if (me) {
      setTimeout(() => {
        axios
          .get("/users/me/images")
          .then((result) => setMyImages(result.data))
          .catch((err) => console.error(err));
      }, 0);
    } else {
      setMyImages([]);
      setIsPublic(true);
    }
  }, [me]);

  const loadMoreImages = () => {
    if (images.length === 0) return;

    const lastImageId = images[images.length - 1]._id;
    setImageUrl(`/images?lastid=${lastImageId}`);
  };

  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
        loadMoreImages,
      }}
    >
      {props.children}
    </ImageContext.Provider>
  );
};
