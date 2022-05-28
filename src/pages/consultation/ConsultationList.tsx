import React from "react";
import { useHistory } from "react-router";
import RemotePagination from "../../component/RemotePagination/RemotePagination";
import { IconsultationListData } from './ConsultationListManagement';

interface Props {
    data: IconsultationListData[];
    getConsultationListManagement: (page: any, sizePerPage: any) => void;
    totalSize?: number;
    selectRow?: any;
    rowEvents?: (tableRowEvents: any) => void;
}

const ConsultationList: React.FC<Props> = ({ data, getConsultationListManagement, totalSize, selectRow, rowEvents }) => {

    const history = useHistory();

    const linkEditFollow = (
        cell: any,
        row: any,
        rowIndex: any,
        formatExtraData: any
    ) => {
        return (
            <a className="action-link see-details-link" onClick={() => { history.push(`/other/consultation/consultation-details?id=${row.id}`) }}> 상세보기 </a>
        );
    };

    const linkHeaderFormatter = (column: any, colIndex: any) => {
        return <a className="action-link see-details-link"> 상세보기 </a>
    }

    const columns = [
        {
            dataField: "no_id",
            text: "번호",
        },
        {
            dataField: "name",
            text: "문의자명",
        },
        {
            dataField: "phone_number",
            text: "전화번호",
        },
        {
            dataField: "email",
            text: "이메일",
        },
        {
            dataField: "address",
            text: "주소",
        },
        {
            dataField: "inquiry",
            text: "문의내용",
        },
        {
            dataField: "date_of_entry",
            text: "등록일",
        },
        {
            dataField: "type",
            text: "분류",
        },
        {
            dataField: "see_details",
            text: "상세보기",
            formatter: linkEditFollow,
            headerFormatter: linkHeaderFormatter,
        },
        {
            dataField: "status",
            text: "처리여부",
        },
        {
            dataField: "date_of_Complete",
            text: "처리일자",
        }
    ];



    const handleTableChange = (pagenumber: number, sizeperpage: number) => {
        getConsultationListManagement(pagenumber, sizeperpage);
    };



    return (
        <>
            <div className="consultation-list checkbox-margin">
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
        </ >
    )
}

export default ConsultationList;
