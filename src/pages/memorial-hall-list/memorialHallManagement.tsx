import React, { useEffect, useState } from "react";
import Buttons from "../../component/Buttons/Buttons";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import moment from "moment";
import { ApiGet, ApiPut } from "../../helper/API/ApiData";
import { useHistory } from "react-router";
import MemorialHallList from "./memorialHallList";
import DeleteMemorialHall from "../../modal/DeleteMemorialHall";
registerLocale("ko", ko);

export interface memorialHallManagment {
  id: string;
  no_id: string;
  name: string;
  memorial_hall_name: string;
  registerer_relationship: string;
  family_members: string;
  followers: string;
  visitors: string;
  total_donation_amount: string;
  type: string;
  user_type_ko: string;
  status: string;
  date_of_deletation: Date;
}

let memorialID: any = [];

const MemorialHallManagement = () => {
  const history = useHistory()
  const [IsMemorialHall, setIsMemorialHall] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [totalSize, setTotalSize] = useState<number>(0);
  const [PrivateCount, setPrivateCount] = useState<number>(0);
  const [PublicCount, setPublicCount] = useState<number>(0);
  const [AllCount, setAllCount] = useState<number>(0);
  const [memeberManagment, setMemeberManagmentData] = useState<
    memorialHallManagment[]
  >([]);
  const [memorialIDList, setMemorialIDList] = useState<any>([]);

  const [state, setState] = useState({
    userType: "",
    memorial_type: "",
    searchTerm: "",
    memorial_information: "",
  });

  const memberInfo = [
    { value: "name", label: "이름" },
    { value: "memorialhallname", label: "추모관명" }
  ];

  const viewMore = () => {
    getMemorialHallManagment();
  };

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      getMemorialHallManagment();
    }
  }

  useEffect(() => {
    state.memorial_information = memberInfo[0].value;
  }, []);

  const DeleteMemorialHallsModal = () => {
    if (memorialIDList.length > 0) {
      setIsMemorialHall(true);
    }
  }

  const DeleteMemorialHalls = () => {
    if (memorialIDList.length > 0) {
      ApiPut(`memorialHall/deleteMemorialHall`, {
        id: memorialIDList.map((m: any) => m.id).join(","),
      }).then((res: any) => {
        getMemorialHallManagment();
        memorialID = [];
        setIsMemorialHall(false);
      });
    }
  };

  const getMemorialHallManagment = (page = 1, sizePerPage = 10) => {
    let start = startDate ? moment(startDate).format("YYYY-MM-DD") : "";
    let end = endDate ? moment(endDate).format("YYYY-MM-DD") : "";

    ApiGet(
      `memorialHall/getmemorialHallByAdmin?start_date=${start + ""}&end_date=${end + ""
      }&per_page=${sizePerPage}&page_number=${page}&memorial_type=${state.memorial_type
      }&search_term=${state.searchTerm}&memorial_information=${state.memorial_information
      }`
    )
      .then((res: any) => {

        setTotalSize(res.data && res.data.count);
        setAllCount(res.data.AllCount);
        setPublicCount(res.data.PublicCount);
        setPrivateCount(res.data.PrivateCount);

        setMemeberManagmentData(
          res.data &&
          res.data.memorialhall &&
          res.data.memorialhall.map((x: any, index: any) => {
            return {
              id: x.id,
              no_id: res.data.count - (page - 1) * sizePerPage - index,
              name: x.user_name,
              memorial_hall_name: x.memorial_hall_name,
              registerer_relationship: x.registerer,
              family_members: x.family_member,
              followers: x.followers,
              visitors: x.visitors,
              total_donation_amount: x.total_donation_amount,
              type: x.user_type,
              user_type_ko: x.user_type_ko,
              status: x.memorial_hall_type,
              date_of_registration: x.date_of_registration
                ? moment(x.date_of_registration).format("YYYY.MM.DD")
                : "",
              date_of_deletation: x.deleted_at
                ? moment(x.deleted_at).format("YYYY.MM.DD")
                : "",
              checkboxCheck: true,
            };
          })
        );
      })
  };

  const TabChange = (TabValue: any) => {
    state.memorial_type = TabValue;
    getMemorialHallManagment();
    setActiveTab(TabValue);
  };

  useEffect(() => {
    getMemorialHallManagment();
  }, []);

  const selectRow = {
    mode: "checkbox",

    onSelect: (isSelect: any, rows: any, e: any) => {
      const index = memorialID.findIndex(
        (item: any) => item.id === isSelect.id
      );
      if (index !== -1 && index !== undefined) {
        memorialID.splice(index, 1);
      } else {
        memorialID.push({ id: isSelect.id });
      }
      setMemorialIDList(memorialID);
    },
    onSelectAll: (isSelect: any, rows: any, e: any) => {

      if (isSelect === true) {
        rows.map((x: any) => memorialID.push({ id: x.id }));
        setMemorialIDList(memorialID);
      } else {
        setMemorialIDList([]);
      }
    },
  };


  const [activeTab, setActiveTab] = useState("All");

  return (
    <>
      <div className="main-heading-wrap">
        <div>
          <span className="font-20-bold roboto color-01">
            추모관 리스트 관리
          </span>
        </div>
        <div className="d-flex ml-auto">
          {/* <div>
            <Buttons type="" ButtonStyle="normalBtn mr-20" onClick={() => { TerminatedMember() }}>
              선택 탈퇴처리
            </Buttons>
          </div> */}
          <div>
            <Buttons
              type=""
              ButtonStyle="normalBtn"
              onClick={() => {
                history.push("/hall/memorial-hall-registration");
              }}
            >
              추모관 등록
            </Buttons>
          </div>
        </div>
      </div>
      <div className="border-black mt-20"></div>
      <div className="search-section">
        <p className="title">추모관 검색</p>
      </div>
      <div className="border"></div>
      <div className="d-flex">
        <div className="width d-flex">
          <div className="date-of-registration-set">
            <label className="">등록일</label>
          </div>
          <div className="DatePicker-set-main">
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
        <div className="width d-flex">
          <div className="date-of-registration-set ">
            <label className="">선택검색</label>
          </div>
          <div className="position-relative selector-padding">
            <select
              className="selector-set minimal"
              name="memorial_information"
              onChange={(e: any) => {

                setState({
                  ...state,
                  memorial_information: e.target.value,
                })

              }}
            >
              {memberInfo.map(({ value, label }) => (
                <option value={value} key={value}>{label}</option>
              ))}
            </select>
            <div className="down-arrow">
              {" "}
              <img src="../img/arrows.svg" alt="" />{" "}
            </div>
          </div>
          <div className="Please-enter-input-set-padding">
            <input
              className="Please-enter-input-set color-11 custom-placeholder"
              name="searchTerm"
              value={state.searchTerm}
              placeholder="입력해주세요."
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
      </div>
      <div className="border"></div>
      <div className="text-center mb-100 mt-49">
        <button className="Search-btn-set" type="submit" onClick={viewMore}>
          <span> 검색 </span>
        </button>
      </div>
      <div className="list-top-border"></div>
      <div className="Search-Results-row">
        <span> 검색 결과 </span>
      </div>
      <div className="border"></div>
      <div className="text-center custom-datatable member-list-table">
        <div className="tab-main">
          <span
            className={activeTab === "All" ? "pl-3 pr-3 active" : "pl-3 pr-3"}
            onClick={() => TabChange("All")}
          >
            전체({AllCount})
          </span>
          <span
            className={
              activeTab === "Public" ? "pl-3 pr-3 active" : "pl-3 pr-3"
            }
            onClick={() => TabChange("Public")}
          >
            공개({PublicCount})
          </span>
          <span
            className={
              activeTab === "Private" ? "pl-3 pr-3 active" : "pl-3 pr-3"
            }
            onClick={() => TabChange("Private")}
          >
            비공개({PrivateCount})
          </span>
        </div>

        <div className="p-0">
          <div className="table-width">
            <MemorialHallList
              data={memeberManagment}
              getMemorialHallManagment={getMemorialHallManagment}
              totalSize={totalSize}
              selectRow={selectRow}
            />
          </div>
        </div>
        <div className="position-relative">
          <div className="button-table-exv">
            <button
              className={memeberManagment.length === 0 ? 'Delete-btn2 font-weight-bold' : 'Delete-btn font-weight-bold'}
              onClick={DeleteMemorialHallsModal}
            >
              삭제
            </button>
            {/* <CSVLink data={memeberManagment} className="Download-Excel-File-btn font-weight-bold">엑셀 다운로드</CSVLink> */}
          </div>
        </div>
      </div>
      {IsMemorialHall && <DeleteMemorialHall show={IsMemorialHall} onHide={() => setIsMemorialHall(false)} DeleteMemorialHalls={DeleteMemorialHalls} />}
    </>
  );
};

export default MemorialHallManagement;
