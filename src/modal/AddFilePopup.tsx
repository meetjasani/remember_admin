import React, { useState, useCallback, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { ApiPost } from "../../src/helper/API/ApiData";
import { useParams } from 'react-router'



interface Props {
    show: boolean;
    onHide: () => void;
    type: string | null;
    handleChange: () => void;
}


const fileFormat = [
    {
        fileFormate: "mp4",
        value: "video/mp4",
        type: "Video"
    },
    {
        fileFormate: "Avi",
        value: ".avi",
        type: "Video"
    },
    {
        fileFormate: "webm",
        value: ".webm",
        type: "Video"
    },
    {
        fileFormate: "mov",
        value: ".mov",
        type: "Video"
    },
];

const imageFormat = [
    {
        fileFormate: "JPG",
        value: "image/jpeg",
        type: "Album"
    },
    {
        fileFormate: "PNG",
        value: "image/png",
        type: "Album"
    },
    {
        fileFormate: "JPEG",
        value: "image/jpeg",
        type: "Album"
    },
];


const allFormat = [...fileFormat, ...imageFormat]

const AddFilePopup: React.FC<Props> = ({ show, onHide, type, handleChange }) => {
    const [selectedFileType, setSelectedFileType] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File>();
    const [filetype, setFiletype] = useState<string | null>(type);
    const { id }: any = useParams();



    const onDrop = useCallback((acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const addFileForm = {
        writer: "",
        file: "",
    };


    const [addFileDataForm, setAddFileDataForm] = useState(addFileForm);



    const handleInputChange = (e: any) => {
        setAddFileDataForm({ ...addFileDataForm, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        let findFormat = allFormat.find((format) => format.value === selectedFileType)?.type

        if (findFormat === "Video") {
            setFiletype("Video");
        }

        if (findFormat === "Album") {
            setFiletype("Album");
        }
    }, [selectedFileType])

    const postAlbumVideo = () => {

        if (filetype === "Video") {
            let formData = new FormData();
            formData.append("post_type", "Video");
            formData.append("memorial_id", id);
            formData.append("writer", addFileDataForm.writer);

            if (selectedFile) {
                formData.append("AlbumAndVideo", selectedFile);
            }

            ApiPost(`memorialHall/memorialHallAlbumAndVideo`, formData)
                .then((response: any) => {
                    if (response.message === "Memorial Album Save Max limit execute") {
                        setErrorMessage(
                            "MemorialPost.Memorial_Post_Video_save_Max_limit_exceeds"
                        );
                    } else {
                        setSelectedFile(undefined);
                        handleChange();
                    }
                })
        }

        if (filetype === "Album") {
            let formData = new FormData();
            formData.append("post_type", "Album");
            formData.append("memorial_id", id);
            formData.append("writer", addFileDataForm.writer);

            if (selectedFile) {
                formData.append("AlbumAndVideo", selectedFile);
            }

            ApiPost(`memorialHall/memorialHallAlbumAndVideo`, formData)
                .then((response: any) => {
                    if (response.message === "Memorial Album Save Max limit execute") {
                        setErrorMessage(
                            "MemorialPost.Memorial_Post_Image_save_Max_limit_exceeds"
                        );
                    } else {
                        setSelectedFile(undefined);
                        handleChange();
                    }
                })
        }
    };

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                size="lg"
                dialogClassName="registerdonation-pop-up"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title
                        className="registerdonation-pop-up-title"
                        id="contained-modal-title-vcenter"
                    >
                        파일 추가하기
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="registerdonation-pop-up-content">
                    <label className="registerdonation-pop-up-lable">작성자</label>
                    <Form.Control
                        name="writer"
                        value={addFileDataForm.writer}
                        className="registerdonation-pop-up-input"
                        type="text"
                        placeholder="이름을 입력하세요."
                        onChange={(e: any) => {
                            handleInputChange(e);
                        }}
                        autoComplete="off"
                    />

                    {/* File type dropdown */}
                    <div className="add-file-pop-up-dropdown">
                        <label>파일형식</label>
                        <div className="position-relative selector-set-main-full ">
                            <select
                                className={
                                    fileFormat.length === 1
                                        ? "selector-set w-100 minimal-add-file"
                                        : "selector-set-gray w-100 minimal-add-file"
                                }
                                onChange={(event: any) => {
                                    setSelectedFileType(event.target.value);
                                }}
                            >
                                <option disabled selected>
                                    파일형식을 선택하세요.
                                </option>

                                {type === "All" &&
                                    allFormat.map((item, index) => (
                                        <option className="redText" value={item.value} key={index} >
                                            {item.fileFormate}
                                        </option>
                                    ))}

                                {type === "Video" &&
                                    fileFormat.map((item, index) => (
                                        <option className="redText" value={item.value}  key={index}>
                                            {item.fileFormate}
                                        </option>
                                    ))}

                                {type === "Album" &&
                                    imageFormat.map((item, index) => (
                                        <option className="redText" value={item.value} key={index}>
                                            {item.fileFormate}
                                        </option>
                                    ))}
                            </select>
                            {/* <div className="down-arrow">
                                {" "}
                                <img src="./img/arrows.svg" alt="dropdown" />{" "}
                            </div> */}
                        </div>
                    </div>

                    {/* File Import  */}
                    <div className="add-file-pop-up-file-import" >
                        <label className="login-label">파일 불러오기</label>
                        <div {...getRootProps()} className={`input-filetypes file-import-disabled ${addFileDataForm.writer && selectedFileType && "file-import-enabled"}`} >
                            {addFileDataForm.writer && selectedFileType && <input {...getInputProps()} accept={selectedFileType} />}
                            파일 불러오기
                        </div>
                    </div>

                </Modal.Body>

                {errorMessage && (
                    <div>
                        <p className="error-color register-seltAuth-error">
                            {errorMessage}
                        </p>
                    </div>
                )}

                <Modal.Footer className="addfile-pop-up-footer">
                    <Button onClick={postAlbumVideo} className="registerdonation-pop-up-btn">
                        등록하기
                    </Button>
                    <Button onClick={onHide} className="registerdonation-pop-up-btn-2">
                        취소
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddFilePopup;
