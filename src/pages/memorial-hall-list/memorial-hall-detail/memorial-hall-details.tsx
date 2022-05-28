import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router'
import { ApiGet, ApiPost, ApiPut } from '../../../helper/API/ApiData'
import AuthStorage from '../../../helper/AuthStorage'
import AddFilePopup from '../../../modal/AddFilePopup'
import MemorialMessagePopup from '../../../modal/MemorialMessagePopup'
import Album_Video from './Album_Video'
import DonationHistory from './DonationHistory'
import MemorialMessage from './MemorialMessage'
import MemorialPost from './MemorialPost'

interface Props {
    ltineraryRegBtn?: any;
    rowEvents: any;
}

const MemorialHallDetails: React.FC<Props> = ({ rowEvents }) => {

    const history = useHistory();

    const [IsMemorialMessageEdit, setIsMemorialMessageEdit] = useState(false);
    const [selectedButton, setSelectedButton] = useState("MemorialMessage")
    const [hideTitleSecondRowAndBtn, setHideTitleSecondRowAndBtn] = useState(false);
    const [firstTabButton, setFirstTabButton] = useState(true);
    const [registerMemorialButton, setRegisterMemorialButton] = useState(false);
    const [addFileButton, setAddFileButton] = useState(false);
    const [donationRegistrationButton, setDonationRegistrationButton] = useState(false);
    const [data, setData] = useState<any>({});
    const [editMessage, setEditMessage] = useState(false);
    const [registerDonation, setRegisterDonation] = useState(false)
    const [ToggleData, setToggleData] = useState(false);
    const [albumVideoTab, setAlbumVideoTab] = useState<string | null>("All");
    const [showEditor, setShowEditor] = useState(false);
    const [fetchAlbumVideoData, setFetchAlbumVideoData] = useState(false);
    const [name, setName] = useState("");
    const [memorialmessage, setMemorialmessage] = useState({
        content: "",
        title: "",
        memorial_id: "",
        id: "",
    });
    const { id }: any = useParams();

    //[+] Show Editor Value:
    const handleMemorialMessageEditor = (showEditor: boolean) => {
        setShowEditor(showEditor);
    }

    //[+] hidesecondheading in below tab:-
    const hideSecondHeadingInTab = ["Album/Video", "DonationHistory"]

    //[+]  Tab 1 onClick Value: 
    const tab1OnClick = () => {
        setSelectedButton("MemorialMessage");
        setHideTitleSecondRowAndBtn(false);
        setFirstTabButton(true);
        setRegisterMemorialButton(false);
        setAddFileButton(false);
        setDonationRegistrationButton(false);
    }


    //[+]  Album Video Tab set Value :  
    const handleAlbumVideoTab = (tabValue: string | null) => {
        setAlbumVideoTab(tabValue)
    }

    //[+] For Album Video AddFile Pop-Up :
    const [showAddFile, setShowAddFile] = useState(false);

    const closeAddFilePopup = () => {
        setShowAddFile(false)
    }

    const postAlbumVideo = () => {

        // const getActivetab = AuthStorage.getStorageData("activeTab")
        setSelectedButton("MemorialMessage");
        // setAlbumVideoTab(getActivetab)
        setShowAddFile(false);
        setSelectedButton("Album/Video");
        setFetchAlbumVideoData(true);
    }

    useEffect(() => {
        setMemorialmessage({
            content: data?.contentData,
            title: data?.title,
            memorial_id: id,
            id: data?.id,
        })
    }, [data])

    useEffect(() => {
        AuthStorage.deleteKey("activeTab")
        if (id) {
            ApiGet(
                `memorialHall/getMemorialHallByid/${id}`
            ).then((res: any) => {
                setName(res?.data?.name)

            });
        }

    }, [])

    const Edit = (activeTab: string) => {
        if (memorialmessage?.id.length === 1) {
            if (activeTab === "MemorialMessage") {
                setEditMessage(true)
            }
        } else {
            // alert("select only one data to edit")
            setIsMemorialMessageEdit(true);
        }
    }

    const setEditFlag = () => {
        if (selectedButton === "MemorialMessage") {
            setEditMessage(false)
        }
    }

    const setDonationModalFlag = () => {
        if (selectedButton === "DonationHistory") {
            setRegisterDonation(false)
        }
    }

    const Post = () => {
        setToggleData(false)
        if (memorialmessage?.id.length > 0) {

            const editMemorialMessage = {
                content: memorialmessage?.content,
                title: memorialmessage?.title

            };
            ApiPut(`memorialHall/editMemorialMessage/${memorialmessage?.id}`, editMemorialMessage)
                .then((res: any) => {
                    setData({});
                    setToggleData(true)
                })
        } else {
            const createMemorialMessage = {
                content: data?.contentData,
                title: data?.title,
                memorial_id: memorialmessage?.memorial_id,
            };
            ApiPost(`memorialHall/memorialHallMessage`, createMemorialMessage)
                .then((res: any) => {
                    setData({});
                    setToggleData(true)
                })
        }
    }

    const AddFile = () => {
        if (selectedButton === "Album/Video") {
            setShowAddFile(true);
        }
    }

    const donationRegistration = () => {
        if (selectedButton === "DonationHistory") {
            setRegisterDonation(true)
        }
    }

    return (
        <>
            {/* First Row */}
            <div className="memorial-hall-detail-title">
                <h1>추모관 리스트 관리</h1>

                {/* First Row for first Tab */}
                {firstTabButton && <button onClick={() => { history.push("/hall/memorial-hall-list") }} >취소</button>}
                {/* {firstTabButton && <button onClick={() => { setToggleData(true) }}  >취소</button>} */}

                {/* First Row for Second, third, last Tab */}
                {registerMemorialButton && <button className="header-btn" onClick={() => { history.push("/hall/memorial-hall-registration") }}>추모관 등록</button>}
            </div>

            {/* Second Row */}
            {
                !hideTitleSecondRowAndBtn ? (
                    <div className="memorial-hall-detail-title-second-row search-section">
                        <h1>{name}</h1>

                        {/* Second Row for first Tab when edit content */}
                        {firstTabButton && <button onClick={() => { Edit(selectedButton); }}>수정</button>}
                    </div>
                ) : (
                    <div>
                        {!hideSecondHeadingInTab.includes(selectedButton) &&
                            <div className="memorial-hall-detail-title-second-row search-section">
                                <h1>{name}</h1>

                                {/* Second Row for first Tab when post content */}
                                {firstTabButton && <button className="postbtn" onClick={() => { Post(); }}>등록</button>}
                            </div>
                        }
                    </div>
                )
            }


            <div className="memorial-hall-detail-tab">
                <div className="tab1">
                    <button
                        onClick={() => { showEditor === false && tab1OnClick() }}
                        className={selectedButton === "MemorialMessage" ? 'selectedbtn' : 'tabbtn'}
                    >조문보</button>
                </div>
                <div className="tab2">
                    <button
                        onClick={() => {
                            setSelectedButton("MemorialPost");
                            setHideTitleSecondRowAndBtn(false);
                            setFirstTabButton(false);
                            setRegisterMemorialButton(true);
                            setAddFileButton(false);
                            setDonationRegistrationButton(false);
                            setShowEditor(false);
                        }}
                        className={selectedButton === "MemorialPost" ? 'selectedbtn' : 'tabbtn'}
                    >추모글</button>
                </div>
                <div className="tab3">
                    <button
                        onClick={() => {
                            setSelectedButton("Album/Video");
                            setHideTitleSecondRowAndBtn(true);
                            setFirstTabButton(false);
                            setRegisterMemorialButton(true);
                            setAddFileButton(true);
                            setShowEditor(false);
                            setDonationRegistrationButton(false);
                        }}
                        className={selectedButton === "Album/Video" ? 'selectedbtn' : 'tabbtn'}
                    >앨범/영상</button>
                </div>
                <div className="tab4">
                    <button
                        onClick={() => {
                            setSelectedButton("DonationHistory");
                            setHideTitleSecondRowAndBtn(true);
                            setFirstTabButton(false);
                            setRegisterMemorialButton(true);
                            setAddFileButton(false);
                            setShowEditor(false);
                            setDonationRegistrationButton(true);
                        }}
                        className={selectedButton === "DonationHistory" ? 'selectedbtn' : 'tabbtn'}
                    >기부내역</button>
                </div>


                {!hideTitleSecondRowAndBtn ? (
                    <div className="Publicbtn">
                        <button
                            className="selectedbtn"
                        >
                            공개
                        </button>
                    </div>
                ) : (
                    // Tab List Row
                    <div className="postbtn-container">
                        {addFileButton && <button className="postbtn" onClick={() => { AddFile(); }}>파일 추가</button>}
                        {donationRegistrationButton && <button className="postbtn" onClick={() => { donationRegistration(); }}>기부금 등록</button>}
                    </div>
                )
                }
            </div>



            <div>
                {selectedButton === "MemorialMessage" ? <MemorialMessage editMessage={editMessage} setEditFlag={setEditFlag} memorial_id={id} setDisplayList={ToggleData} handleMemorialMessageEditor={handleMemorialMessageEditor} hideRow={(value: boolean) => setHideTitleSecondRowAndBtn(value)} Post={(value: any) => setData(value)} />
                    : selectedButton === "MemorialPost" ? <MemorialPost memorialPost_id={id} />
                        : selectedButton === "Album/Video" ? <Album_Video albumVideoTabId={id} handleAlbumVideoTab={handleAlbumVideoTab} fetchAlbumVideoData={fetchAlbumVideoData} />
                            : selectedButton === "DonationHistory" ? <DonationHistory registerDonation={registerDonation} setDonationModalFlag={setDonationModalFlag} memorial_id={id} />
                                : <MemorialMessage memorial_id={id} editMessage={editMessage} setEditFlag={setEditFlag} setDisplayList={ToggleData} handleMemorialMessageEditor={handleMemorialMessageEditor} hideRow={(value: boolean) => setHideTitleSecondRowAndBtn(value)} Post={(value: any) => setData(value)} />}
            </div>

            {IsMemorialMessageEdit && <MemorialMessagePopup show={IsMemorialMessageEdit} onHide={() => setIsMemorialMessageEdit(false)} Edit={Edit} />}

            {showAddFile && <AddFilePopup show={showAddFile} type={albumVideoTab} onHide={closeAddFilePopup} handleChange={postAlbumVideo} />}
        </>
    )

}

export default MemorialHallDetails
