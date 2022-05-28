import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useHistory } from "react-router";
import Buttons from "../../component/Buttons/Buttons";
import { ApiGet, ApiPut } from "../../helper/API/ApiData";
import TextareaAutosize from 'react-textarea-autosize';
import { InquiryStatus, FreeConsultationApplicationUserType } from '../../helper/Constant';

interface IConsultationDetails {
    id: string;
    name: string,
    phone_number: string,
    email: string,
    address: string,
    inquiry: string,
    type: string,
    status: string,
    detail: string,
}
const ConsultationDetails = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id')?.toString() ?? "";

    const inquiryStatus = InquiryStatus;
    const freeConsultationApplicationUserType = FreeConsultationApplicationUserType;
    const history = useHistory();
    const ConsultationDetails: IConsultationDetails = {
        id: "",
        name: "",
        phone_number: "",
        email: "",
        address: '',
        inquiry: '',
        type: '',
        status: '',
        detail: ''
    };

    const [date, setDate] = useState<Date | null>()
    const [data, setData] = useState<any>(ConsultationDetails)

    const selectstatus = [
        { value: inquiryStatus.InProgress, label: "미처리" },
        { value: inquiryStatus.Complete, label: "처리완료" }
    ];
    const selectType = [
        // { value: freeConsultationApplicationUserType.Empty, label: "비어있는" },
        { value: freeConsultationApplicationUserType.Non, label: "비회원" },
        { value: freeConsultationApplicationUserType.Standard, label: "일반" },
        { value: freeConsultationApplicationUserType.Basic, label: "베이직" },
        { value: freeConsultationApplicationUserType.Premium, label: "프리미엄" }
    ];
    useEffect(() => {
        if (id !== "") {
            ApiGet(`General/getFreeConsultationApplicationByID/${id}`)
                .then((res: any) => {
                    setData({
                        id: id,
                        name: res.data?.name,
                        phone_number: res.data?.phone_number,
                        email: res.data?.email,
                        address: res.data.address,
                        inquiry: res.data.inquiry,
                        type: res.data.type,
                        status: res.data.status,
                        detail: res.data.detail
                    })
                    setDate(new Date(res.data?.date_of_entry))
                })
                .catch((error) => {
                });
        }
    }, []);
    const Save = () => {
        if (id !== "") {
            ApiPut(`general/editFreeConsultationApplication/${id}`, {
                name: data.name,
                phone_number: data.phone_number,
                date_of_entry: date,
                email: data.email,
                address: data.address,
                inquiry: data.inquiry,
                type: data.type,
                status: data.status,
                detail: data.detail,
            }

            )
                .then((res: any) => {
                    history.push("/other/consultation/consultation-list-management");
                })
                .catch((error) => {
                });
        }
    };
    return (
        <>
            <div className="main-heading-wrap">
                <span className="font-20-bold roboto color-01">무료상담신청 리스트 관리</span>
                <div className="d-flex ml-auto">
                    <div className="">
                        <Buttons
                            type=""
                            ButtonStyle="normalBtns mr-20"
                            onClick={() => {
                                history.push("/other/consultation/consultation-list-management");
                            }}
                        >
                            취소
                        </Buttons>
                    </div>
                    <div>
                        <Buttons
                            type=""
                            ButtonStyle="normalBtn"
                            onClick={() => { Save() }}
                        >
                            등록
                        </Buttons>
                    </div>
                </div>
            </div>

            <div className="border-black mt-19"></div>

            <div className="search-section">
                <div className="title">무료상담신청 상세</div>
            </div>

            <div className="border"></div>

            <div className="d-flex">
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">문의자명</label>
                    </div>
                    <div className="DatePicker-set-main">
                        <input
                            className="Please-enter-input-set color-11 custom-placeholder"
                            name="name"
                            autoComplete="off"
                            value={data.name}
                            type="text"
                            onChange={(e: any) => {
                                setData({ ...data, name: e.target.value });
                            }}
                        />
                    </div>
                </div>
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">전화번호</label>
                    </div>
                    <div className="DatePicker-set-main color-11 custom-placeholder">
                        <input
                            className="Please-enter-input-set"
                            name="phone"
                            value={data.phone_number}
                            type="tel"
                            onChange={(e: any) => {
                                setData({ ...data, phone_number: e.target.value });
                            }}
                            maxLength={11}
                        />
                    </div>
                </div>
            </div>

            <div className="border"></div>

            <div className="d-flex">
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">이메일</label>
                    </div>
                    <div className="DatePicker-set-main">
                        <input
                            className="Please-enter-input-set color-11 custom-placeholder"
                            name="email"
                            value={data.email}
                            type="email"
                            onChange={(e: any) => {
                                setData({ ...data, email: e.target.value });
                            }}
                        />
                    </div>
                </div>

                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">주소</label>
                    </div>
                    <div className="DatePicker-set-main">
                        <input
                            className="Please-enter-input-set color-11 custom-placeholder"
                            name="address"
                            value={data.address}
                            type="text"
                            onChange={(e: any) => {
                                setData({ ...data, address: e.target.value });
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="border"></div>

            <div className="width d-flex inquiry-input-set ">
                <div className="date-of-registration-set inquiry-lable">
                    <label className="">문의내용</label>
                </div>
                <TextareaAutosize
                    className="textAreaClass placeholder-padding"
                    maxRows={4}
                    readOnly={true}
                    value={data.inquiry}
                    onChange={(e: any) => {
                        setData({ ...data, inquiry: e.target.value });
                    }}

                />
            </div>

            <div className="border"></div>

            <div className="d-flex">
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">등록일</label>
                    </div>
                    <div className="DatePicker-set-main">
                        <ReactDatePicker
                            id="date"
                            selected={date}
                            onChange={(date: Date | null) => setDate(date)}
                            dateFormat="yyyy.MM.dd"
                            className="DatePicker-set"
                            locale="ko"
                        ></ReactDatePicker>
                    </div>
                </div>

                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">분류</label>
                    </div>
                    <div className="type-set-main">
                        <select
                            className={data === "" ? ' minimal-free' : 'minimal-free'}
                            value={data.type}
                            name="type"
                            onChange={(e: any) => {
                                setData({ ...data, type: e.target.value });
                            }}
                        >
                            <option disabled selected >시간</option>
                            {selectType.map(({ value, label }) =>
                                <option className="redText" value={value}  key={value} >{label}</option>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            <div className="border"></div>

            <div className=" d-flex consultation-details-status status-margin  ">
                <div className="border"></div>
                <div className="date-of-registration-set">
                    <label className="">처리여부</label>
                </div>
                <div className="status-set-main">
                    <select
                        className={data === "" ? 'minimal-free ' : 'minimal-free'}
                        value={data.status}
                        name="status"
                        onChange={(e: any) => {
                            setData({ ...data, status: e.target.value });
                        }}
                    >
                        <option disabled selected>시간</option>
                        {selectstatus.map(({ value, label }) =>
                            <option className="redText" value={value}  key={value}>{label}</option>
                        )}
                    </select>
                </div>
            </div>

            <div className="border"></div>

            <div className="width d-flex inquiry-input-set ">
                <div className="date-of-registration-set inquiry-lable">
                    <label className="">작성</label>
                </div>
                <TextareaAutosize
                    className="textAreaClass placeholder-padding"
                    maxRows={4}
                    value={data.detail}
                    onChange={(e: any) => {
                        setData({ ...data, detail: e.target.value });
                    }}
                />
            </div>

            <div className="border"></div>


        </>
    )
}

export default ConsultationDetails;
