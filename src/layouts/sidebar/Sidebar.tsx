import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import { CSidebar, CSidebarNav, CCreateElement, CSidebarNavDivider, CSidebarNavDropdown, CSidebarNavItem, CSidebarNavTitle } from '@coreui/react'
import { _navmember, _navhall, _navother } from "./SidebarMenu"
import { RootStateOrAny, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

function Sidebar() {
    const location = useLocation()
    const loctionPath = location.pathname.split('/')[1]
    const { is_toggleMenu } = useSelector((state: RootStateOrAny) => state.menuToggle);
    const { sidebarMenu } = useSelector((state: RootStateOrAny) => state.sidebarMenu);

    const sidebarClass = is_toggleMenu ? 'sidebar-small' : 'sidebar';
    const [menuList, setMenuList] = useState(_navmember)

    useEffect(() => {
        if (sidebarMenu === "Member") {
            setMenuList(_navmember)
        }
        if (sidebarMenu === "Hall") {
            setMenuList(_navhall)
        }
        if (sidebarMenu === "Other") {
            setMenuList(_navother)
        }
    }, [sidebarMenu])

    useEffect(() => {
        if (loctionPath === "member") {
            setMenuList(_navmember)
        }
        if (loctionPath === "hall") {
            setMenuList(_navhall)
        }
        if (loctionPath === "other") {
            setMenuList(_navother)
        }
    }, [loctionPath])

    return (
        <div id="mySidebar" className={sidebarClass}>
            {/* <div className="p-2 d-flex align-items-center ">
                <Image className="admin-profile-img" src={AdminPic}/>
                <h4 className="ml-2 admin-name">Admin</h4>
            </div> */}
            <CSidebar show={true}>
                <CSidebarNav className="sidebar-in">
                    <CCreateElement
                        items={menuList}
                        components={{
                            CSidebarNavDivider,
                            CSidebarNavDropdown,
                            CSidebarNavItem,
                            CSidebarNavTitle,
                        }}
                    />
                </CSidebarNav>
            </CSidebar>
        </div>
    )
}

export default Sidebar
