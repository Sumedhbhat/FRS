import { useState, useEffect } from "react";
import OptionAdd from "./UserActions/OptionAdd";
import ModifyModal from "./UserActions/ModifyModal";
import AddModal from "./UserActions/AddModal";
import ImageCapture from "./UserActions/ImageCapture";
import UploadPic from "./UserActions/UploadPic";
import DeleteConfirm from "./UserActions/DeleteConfirm";

const Modals = ({ modals, setModals }) => {
  useEffect(() => {
    console.log(modals);
  }, [modals]);
  return (
    <>
      <OptionAdd
        optionAdd={modals.optionAdd || modals.modifyOptionAdd}
        setModals={setModals}
      />
      {/* <AddModal addOpen={modals.addOpen} setModals={setModals} /> */}
      <ImageCapture
        takePic={modals.takePic || modals.modifyTakePic}
        setModals={setModals}
      />
      <UploadPic
        uploadPic={modals.uploadPic || modals.modifyUploadPic}
        setModals={setModals}
      />
      <ModifyModal modify={modals.modify} setModals={setModals} />
    </>
  );
};

export default Modals;
