import React from 'react'
import { Button, Modal } from 'react-bootstrap'


interface Props {
    show: boolean,
    onHide: () => void,
    DeleteMemorialHalls: () => void
}

const DeleteMemorialHall: React.FC<Props> = ({ onHide, show, DeleteMemorialHalls }) => {

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                backdrop='static'
                size="lg"
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
                    <h4>선택하신 추모관을 삭제 하시겠습니까?</h4>
                </Modal.Body>
                <Modal.Footer className="deletemember-pop-up-footer">
                    <Button onClick={onHide} className="deletemember-pop-up-No-btn">아니오</Button>
                    <Button onClick={DeleteMemorialHalls} className="deletemember-pop-up-yes-btn ">네</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DeleteMemorialHall
