import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { ApiPost } from '../helper/API/ApiData';

interface Props {
    show: boolean,
    onHide: () => void,
    memorial_id: string
}

const RegisterDonation: React.FC<Props> = ({ onHide, show, memorial_id }) => {
    const registerDonation = {
        name: "",
        organization: "",
        donation_amount: "",
        memorial_id: ""

    };
    const [addRegisterDonation, setAddRegisterDonation] = useState(registerDonation);

    const handleChange = (e: any) => {
        setAddRegisterDonation({ ...addRegisterDonation, [e.target.name]: e.target.value });
    }

    const postDonation = () => {

        const addRegisterDonationBody = {
            name: addRegisterDonation.name,
            organization: addRegisterDonation.organization,
            donation_amount: addRegisterDonation.donation_amount,
            memorial_id: memorial_id
        }

        ApiPost(`memorialHall/createMemorialHallDonationByAdmin`, addRegisterDonationBody)
            .then((response: any) => {
                if (response.status === 200) {
                    onHide()
                    setAddRegisterDonation(registerDonation)
                }
            })
            .catch((error: any) => { });
    }

    const hidePopUp = () => {
        onHide()
        setAddRegisterDonation(registerDonation)
    }

    const handleChangenum = (event: { target: { value: any; }; }) => {
        const { value } = event.target;
        const re = /^[0-9\b]+$/;

        if (!value || value === "" || re.test(value)) {
            handleChange(event);
        }
    }

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                backdrop='static'
                dialogClassName="registerdonation-pop-up"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className="registerdonation-pop-up-title" id="contained-modal-title-vcenter">
                        기부금 등록
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="registerdonation-pop-up-content">
                    <label className="registerdonation-pop-up-lable">기부자 이름</label>
                    <Form.Control
                        name="name"
                        value={addRegisterDonation.name}
                        className="registerdonation-pop-up-input"
                        type="text"
                        placeholder="기부자를 입력하세요."
                        onChange={(e) => { handleChange(e) }}
                        autoComplete="off"
                    />
                    <label className="registerdonation-pop-up-lable">소속</label>
                    <Form.Control
                        name="organization"
                        value={addRegisterDonation.organization}
                        className="registerdonation-pop-up-input"
                        type="text"
                        placeholder="소속을 입력하세요."
                        onChange={(e) => { handleChange(e) }}
                        autoComplete="off"
                    />
                    <label className="registerdonation-pop-up-lable">기부금액</label>
                    <div className="donation-pop-up-amount">
                        <Form.Control
                            name="donation_amount"
                            value={addRegisterDonation.donation_amount}
                            className="registerdonation-pop-up-input"
                            type="text"
                            placeholder="기부금액을 입력하세요."
                            autoComplete="off"
                            maxLength={10}
                            onChange={(e) => { handleChangenum(e) }}
                        />
                        <div className="donation-amount-won">
                            <p>원</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="registerdonation-pop-up-footer">
                    <Button onClick={postDonation} className="registerdonation-pop-up-btn">등록하기</Button>
                    <Button onClick={hidePopUp} className="registerdonation-pop-up-btn-2"> 취소</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RegisterDonation
