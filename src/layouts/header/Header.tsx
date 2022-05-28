import "./Header.css"
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { Container, Dropdown, Navbar } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { useLocation } from "react-router-dom";
import { changeMenuState } from '../../redux/actions/activeMenuAction';
import { changeLoginState } from '../../redux/actions/loginAction';
import AuthStorage from '../../helper/AuthStorage';
function Header() {
    const location = useLocation();
    const loctionPath = location.pathname.split('/')[1]
    const history = useHistory();
    const dispatch = useDispatch();
    const { is_toggleMenu } = useSelector((state: RootStateOrAny) => state.menuToggle);

    const showMenuBar = (type: string) => {
        if (type === "Member") {
            history.push("/member/member-list");
        }
        if (type === "Hall") {
            history.push("/hall/memorial-hall-list");
        }
        if (type === "Other") {
            history.push("/other/consultation/consultation-list-management");
        }
        dispatch(changeMenuState(type))
    }

    const closeopenClass = is_toggleMenu ? 'openmenu' : 'closemenu';

    const Logout = () => {
        dispatch(changeLoginState(false));
        AuthStorage.deauthenticateUser();
        history.push("/login");
    }

    return (
        <>
            <div className={closeopenClass}>
                <Container fluid className="p-0">
                    <Navbar collapseOnSelect expand="lg" className="header-bg position-fixed">

                        <Navbar.Brand className="text-white logo-text">
                            <div className="header-link">
                                <img src="/img/Frame.svg" alt="" className="img-h-w" />
                                <button className={loctionPath === "member" ? "header-tab-active" : "header-tab"} onClick={() => { showMenuBar("Member") }}>회원설정</button>
                                {/* <span className="compastrips_name" onClick={() => { showMenuBar("Member") }}>회원설정</span> */}
                                <button className={loctionPath === "hall" ? "header-tab-active" : "header-tab"} onClick={() => { showMenuBar("Hall") }}>추모관설정</button>
                                <button className={loctionPath === "other" ? "header-tab-active" : "header-tab"} onClick={() => { showMenuBar("Other") }}>기타설정</button>
                            </div>
                        </Navbar.Brand>

                        <Dropdown className="ml-auto logout-btn-header">
                            <Dropdown.Toggle id="dropdown-basic" className="text-center text-black d-flex align-items-center profile-dropdown">
                                <img src="/img/Group 12242.png" className="mr-14" alt="" />
                                관리자
                                <img src="/img/Rectangle 3191.svg" className="ml-15 mt-2-" alt="" />
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="profile-dropdown-menu">
                                <Dropdown.Item onClick={() => { Logout(); }}>로그아웃</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>



                    </Navbar>
                </Container>
            </div>
        </>
    )
}

export default Header
