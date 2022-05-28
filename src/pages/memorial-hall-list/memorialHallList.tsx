import React from "react";
import { useHistory } from "react-router";
import RemotePagination from "../../component/RemotePagination/RemotePagination";
import { memorialHallManagment } from "./memorialHallManagement";

interface Props {
  data: memorialHallManagment[];
  getMemorialHallManagment: (page: any, sizePerPage: any) => void;
  totalSize?: number;
  ltineraryRegBtn?: any;
  selectRow?: any;
  rowEvents?: (tableRowEvents: any) => void;
}

const MemorialHallList: React.FC<Props> = ({
  data,
  getMemorialHallManagment,
  totalSize,
  selectRow,
}) => {
  const history = useHistory();

  const EditMember = (id: any, e: any) => {
    e.stopPropagation();
    history.push(`/hall/memorial-hall-registration/${id}`);
  };

  const linkEditFollow = (
    cell: any,
    row: any,
    rowIndex: any,
    formatExtraData: any
  ) => {
    return (
      <a className="action-link" onClick={(event: any) => { EditMember(row.id, event); }}> 수정 </a>
    );
  };

  const linkViewFollow = (
    cell: any,
    row: any,
    rowIndex: any,
    formatExtraData: any
  ) => {

    return (
      <a className=" " onClick={(event: any) => { history.push(`/hall/memorial-hall-details/${row.id}`); }}> {row.memorial_hall_name} </a>
    );
  };

  const columns = [
    {
      dataField: "no_id",
      text: "번호",
    },
    {
      dataField: "name",
      text: "이름",
    },
    {
      dataField: "memorial_hall_name",
      text: "추모관명",
      formatter: linkViewFollow,
    },
    {
      dataField: "registerer_relationship",
      text: "상주(관계)",
    },
    {
      dataField: "family_members",
      text: "가족구성원",
    },
    {
      dataField: "followers",
      text: "팔로워",
    },
    {
      dataField: "visitors",
      text: "방문자",
    },
    {
      dataField: "total_donation_amount",
      text: "기부금 총액",
    },
    {
      dataField: "date_of_registration",
      text: "등록일",
    },
    {
      dataField: "type",
      text: "분류",
    },
    {
      dataField: "status",
      text: "공개여부",
    },
    {
      dataField: "edit_information",
      text: "정보수정",
      formatter: linkEditFollow,
    },
  ];

  const handleTableChange = (pagenumber: number, sizeperpage: number) => {
    getMemorialHallManagment(pagenumber, sizeperpage);
  };

  /* Table Row Events */
  const rowEvents = (id: string) => {
    history.push(`/hall/memorial-hall-details/${id}`);
  }

  return (
    <div className="memorial-hall-list">
      <RemotePagination
        data={data}
        columns={columns}
        totalSize={totalSize ?? 0}
        onTableChange={(page, sizePerPage) =>
          handleTableChange(page, sizePerPage)
        }
        pagesizedropdownflag
        selectRow={selectRow}
        // rowEvents={rowEvents}
        rowEvents=""
        pageName="MemorialHallList"
      />

    </div>
  );
};

export default MemorialHallList;
