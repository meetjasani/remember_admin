import React, { useEffect, useState } from "react";
import { Button, Modal, ModalProps } from 'react-bootstrap'
import { Omit, BsPrefixProps } from 'react-bootstrap/esm/helpers'
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Buttons from "../../component/Buttons/Buttons";
import STORAGEKEY from "../../config/APP/app.config";
import { ApiPost } from "../../helper/API/ApiData";
import AuthStorage from "../../helper/AuthStorage";
import { changeLoginState } from "../../redux/actions/loginAction";

interface loginFormState {
    email: string;
    password: string;
}

function MyVerticallyCenteredModal(props: JSX.IntrinsicAttributes & Omit<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React.HTMLAttributes<HTMLDivElement>> & { ref?: ((instance: HTMLDivElement | null) => void) | React.RefObject<HTMLDivElement> | null | undefined }, BsPrefixProps<"div"> & ModalProps> & BsPrefixProps<"div"> & ModalProps & { children?: React.ReactNode }) {
    //i18n
    //   const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);

    const loginFormState: loginFormState = {
        email: "",
        password: "",
    };

    const login_Err = {
        emailError: "",
        emailFormatErr: "",
        passError: "",
    };

    const [statelogin, setStatelogin] = useState(loginFormState);
    const [loginErrors, setLoginErrors] = useState(login_Err);
    const [isloginSubmit, setIsLoginSubmit] = useState(false);
    const [stayLogedIn, setStayLogedIn] = useState(false);
    const [incorrectPass, setIncorrectPass] = useState("");
    const [invalidEmail, setInvalidEmail] = useState("");
    const [btnDisabled, setBtnDisabled] = useState(true);

    const loginValidation = () => {
        let login_Err = {
            emailError: "",
            emailFormatErr: "",
            passError: "",
        };

        const validEmail: any = new RegExp("^[a-z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");

        if (statelogin.email && !validEmail.test(statelogin.email)) {
            login_Err.emailFormatErr = "????????? ?????????."
        }

        if (!statelogin.email) {
            login_Err.emailError = "?????? ???????????????.";
        }

        if (statelogin.password === "") {
            login_Err.passError = "??????????????? ?????? ??? ??????????????????.";
        }

        setLoginErrors(login_Err);
        setIncorrectPass("");

        if (!loginErrors.emailError && !loginErrors.passError && !loginErrors.emailFormatErr) {
            return true;
        }

        return false;
    };

    const Login = (loginWith: string) => {
        setIsLoginSubmit(true);

        if (!loginValidation()) {
            setBtnDisabled(true);
            return;
        }

        ApiPost("admin/auth/login", {
            email: statelogin.email,
            password: statelogin.password,
        })
            .then((res: any) => {

                setStatelogin(loginFormState);
                dispatch(changeLoginState(true))

                AuthStorage.setStorageData(
                    STORAGEKEY.token,
                    res.data.token,
                    stayLogedIn
                );
                delete res.data.token;
                AuthStorage.setStorageJsonData(
                    STORAGEKEY.userData,
                    res.data,
                    stayLogedIn
                );

                history.push("/member/member-list");
            })
            .catch((error) => {
                if (error === "Wrong Email") {
                    setIncorrectPass("");
                    setInvalidEmail("?????? ???????????????.");
                }
                if (error === "Wrong Password") {
                    setInvalidEmail("");
                    setIncorrectPass("??????????????? ?????? ??? ??????????????????.");
                }
            });
    };

    const validityChack = () => {
        if (statelogin.email !== "" && statelogin.password !== "") {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    };

    useEffect(() => {
        validityChack();
    }, [statelogin]);

    return (
        <>
            <Modal
                {...props}
                size="lg"
                dialogClassName="login-popup"
                aria-labelledby="contained-modal-title-vcenter "
                centered>
                <Modal.Body className="login-modal-body p-0">
                    <div className="">
                        <img src="./img/Frame.svg" className="logo-img" />

                        <div><p className="mb-0 font-24-bold color-01 SpoqaHanSans text-left mt-30 h-28">????????? ?????????</p></div>


                        <form className="login-form">
                            <label className="font-16-bold color-01 SpoqaHanSans mt-30 h-20">????????? ??????</label>
                            <input
                                type="email"
                                className="login-input mt-20"
                                name="email"
                                onChange={(e) => {
                                    setLoginErrors({
                                        ...loginErrors,
                                        emailError: "",
                                        emailFormatErr: ""
                                    });
                                    setStatelogin({ ...statelogin, email: e.target.value })
                                }
                                }
                                value={statelogin.email}
                                placeholder="????????? ????????? ???????????????."
                            />
                            {loginErrors.emailError && (
                                <p className="font-14-normal mt-10 color-danger h-18 mb-0 position-absolute">
                                    {loginErrors.emailError}
                                </p>
                            )}
                            {loginErrors.emailFormatErr && (
                                <p className="font-14-normal mt-10 color-danger mb-0 h-18 position-absolute">
                                    {loginErrors.emailFormatErr}
                                </p>
                            )}
                            {!loginErrors.emailError &&
                                !loginErrors.emailFormatErr &&
                                invalidEmail && (
                                    <p className="font-14-normal mt-10 color-danger h-18 mb-0 position-absolute">{invalidEmail}</p>
                                )}
                            <label className="font-16-bold color-01 SpoqaHanSans  mt-40 h-20">????????????</label>
                            <input
                                type="password"
                                className="login-input mt-20 font-16-bold color-01 SpoqaHanSans"
                                name="password"
                                onChange={(e) => {
                                    setLoginErrors({
                                        ...loginErrors,
                                        passError: ""
                                    });
                                    setStatelogin({ ...statelogin, password: e.target.value })
                                }
                                }
                                placeholder="??????????????? ???????????????."
                            />
                            {loginErrors.passError && (
                                <p className="font-14-normal mt-10 color-danger mb-0 position-absolute">
                                    {loginErrors.passError}
                                </p>
                            )}
                            {!loginErrors.passError && incorrectPass && (
                                <p className="font-14-normal mt-10 color-danger mb-0 position-absolute">{incorrectPass}</p>
                            )}
                            <label
                                className={
                                    stayLogedIn
                                        ? "login-label-checkbox-checked mt-40"
                                        : "login-label-checkbox mt-40"
                                }
                            >
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        setStayLogedIn(e.target.checked);
                                    }}
                                    className="checkbox-input"
                                />
                                ????????? ?????? ??????
                            </label>
                            <Buttons type=""
                                ButtonStyle={btnDisabled ? "bg-disable login-btn mt-40 cusrsor-not-allowed" : "login-btn b-yellow mt-40"}
                                onClick={() => Login("Manual")}
                                disabled={btnDisabled}
                            >
                                ?????????
                            </Buttons>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default MyVerticallyCenteredModal
