import React, { useState } from "react";
import { Button } from "react-bootstrap";
import DeleteMember from "./DeleteMember";
import TerminatePopup from "./TerminatePopup";


const AllModal = () => {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <Button variant="primary" onClick={() => setModalShow(true)}>
                Launch vertically centered modal
            </Button>

        </>

    );
}

export default AllModal