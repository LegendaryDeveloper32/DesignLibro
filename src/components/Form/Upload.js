import React from "react";
import PropTypes from "prop-types";
import { IonButton, isPlatform } from "@ionic/react";
import { Plugins, CameraResultType } from "@capacitor/core";
import { dataURItoBlob } from "../../utils/file";
import "./Upload.css";

const { Camera } = Plugins;

function Upload(props) {
  const { onChange, placeholder, files, multiple, ...rest } = props;
  const handleSelectFile = async (evt) => {
    if (isPlatform("mobile")) {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
      });
      const blob = dataURItoBlob(image.dataUrl);

      onChange([blob]);
    } else {
      onChange([...evt.target.files]);
    }
  };

  return (
    <div className="file-input-container">
      {!isPlatform("mobile") && (
        <input
          id="file"
          type="file"
          className="file-input"
          accept="image/*"
          multiple={multiple}
          onChange={handleSelectFile}
        />
      )}
      <button className="btn cloud-btn" onClick={handleSelectFile} {...rest}>
        {
          props.children ? props.children
            : <>{placeholder}{files.length > 0 ? `-${files.length}` : ""}</>
        }
      </button>
    </div>
  );
}

Upload.propTypes = {
  multiple: PropTypes.bool,
  files: PropTypes.array,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default Upload;