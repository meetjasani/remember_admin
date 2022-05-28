import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import moment from "moment";
import { ApiGet, ApiPut } from "../../helper/API/ApiData";
import MemberMngList from "./MemberMngList";
import DeleteMember from "../../modal/DeleteMember";
registerLocale("ko", ko);
export interface terminationMemberMng {
  id: string;
  no_id: string,
  email: string;
  name: string;
  memorial_hall: string;
  phone_number: string;
  date_of_termination: Date;
}
let memberID: any = []
const MemberMngment = () => {

  const [IsMemberTerminate, setIsMemberTerminate] = useState(false);
  const [terminationstartDate, setTerminationStartDate] = useState<Date | null>();
  const [terminationendDate, setTerminationEndDate] = useState<Date | null>();
  const [terminationtotalSize, setTerminationTotalSize] = useState<number>(0);
  const [terminationAllCount, setTerminationAllCount] = useState<number>(0);
  const [terminationMemberMng, setTerminationMemberMngData] = useState<terminationMemberMng[]>([]);
  const [terminationmemeberIDList, setTerminationMemeberIDList] = useState<any>([]);


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

  useEffect(() => {
    state.user_information = memberInfo[0].value
  }, [])

  const sendMemberId = (data: any) => {
    setTerminationMemeberIDList(data)
  }


  const getMemberManagment = (page = 1, sizePerPage = 10) => {
    let start = terminationstartDate ? moment(terminationstartDate,"YYYY-MM-DD").format("YYYY-MM-DD") : "";
    let end = terminationendDate ? moment(terminationendDate, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
    ApiGet(
      `admin/getTerminatedUsers?start_date=${start + ''}&end_date=${end + ''}&per_page=${sizePerPage}&page_number=${page}&search_term=${state.searchTerm}`
    ).then((res: any) => {
      setTerminationTotalSize(res.data && res.data.count);
      setTerminationAllCount(res.data.AllCount);
      setTerminationMemberMngData(
        res.data &&
        res.data.users &&
        res.data.users.map((x: any, index: any) => {
          return {
            id: x.id,
            no_id: (res.data.count - ((page - 1) * sizePerPage)) - index,
            email: x.email,
            name: x.name,
            memorial_hall: x.memorialHallName,
            // dob: x.dob ? moment(x.dob).format("YYYY.MM.DD") : "",
            phone_number: x.mobile,
            date_of_termination: x.deleted_at ? moment(x.deleted_at).format("YYYY.MM.DD") : "",
            checkboxCheck: true
          };
        })
      );
    });
  };

  const TabChange = (TabValue: any) => {
    state.userType = TabValue;
    getMemberManagment();
    setActiveTab(TabValue)
  }

  useEffect(() => {
    getMemberManagment()
  }, [])

  const DeleteMemberModal = () => {
    if (terminationmemeberIDList.length > 0) {
      setIsMemberTerminate(true);
    }
  }

  const DeleteMembers = () => {
    if (terminationmemeberIDList.length > 0) {
      ApiPut(
        `admin/auth/deleteUser`, {
        id: terminationmemeberIDList.map((m: any) => m.id).join(",")
      }
      ).then((res: any) => {
        getMemberManagment();
        memberID = [];
        setIsMemberTerminate(false)
      });
    }
  }

  const selectRow = {
    mode: 'checkbox',
    onSelect: (isSelect: any, rows: any, e: any) => {
      const index = memberID.findIndex((item: any) => item.id === isSelect.id)
      if (index !== -1 && index !== undefined) {
        memberID.splice(index, 1)
      } else {
        memberID.push({ id: isSelect.id });
      }
      setTerminationMemeberIDList(memberID)
    },

    onSelectAll: (isSelect: any, rows: any, e: any) => {
      if (isSelect === true) {
        rows.map((x: any) => memberID.push({ id: x.id }))
        setTerminationMemeberIDList(memberID)
      } else {
        setTerminationMemeberIDList([])
      }

    }
  };

  const [activeTab, setActiveTab] = useState("All")

  return (
    <>

      <div className="main-heading-wrap">
        <div>
          <span className="font-20-bold roboto color-01">회원 탈퇴 ∙ 삭제 관리</span>
        </div>

      </div>
      <div className="border-black mt-20"></div>
      <div className="search-section">
        <p className="title">회원 검색</p>
      </div>
      <div className="border"></div>
      <div className="d-flex">

        <div className="width d-flex">
          <div className="date-of-registration-set ">
            <label className="">검색어</label>
          </div>

          <div className="Please-enter-input-set-padding">
            <input
              className="Please-enter-input-set color-11 custom-placeholder pl-25"
              name="searchTerm"
              value={state.searchTerm}
              placeholder="검색어 입력."
              type="text"
              onChange={(e: any) => {
                setState({
                  ...state,
                  searchTerm: e.target.value,
                })
              }
              }
            />
          </div>
        </div>
        <div className="width d-flex">
          <div className="date-of-registration-set">
            <label className="">탈퇴일</label>
          </div>
          <div className="DatePicker-set-main">
            <div className="DatePicker-set-input">
              <DatePicker
                id="startDate"
                selected={terminationstartDate}
                onChange={(startDate: Date | null) => setTerminationStartDate(startDate)}
                dateFormat="yyyy.MM.dd"
                placeholderText="YYYY.MM.DD"
                className="DatePicker-set"
                locale="ko"
                autoComplete="off"
              >
              </DatePicker>
            </div>
            <div className="DatePicker-set-input">
              <span className="datepicker-separator">-</span>
              <DatePicker
                id="endDate"
                selected={terminationendDate}
                onChange={(endDate: Date | null) => setTerminationEndDate(endDate)}
                dateFormat="yyyy.MM.dd"
                placeholderText="YYYY.MM.DD"
                className="DatePicker-set"
                locale="ko"
                autoComplete="off"
              >
              </DatePicker>
            </div>
          </div>
        </div>
      </div>
      <div className="border"></div>
      <div className="text-center mb-100 mt-49">
        <button className="Search-btn-set" onClick={viewMore}>
          <span>  검색 </span>
        </button></div>
      <div className="list-top-border"></div>
      <div className="Search-Results-row">
        <span>  검색 결과 </span>
      </div>
      <div className="border"></div>

      <div className="text-center custom-datatable member-list-table">
        <div className="tab-main">
          <span className={activeTab === "All" ? "pl-3 pr-3 active" : "pl-3 pr-3"} onClick={() => TabChange('All')}>전체({terminationAllCount})</span>
        </div>

        <div className="p-0">

          <div className="table-width member-mng-table">

            <MemberMngList
              data={terminationMemberMng}
              getMemberManagment={getMemberManagment}
              sendMemberId={sendMemberId}
              selectRow={selectRow}
              terminationtotalSize={terminationtotalSize}
            />
          </div>

        </div>
        <div className="position-relative">
          <div className="button-table-exv">
            <button className={terminationMemberMng.length === 0 ? 'Delete-btn2 font-weight-bold' : 'Delete-btn font-weight-bold'} onClick={() => DeleteMemberModal()}>삭제</button>

          </div>
        </div>
      </div>
      {IsMemberTerminate && <DeleteMember show={IsMemberTerminate} onHide={() => setIsMemberTerminate(false)} DeleteMembers={DeleteMembers} />}
    </>
  );
};

export default MemberMngment;
