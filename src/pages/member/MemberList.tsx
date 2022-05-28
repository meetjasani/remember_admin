import React from "react";
import RemotePagination from "../../component/RemotePagination/RemotePagination";
import { memeberManagment } from "./MemberManagement";
import { useHistory } from "react-router";

interface Props {
  data: memeberManagment[];
  getMemberManagment: (page: any, sizePerPage: any) => void;
  totalSize?: number;
  ltineraryRegBtn?: any;
  selectRow?: any;
  rowEvents?: (tableRowEvents: any) => void;
}

const MemberList: React.FC<Props> = ({
  data,
  getMemberManagment,
  totalSize,
  selectRow,
  rowEvents,
}) => {
  const history = useHistory();

  const EditMember = (id: any) => {
    history.push(`/member/member-registration/${id}`);
  };

  const linkEditFollow = (
    cell: any,
    row: any,
    rowIndex: any,
    formatExtraData: any
  ) => {
    return (
      <a
        className="action-link"
        onClick={() => {
          EditMember(row.id);
        }}
      >
        수정
      </a>
    );
  };

  const noValue = (
    cell: any,
    row: any,
    rowIndex: any,
    formatExtraData: any
  ) => {
    return (
      <span
        className=""
      >
        {cell === "Invalid date" ? "-" : cell}
      </span>
    );
  };

  const columns = [
    {
      dataField: "no_id",
      text: "번호",
    },
    {
      dataField: "email",
      text: "이메일",
    },
    {
      dataField: "name",
      text: "이름",
    },
    // {
    //   dataField: "dob",
    //   text: "생년월일",
    //   formatter: noValue
    // },
    {
      dataField: "mobile",
      text: "핸드폰 번호",
    },
    {
      dataField: "user_type_ko",
      text: "분류",
    },
    {
      dataField: "date_of_registration",
      text: "가입일",
    },
    {
      dataField: "date_of_deletation",
      text: "탈퇴일",
      formatter: noValue
    },
    {
      dataField: "edit_information",
      text: "정보수정",
      formatter: linkEditFollow,
    },
  ];

  const handleTableChange = (pagenumber: number, sizeperpage: number) => {
    getMemberManagment(pagenumber, sizeperpage);
  };


  return (
    <>
      <div className="member-list-table member-list">
        <RemotePagination
          data={data}
          columns={columns}
          totalSize={totalSize ?? 0}
          onTableChange={(page, sizePerPage) =>
            handleTableChange(page, sizePerPage)
          }
          pagesizedropdownflag
          selectRow={selectRow}
          rowEvents={rowEvents}
          pageName=""
        />
      </div>
    </>
  );
};

export default MemberList;