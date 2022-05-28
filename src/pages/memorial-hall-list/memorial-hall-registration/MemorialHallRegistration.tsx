import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import Buttons from "../../../component/Buttons/Buttons";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import { ApiGet, ApiPatch, ApiPost, ApiPut } from "../../../helper/API/ApiData";
import './MemorialHallRegistration.css'
import moment from "moment";
import { RelationShip, ServiceDuration } from "../../../helper/Constant";
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from "react-bootstrap";
import ReactHtmlParser from 'react-html-parser';
import { debounce } from "lodash";
registerLocale("ko", ko);
// import debounce from 'lodash.debounce';

interface IMemorialHallRegistration {
    id: string,
    type: string,
    name: string,
    date_of_birth: string,
    job_title: string,
    funeral_home: string,
    room_number: string,
    burial_plot: string,
    memorial_hall_active: string,
    Introduction: string,
    image: string,
    registerer: [],
    inviteFamilyMembers: [],
    moneyAccount: [],
    donationSerives: [],
}

const MemorialHallRegistration = () => {
    const { id }: any = useParams();

    const history = useHistory();

    const relationShip = RelationShip;
    const serviceDuration = ServiceDuration;
    const [oldDonationField, setOldDonationField] = useState("");
    const [oldDonationOrg, setOldDonationOrg] = useState("");
    const [imgSrc, setImgSrc] = useState("");
    const [imageName, setImageName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File>();
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [dateOfDeath, setDateOfDeath] = useState<Date | null>(null);
    const [dateOfCarryingCofinOut, setDateOfCarryingCofinOut] = useState<Date | null>(null);
    const [hourOfDeath, setHourOfDeath] = useState("시간");
    const [minuteOfDeath, setMinuteOfDeath] = useState("분");
    const [hallType, setHallType] = useState("Private");
    const [memorialHallActive, setMemorialHallActive] = useState("true");
    const [hourOfCarryingCofinOut, setHourOfCarryingCofinOut] = useState("시간");
    const [minuteOfCarryingCofinOut, setMinuteOfCarryingCofinOut] = useState("분");

    const relationShipDropDown = [
        { label: relationShip.daughter, value: "Daughter" },
        { label: relationShip.son, value: "Son" },
        { label: relationShip.other, value: "Other" },
    ];

    const serviceDurationDropDown = [
        { label: serviceDuration.days, value: "1 of 3 days" },
        { label: serviceDuration.week, value: "1 week" },
        { label: serviceDuration.month, value: "1 month" },
    ];

    const [registerer, setRegisterer] = useState([
        {
            name: "",
            relationship: "",
            relationship_name: ""
        },
    ]);

    const [inviteFamilyMembers, setInviteFamilyMembers] = useState([
        {
            name: "",
            email: "",
            relationship: "",
            relationship_name: ""
        },
    ]);

    const [moneyAccount, setMoneyAccount] = useState([
        {
            name: "",
            bank_name: "",
            ac_number: "",
        },
    ]);

    const [donationSerives, setDonationSerives] = useState([
        {
            donation_field: "",
            bank_name: "",
            recipient_organization: "",
            ac_number: "",
            Introduction: "",
            service_duration: "",
        },
    ]);

    const memorialHallRegistration: IMemorialHallRegistration = {
        id: "",
        type: "",
        name: "",
        date_of_birth: "",
        job_title: "",
        funeral_home: "",
        room_number: "",
        burial_plot: "",
        memorial_hall_active: "",
        Introduction: "",
        image: "",
        registerer: [],
        inviteFamilyMembers: [],
        moneyAccount: [],
        donationSerives: [],
    };

    const selecthour = [
        { value: "01", label: "01시" },
        { value: "02", label: "02시" },
        { value: "03", label: "03시" },
        { value: "04", label: "04시" },
        { value: "05", label: "05시" },
        { value: "06", label: "06시" },
        { value: "07", label: "07시" },
        { value: "08", label: "08시" },
        { value: "09", label: "09시" },
        { value: "10", label: "10시" },
        { value: "11", label: "11시" },
        { value: "12", label: "12시" },
        { value: "13", label: "13시" },
        { value: "14", label: "14시" },
        { value: "15", label: "15시" },
        { value: "16", label: "16시" },
        { value: "17", label: "17시" },
        { value: "18", label: "18시" },
        { value: "19", label: "19시" },
        { value: "20", label: "20시" },
        { value: "21", label: "21시" },
        { value: "22", label: "22시" },
        { value: "23", label: "23시" },
        { value: "24", label: "24시" },
    ];

    const selectminute = [
        { value: "00", label: "00분" },
        { value: "01", label: "01분" },
        { value: "02", label: "02분" },
        { value: "03", label: "03분" },
        { value: "04", label: "04분" },
        { value: "05", label: "05분" },
        { value: "06", label: "06분" },
        { value: "07", label: "07분" },
        { value: "08", label: "08분" },
        { value: "09", label: "09분" },
        { value: "10", label: "10분" },
        { value: "11", label: "11분" },
        { value: "12", label: "12분" },
        { value: "13", label: "13분" },
        { value: "14", label: "14분" },
        { value: "15", label: "15분" },
        { value: "16", label: "16분" },
        { value: "17", label: "17분" },
        { value: "18", label: "18분" },
        { value: "19", label: "19분" },
        { value: "20", label: "20분" },
        { value: "21", label: "21분" },
        { value: "22", label: "22분" },
        { value: "23", label: "23분" },
        { value: "24", label: "24분" },
        { value: "25", label: "25분" },
        { value: "26", label: "26분" },
        { value: "27", label: "27분" },
        { value: "28", label: "28분" },
        { value: "29", label: "29분" },
        { value: "30", label: "30분" },
        { value: "31", label: "31분" },
        { value: "32", label: "32분" },
        { value: "33", label: "33분" },
        { value: "34", label: "34분" },
        { value: "35", label: "35분" },
        { value: "36", label: "36분" },
        { value: "37", label: "37분" },
        { value: "38", label: "38분" },
        { value: "39", label: "39분" },
        { value: "40", label: "40분" },
        { value: "41", label: "41분" },
        { value: "42", label: "42분" },
        { value: "43", label: "43분" },
        { value: "44", label: "44분" },
        { value: "45", label: "45분" },
        { value: "46", label: "46분" },
        { value: "47", label: "47분" },
        { value: "48", label: "48분" },
        { value: "49", label: "49분" },
        { value: "50", label: "50분" },
        { value: "51", label: "51분" },
        { value: "52", label: "52분" },
        { value: "53", label: "53분" },
        { value: "54", label: "54분" },
        { value: "55", label: "55분" },
        { value: "56", label: "56분" },
        { value: "57", label: "57분" },
        { value: "58", label: "58분" },
        { value: "59", label: "59분" },
    ];

    const user_type = [
        { value: "Private", label: "비공개하기" },
        { value: "Public", label: "공개 " },
    ];

    const [donation, setDonationField] = useState([
        { value: "", label: "" },
    ]);

    // const DonationIntroduction = `고인은 생전 ${donationSerives[0].donation_field} 에 대한 관심과 애정으로 평소 정성스런 마음과 물질을 나누셨습니다.\n유족들은 고인의 유지를 잇기 위해 ${donationSerives[0].recipient_organization} 기부단체에 계속 지원하기로 하였습니다. \n`
    const DonationIntroductionPlaceholder = `고인은 생전 (기부 분야 예: 미혼모 복지_①) 에 대한 관심과 애정으로 평소 정성스런 마음과 물질을 나누셨습니다.\n유족들은 고인의 유지를 잇기 위해 (단체 이름과 Web site_②) 기부단체에 계속 지원하기로 하였습니다.`

    const donationField = [
        { value: "생명 살림, 건강한 가정", label: "생명 살림, 건강한 가정" },
        { value: "어린이 청년 지원, 장학 사업", label: "어린이 청년 지원, 장학 사업 " },
        { value: "여성 인권 복지, 성평등", label: "여성 인권 복지, 성평등" },
        { value: "노인 복지 웰다잉", label: "노인 복지 웰다잉" },
        { value: "장애인 인권 복지", label: "장애인 인권 복지" },
        { value: "생태 환경, 생협, 공동체 지원", label: "생태 환경, 생협, 공동체 지원" },
        { value: "경제 정의, 빈민층 지원", label: "경제 정의, 빈민층 지원" },
    ]

    const koreanBank = [
        { value: "국민은행", label: "국민은행" },
        { value: "우리은행", label: "우리은행" },
        { value: "신한은행", label: "신한은행" },
        { value: "하나은행", label: "하나은행" },
        { value: "농협은행", label: "농협은행" },
        { value: "기업은행", label: "기업은행" },
        { value: "케이뱅크", label: "케이뱅크" },
        { value: "새마을금고", label: "새마을금고" },
        { value: "대구은행", label: "대구은행" },
        { value: "부산은행", label: "부산은행" },
        { value: "SC은행", label: "SC은행" },
        { value: "광주은행", label: "광주은행" },
        { value: "신협", label: "신협" },
        { value: "전북은행", label: "전북은행" },
        { value: "수협", label: "수협" },
        { value: "산업은행", label: "산업은행" },
        { value: "제주은행", label: "제주은행" },
        { value: "카카오뱅크", label: "카카오뱅크" },
    ]

    const [memorialReg, setMemorialReg] = useState(memorialHallRegistration);



    useEffect(() => {
        getFuneralAddress("");
        if (id) {
            ApiGet(`memorialHall/getMemorialHallByid/${id}`)
                .then((res: any) => {
                    // debugger
                    setMemorialReg({
                        ...memorialReg,
                        id: res.data?.id,
                        type: res.data?.memorial_hall_type,
                        name: res.data?.name,
                        job_title: res.data?.job_title,
                        burial_plot: res.data?.burial_plot,
                        funeral_home: res.data?.funeral_Address,
                        room_number: res.data?.room_number,
                        Introduction: res.data?.Introduction,
                        image: res.data?.image,
                    })
                    setHallType(res.data?.memorial_hall_status)
                    setDateOfBirth(new Date(res.data.date_of_birth))
                    setDateOfDeath(new Date(res.data.date_of_death))
                    setHourOfDeath(moment(new Date(res.data.date_of_death)).format('HH'))
                    setMinuteOfDeath(moment(new Date(res.data.date_of_death)).format('mm'))

                    setDateOfCarryingCofinOut(new Date(res.data.date_of_carrying_the_coffin_out))
                    setHourOfCarryingCofinOut(moment(new Date(res.data.date_of_carrying_the_coffin_out)).format('HH'))
                    setMinuteOfCarryingCofinOut(moment(new Date(res.data.date_of_carrying_the_coffin_out)).format('mm'))

                    setRegisterer(res.data?.registerer)

                    if (res.data?.moneyAccount.length > 0) {
                        setMoneyAccount(res.data?.moneyAccount)
                    } else {
                        setMoneyAccount([
                            {
                                name: "",
                                bank_name: "",
                                ac_number: "",
                            },
                        ])
                    }

                    if (res.data?.donationSerives.length > 0) {
                        setDonationSerives(res.data?.donationSerives.map((item: any) => {

                            setOldDonationOrg(item?.recipient_organization)
                            setOldDonationField(item?.donation_field)
                            return {
                                donation_field: item?.donation_field,
                                bank_name: item?.bank_name,
                                recipient_organization: item?.recipient_organization,
                                ac_number: item?.ac_number,
                                Introduction: item?.Introduction,
                                service_duration: item?.service_duration,
                            }
                        }))

                    } else {
                        setDonationSerives([{
                            donation_field: "",
                            bank_name: "",
                            recipient_organization: "",
                            ac_number: "",
                            Introduction: "",
                            service_duration: "",
                        }])
                    }
                    if (res.data?.inviteFamilyMembers.length > 0) {
                        setInviteFamilyMembers(res.data?.inviteFamilyMembers)
                    } else {
                        setInviteFamilyMembers([
                            {
                                name: "",
                                email: "",
                                relationship: "",
                                relationship_name: ""

                            }
                        ])
                    }
                    setMemorialHallActive(res.data?.is_deleted.toString())

                    const label = (res.data.image).split('/')
                    const files = label[label.length - 1].split('?')[0]
                    setImageName(files)

                })
        }
        setDonationField(donationField)
    }, []);

    useEffect(() => {
        if (donationSerives[0]?.donation_field && donationSerives[0]?.recipient_organization) {

            let DonationIntroduction = ""

            if (id) {
                DonationIntroduction = `${donationSerives[0]?.Introduction}`.replace(oldDonationField, `${donationSerives[0]?.donation_field}`).replace(oldDonationOrg, `${donationSerives[0]?.recipient_organization}`)
            } else {
                DonationIntroduction = `고인은 생전 ${donationSerives[0]?.donation_field} 에 대한 관심과 애정으로 평소 정성스런 마음과 물질을 나누셨습니다.\n유족들은 고인의 유지를 잇기 위해 ${donationSerives[0]?.recipient_organization} 기부단체에 계속 지원하기로 하였습니다. \n`
            }


            const val = donationSerives[0]
            const newVal = {
                ...val,
                Introduction: DonationIntroduction
            }
            setDonationSerives([newVal])
            if (id) {
                setOldDonationOrg(donationSerives[0]?.recipient_organization)
                setOldDonationField(donationSerives[0]?.donation_field)
            }
        }
    }, [donationSerives[0]?.donation_field, donationSerives[0]?.recipient_organization])
    useEffect(() => {
    }, [memorialReg])

    const handleInputChangeRegisterer = (index: number, event: any, inputName: string) => {
        const values = [...registerer];
        if (inputName === "relationship") {
            values[index].relationship = event.target.value;
        }
        if (inputName === "name") {
            values[index].name = event.target.value;
        }
        if (inputName === "relationship_name") {
            values[index].relationship_name = event.target.value;
        }
        setRegisterer(values);
    };

    const handleRemoveRegistererFields = (index: number) => {
        if (registerer.length > 1) {
            const values = [...registerer];
            values.splice(index, 1);
            setRegisterer(values);
        }
    };

    const handleAddRegistererFields = () => {
        const values = [...registerer];
        values.push({
            name: "",
            relationship: "",
            relationship_name: ""
        });
        setRegisterer(values);
    };

    const handleRemoveinviteFamilyMembersFields = (index: number) => {
        if (inviteFamilyMembers.length > 1) {
            const values = [...inviteFamilyMembers];
            values.splice(index, 1);
            setInviteFamilyMembers(values);
        }
    };

    const handleAddInvitaionFamilyFields = () => {
        const values = [...inviteFamilyMembers];
        values.push({
            name: "",
            email: "",
            relationship: "",
            relationship_name: ""
        });
        setInviteFamilyMembers(values);
    };

    const handleInputChangeInvitaionFamily = (index: number, event: any, inputName: string) => {
        const values = [...inviteFamilyMembers];
        if (inputName === "relationship") {
            values[index].relationship = event.target.value
        }
        if (inputName === "relationship_name") {
            values[index].relationship_name = event.target.value
        }
        if (inputName === "name") {
            values[index].name = event.target.value;
        }
        if (inputName === "email") {
            values[index].email = event.target.value;
        }
        setInviteFamilyMembers(values);
    };

    const handleInputChangeApplicant = (index: number, event: any, inputName: string) => {

        const values = [...moneyAccount];
        if (inputName === "bank_name") {
            values[index].bank_name = event.target.value;
        }
        if (inputName === "name") {
            values[index].name = event.target.value;
        }
        if (inputName === "ac_number") {

            const re = /^[0-9\b]+$/;

            if (!event.target.value || event.target.value === "" || re.test(event.target.value)) {
                values[index].ac_number = event.target.value;
            }

        }
        setMoneyAccount(values);
    };

    const handleRemoveApplicantFields = (index: number) => {
        if (moneyAccount.length > 1) {
            const values = [...moneyAccount];
            values.splice(index, 1);
            setMoneyAccount(values);
        }
    };

    const handleAddApplicantFields = () => {
        const values = [...moneyAccount];
        values.push({
            name: "",
            bank_name: "",
            ac_number: "",
        });
        setMoneyAccount(values);
    };

    const handleChnageEventDonationSerives = (index: number, event: any, inputName: string) => {

        const values = [...donationSerives];
        if (inputName === "donation_field") {
            values[index].donation_field = event.target.value;
        }
        if (inputName === "recipient_organization") {
            values[index].recipient_organization = event.target.value;
        }
        if (inputName === "bank_name") {
            values[index].bank_name = event.target.value;
        }
        if (inputName === "ac_number") {
            const re = /^[0-9\b]+$/;

            if (!event.target.value || event.target.value === "" || re.test(event.target.value)) {
                values[index].ac_number = event.target.value;
            }
        }
        if (inputName === "introduction") {
            values[index].Introduction = event.target.value;
        }
        if (inputName === "service_duration") {
            values[index].service_duration = event.target.value;
        }
        setDonationSerives(values);
    };

    const attechImage = () => {
        document.getElementById("attechImage")?.click();
    };
    const Save = () => {

        const deathDateTime =
            moment(dateOfDeath).format("YYYY-MM-DD") +
            " " +
            hourOfDeath +
            ":" +
            minuteOfDeath;

        const CarryingCofinOutDateTime =
            moment(dateOfCarryingCofinOut).format("YYYY-MM-DD") +
            " " +
            hourOfCarryingCofinOut +
            ":" +
            minuteOfCarryingCofinOut;

        const finalDeathDateTime = moment(
            deathDateTime
        ).format("YYYY-MM-DD HH:mm:ss");
        const finalCarryingCofinOutDateTime = moment(
            CarryingCofinOutDateTime
        ).format("YYYY-MM-DD HH:mm:ss");

        if (memorialReg.id === "") {

            ApiPost("memorialHall/memorialHallRegistrationByAdmin", {
                name: memorialReg.name,
                date_of_birth: moment(dateOfBirth).format("YYYY-MM-DD"),
                job_title: memorialReg.job_title,
                date_of_death: finalDeathDateTime,
                date_of_carrying_the_coffin_out: finalCarryingCofinOutDateTime,
                funeral_Address: selectedAddressID.toString(),
                // funeral_Address: memorialReg.funeral_home,
                room_number: memorialReg.room_number.toString(),
                burial_plot: memorialReg.burial_plot,
                memorial_hall_active: memorialHallActive,
                Introduction: memorialReg.Introduction,
                memorial_hall_status: hallType,
                registerer: registerer.map((data: any) => {
                    return {
                        ...data,
                        relationship: data?.relationship,
                    };
                }),
                inviteFamilyMembers: inviteFamilyMembers.map((data: any) => {
                    return {
                        ...data,
                        relationship: data?.relationship,
                    };
                }),
                moneyAccount: moneyAccount.map((data: any) => {
                    return {
                        ...data,
                        bank_name: data?.bank_name,
                    };
                }),
                donationSerives: donationSerives.map((data: any) => {
                    return {
                        ...data,
                        service_duration: data?.service_duration,
                        bank_name: data?.bank_name,
                        donation_field: data?.donation_field,
                    };
                }),
            })
                .then((res: any) => {
                    memorialHallImage(res.data.id)
                })
        } else {
            ApiPut(`memorialHall/editMemorialHallByAdmin/${memorialReg.id}`, {

                name: memorialReg.name,
                date_of_birth: moment(dateOfBirth).format("YYYY-MM-DD"),
                job_title: memorialReg.job_title,
                date_of_death: finalDeathDateTime,
                date_of_carrying_the_coffin_out: finalCarryingCofinOutDateTime,
                funeral_Address: memorialReg.funeral_home,
                room_number: memorialReg.room_number.toString(),
                burial_plot: memorialReg.burial_plot,
                memorial_hall_active: memorialHallActive,
                Introduction: memorialReg.Introduction,
                memorial_hall_status: hallType,
                registerer: registerer.map((data: any) => {
                    return {
                        name: data?.name,
                        relationship: data?.relationship,
                        relationship_name: data?.relationship_name,
                    };
                }),
                inviteFamilyMembers: inviteFamilyMembers.map((data: any) => {
                    return {
                        email: data?.email,
                        name: data?.name,
                        relationship: data?.relationship,
                        relationship_name: data?.relationship_name,
                    };
                }),
                moneyAccount: moneyAccount.map((data: any) => {
                    return {
                        ac_number: data?.ac_number,
                        name: data?.name,
                        bank_name: data?.bank_name,
                    };
                }),
                donationSerives: donationSerives.map((data: any) => {
                    return {
                        Introduction: data?.Introduction,
                        ac_number: data?.ac_number,
                        recipient_organization: data?.recipient_organization,
                        service_duration: data?.service_duration,
                        bank_name: data?.bank_name,
                        donation_field: data?.donation_field,
                    };
                }),

            })
                .then((res: any) => {
                    memorialHallImage(res.data.id)
                })
        }
    };

    const memorialHallImage = (memorial_Hall_id: any) => {

        let formData = new FormData();
        if (selectedFile) {
            formData.append('id', memorial_Hall_id);
            if (selectedFile) {
                formData.append('image', selectedFile);
            }
            ApiPatch("memorialHall/memorialHallImage", formData)
                .then((res) => {
                    history.push("/hall/memorial-hall-list");
                })
        } else {
            history.push("/hall/memorial-hall-list");
        }
    }

    useEffect(() => {
        if (!selectedFile) {
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setImgSrc(objectUrl);
        setImageName(selectedFile.name)

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    useEffect(() => {
        if (dateOfDeath) {
            let we = moment(dateOfDeath).add(3, 'd').format('YYYY/MM/DD HH:mm:ss')
            setDateOfCarryingCofinOut(new Date(we))
        }
    }, [dateOfDeath])

    const [page, setPage] = useState<number>(1);
    const [addressSuggestion, setAddressSuggestion] = useState(false);
    const [funeralList, setFuneralList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const observer = useRef<any>();
    const [hasMore, setHasMore] = useState(false);
    const location = useLocation()
    const [selectedAddressID, setSelectedAddressID] = useState("");
    const [searchAddsTerm, setSearchAddsTerm] = useState("");

    const closeSuggestions = () => {
        setPage(1);
        setAddressSuggestion(!addressSuggestion)
    }

    const getFuneralAddress = (event: any) => {
        let val: any
        if (event === "") {
            val = ""
        } else {
            val = event
            setFuneralList([])
        }
        ApiGet(`memorialHall/getFuneralAddress?funeral_term=${val.toString()}&per_page=10&page_number=${page}`)
            .then((res: any) => {
                setFuneralList((prev: any[]) => {
                    return [...prev, ...res?.data.funeralList];
                });

                setHasMore(res.data.funeralList.length > 0);
                setLoading(false);

                if (val) {
                    setAddressSuggestion(true)
                }
            });
    }

    const selectAddress = (item: any) => {
        setSelectedAddressID(item.id)
        setMemorialReg({
            ...memorialReg,
            funeral_home: item.address
        })
        setAddressSuggestion(false)
    }

    const lastTourListRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );
    const getAddressById = (aid: string) => {
        if (funeralList.length > 0) {
            const findone: any = funeralList.find((data: any) => data.id === aid)
            return findone?.address
        }
        return ""
    }

    const debouncedChangeHandler = useCallback(
        debounce(getFuneralAddress, 300)
        , []);

    useEffect(() => {
        getFuneralAddress("")
    }, [page, location]);

    return (
        <>
            <div className="main-heading-wrap">
                <span className="font-20-bold roboto color-01">추모관 등록</span>
                <div className="d-flex ml-auto">
                    <div className="">
                        <Buttons
                            type=""
                            ButtonStyle="normalBtns mr-20"
                            onClick={() => { history.push("/hall/memorial-hall-list"); }}
                        >
                            취소
                        </Buttons>
                    </div>
                    <div>
                        <Buttons
                            type=""
                            ButtonStyle="normalBtn"
                            onClick={() => {
                                Save()
                            }}
                        >
                            저장
                        </Buttons>
                    </div>
                </div>
            </div>
            <div className="border-black mt-19"></div>
            <div className="search-section memorial-hall-info">
                <div className="title">추모관 정보 등록</div>
                <div className="position-relative">
                    <select
                        className={hallType === "" ? 'selector-set option-minimal' : 'option-selector option-minimal'}
                        id=""
                        value={hallType}
                        name="user_information"
                        onChange={(event: any) => {
                            setHallType(event.target.value);

                        }}
                    >
                        <option disabled selected >시간</option>
                        {user_type.map(({ value, label }) =>
                            <option className="redText" value={value} key={value} >{label}</option>
                        )}
                    </select>
                </div>
            </div>
            <div className="border"></div>
            <div className="d-flex">
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">추모하실 분 이름</label>
                    </div>
                    <div className="DatePicker-set-main">
                        <input
                            className="Please-enter-input-set color-11 custom-placeholder"
                            name="name"
                            autoComplete="off"
                            value={memorialReg.name}
                            placeholder="추모하실 분 입력"
                            type="text"
                            onChange={(e: any) => {
                                setMemorialReg({ ...memorialReg, name: e.target.value });
                            }}
                        />
                    </div>
                </div>
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">생년월일</label>
                    </div>
                    <div className="DatePicker-set-main dob color-11 custom-placeholder">
                        <DatePicker
                            selected={dateOfBirth}
                            onChange={(dateOfBirth: Date | null) => setDateOfBirth(dateOfBirth)}
                            isClearable={false}
                            dateFormat="yyyy.MM.dd"
                            placeholderText="입력 생년월일"
                            locale="ko"
                            maxDate={new Date()}
                            className="DatePicker-set"
                            // showMonthDropdown={true}
                            // showYearDropdown={true}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>
            <div className="border"></div>
            <div className="d-flex">
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">직위</label>
                    </div>
                    <div className="DatePicker-set-main">
                        <input
                            className="password-input-set color-11 custom-placeholder"
                            name="jobtitle"
                            value={memorialReg.job_title}
                            placeholder="직위 입력"
                            type="text"
                            onChange={(e: any) => {
                                setMemorialReg({ ...memorialReg, job_title: e.target.value });
                            }}
                        />
                    </div>
                </div>
                <div className="width d-flex p-relative">
                    <div className="date-of-registration-set">
                        <label className="">영정사진 이미지</label>
                    </div>
                    <div>
                        <div className="d-flex align-items-center form-input file-select">
                            <div>
                                <span className={imageName ? "" : "placeholder-color"}>{(imageName) ? (imageName) : ``}</span>
                            </div>
                            <div className="ml-auto">
                                <Button
                                    className="Attachfile-btn-type-file ml-auto"
                                    onClick={attechImage}
                                    children="파일 첨부"
                                />
                            </div>
                            {/* {imageName &&
                                <div>
                                    <Buttons
                                        type=""
                                        ButtonStyle="delete-btn"
                                        onClick={DeleteImg}>
                                        삭제
                                    </Buttons>
                                </div>
                            } */}
                        </div>
                    </div>
                    <input
                        id="attechImage"
                        type="file"
                        hidden
                        src={imgSrc}
                        onChange={(e: any) => {
                            if (!e.target.files || e.target.files.length === 0) {
                                setSelectedFile(undefined);
                                return;
                            }
                            setSelectedFile(e.target.files[0]);
                        }}
                        alt="img"
                        accept="*"
                        className="login-input"
                    />
                </div>
            </div>
            <div className="border"></div>
            <div className="d-flex selector-color-set">
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">임종일자</label>
                    </div>
                    <div className="d-flex DateOfDeath-content-center">
                        <DatePicker
                            selected={dateOfDeath}
                            onChange={(dateOfDeath: Date | null) => setDateOfDeath(dateOfDeath)}
                            dateFormat="yyyy.MM.dd"
                            placeholderText="연도.월.일"
                            locale="ko"
                            className="DateOfDeath-DatePicker "
                            isClearable={false}
                            maxDate={new Date()}
                            autoComplete="off"
                        />


                        <div className="position-relative dropdown-1">
                            <select
                                className={minuteOfDeath === "" ? 'height-width-set minimal' : 'height-width-set minimal'}
                                name="minute_death"
                                value={minuteOfDeath}
                                onChange={(event: any) => {
                                    setMinuteOfDeath(event.target.value);
                                }}
                            >
                                <option disabled selected>분</option>
                                {selectminute.map(({ value, label }) =>

                                    <option className="redText" value={value} key={value} >{label}</option>
                                )}
                            </select>
                        </div>
                        <div className="position-relative dropdown-2">
                            <select
                                className={hourOfDeath === "" ? 'height-width-set minimal ' : 'height-width-set minimal'}
                                id=""
                                value={hourOfDeath}
                                name="hour_death"
                                onChange={(event: any) => {
                                    setHourOfDeath(event.target.value);
                                }}
                            >
                                <option disabled selected>시간</option>
                                {selecthour.map(({ value, label }) =>

                                    <option className="redText" value={value} key={value} >{label}</option>
                                )}
                            </select>
                        </div>


                    </div>
                </div>
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">발인일시</label>
                    </div>
                    <div className="d-flex DateOfDeath-content-center">

                        <div className="position-relative">
                            <DatePicker
                                selected={dateOfCarryingCofinOut}
                                onChange={(dateOfCarryingCofinOut: Date | null) => setDateOfCarryingCofinOut(dateOfCarryingCofinOut)}
                                isClearable={false}
                                dateFormat="yyyy.MM.dd"
                                placeholderText="연도.월.일"
                                locale="ko"
                                className="DateOfDeath-DatePicker"
                                minDate={new Date()}
                                autoComplete="off"
                            />
                        </div>



                        <div className="position-relative selector-set-main dropdown-1">
                            <select
                                className={minuteOfCarryingCofinOut === "" ? 'height-width-set minimal' : 'height-width-set minimal'}
                                name="minute_carrying"
                                value={minuteOfCarryingCofinOut}
                                onChange={(event: any) => {
                                    setMinuteOfCarryingCofinOut(event.target.value);
                                }}
                            >
                                <option disabled selected>분</option>
                                {selectminute.map(({ value, label }) =>

                                    <option className="redText" value={value} key={value}>{label}</option>
                                )}
                            </select>
                        </div>

                        <div className="position-relative dropdown-2">
                            <select
                                className={hourOfCarryingCofinOut === "" ? 'height-width-set minimal' : 'height-width-set minimal'}
                                id=""
                                name="hours_carrying"
                                value={hourOfCarryingCofinOut}
                                onChange={(event: any) => {
                                    setHourOfCarryingCofinOut(event.target.value);
                                }}
                            >

                                <option disabled selected>시간</option>
                                {selecthour.map(({ value, label }) =>

                                    <option className="redText" value={value} key={value} >{label}</option>
                                )}
                            </select>
                        </div>


                    </div>
                </div>
            </div>
            <div className="border"></div>
            <div className="d-flex">
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">장례식장</label>
                    </div>
                    <div className="d-flex DateOfDeath-content-center">
                        <input
                            className="DateOfDeath-DatePicker input-1"
                            name="funeral_home"
                            autoComplete="off"
                            value={memorialReg.funeral_home}
                            placeholder="장례식장 입력"
                            type="text"
                            onChange={(e: any) => {
                                setMemorialReg({ ...memorialReg, funeral_home: e.target.value });
                                setSearchAddsTerm(e.target.value)
                                debouncedChangeHandler(e.target.value)
                            }}
                        />

                        <Buttons type="" ButtonStyle="Attachfile-btn" onClick={closeSuggestions}>
                            주소찾기
                        </Buttons>


                        {addressSuggestion &&
                            <div className="list-dropdown-address">
                                {funeralList.map((item: any, index: number) =>
                                    <div className="cursor-pointer" onClick={() => selectAddress(item)}
                                        ref={funeralList.length === index + 1 ? lastTourListRef : null}
                                        key={index}
                                    >
                                        {item.type_of_operation === "병원" ?
                                            <div className="yellow-label">
                                                병원장례식장
                                            </div>
                                            :
                                            <div className="sky-label">
                                                전문장례식장
                                            </div>
                                        }
                                        <h4>{item.facility_name}</h4>
                                        <p>{item.address}</p>
                                    </div>
                                )}
                            </div>
                        }
                        <input
                            className="DateOfDeath-DatePicker input-2"
                            name="room_number"
                            autoComplete="off"
                            value={memorialReg.room_number}
                            placeholder="호실 입력"
                            type="text"
                            onChange={(e: any) => {
                                setMemorialReg({ ...memorialReg, room_number: e.target.value });
                            }}
                        />
                    </div>
                </div>

                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">장지</label>
                    </div>
                    <div className="DateOfDeath-content-center d-flex">
                        <input
                            className="Please-enter-input-set"
                            name="burial_plot"
                            value={memorialReg.burial_plot}
                            placeholder="장지 입력"
                            type="text"
                            onChange={(e: any) => {
                                setMemorialReg({ ...memorialReg, burial_plot: e.target.value });
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="border"></div>
            <div className="d-flex">
                <div className="width d-flex">
                    <div className="date-of-registration-set">
                        <label className="">활성화 여부</label>
                    </div>

                    <div className="Activation-content d-flex">
                        <div className="Activation-content-center d-flex">
                            <input
                                name="deactivate"
                                type="radio"
                                // value={memorialHallActive}
                                checked={memorialHallActive === "true"}
                                className="radio-btn"
                                defaultChecked
                                onChange={(e: any) => {
                                    setMemorialHallActive("true");
                                }}
                            />

                            <label className="radio-btn-lable">비활성화</label>

                        </div>
                        <div className="Activation-content-center d-flex">
                            <input
                                name="deactivate"
                                type="radio"
                                // value={memorialHallActive}
                                checked={memorialHallActive === "false"}
                                className="radio-btn"
                                onChange={(e: any) => {
                                    setMemorialHallActive("false")
                                }}
                            />
                            <label className="radio-btn-lable">활성화</label>
                        </div>
                    </div>
                </div>

            </div>
            <div className="border"></div>
            <div className="d-flex">
                <div className="Introduction-content">
                    <label className="">소개글</label>
                </div>
                <TextareaAutosize
                    className="textAreaClass"
                    maxRows={4}
                    placeholder="소개글 입력"
                    onChange={(e: any) => {
                        setMemorialReg({ ...memorialReg, Introduction: e.target.value });
                    }}
                    value={memorialReg.Introduction}
                />
            </div>

            {/* Registerer Information */}

            <div className="border"></div>
            <div className="border-black mt-100"></div>
            <div className="search-section">
                <div className="title">상주 정보 입력</div>
            </div>

            <div className="add-row-main">
                {registerer.map((input, index) => (
                    <div className="add-row-main-content" id="registerer-list" key={index}>
                        <div className="border"></div>
                        <div className="d-flex">
                            <div className="width d-flex">
                                <div className="date-of-registration-set">
                                    <label className="">상주{index + 1} 이름</label>
                                </div>

                                <div className="DatePicker-set-main">
                                    <input
                                        className="Please-enter-input-set color-11 custom-placeholder"
                                        name="name"
                                        autoComplete="off   "
                                        value={input.name}
                                        placeholder={`상주${index + 1} 이름 입력`}
                                        type="text"
                                        onChange={(event) => {
                                            handleInputChangeRegisterer(index, event, "name");
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="border"></div>
                            <div className="date-of-registration-set">
                                <label className="">윗분과의 관계</label>
                            </div>
                            <div className="Relationship-to-the-person-height-width position-relative">
                                <select
                                    className={input.relationship === "" ? 'Relationship-to-the-person-above-selector color-gray arrow-img' : 'Relationship-to-the-person-above-selector arrow-img'}
                                    name="relationship"
                                    id={`registererRelation${index}`}
                                    value={input.relationship}
                                    onChange={(event) => { handleInputChangeRegisterer(index, event, "relationship"); }}
                                >
                                    <option selected>윗분과의 관계 입력</option>
                                    {relationShipDropDown.map(({ value, label }) =>

                                        <option className="redText" value={value} key={value} >{label}</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="border"></div>
                        <div className="relationship-other">
                            {input.relationship === "Other" &&
                                < input
                                    name="relationship_name"
                                    value={input.relationship_name}
                                    placeholder="관계를 입력하세요."
                                    type="text"
                                    onChange={(event) => {
                                        handleInputChangeRegisterer(index, event, "relationship_name");
                                    }}
                                />
                            }
                        </div>
                        <div className="border"></div>
                        <div className="d-flex">
                            {
                                registerer.length > 1 && (
                                    <div className="delet-bttn-set" >
                                        <Buttons
                                            type=""
                                            ButtonStyle={id !== undefined ? "delet-bttn-red" : "delet-bttn"}
                                            onClick={() => {
                                                handleRemoveRegistererFields(index);
                                            }}
                                        >삭제하기</Buttons>
                                    </div>
                                )
                            }
                            <div className=" add-bttn-set">
                                <Buttons type="" ButtonStyle="add-bttn" onClick={() => { handleAddRegistererFields(); }}>
                                    추가하기
                                </Buttons>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Enter Family Member Information */}

            <div className="border-black mt-71"></div>
            <div className="title-Enter-Family-Member-Information-set">
                <div className="title-Enter-Family-Member-Information">가족구성원 정보 입력</div>
            </div>

            <div className="border"></div>
            <div className="add-row-main">
                {inviteFamilyMembers.map((inviteFamilyMembersData, index) => (
                    <div className="add-row-main-content" id="registerer-list" key={index}>
                        <>
                            <div className="d-flex">
                                <div className="width d-flex">
                                    <div className="border"></div>

                                    <div className="date-of-registration-set">
                                        <label className="">가족구성원{index + 1} 이름</label>
                                    </div>
                                    <div className="DatePicker-set-main">
                                        <input
                                            className="Please-enter-input-set color-11 custom-placeholder"
                                            name="family_member"
                                            autoComplete="off"
                                            value={inviteFamilyMembersData.name}
                                            placeholder="가족구성원 이름 입력"
                                            type="text"
                                            onChange={(event) => {
                                                handleInputChangeInvitaionFamily(index, event, "name");
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="date-of-registration-set">
                                    <label className="">윗분과의 관계</label>
                                </div>
                                <div className="Relationship-to-the-person-height-width position-relative">
                                    <select
                                        className={inviteFamilyMembersData.relationship === "" ? 'Relationship-to-the-person-above-selector color-gray arrow-img' : 'Relationship-to-the-person-above-selector arrow-img'}
                                        name="user_information"
                                        id={`registererRelation${index}`}
                                        value={inviteFamilyMembersData.relationship}
                                        placeholder="윗분과의 관계 입력"
                                        onChange={(event) => { handleInputChangeInvitaionFamily(index, event, "relationship"); }}

                                    >
                                        <option selected>윗분과의 관계 입력</option>
                                        {relationShipDropDown.map(({ value, label }) =>
                                            <option className="redText" value={value} key={value} >{label}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="border"></div>
                            <div className="relationship-other">
                                {inviteFamilyMembersData.relationship === "Other" &&
                                    < input
                                        name="relationship_name"
                                        value={inviteFamilyMembersData.relationship_name}
                                        placeholder="관계를 입력하세요."
                                        type="text"
                                        onChange={(event) => {
                                            handleInputChangeInvitaionFamily(index, event, "relationship_name");
                                        }}
                                    />
                                }
                            </div>

                            <div className="border"></div>
                            <div className="width d-flex">
                                <div className="date-of-registration-set">
                                    <label className="">이메일 주소</label>
                                </div>
                                <div className="d-flex Enter-email-address-set">
                                    <input
                                        className="Enter-email-address"
                                        name="email"
                                        value={inviteFamilyMembersData.email}
                                        placeholder="이메일 주소 입력"
                                        type="text"
                                        onChange={(event) => {
                                            handleInputChangeInvitaionFamily(index, event, "email");
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="border"></div>

                            <div className="d-flex">
                                {
                                    inviteFamilyMembers.length > 1 && (
                                        <div className="delet-bttn-set" >
                                            <Buttons
                                                type=""
                                                ButtonStyle={id !== undefined ? "delet-bttn-red" : "delet-bttn"}
                                                onClick={() => {
                                                    handleRemoveinviteFamilyMembersFields(index);
                                                }}
                                            >삭제하기</Buttons>
                                        </div>
                                    )
                                }
                                <div className=" add-bttn-set">

                                    <Buttons type="" ButtonStyle="add-bttn" onClick={() => { handleAddInvitaionFamilyFields(); }}>
                                        추가하기
                                    </Buttons>
                                </div>
                            </div>
                        </>
                    </div>
                ))}
            </div>

            {/* Memorial Money Account Guide Service */}

            <div className="border-black mt-71"></div>
            <div className="title-Enter-Family-Member-Information-set">
                <div className="title-Enter-Family-Member-Information">조의금 계좌 안내 서비스</div>
            </div>

            <div className="border"></div>
            <div className="add-row-main">
                {moneyAccount.map((moneyAccountData, index) => (
                    <div className="add-row-main-content" id="registerer-list" key={index}>
                        <>
                            <div className="d-flex">
                                <div className="border"></div>
                                <div className="width d-flex">
                                    <div className="date-of-registration-set">
                                        <label className="">신청자{index + 1} 이름</label>
                                    </div>
                                    <div className="DatePicker-set-main">
                                        <input
                                            className="Please-enter-input-set color-11 custom-placeholder"
                                            name="applicant_name"
                                            autoComplete="off"
                                            value={moneyAccountData.name}
                                            placeholder={`신청자${index + 1} 이름 입력`}
                                            type="text"
                                            onChange={(event) => {
                                                handleInputChangeApplicant(index, event, "name");
                                            }}
                                        />
                                    </div>
                                </div>
                                {/* <div className="width d-flex"> */}
                                <div className="date-of-registration-set">
                                    <label className="">은행</label>
                                </div>
                                <div className="Relationship-to-the-person-height-width position-relative">
                                    <select
                                        className={moneyAccountData.bank_name === "" ? 'Relationship-to-the-person-above-selector color-gray arrow-img' : 'Relationship-to-the-person-above-selector arrow-img'}
                                        name="bank_name"
                                        placeholder="윗분과의 관계 입력"
                                        value={moneyAccountData.bank_name}
                                        onChange={(event) => { handleInputChangeApplicant(index, event, "bank_name"); }}
                                    >
                                        <option selected>은행 선택</option>
                                        {koreanBank.map(({ value, label }) =>
                                            <option className="redText" value={value} key={value} >{label}</option>
                                        )}
                                    </select>
                                </div>
                            </div>


                            <div className="border"></div>
                            <div className="width d-flex">
                                <div className="date-of-registration-set">
                                    <label className="">계좌번호</label>
                                </div>
                                <div className="DatePicker-set-main">
                                    <input
                                        className="Please-enter-input-set color-11 custom-placeholder"
                                        name="account_number"
                                        value={moneyAccountData.ac_number}
                                        placeholder="계좌번호 입력"
                                        type="text"
                                        onChange={(event) => {
                                            handleInputChangeApplicant(index, event, "ac_number");
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="border"></div>

                            <div className="d-flex">
                                {
                                    moneyAccount.length > 1 && (
                                        <div className="delet-bttn-set" >
                                            <Buttons
                                                type=""
                                                ButtonStyle={id !== undefined ? "delet-bttn-red" : "delet-bttn"}
                                                onClick={() => {
                                                    handleRemoveApplicantFields(index);
                                                }}
                                            >삭제하기</Buttons>
                                        </div>
                                    )
                                }
                                <div className=" add-bttn-set">

                                    <Buttons type="" ButtonStyle="add-bttn" onClick={() => { handleAddApplicantFields(); }}>
                                        추가하기
                                    </Buttons>
                                </div>
                            </div>
                        </>
                    </div>
                ))}
            </div>

            {/* Donation Money Service============================================ */}

            <div className="border-black mt-71"></div>
            <div className="title-Enter-Family-Member-Information-set">
                <div className="title-Enter-Family-Member-Information">기부금 서비스</div>
            </div>

            <div className="border"></div>
            {donationSerives.map((donationSerivesAccount, index) => (
                <div key={index}>
                    <div className="d-flex">
                        <div className="width d-flex">
                            <div className="date-of-registration-set">
                                <label className="">기부 분야</label>
                            </div>
                            <div className="Relationship-to-the-person-height-width position-relative">
                                <select
                                    className={donationSerivesAccount.donation_field === "" ? 'Relationship-to-the-person-above-selector color-gray arrow-img' : 'Relationship-to-the-person-above-selector arrow-img'}
                                    name="donation_field"
                                    value={donationSerivesAccount.donation_field}
                                    onChange={(event: any) => {
                                        handleChnageEventDonationSerives(
                                            index,
                                            event,
                                            "donation_field"
                                        );
                                    }}
                                >
                                    <option selected>기부 분야 입력</option>
                                    {donation.map(({ value, label }) =>
                                        <option className="redText" value={value} key={value} >{label}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="width d-flex">
                            <div className="date-of-registration-set">
                                <label className="">기부 단체</label>
                            </div>
                            <div className="DatePicker-set-main color-11 custom-placeholder">
                                <input
                                    className="Please-enter-input-set"
                                    name="Recipient_Organization"
                                    value={donationSerivesAccount.recipient_organization}
                                    placeholder="기부 단체 입력"
                                    type="text"
                                    onChange={(event) => {
                                        handleChnageEventDonationSerives(
                                            index,
                                            event,
                                            "recipient_organization"
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="border"></div>
                    <div className="d-flex">
                        <div className="width d-flex">
                            <div className="date-of-registration-set">
                                <label className="">은행</label>
                            </div>
                            <div className="Relationship-to-the-person-height-width position-relative">
                                <select
                                    className={donationSerivesAccount.bank_name === "" ? 'Relationship-to-the-person-above-selector color-gray arrow-img' :
                                        'Relationship-to-the-person-above-selector arrow-img'}
                                    name="donation_bank"
                                    placeholder="은행 선택"
                                    value={donationSerivesAccount.bank_name}
                                    onChange={(event: any) => {
                                        handleChnageEventDonationSerives(
                                            index,
                                            event,
                                            "bank_name"
                                        );
                                    }}
                                >
                                    <option selected>은행 선택</option>
                                    {koreanBank.map(({ value, label }) =>
                                        <option className="redText" value={value} key={value} >{label}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="width d-flex">
                            <div className="date-of-registration-set">
                                <label className="">계좌번호</label>
                            </div>
                            <div className="DatePicker-set-main color-11 custom-placeholder">
                                <input
                                    className="Please-enter-input-set"
                                    name="ac_number"
                                    value={donationSerivesAccount.ac_number}
                                    placeholder="계좌번호 입력"
                                    type="text"
                                    onChange={(event) => {
                                        handleChnageEventDonationSerives(
                                            index,
                                            event,
                                            "ac_number"
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="border"></div>
                    <div className=" d-flex">
                        <div className="Introduction-content">
                            <label className="">소개글</label>
                        </div>
                        <TextareaAutosize
                            className="textAreaClass"
                            maxRows={4}
                            value={`${ReactHtmlParser(donationSerivesAccount.Introduction)}`}
                            placeholder={`${ReactHtmlParser(DonationIntroductionPlaceholder)}`}
                            onChange={(event: any) => {
                                handleChnageEventDonationSerives(
                                    index,
                                    event,
                                    "introduction"
                                );
                            }}
                        />
                    </div>
                    <div className="border"></div>
                    <div className="border-black mt-100"></div>
                    <div className="title-Enter-Family-Member-Information-set">
                        <div className="title-Enter-Family-Member-Information">조의금 및 기부금 서비스 노출 기간</div>
                    </div>
                    <div className="border"></div>
                    <div className="d-flex">
                        <div className=" d-flex">
                            <div className="Select-Duration-set">
                                <label className="">기간 선택</label>
                            </div>
                            <div className="Relationship-to-the-person-height-width position-relative">
                                <select
                                    className='Memorial-Money-Donation-Money-Service-Display-Duration-selector arrow-img-last'
                                    name="service_duration"
                                    id={`donationSerivesServiceDuration${index}`}
                                    value={donationSerivesAccount.service_duration}
                                    onChange={(event: any) => {
                                        handleChnageEventDonationSerives(
                                            index,
                                            event,
                                            "service_duration"
                                        );
                                    }}
                                >

                                    {serviceDurationDropDown.map(({ value, label }) =>
                                        <option className="redText" value={value} key={value} >{label}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="border"></div>

                </div>
            ))}
        </>
    );
};

export default MemorialHallRegistration;
