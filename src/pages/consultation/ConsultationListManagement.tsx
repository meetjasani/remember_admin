import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import ConsultationList from "./ConsultationList";
import moment from "moment";
import { ApiGet, ApiPost } from "../../helper/API/ApiData";
import DeleteInquiryPopup from "../../modal/DeleteInquiryPopup";

export interface IconsultationListData {
    id: string;
    no_id: string;
    date_of_completion: Date;
    date_of_entry: Date;
    email: string;
    inquiry: string;
    name: string;
    phone_number: number;
    visitors: string;
    status: string;
    type: string;
    detail: string;
}


const ConsultationListManagement = () => {

    const [IsConsultationManagement, setIsConsultationManagement] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [totalSize, setTotalSize] = useState<number>(0);
    const [AllCount, setAllCount] = useState<number>(0);
    const [CompleteCount, setCompleteCount] = useState<number>(0);
    const [InProgressCount, setInProgressCount] = useState<number>(0);
    const [consultationListId, setConsultationListId] = useState<any>([]);


    const [activeTab, setActiveTab] = useState("");
    const [consultationList, setConsultationList] = useState<IconsultationListData[]>([]);

    const [state, setState] = useState({
        searchTerm: "",
        status: "",
    });

    const TabChange = (TabValue: any) => {
        state.status = TabValue;
        getConsultationListManagement();
        setActiveTab(TabValue);
    };


    const viewMore = () => {
        getConsultationListManagement();
    };

    const DeleteMemberModal = () => {
        if (consultationListId.length > 0) {
            setIsConsultationManagement(true);
        }
    }
    const TerminatedConsultationLis = () => {
        if (consultationListId.length > 0) {
            ApiPost(`general/deleteFreeConsultationApplicationByAdmin`, {
                id: consultationListId.map((m: any) => m.id).join(","),
            }).then((res: any) => {
                getConsultationListManagement();
                setConsultationListId([]);
                setIsConsultationManagement(false)
            });
        }
    };
    useEffect(() => {
        getConsultationListManagement();
    }, []);

    const getConsultationListManagement = (page = 1, sizePerPage = 10) => {

        let start = startDate ? moment(startDate).format("YYYY-MM-DD") : "";
        let end = endDate ? moment(endDate).format("YYYY-MM-DD") : "";

        ApiGet(
            `general/getFreeConsultationApplicationByAdmin?start_date=${start}&end_date=${end}&keyword=${state.searchTerm}&per_page=${sizePerPage}&page_number=${page}&status=${state.status}`
        )
            .then((res: any) => {

                setTotalSize(res.data && res.data.count);
                setAllCount(res.data.AllCount);
                setCompleteCount(res.data.CompleteCount);
                setInProgressCount(res.data.InProgressCount);

                setConsultationList(
                    res.data &&
                    res.data.freeConsultationApplication &&
                    res.data.freeConsultationApplication.map((x: any, index: any) => {
                        return {
                            id: x.id,
                            no_id: res.data.count - (page - 1) * sizePerPage - index,
                            address: x.address,
                            date_of_Complete: x.date_of_Complete
                                ? moment(x.date_of_Complete).format("YYYY.MM.DD")
                                : "",
                            date_of_entry: x.date_of_entry
                                ? moment(x.date_of_entry).format("YYYY.MM.DD")
                                : "",
                            email: x.email,
                            inquiry: x.inquiry,
                            name: x.name,
                            phone_number: x.phone_number,
                            visitors: x.visitors,
                            status: x.status,
                            type: x.type
                        };
                    })
                );
            })
    };
    // let consultationListId: any = [];
    const selectRow = {
        mode: "checkbox",
        onSelect: (isSelect: any, rows: any, e: any) => {
            const index = consultationListId.findIndex(
                (item: any) => item.id === isSelect.id
            );
            if (index !== -1 && index !== undefined) {
                consultationListId.splice(index, 1);
            } else {
                consultationListId.push({ id: isSelect.id });
            }
        },
        onSelectAll: (isSelect: any, rows: any, e: any) => {
            if (isSelect === true) {
                rows.map((x: any) => (
                    consultationListId.push({ id: x.id })
                ));
            } else {
                setConsultationListId([]);
            }
        },
    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            getConsultationListManagement();
        }
    }
    return (
        <>
            <div className="main-heading-wrap">
                <div>
                    <span className="font-20-bold roboto color-01">
                        무료상담신청 리스트 관리
                    </span>
                </div>
            </div>

            <div className="border-black mt-20"></div>

            <div className="search-section consultation-search">
                <p className="title">무료상담신청 검색</p>
            </div>

            <div className="border"></div>

            <div className="d-flex">

                <div className="width d-flex">
                    <div className="date-of-registration-set  ">
                        <label className="">검색어</label>
                    </div>

                    <div className="Please-enter-input-set-padding enter-keyword">
                        <input
                            className="Please-enter-input-set color-11 custom-placeholder"
                            name="searchTerm"
                            value={state.searchTerm}
                            placeholder="검색어 입력"
                            type="text"
                            onKeyPress={handleKeyPress}
                            onChange={(e: any) => {
                                setState({
                                    ...state,
                                    searchTerm: e.target.value,
                                });
                            }}
                        />
                    </div>
                </div>

                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">등록일</label>
                    </div>
                    <div className="DatePicker-set-main ">
                        <div className="DatePicker-set-input">
                            <DatePicker
                                id="startDate"
                                selected={startDate}
                                onChange={(startDate: Date | null) => setStartDate(startDate)}
                                dateFormat="yyyy.MM.dd"
                                placeholderText="YYYY.MM.DD"
                                className="DatePicker-set"
                                locale="ko"
                                maxDate={new Date()}
                                autoComplete="off"
                            ></DatePicker>
                        </div>
                        {/* <span> - </span> */}
                        <div className="DatePicker-set-input">
                            <span className="datepicker-separator">-</span>
                            <DatePicker
                                id="endDate"
                                selected={endDate}
                                onChange={(endDate: Date | null) => setEndDate(endDate)}
                                dateFormat="yyyy.MM.dd"
                                placeholderText="YYYY.MM.DD"
                                className="DatePicker-set"
                                locale="ko"
                                maxDate={new Date()}
                                autoComplete="off"
                            ></DatePicker>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border"></div>
            <div className="text-center mb-100 mt-49">
                <button className="Search-btn-set" onClick={viewMore}>
                    <span> 검색 </span>
                </button>
            </div>

            <div className="list-top-border"></div>

            <div className="Search-Results-row">
                <span>무료상담 리스트</span>
            </div>

            <div className="border"></div>

            <div className="text-center custom-datatable member-list-table">
                <div className="tab-main">
                    <span
                        className={activeTab === "" ? "pl-3 pr-3 active" : "pl-3 pr-3"}
                        onClick={() => TabChange("")}
                    >
                        전체({AllCount})
                    </span>
                    <span
                        className={
                            activeTab === "Complete" ? "pl-3 pr-3 active" : "pl-3 pr-3"
                        }
                        onClick={() => TabChange("Complete")}
                    >
                        처리완료({CompleteCount})
                    </span>
                    <span
                        className={
                            activeTab === "InProgress" ? "pl-3 pr-3 active" : "pl-3 pr-3"
                        }
                        onClick={() => TabChange("InProgress")}
                    >
                        미처리({InProgressCount})
                    </span>
                </div>


                <div className="p-0">
                    <div className="table-width">
                        <ConsultationList
                            data={consultationList}
                            getConsultationListManagement={getConsultationListManagement}
                            totalSize={totalSize}
                            selectRow={selectRow}
                        />
                    </div>
                </div>

                <div className="memorial-message-footer memorial-post-button text-left">
                    <button onClick={DeleteMemberModal} className={consultationList.length === 0 ? 'memorial-message-footer-btn2' : 'memorial-message-footer-btn'}>
                        삭제
                    </button>
                </div>

            </div>
            {IsConsultationManagement && <DeleteInquiryPopup show={IsConsultationManagement} onHide={() => setIsConsultationManagement(false)} TerminatedConsultationLis={TerminatedConsultationLis} />}
        </>
    )
}

export default ConsultationListManagement


