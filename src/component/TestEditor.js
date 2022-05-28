import { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { API } from "../config/API/api.config";

const TestEditor = (props) => {
  useEffect(() => { }, []);

  const handleChange = (event, editor) => {
    const data = editor.getData();
    props.onChange(data);
  };

  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        data={props.data}
        onChange={handleChange}
        config={{
          ckfinder: {
            withCredentials: true,
            headers: {
              "X-CSRF-TOKEN": "CSFR-Token",
              Authorization: "Bearer <JSON Web Token>",
            },
          },
        }}
      />
    </>
  );
};

export default TestEditor;
