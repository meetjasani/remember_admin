import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import Buttons from "../../component/Buttons/Buttons";
import MessageCkEditor from "../../component/MessageCkEditor";
import { ApiGet, ApiPost, ApiPut } from "../../helper/API/ApiData";
import { useHistory } from "react-router";

interface IFuneralDetails {
    id: string;
    write: string,
    title: string,
    content: string
}

const FuneralDetails = () => {

    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id')?.toString() ?? "";

    const history = useHistory();

    const FuneralData: IFuneralDetails = {
        id: "",
        write: "",
        title: "",
        content: "",
    };
    const [date, setDate] = useState<Date | null>()
    const [data, setData] = useState("");
    const [dataObject, setDataObject] = useState<IFuneralDetails>(FuneralData);

    useEffect(() => {
        if (id !== "") {
            ApiGet(`general/getFuneralNewsByID/${id}`)
                .then((res: any) => {
                    setDataObject({
                        id: id,
                        write: res.data?.write,
                        title: res.data?.title,
                        content: res.data?.content
                    })
                    setData(res.data?.content)
                    setDate(new Date(res.data?.date_of_entry))

                })
                .catch((error) => {
                });
        }
    }, []);

    useEffect(() => {
    }, [data])

    const handleChange = (newData: any) => {
        setData(newData);
        setDataObject({ ...dataObject, content: newData })
    };

    const Save = () => {
        if (id === "") {
            ApiPost("general/createFuneralNews", {
                write: dataObject.write,
                title: dataObject.title,
                date_of_entry: date,
                content: dataObject.content,
            })
                .then((res: any) => {
                    history.push("/other/funeral-news/funeral-news-management");
                })
        } else {
            if (id !== "") {
                ApiPut(`general/editFuneralNews/${id}`, {
                    write: dataObject.write,
                    title: dataObject.title,
                    date_of_entry: date,
                    content: dataObject.content,
                })
                    .then((res: any) => {
                        history.push("/other/funeral-news/funeral-news-management");
                    })
                    .catch((error) => {
                    });
            }
        }
    };

    return (
        <>
            <div className="main-heading-wrap">
                <span className="font-20-bold roboto color-01">???????????? ??????</span>
                <div className="d-flex ml-auto">
                    <div className="">
                        <Buttons
                            type=""
                            ButtonStyle="normalBtns mr-20"
                            onClick={() => {
                                history.push("/other/funeral-news/funeral-news-management");
                            }}
                        >
                            ??????
                        </Buttons>
                    </div>
                    <div>
                        <Buttons
                            type=""
                            ButtonStyle="normalBtn"
                            onClick={() => { Save() }}
                        >
                            ??????
                        </Buttons>
                    </div>
                </div>
            </div>

            <div className="border-black mt-19"></div>

            <div className="search-section">
                <div className="title">???????????? ??????</div>
            </div>

            <div className="border"></div>

            <div className="d-flex">
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">????????????</label>
                    </div>
                    <div className="DatePicker-set-main">
                        <input
                            className="Please-enter-input-set color-11 custom-placeholder"
                            name="writer"
                            autoComplete="off"
                            value={dataObject.write}
                            placeholder="?????????"
                            type="text"
                            onChange={(e: any) => {
                                setDataObject({ ...dataObject, write: e.target.value });
                            }}
                        />
                    </div>
                </div>
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">?????????</label>
                    </div>
                    <div className="DatePicker-set-main">
                        <ReactDatePicker
                            id="date"
                            selected={date}
                            onChange={(date: Date | null) => setDate(date)}
                            dateFormat="yyyy.MM.dd"
                            placeholderText="YYYY.MM.DD"
                            className="DatePicker-set"
                            locale="ko"
                        ></ReactDatePicker>
                    </div>
                </div>
            </div>

            <div className="border"></div>


            <div className="width d-flex consultation-details-status  ">
                <div className="date-of-registration-set">
                    <label className="">??????</label>
                </div>
                <div className="DatePicker-set-main">
                    <input
                        className="Please-enter-input-set color-11 custom-placeholder"
                        name="title"
                        value={dataObject.title}
                        type="text"
                        placeholder="?????? ??????"
                        onChange={(e: any) => {
                            setDataObject({ ...dataObject, title: e.target.value });
                        }}
                    />
                </div>
            </div>

            <div className="border"></div>

            <div className="edit-information">
                <MessageCkEditor
                    onChange={handleChange}
                    data={data}
                />
            </div>
        </>
    )
}

export default FuneralDetails
