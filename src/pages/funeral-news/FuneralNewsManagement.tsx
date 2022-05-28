import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import Buttons from "../../component/Buttons/Buttons";
import FuneralList from "./FuneralList";
import { useHistory } from "react-router";
import { ApiGet, ApiPost } from "../../helper/API/ApiData";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";
export interface funeralListData {
    id: string;
    no_id: string;
    content: string;
    write: string;
    date_of_entry: Date;
    edit_information: string;
}

const FuneralNewsManagement = () => {

    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [funeralNewsList, setfuneralNewsList] = useState<any>([]);
    const [totalSize, setTotalSize] = useState<number>(0);
    const [AllCount, setAllCount] = useState<number>(0);

    const history = useHistory();

    const [searchTerm, setsearchTerm] = useState("");


    const viewMore = () => {
        getFuneralNewManagment()
    };
    const TerminatedFuneralNews = () => {
        if (funeralListId.length > 0) {
            ApiPost(`general/deleteFuneralNewsByAdmin`, {
                id: funeralListId.map((m: any) => m.id).join(","),
            }).then((res: any) => {
                getFuneralNewManagment();
                funeralListId = [];
            });
        }
    };
    useEffect(() => {
        getFuneralNewManagment();
    }, []);


    const getFuneralNewManagment = (page = 1, sizePerPage = 10) => {

        let start = startDate ? moment(startDate).format("YYYY-MM-DD") : "";
        let end = endDate ? moment(endDate).format("YYYY-MM-DD") : "";

        return ApiGet(`general/getFuneralNewsByAdmin?per_page=${sizePerPage}&page_number=${page}&start_date=${start}&end_date=${end}&keyword=${searchTerm}`)
            .then((response: any) => {
                setTotalSize(response.data && response.data.count);
                setAllCount(response.data && response.data.AllCount);
                setfuneralNewsList(
                    response.data &&
                    response?.data?.funeralnews.map((data: any, index: any) => {
                        return {
                            id: data.id,
                            no_id: response.data.count - (page - 1) * sizePerPage - index,
                            write: data.write,
                            title: data.title,
                            content: ReactHtmlParser('<div class="ck-content">' + data.content + '</div>'),
                            date_of_entry: data.created_at
                                ? moment(data.created_at).format("YYYY.MM.DD")
                                : "",
                        }
                    })
                );
            })
            .catch((error: any) => { });
    }
    let funeralListId: any = [];
    const selectRow = {
        mode: "checkbox",
        onSelect: (isSelect: any, rows: any, e: any) => {
            const index = funeralListId.findIndex(
                (item: any) => item.id === isSelect.id
            );
            if (index !== -1 && index !== undefined) {
                funeralListId.splice(index, 1);
            } else {
                funeralListId.push({ id: isSelect.id });
            }

        },
        onSelectAll: (isSelect: any, rows: any, e: any) => {
            if (isSelect === true) {
                rows.map((x: any) => (
                    funeralListId.push({ id: x.id })
                ));
            } else {
                funeralListId = [];
            }
        },
    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            getFuneralNewManagment();
        }
    }
    return (
        <>
            <div className="main-heading-wrap">

                <span className="font-20-bold roboto color-01">
                    장례뉴스 관리
                </span>

                <div className="d-flex ml-auto">
                    <div>
                        <Buttons
                            type=""
                            ButtonStyle="normalBtn"
                            onClick={() => { history.push("/other/funeral-news/funeral-details") }}
                        >
                            장례뉴스 등록
                        </Buttons>
                    </div>
                </div>

            </div>

            <div className="border-black mt-19"></div>

            <div className="search-section consultation-search">
                <p className="title">장례뉴스 검색</p>
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
                            value={searchTerm}
                            placeholder="검색어 입력"
                            type="text"
                            onKeyPress={handleKeyPress}
                            onChange={(e: any) => setsearchTerm(e.target.value)}
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
                                autoComplete="off"
                                maxDate={new Date()}
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
                                autoComplete="off"
                                maxDate={new Date()}
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
                <span>장례뉴스 리스트({AllCount})</span>
            </div>

            <div className="border"></div>

            <div className="text-center custom-datatable member-list-table">

                <div className="p-0">
                    <div className="table-width">
                        <FuneralList
                            data={funeralNewsList}
                            getFuneralNewManagment={getFuneralNewManagment}
                            totalSize={totalSize}
                            selectRow={selectRow}
                        />
                    </div>
                </div>

                <div className="memorial-message-footer memorial-post-button text-left">
                    <button onClick={TerminatedFuneralNews} className={funeralNewsList.length === 0 ? 'memorial-message-footer-btn2 funeral-news-footer-button' : 'memorial-message-footer-btn funeral-news-footer-button'}>
                        선택 삭제
                    </button>
                </div>

            </div>
        </>
    )
}

export default FuneralNewsManagement;
