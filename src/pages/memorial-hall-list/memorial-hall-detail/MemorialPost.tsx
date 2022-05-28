import React, { useState, useEffect } from 'react'
import RemotePagination from '../../../component/RemotePagination/RemotePagination';
import { ApiGet, ApiPost } from '../../../helper/API/ApiData';
import ReactHtmlParser from 'react-html-parser';

export interface memorialPostData {
    id: string;
    no_id: string;
    name: string;
    content: string;
    image_file: string;
    video_file: string;
    date_of_entry: string;
}

interface Props {
    ltineraryRegBtn?: any;
    memorialPost_id: string;
}

let memorialPostId: any = [];

const MemorialPost: React.FC<Props> = ({
    memorialPost_id,
}) => {

    const [memorialPostIdList, setMemorialPostIdList] = useState<memorialPostData[]>([]);
    const [selectedButton, setSelectedButton] = useState("All");
    const [totalSize, setTotalSize] = useState<number>(0);
    const [AllCount, setAllCount] = useState<number>(0);

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
            dataField: "content",
            text: "내용",
        },
        {
            dataField: "image_file",
            text: "이미지 파일",
        },
        {
            dataField: "video_file",
            text: "영상 파일",
        },
        {
            dataField: "date_of_entry",
            text: "작성일자",
        }
    ];

    const DeleteMemorialPost = () => {
        if (memorialPostId.length > 0) {
            ApiPost(`memorialHall/deleteMemorialPostByIdByAdmin`, {
                id: memorialPostId.map((m: any) => m.id).join(","),
            })
                .then((res: any) => {
                    getMemorialPostManagment();
                    memorialPostId = [];
                });
        }
    }
    const handleTableChange = (pagenumber: number, sizeperpage: number) => {
        getMemorialPostManagment(pagenumber, sizeperpage);
    };

    const getMemorialPostManagment = (page = 1, sizePerPage = 10) => {

        ApiGet(`memorialHall/getAllMemorialHallPostByIDAdmin/${memorialPost_id}?per_page=${sizePerPage}&page_number=${page}`)
            .then((res: any) => {

                setAllCount(res.data.AllCount)
                setTotalSize(res.data.count)

                setMemorialPostIdList(
                    res.data &&
                    res.data.memorialPostData &&
                    res.data.memorialPostData.map((x: any, index: any) => {
                        return {
                            id: x.id,
                            no_id: res.data.count - (page - 1) * sizePerPage - index,
                            name: x.name,
                            content: ReactHtmlParser('<div class="ck-content">' + x.content.replace(/<img .*?><video .*?>/g, " ") + '</div>'),
                            image_file: x.image,
                            video_file: x.video,
                            date_of_entry: x.post_create_date
                        }
                    })
                );

            })
    };

    useEffect(() => {
        getMemorialPostManagment()
    }, [])

    const selectRow = {
        mode: "checkbox",
        onSelect: (isSelect: any, rows: any, e: any) => {
            const index = memorialPostId.findIndex(
                (item: any) => item.id === isSelect.id
            );
            if (index !== -1 && index !== undefined) {
                memorialPostId.splice(index, 1);
            } else {
                memorialPostId.push({ id: isSelect.id });
            }
        },
        onSelectAll: (isSelect: any, rows: any, e: any) => {
            if (isSelect === true) {
                rows.map((x: any) => (
                    memorialPostId.push({ id: x.id })
                ));
            } else {
                memorialPostId = [];
            }
        },
    };
    return (
        <>
            <div className="custom-datatable">

                <div className="memorial-hall-detail-tab">
                    <button onClick={() => { setSelectedButton("All") }} className={selectedButton === "All" ? 'selectedbtn tab1' : 'tabbtn tab1'}>전체({AllCount})</button>
                </div>
                <div className="">
                    <div className=" text-center memorial-post-list ">
                        <RemotePagination
                            data={memorialPostIdList}
                            columns={columns}
                            totalSize={totalSize ?? 0}
                            onTableChange={(page, sizePerPage) =>
                                handleTableChange(page, sizePerPage)
                            }
                            pagesizedropdownflag={false}
                            selectRow={selectRow}
                            rowEvents=""
                            pageName=""
                        />
                    </div>
                </div>

                <div className="memorial-message-footer memorial-post-button">
                    <button onClick={DeleteMemorialPost} className={memorialPostIdList.length === 0 ? 'memorial-message-footer-btn2' : 'memorial-message-footer-btn'}>
                        삭제
                    </button>
                </div>
            </div>

        </>
    )
}

export default MemorialPost
