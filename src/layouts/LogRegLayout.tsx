import React from 'react'
import Footer from './footer/Footer';

interface Props {
    children?: React.ReactNode;
}

const LogRegLayout: React.FC<Props> = ({
    children,
}) => {
    return (
        <>
            <div className="loginreg-bg">
                {children}
            </div>
            <Footer />
        </>
    )
}

export default LogRegLayout;
