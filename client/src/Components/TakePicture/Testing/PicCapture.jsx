import axios from "axios";
import React from "react";
import Webcam from "react-webcam";
import { Buffer } from "buffer";

const PicCapture = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    console.log(imageSrc);

    // var data = new FormData({
    //   name: "Sumedh Bhat",
    //   mob_no: "3333333",
    //   gender: "M",
    //   city: "bangalore",
    //   department: "react",
    //   base_img: imageBuffer,
    // });

    // axios.post("http://localhost:3007/admin/users/create", {
    //   name: "Sumedh Bhat",
    //   mob_no: "3333333",
    //   gender: "M",
    //   city: "bangalore",
    //   department: "react",
    //   base_img: imageBuffer,
    // });
    if (imageSrc !== null || imageSrc !== "" || imageSrc !== undefined) {
      axios.post(
        "http://localhost:3090/",
        {
          img_string: imgSrc,
          img_name: "sumedh",
        },
        {
          headers: { authorization: sessionStorage.getItem("token") },
        }
      );
    }
  }, [webcamRef, setImgSrc, imgSrc]);

  return (
    <>
      <Webcam audio={false} ref={webcamRef} screenshotFormat='image/jpeg' />
      <button onClick={capture}>Capture photo</button>
      {imgSrc && <img src={imgSrc} />}
    </>
  );
};

export default PicCapture;
