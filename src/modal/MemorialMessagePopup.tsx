import React from 'react'
import { Button, Modal } from 'react-bootstrap'


interface Props {
    show: boolean,
    onHide: () => void,
    Edit: any
}

const MemorialMessagePopup: React.FC<Props> = ({ onHide, show, Edit }) => {
    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                backdrop='static'
                dialogClassName="deletemember-pop-up"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className="deletemember-pop-up-title" id="contained-modal-title-vcenter">
                        오류 안내 메세지
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="deletemember-pop-up-content">
                    {/* <h4>선택하신 회원을 삭제하시겠습니까?</h4> */}
                    <h4>수정을 원하시면 조문보 중에서 한개를 선택 한 후 수정버튼을 클릭하여주세요. (선택 아이콘을 클릭할 시 선택 가능합니다.)</h4>
                </Modal.Body>
                <Modal.Footer className="deletemember-pop-up-footer">
                    <Button onClick={onHide} className="deletemember-pop-up-No-btn">아니오</Button>
                    {/* <Button onClick={Edit} className="deletemember-pop-up-yes-btn ">네</Button> */}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default MemorialMessagePopup
