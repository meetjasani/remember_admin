import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'


interface Props {
    show: boolean,
    onHide: () => void,
    Reset: () => void,
}

const PasswordReset: React.FC<Props> = ({ onHide, show, Reset }) => {

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
                        비밀번호 초기화
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="deletemember-pop-up-content">
                    <h4>비밀번호를 초기화하시겠습니까?</h4>
                </Modal.Body>
                <Modal.Footer className="deletemember-pop-up-footer">
                    <Button onClick={onHide} className="deletemember-pop-up-No-btn">아니오</Button>
                    <Button onClick={Reset} className="deletemember-pop-up-yes-btn ">네</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PasswordReset
