import React, { useState, useEffect } from "react";
import { Phone } from "react-bootstrap-icons";
import NumberFormat from "react-number-format";
import { useHistory, useParams } from "react-router";
import Buttons from "../../component/Buttons/Buttons";
import { ApiGet, ApiPatch, ApiPost } from "../../helper/API/ApiData";
import PasswordReset from "../../modal/PasswordReset";

interface memberRegistration {
  id: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  user_type: string;
}

const MemberRegistration = () => {
  const { id }: any = useParams();
  const history = useHistory();

  const [IsMemberReset, setIsMemberReset] = useState(false);
  const memberRegistration: memberRegistration = {
    id: "",
    email: "",
    name: "",
    password: "",
    phone: "",
    user_type: "Standard",
  };

  const [memberReg, setMemberReg] = useState(memberRegistration);

  useEffect(() => {
    if (id !== "" && id) {
      ApiGet(`user/${id}`)
        .then((res: any) => {

          setMemberReg({
            id: res.data?.id,
            email: res.data?.email,
            name: res.data?.name,
            password: res.data?.password,
            phone: res.data?.mobile,
            user_type: res.data?.user_type,
          });
        })
        .catch((error) => {
        });
    }
  }, []);

  const userMng_Info = [
    { value: "Standard", label: "일반" },
    { value: "Basic", label: "베이직" },
    { value: "Premium", label: "프리미엄" },
  ];

  const Save = () => {
    if (memberReg.id === "") {
      ApiPost("admin/addUser", {
        email: memberReg.email,
        name: memberReg.name,
        password: memberReg.password === "" ? memberReg.phone.slice(4, 14).replace("-", "") : memberReg.password,
        // password: memberReg.password,
        mobile: memberReg.phone,
        user_type: memberReg.user_type,
      })
        .then((res: any) => {
          history.push("/member/member-list");
        })
    } else {
      ApiPatch(`admin/editUser?id=${memberReg.id}`, {
        email: memberReg.email,
        name: memberReg.name,
        password: memberReg.password === "" ? memberReg.phone.slice(4, 14).replace("-", "") : memberReg.password,
        mobile: memberReg.phone,
        user_type: memberReg.user_type,
      })
        .then((res: any) => {
          history.push("/member/member-list");
        })
        .catch((error) => {
        });
    }
  };

  const ResetModal = () => {
    setIsMemberReset(true);
    // if (memberReg.password === "") {
    //   setMemberReg(memberReg.phone)
    // }

  }

  const Reset = () => {
    memberReg.password = "";
    setIsMemberReset(false);
    if (memberReg.password === "") {
      setMemberReg({ ...memberReg, password: memberReg.phone.slice(4, 14).replace("-", "") });
    }
  }

  return (
    <>
      <div className="main-heading-wrap">
        <span className="font-20-bold roboto color-01">{id ? "회원 수정" : "회원 등록"}</span>
        <div className="d-flex ml-auto">
          <div className="">
            <Buttons
              type=""
              ButtonStyle="normalBtns mr-20"
              onClick={() => {
                history.push("/member/member-list");
              }}
            >
              취소
            </Buttons>
          </div>
          <div>
            <Buttons
              type=""
              ButtonStyle="normalBtn"
              onClick={() => {
                Save();
              }}
            >
              저장
            </Buttons>
          </div>
        </div>
      </div>
      <div className="border-black mt-20"></div>
      <div className="search-section">
        <div className="title">{id ? "회원 정보 수정" : "회원 정보 입력"}</div>
      </div>
      <div className="border"></div>
      <div className="d-flex">
        <div className="width d-flex">
          <div className="date-of-registration-set">
            <label className="">이메일</label>
          </div>
          <div className="DatePicker-set-main">
            <input
              className="Please-enter-input-set color-11 custom-placeholder"
              name="email"
              autoComplete="off   "
              value={memberReg.email}
              placeholder="이메일 입력"
              type="text"
              onChange={(e: any) => {
                setMemberReg({ ...memberReg, email: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="width d-flex">
          <div className="date-of-registration-set">
            <label className="">이름</label>
          </div>
          <div className="DatePicker-set-main color-11 custom-placeholder">
            <input
              className="Please-enter-input-set"
              name="name"
              value={memberReg.name}
              placeholder="이름 입력"
              type="text"
              onChange={(e: any) => {
                setMemberReg({ ...memberReg, name: e.target.value });
              }}
            />
          </div>
        </div>
      </div>
      <div className="border"></div>
      <div className="d-flex">
        <div className="width d-flex">
          <div className="date-of-registration-set">
            <label className="">비밀번호</label>
          </div>
          <div className="DatePicker-set-main">
            <input
              className="password-input-set color-11 custom-placeholder"
              name="password"
              value={memberReg.password}
              placeholder="비밀번호 입력(초기 비밀번호는 핸드폰 뒷자리 8자리)"
              type="password"
              onChange={(e: any) => {
                // if (memberReg.password === "") {
                //   setMemberReg({ ...memberReg, phone: e.target.value })
                // } else {
                setMemberReg({ ...memberReg, password: e.target.value });
                // }
              }}
            />
            {memberReg.id !== "" ? (
              <div className="reset-button">
                <Buttons type="" ButtonStyle="normalBtn" onClick={ResetModal}>
                  초기화
                </Buttons>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="width d-flex">
          <div className="date-of-registration-set">
            <label className="">핸드폰 번호</label>
          </div>
          <div className="DatePicker-set-main">
            <NumberFormat
              format="###-####-####"
              className="Please-enter-input-set color-11 custom-placeholder"
              name="phone"
              value={memberReg.phone}
              type="text"
              onChange={(e: any) => {
                // if (memberReg.password === "") {
                //   setMemberReg({ ...memberReg, phone: e.target.value.slice(4, 14).replace("-", "") })
                // } else {
                //   setMemberReg({ ...memberReg, password: e.target.value })
                // }
                setMemberReg({ ...memberReg, phone: e.target.value })
              }}
            />
          </div>
        </div>
      </div>
      <div className="border"></div>
      <div className="width d-flex">
        <div className="date-of-registration-set">
          <label className="">회원 분류</label>
        </div>
        <div className="position-relative selector-padding dropdown-padding">
          <select
            className="selector-set minimal"
            name="user_information"
            value={memberReg.user_type}
            onChange={(e: any) => {
              setMemberReg({ ...memberReg, user_type: e.target.value });
            }}
          >
            {userMng_Info.map(({ value, label }) => (
              <option value={value} key={value}>{label}</option>
            ))}
          </select>
          <div className="down-arrow">
            {" "}
            <img src="/img/arrows.svg" alt="" />{" "}
          </div>
        </div>
      </div>
      <div className="border"></div>
      {IsMemberReset && <PasswordReset show={IsMemberReset} onHide={() => setIsMemberReset(false)} Reset={Reset} />}

    </>
  );
};

export default MemberRegistration;
