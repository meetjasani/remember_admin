import React, { useEffect, useState } from "react";
import Buttons from "../../component/Buttons/Buttons";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import moment from "moment";
import { ApiGet, ApiPut } from "../../helper/API/ApiData";
import MemberList from "./MemberList";
import { useHistory } from "react-router";
import { CSVLink } from "react-csv";
import TerminatePopup from "../../modal/TerminatePopup";
import NumberFormat from "react-number-format";
registerLocale("ko", ko);

export interface memeberManagment {
  id: string;
  no_id: string;
  name: string;
  email: string;
  mobile: string;
  // dob: string;
  user_type: string;
  user_type_ko: string;
  date_of_registration: Date;
  date_of_deletation: Date;
}
let memberID: any = [];
const MemberManagement = () => {
  const history = useHistory();

  const [IsTerminate, setIsTerminate] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [totalSize, setTotalSize] = useState<number>(0);
  const [Basiccount, setBasiccount] = useState<number>(0);
  const [AllCount, setAllCount] = useState<number>(0);
  const [StandardCount, setStandardCount] = useState<number>(0);
  const [PremiumCount, setPremiumCount] = useState<number>(0);
  const [TerminatedCount, setTerminatedCount] = useState<number>(0);
  const [memeberManagment, setMemeberManagmentData] = useState<
    memeberManagment[]
  >([]);
  const [exportMemeberManagment, setExportMemeberManagmentData] = useState<any>([]);
  const [memeberIDList, setMemeberIDList] = useState<any>([]);

  const [state, setState] = useState({
    userType: "",
    searchTerm: "",
    user_information: "",
  });

  const memberInfo = [
    { value: "name", label: "이름" },
    { value: "email", label: "이메일" },
    { value: "mobile", label: "핸드폰 번호" },
  ];

  const viewMore = () => {
    getMemberManagment();
  };

  //Keypress
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      getMemberManagment();
    }
  }

  useEffect(() => {
    state.user_information = memberInfo[0].value;
  }, []);

  const TerminatedMemberModal = () => {
    if (memeberIDList.length > 0) {
      setIsTerminate(true)
    }
  }
  const TerminatedMember = () => {
    if (memeberIDList.length > 0) {
      ApiPut(`admin/auth/terminateUser`, {
        id: memeberIDList.map((m: any) => m.id).join(","),
      }).then((res: any) => {
        getMemberManagment();
        memberID = [];
        setIsTerminate(false)
      });
    }
  };

  const getMemberManagment = (page = 1, sizePerPage = 10) => {
    let start = startDate ? moment(startDate).format("YYYY-MM-DD") : "";
    let end = endDate ? moment(endDate).format("YYYY-MM-DD") : "";
    ApiGet(
      `admin/getFilteredUser?date_option=sign_up&start_date=${start + ""
      }&end_date=${end + ""
      }&per_page=${sizePerPage}&page_number=${page}&user_information=${state.user_information
      }&search_term=${state.searchTerm}&user_type=${state.userType}`
    ).then((res: any) => {
      setTotalSize(res.data && res.data.count);
      setAllCount(res.data.AllCount);
      setBasiccount(res.data.Basiccount);
      setStandardCount(res.data.StandardCount);
      setPremiumCount(res.data.PremiumCount);
      setTerminatedCount(res.data.TerminatedCount);
      if (start !== "" || end !== "" || state.searchTerm !== "" || state.userType !== "") {
        if (res?.data?.users.length > 0) {
          let val = res?.data?.users?.every((e: any) => e?.user_type === res?.data?.users[0].user_type);
          if (val) {
            setActiveTab(res?.data?.users[0].user_type)
          } else {
            setActiveTab("")
          }
        } else {
          setActiveTab("")
        }

      }

      setMemeberManagmentData(
        res.data &&
        res.data.users &&
        res.data.users.map((x: any, index: any) => {
          return {
            id: x.id,
            no_id: res.data.count - (page - 1) * sizePerPage - index,
            name: x.name,
            email: x.email,
            mobile: x.mobile,
            // dob: x.dob ? x.dob : "",
            user_type: x.user_type,
            user_information: x.user_information,
            user_type_ko: x.user_type_ko,
            date_of_registration: x.created_at
              ? x.created_at
              : "-",
            date_of_deletation: x.deleted_at
              ? x.deleted_at
              : "-",
            checkboxCheck: true,
          };
        })
      );

      let DataAdd = []
      DataAdd.push(['번호', '이메일', '이름', '핸드폰 번호', '분류', '가입일', '탈퇴일'])
      // res.data &&
      //   res.data.users &&
      res.data.users.map((x: any, index: any) => {
        DataAdd.push([
          res.data.count - (page - 1) * sizePerPage - index,
          x.name,
          x.email,
          x.mobile,
          x.user_type_ko,
          x.created_at !== "Invalid date" ? (x.created_at ? x.created_at : "-") : "-",
          x.deleted_at !== "Invalid date" ? (x.deleted_at ? x.deleted_at : "-") : "-"
        ])
      })

      setExportMemeberManagmentData(
        DataAdd
      )
    });
  };

  const TabChange = (TabValue: any) => {
    state.userType = TabValue;
    getMemberManagment();
    setActiveTab(TabValue);
  };

  useEffect(() => {
    getMemberManagment();
  }, []);

  const selectRow = {
    mode: "checkbox",
    onSelect: (isSelect: any, rows: any, e: any) => {
      const index = memberID.findIndex((item: any) => item.id === isSelect.id);
      if (index !== -1 && index !== undefined) {
        memberID.splice(index, 1);
      } else {
        memberID.push({ id: isSelect.id });
      }
      setMemeberIDList(memberID);
    },
    onSelectAll: (isSelect: any, rows: any, e: any) => {
      if (isSelect === true) {
        rows.map((x: any) => memberID.push({ id: x.id }));
        setMemeberIDList(memberID);
      } else {
        setMemeberIDList([]);
      }
    },
  };

  const [activeTab, setActiveTab] = useState("All");

  return (
    <>
      <div className="main-heading-wrap">
        <div>
          <span className="font-20-bold roboto color-01">회원 리스트 관리</span>
        </div>
        <div className="d-flex ml-auto">
          <div>
            <Buttons
              type=""
              ButtonStyle="normalBtn mr-20"
              onClick={() => {
                TerminatedMemberModal();
              }}
            >
              선택 탈퇴처리
            </Buttons>
          </div>
          <div>
            <Buttons
              type=""
              ButtonStyle="normalBtn"
              onClick={() => {
                history.push("/member/member-registration");
              }}
            >
              회원 등록
            </Buttons>
          </div>
        </div>
      </div>
      <div className="border-black mt-20"></div>
      <div className="search-section">
        <p className="title">회원 검색</p>
      </div>
      <div className="border"></div>
      <div className="d-flex">
        <div className="width d-flex">
          <div className="date-of-registration-set">
            <label className="">가입일</label>
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
                maxDate={new Date()}
                autoComplete="off"
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
                maxDate={new Date()}
                autoComplete="off"
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
              name="user_information"
              onChange={(e: any) => {
                setState({
                  ...state,
                  user_information: e.target.value,
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
            {state.user_information === "mobile" ?
              <NumberFormat
                format="###-####-####"
                className="Please-enter-input-set color-11 custom-placeholder"
                name="phone"
                value={state.searchTerm}
                type="text"
                onChange={(e: any) => {
                  setState({
                    ...state,
                    searchTerm: e.target.value,
                  });
                }}
              />
              :
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
            }

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
        <span> 검색 결과 </span>
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
              activeTab === "Standard" ? "pl-3 pr-3 active" : "pl-3 pr-3"
            }
            onClick={() => TabChange("Standard")}
          >
            일반({StandardCount})
          </span>
          <span
            className={activeTab === "Basic" ? "pl-3 pr-3 active" : "pl-3 pr-3"}
            onClick={() => TabChange("Basic")}
          >
            베이직({Basiccount})
          </span>
          <span
            className={
              activeTab === "Premium" ? "pl-3 pr-3 active" : "pl-3 pr-3"
            }
            onClick={() => TabChange("Premium")}
          >
            프리미엄({PremiumCount})
          </span>
          <span
            className={
              activeTab === "Terminated" ? "pl-3 pr-3 active" : "pl-3 pr-3"
            }
            onClick={() => TabChange("Terminated")}
          >
            탈퇴({TerminatedCount})
          </span>
        </div>

        <div className="p-0">
          <div className="table-width">
            <MemberList
              data={memeberManagment}
              getMemberManagment={getMemberManagment}
              totalSize={totalSize}
              selectRow={selectRow}
            />
          </div>
        </div>
        <div className="position-relative">
          <div className="button-table-exv">
            <CSVLink
              data={exportMemeberManagment}
              className={memeberManagment.length === 0 ? "Download-Excel-File-btn font-weight-bold membermanagement download-csv-btn" : "Download-Excel-File-btn font-weight-bold"}
              filename={`memeberlist_${moment().format("YYYYMMDD")}.xls`}
            >
              엑셀 다운로드
            </CSVLink>
          </div>
        </div>
      </div>
      {IsTerminate && <TerminatePopup show={IsTerminate} onHide={() => setIsTerminate(false)} TerminatedMember={TerminatedMember} />}
    </>
  );
};

export default MemberManagement;
