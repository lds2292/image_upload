import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = (props) => {
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [imageUrl, setImageUrl] = useState("/images");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [me] = useContext(AuthContext);

  useEffect(() => {
    setImageLoading(true);
    axios
      .get(imageUrl)
      .then((result) => setImages((prevData) => [...prevData, ...result.data]))
      .catch((err) => {
        console.error(err);
        setImageError(err);
      })
      .finally(() => setImageLoading(false));
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

  const lastImageId = images.length > 0 ? images[images.length - 1]._id : null;

  const loadMoreImages = useCallback(() => {
    if (imageLoading || !lastImageId) return;

    setImageUrl(`/images?lastid=${lastImageId}`);
  }, [lastImageId, imageLoading]);

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
        imageLoading,
        imageError,
      }}
    >
      {props.children}
    </ImageContext.Provider>
  );
};
