import React, { useEffect, useState } from 'react'
import RemotePagination from '../../../component/RemotePagination/RemotePagination';
import { ApiGet, ApiPost } from '../../../helper/API/ApiData';
import AuthStorage from '../../../helper/AuthStorage';


export interface albumVideoData {
    id: string;
    no_id: string;
    writer: string;
    fileName: string;
    fileFormat: string;
    fileFormat_ko: string;
    fileSize: string;
    date_of_entry: string;
}

interface Props {
    albumVideoTabId: string;
    handleAlbumVideoTab: (tabValue: string | null) => void;
    rowEvents?: (tableRowEvents: any) => void;
    fetchAlbumVideoData: boolean;
}

let albumVideoId: any = [];



const Album_Video: React.FC<Props> = ({
    albumVideoTabId, handleAlbumVideoTab, rowEvents, fetchAlbumVideoData
}) => {

    const [selectedButton, setSelectedButton] = useState<string | null>("All");
    const [albumVideoData, setAlbumVideoData] = useState<albumVideoData[]>([]);
    const [albumVideoIdList, setAlbumVideoIdList] = useState<any>([]);
    const [totalSize, setTotalSize] = useState<number>(0);
    const [allCount, setAllCount] = useState<number>(0);
    const [albumCount, setAlbumCount] = useState<number>(0);
    const [videoCount, setVideoCount] = useState<number>(0);
    const getActivetab = AuthStorage.getStorageData("activeTab") ? AuthStorage.getStorageData("activeTab") : "All"

    useEffect(() => {
        //[+] CallBack Function :- Pass tab change value to memorail-hall-details
        handleAlbumVideoTab(selectedButton);
    }, [selectedButton])


    //[+] Main save in  table
    const mainSave = (rowData: any) => {
        ApiPost("memorialHall/memorialHallMainImage", {
            memorial_id: albumVideoTabId,
            album_and_video_id: rowData.id,
            post_type: rowData.fileFormat,
        }).then((res: any) => res)
    }

    const linkEditFollow = (
        cell: any,
        row: any,
        rowIndex: any,
        formatExtraData: any
    ) => {


        return (
            <button

                className="tablebtn"
                onClick={() => {
                    mainSave(row);
                }}
            >
                메인 저장
            </button>
        );
    };
    const columns = [
        {
            dataField: "no_id",
            text: "번호",
        },
        {
            dataField: "writer",
            text: "작성자",
        },
        {
            dataField: "fileName",
            text: "파일명",
        },
        {
            dataField: "fileFormat_ko",
            text: "파일형식",
        },
        {
            dataField: "fileSize",
            text: "파일크기",
        },
        {
            dataField: "date_of_entry",
            text: "등록일",
        },
        {
            dataField: "button",
            text: " ",
            formatter: linkEditFollow,
        }
    ];

    const handleTableChange = (pagenumber: number, sizeperpage: number) => {
        getAllAlbumVideoData(pagenumber, sizeperpage);
    };

    const selectRow = {
        mode: "checkbox",
        onSelect: (isSelect: any, rows: any, e: any) => {
            const index = albumVideoId.findIndex(
                (item: any) => item.id === isSelect.id
            );
            if (index !== -1 && index !== undefined) {
                albumVideoId.splice(index, 1);
            } else {
                albumVideoId.push({ id: isSelect.id });
            }
            setAlbumVideoIdList(albumVideoId);
        },
        onSelectAll: (isSelect: any, rows: any, e: any) => {
            if (isSelect === true) {
                rows.map((x: any) => (
                    albumVideoId.push({ id: x.id })
                ));
                setAlbumVideoIdList(albumVideoId);
            } else {
                setAlbumVideoIdList([]);
            }
        },
    };

    // [+] GET All Album Video Data
    const getAllAlbumVideoData = (page = 1, sizePerPage = 10) => {
        let type = getActivetab === "All" ? "" : getActivetab
        if (type === null) {
            type = ""
        }
        return ApiGet(`memorialHall/getAllMemorialHallAlbumAndVideoByIDAdmin/${albumVideoTabId}?post_type=${type}&per_page=${sizePerPage}&page_number=${page}`)
            .then((response: any) => {
                setTotalSize(response.data && response.data.Count);
                setAllCount(response.data && response.data.AllCount);
                setAlbumCount(response.data && response.data.AlbumCount);
                setVideoCount(response.data && response.data.VideoCount);
                setAlbumVideoData(
                    response.data &&
                    response.data.memorialAlbumVideoData &&
                    response.data.memorialAlbumVideoData.map((data: any, index: any) => {
                        return {
                            id: data.id,
                            no_id: (page - 1) * sizePerPage + index + 1,
                            writer: data.writer,
                            fileName: data.fileName,
                            fileFormat: data.fileFormat,
                            fileFormat_ko: data.fileFormat_ko,
                            fileSize: data.fileSize,
                            date_of_entry: data.date_of_entry,
                        }
                    })
                );
            })
    };


    useEffect(() => {
        getAllAlbumVideoData();
    }, [selectedButton]);

    useEffect(() => {
        setSelectedButton(getActivetab)
        //[+] when successfully post album video data then again fetch album video data
        // if (fetchAlbumVideoData) {
        //     getAllAlbumVideoData();
        // }
    }, [fetchAlbumVideoData]);

    const deleteAlbumVideoData = () => {
        if (albumVideoId.length > 0) {
            ApiPost("memorialHall/deleteMemorialAlbumAndVideoByIdByAdmin", {
                id: albumVideoId.map((m: any) => m.id).join(","),
            }).then((res: any) => {
                getAllAlbumVideoData();
                albumVideoId = [];
            });
        }
    }

    return (
        <>
            <div className=" custom-datatable">
                {/* Album video tab */}
                <div className="memorial-hall-detail-tab">
                    <div className="tab1">
                        <button
                            onClick={() => {
                                setSelectedButton("All")
                                AuthStorage.setStorageData("activeTab", "All", false)
                            }}
                            className={selectedButton === "All" ? 'selectedbtn' : 'tabbtn'}
                        >전체({allCount})</button>
                    </div>
                    <div className="tab2">
                        <button
                            onClick={() => {
                                setSelectedButton("Album")
                                AuthStorage.setStorageData("activeTab", "Album", false)
                            }}
                            className={selectedButton === "Album" ? 'selectedbtn' : 'tabbtn'}
                        >이미지({albumCount})</button>
                    </div>
                    <div className="tab3">
                        <button
                            onClick={() => {
                                setSelectedButton("Video")
                                AuthStorage.setStorageData("activeTab", "Video", false)
                            }}
                            className={selectedButton === "Video" ? 'selectedbtn' : 'tabbtn'}
                        >동영상({videoCount})</button>
                    </div>
                </div>


                <div className=" text-center album-video-list">
                    <RemotePagination
                        data={albumVideoData}
                        columns={columns}
                        totalSize={totalSize ?? 0}
                        onTableChange={(page, sizePerPage) =>
                            handleTableChange(page, sizePerPage)
                        }
                        pagesizedropdownflag={false}
                        selectRow={selectRow}
                        rowEvents={rowEvents}
                        pageName=""
                    />
                </div>
            </div>

            <div className="memorial-message-footer memorial-post-button">
                <button onClick={deleteAlbumVideoData} className={albumVideoData.length === 0 ? 'memorial-message-footer-btn2' : 'memorial-message-footer-btn'}>
                    삭제
                </button>
            </div>

        </>
    )
}

export default Album_Video
