import React from "react";
import { useHistory } from "react-router";
import RemotePagination from "../../component/RemotePagination/RemotePagination";
import { funeralListData } from "./FuneralNewsManagement";

interface Props {
    data: funeralListData[];
    getFuneralNewManagment: (page: number, sizePerPage: number) => void;
    totalSize?: number;
    selectRow?: any;
    rowEvents?: (tableRowEvents: any) => void;
}

const FuneralList: React.FC<Props> = ({
    data,
    getFuneralNewManagment,
    totalSize,
    selectRow,
    rowEvents,
}) => {

    const history = useHistory();

    const EditFuneralNews = (id: string) => {
        history.push(`/other/funeral-news/funeral-details?id=${id}`);
    };

    const linkEditFollow = (
        cell: any,
        row: any,
        rowIndex: any,
        formatExtraData: any
    ) => {
        return (
            <a className="action-link" onClick={() => { EditFuneralNews(row.id); }}> 수정 </a>
        );
    };

    const columns = [
        {
            dataField: "no_id",
            text: "번호",
        },
        {
            dataField: "title",
            text: "제목",
        },
        {
            dataField: "write",
            text: "작성자",
        },
        {
            dataField: "date_of_entry",
            text: "등록일",
        },
        {
            dataField: "edit_information",
            text: "정보수정",
            formatter: linkEditFollow,
        },
    ];

    const handleTableChange = (pagenumber: number, sizeperpage: number) => {
        getFuneralNewManagment(pagenumber, sizeperpage);
    };
    return (
        <>

            <div className="funeral-list checkbox-margin">
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
    )

}

export default FuneralList;
