import React from "react";
import RemotePagination from "../../component/RemotePagination/RemotePagination";
import { terminationMemberMng } from "./MemberMngment";

interface Props {
  data: terminationMemberMng[];
  getMemberManagment: (page: any, sizePerPage: any) => void;
  terminationtotalSize?: number;
  ltineraryRegBtn?: any;
  sendMemberId: (memberID: any) => void
  selectRow?: any
  rowEvents?: any;
}

const MemberMngList: React.FC<Props> = ({ data, getMemberManagment, terminationtotalSize, selectRow, rowEvents }) => {

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
    {
      dataField: "memorial_hall",
      text: "추모관",
    },
    // {
    //   dataField: "dob",
    //   text: "생년월일",
    // },
    {
      dataField: "phone_number",
      text: "핸드폰 번호",
    },
    {
      dataField: "date_of_termination",
      text: "탈퇴일",
    },
  ];

  const handleTableChange = (pagenumber: number, sizeperpage: number) => {
    getMemberManagment(pagenumber, sizeperpage)
  }

  return (
    <>
      <div className="member-list-table member-mng-list ">
        <RemotePagination
          data={data}
          columns={columns}
          totalSize={terminationtotalSize ?? 0}
          onTableChange={(page, sizePerPage) => handleTableChange(page, sizePerPage)}
          pagesizedropdownflag
          selectRow={selectRow}
          rowEvents={rowEvents}
          pageName=""
        />
      </div>
    </>
  );
};

export default MemberMngList;


