import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import Buttons from "../../component/Buttons/Buttons";
import STORAGEKEY from "../../config/APP/app.config";
import { ApiPost } from "../../helper/API/ApiData";
import AuthStorage from "../../helper/AuthStorage";
import { changeLoginState } from "../../redux/actions/loginAction";
import { getCookie, setCookie } from "../../helper/util";

interface loginFormState {
  email: string;
  password: string;
}

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();

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
  // const [isloginSubmit, setIsLoginSubmit] = useState(false);
  const [stayLogedIn, setStayLogedIn] = useState(false);
  const [incorrectPass, setIncorrectPass] = useState("");
  const [invalidEmail, setInvalidEmail] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);

  useEffect(() => {
    let getEmail = ""
    var cookieArr = document.cookie.split(";");
    // Loop through the array elements
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      /* Removing whitespace at the beginning of the cookie name
          and compare it with the given string */
      if ("email" === cookiePair[0].trim()) {
        // Decode the cookie value and return
        getEmail = decodeURIComponent(cookiePair[1]);
      }
    }
    if (getEmail !== null || getEmail !== "") {
      setStatelogin({ ...statelogin, email: getEmail });
    }
  }, [])

  const loginValidation = () => {
    let login_Err = {
      emailError: "",
      emailFormatErr: "",
      passError: "",
    };

    const validEmail: any = new RegExp("^[a-z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");



    if (statelogin.email && !validEmail.test(statelogin.email)) {
      login_Err.emailFormatErr = "이메일 양식이 잘못되었습니다."
    }

    if (!statelogin.email) {
      login_Err.emailError = "필수 정보입니다.";
    }

    if (statelogin.password === "") {
      login_Err.passError = "비밀번호를 한번 더 확인해주세요.";
    }

    setLoginErrors(login_Err);
    setIncorrectPass("");

    if (!loginErrors.emailError && !loginErrors.passError && !loginErrors.emailFormatErr) {
      return true;
    }

    return false;
  };


  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (!loginValidation()) {
        setBtnDisabled(true);
        return;
      }
      let getEmail = ""
      var cookieArr = document.cookie.split(";");
      // Loop through the array elements
      for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        /* Removing whitespace at the beginning of the cookie name
            and compare it with the given string */
        if ("email" === cookiePair[0].trim()) {
          // Decode the cookie value and return
          getEmail = decodeURIComponent(cookiePair[1]);
        }
      }
      if (getEmail === null || getEmail === "") {
        if (stayLogedIn === true) {
          var da = new Date();
          da.setTime(da.getTime() + (1440 * 60 * 1000));
          var expires = "expires=" + da.toUTCString();
          document.cookie = "email" + "=" + statelogin.email + "; " + expires;
        } else {
          var d = new Date();
          d.setTime(d.getTime() + (1440 * 60 * 1000));
          var expires = "expires=" + d.toUTCString();
          document.cookie = "email" + "=" + "" + "; " + expires;
        }
      } else {
        if (stayLogedIn === true) {
          var d = new Date();
          d.setTime(d.getTime() + (1440 * 60 * 1000));
          var expires = "expires=" + d.toUTCString();
          document.cookie = "email" + "=" + statelogin.email + "; " + expires; var d = new Date();

        }
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

          if (error === "Wrong Password-Wrong Email") {
            setInvalidEmail("필수 정보입니다.");
            setIncorrectPass("비밀번호를 한번 더 확인해주세요.");
          }

          if (error === "Wrong Email") {
            setIncorrectPass("");
            setInvalidEmail("필수 정보입니다.");
          }

          if (error === "Wrong Password") {
            setInvalidEmail("");
            setIncorrectPass("비밀번호를 한번 더 확인해주세요.");
          }
        });

    };
  }

  const Login = (loginWith: string) => {
    // setIsLoginSubmit(true);
    if (!loginValidation()) {
      setBtnDisabled(true);
      return;
    }
    let getEmail: any = ""
    var cookieArr = document.cookie.split(";");
    // Loop through the array elements
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      /* Removing whitespace at the beginning of the cookie name
          and compare it with the given string */
      if ("email" === cookiePair[0].trim()) {
        // Decode the cookie value and return
        getEmail = decodeURIComponent(cookiePair[1]);
      }
    }
    if (getEmail === null || getEmail === "") {
      if (stayLogedIn === true) {
        var d = new Date();
        d.setTime(d.getTime() + (1440 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = "email" + "=" + statelogin.email + "; " + expires;
      } else {
        var d = new Date();
        d.setTime(d.getTime() + (1440 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = "email" + "=" + "" + "; " + expires;
      }
    } else {
      if (stayLogedIn === true) {
        var d = new Date();
        d.setTime(d.getTime() + (1440 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = "email" + "=" + statelogin.email + "; " + expires; var d = new Date();
      }
    }


    getEmail = getCookie("email");

    if (getEmail !== null && getEmail !== "") {
      if (stayLogedIn === true) {
        setCookie("email", statelogin.email, 1440);
      } else {
        setCookie("email", "", 1440);
      }
    } else {
      if (stayLogedIn === true) {
        setCookie("email", statelogin.email, 1440);
      } else {
        setCookie("email", "", 1440);
      }
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

        if (error === "Wrong Password-Wrong Email") {
          setInvalidEmail("필수 정보입니다.");
          setIncorrectPass("비밀번호를 한번 더 확인해주세요.");
        }

        if (error === "Wrong Email") {
          setIncorrectPass("");
          setInvalidEmail("필수 정보입니다.");
        }

        if (error === "Wrong Password") {
          setInvalidEmail("");
          setIncorrectPass("비밀번호를 한번 더 확인해주세요.");
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

  useEffect(() => {
    const getEmail = getCookie("email");
    if (getEmail !== null && getEmail !== "") {
      setStatelogin({ ...statelogin, email: getEmail });
      setStayLogedIn(true)
    } else {
      setStayLogedIn(false)
    }
  }, []);

  return (
    <>

      <div className="modal-dialog login-popup modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="">
            <img src="./img/Frame.svg" className="logo-img" alt="" />

            <div><p className="mb-0 font-24-bold color-01 SpoqaHanSans text-left mt-30 h-28">관리자 로그인</p></div>


            <form className="login-form">
              <label className="font-16-bold color-01 SpoqaHanSans mt-30 h-20">이메일 주소</label>
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
                placeholder="이메일 주소를 입력하세요."
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
              <label className="font-16-bold color-01 SpoqaHanSans  mt-40 h-20">비밀번호</label>
              <input
                type="password"
                className="login-input mt-20 font-16-bold color-01 SpoqaHanSans"
                name="password"
                onKeyPress={handleKeyPress}
                onChange={(e) => {
                  setLoginErrors({
                    ...loginErrors,
                    passError: ""
                  });
                  setStatelogin({ ...statelogin, password: e.target.value })
                }
                }
                placeholder="비밀번호를 입력하세요."
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
                  checked={stayLogedIn}
                />
                아이디 저장하기
              </label>
              <Buttons type=""
                ButtonStyle={btnDisabled ? "bg-disable login-btn mt-40 cusrsor-not-allowed" : "login-btn b-yellow mt-40"}
                onClick={() => Login("Manual")}
                disabled={btnDisabled}
              >
                로그인
              </Buttons>
            </form>
          </div>
        </div>
      </div>


    </>
  );
};

export default Login;
