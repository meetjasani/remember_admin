import React, { useEffect, useState } from 'react'
import RemotePagination from '../../../component/RemotePagination/RemotePagination';
import { ApiGet, ApiPost } from '../../../helper/API/ApiData';
import RegisterDonation from '../../../modal/RegisterDonation';

export interface donationHistoryData {
    id: string;
    no_id: string;
    donor_name: string;
    group: string;
    donation_amount: string;
    date_of_registration: string;
}
interface Props {
    registerDonation: boolean;
    memorial_id: string;
    setDonationModalFlag: () => void;
}

let donationHistoryId: any = [];

const DonationHistory: React.FC<Props> = ({
    memorial_id,
    registerDonation,
    setDonationModalFlag
}) => {

    const [donationHistoryIdList, setDonationHistoryIdList] = useState<donationHistoryData[]>([]);
    const [selectedButton, setSelectedButton] = useState("All");
    const [totalSize, setTotalSize] = useState<number>(0);
    const [AllCount, setAllCount] = useState<number>(0);
    const [showRegisterDonation, setShowRegisterDonation] = useState(false);

    const columns = [
        {
            dataField: "no_id",
            text: "번호",
        },
        {
            dataField: "donor_name",
            text: "기부자 이름",
        },
        {
            dataField: "group",
            text: "소속",
        },
        {
            dataField: "donation_amount",
            text: "기부금액",
        },
        {
            dataField: "date_of_registration",
            text: "등록일",
        }
    ];

    const DeleteDonationHistory = () => {
        if (donationHistoryId.length > 0) {
            ApiPost(`memorialHall/deleteMemorialHallDonationByAdmin`, {
                id: donationHistoryId.map((m: any) => m.id).join(","),
            }).then((res: any) => {
                getDonationManagment();
                donationHistoryId = [];
            });
        }
    };

    function numberWithCommas(x: any) {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
    const getDonationManagment = (page = 1, sizePerPage = 10) => {

        ApiGet(
            `memorialHall/getAllMemorialHallDonationByID/${memorial_id}?per_page=${sizePerPage}&page_number=${page}`
        )
            .then((res: any) => {

                setTotalSize(res.data && res.data.AllCount);
                setAllCount(res.data.AllCount);

                setDonationHistoryIdList(
                    res.data &&
                    res.data.donationHistoryData &&
                    res.data.donationHistoryData.map((x: any, index: any) => {
                        return {
                            id: x.id,
                            no_id: res.data.count - (page - 1) * sizePerPage - index,
                            donor_name: x.name,
                            group: x.organization,
                            donation_amount: numberWithCommas(x.donation_amount) + " 원",
                            date_of_registration: x.donation_created_date
                        };
                    })
                );
            })
    };

    const closeDonationRegister = () => {
        setShowRegisterDonation(false)
        setDonationModalFlag()
    }

    useEffect(() => {
        getDonationManagment()
    }, [showRegisterDonation])

    useEffect(() => {
        getDonationManagment()
    }, [])

    useEffect(() => {
        if (registerDonation === true) {
            setShowRegisterDonation(true);
        }
    }, [registerDonation])

    const selectRow = {
        mode: "checkbox",
        onSelect: (isSelect: any, rows: any, e: any) => {
            const index = donationHistoryId.findIndex(
                (item: any) => item.id === isSelect.id
            );
            if (index !== -1 && index !== undefined) {
                donationHistoryId.splice(index, 1);
            } else {
                donationHistoryId.push({ id: isSelect.id });
            }
        },
        onSelectAll: (isSelect: any, rows: any, e: any) => {
            if (isSelect === true) {
                rows.map((x: any) => (
                    donationHistoryId.push({ id: x.id })
                ));
            } else {
                donationHistoryId = [];
            }
        },
    };

    return (
        <>
            <div className="custom-datatable">
                {/* <div className=" custom-datatable member-list-table memorial-post audio-video"> */}

                {/* Album video tab */}
                <div className="memorial-hall-detail-tab border-none">
                    <div className="tab1">
                        <button
                            onClick={() => { setSelectedButton("All") }}
                            className={selectedButton === "All" ? 'selectedbtn' : 'tabbtn'}
                        >전체({AllCount})</button>
                    </div>
                    {/* <div className="tab2">
                        <button
                            onClick={() => { setSelectedButton("Image") }}
                            className={selectedButton === "Image" ? 'selectedbtn' : 'tabbtn'}
                        >이미지(30)</button>
                    </div> */}
                    {/* <div className="tab3">
                        <button
                            onClick={() => { setSelectedButton("Video") }}
                            className={selectedButton === "Video" ? 'selectedbtn' : 'tabbtn'}
                        >동영상(59)</button>
                    </div> */}
                </div>
                <div className=" text-center donation-history-list">
                    {/* <div className="member-list-table text-center table-width checkbox-margin table-btn"> */}
                    <RemotePagination
                        data={donationHistoryIdList}
                        columns={columns}
                        totalSize={totalSize ?? 0}
                        onTableChange={(page, sizePerPage) => {
                            getDonationManagment(page, sizePerPage)
                        }}
                        pagesizedropdownflag={false}
                        selectRow={selectRow}
                        rowEvents=""
                        pageName=""
                    />
                </div>
            </div>

            <div className="memorial-message-footer memorial-post-button">
                <button onClick={DeleteDonationHistory} className={donationHistoryIdList.length === 0 ? 'memorial-message-footer-btn2' : 'memorial-message-footer-btn'}>
                    삭제
                </button>
            </div>

            <RegisterDonation show={showRegisterDonation} onHide={closeDonationRegister} memorial_id={memorial_id} />
        </>
    )
}

export default DonationHistory
