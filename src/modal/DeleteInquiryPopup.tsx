import React from 'react'
import { Button, Modal } from 'react-bootstrap'


interface Props {
    show: boolean;
    onHide: () => void;
    TerminatedConsultationLis: () => void
}
const DeleteInquiryPopup: React.FC<Props> = ({ show, onHide, TerminatedConsultationLis }) => {
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
                        삭제하기
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="deletemember-pop-up-content">
                    <h4>선택하신 문의내용을 삭제하시겠습니까?</h4>
                </Modal.Body>
                <Modal.Footer className="deletemember-pop-up-footer">
                    <Button onClick={onHide} className="deletemember-pop-up-No-btn">아니오</Button>
                    <Button onClick={TerminatedConsultationLis} className="deletemember-pop-up-yes-btn ">네</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DeleteInquiryPopup
