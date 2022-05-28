import React, { Children } from 'react'


interface Props {
    children?: React.ReactNode;
}
const Tabs: React.FC<Props> = ({
    children

}) => {
    return (
        <div className="tab-main">
            <span className="pl-3 pr-3 active" >{children}</span>
        </div>
    );
}

export default Tabs;


