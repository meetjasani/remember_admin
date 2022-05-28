import React, { useEffect, useState } from "react";
import { ApiGet, ApiPost } from "../../../helper/API/ApiData";
import ReactHtmlParser from 'react-html-parser';
import MessageCkEditor from "../../../component/MessageCkEditor.js";

interface Props {
  hideRow: any;
  memorial_id: any;
  Post: any;
  editMessage: boolean;
  setEditFlag: () => void;
  setDisplayList: boolean;
  handleMemorialMessageEditor: (showEditor: boolean) => void;
}

const MemorialMessage: React.FC<Props> = ({ hideRow, memorial_id, Post, editMessage, setEditFlag, setDisplayList, handleMemorialMessageEditor }) => {

  const [showEditor, setShowEditor] = useState(false);
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  const [MemorialMessages, setMemorialMessages] = useState([]);
  const [MemorialMessage, setMemorialMessage] = useState<any>([]);
  const [selectCheck, setSelectCheck] = useState(true);
  const [dataObject, setDataObject] = useState<any>({
    contentData: "",
    title: "",
    id: []
  });

  const toggleEditor = () => {
    setShowEditor(true);
    hideRow(true);
  };

  useEffect(() => {
    //[+] CallBack Function :- Pass editor value to memorail-hall-details
    handleMemorialMessageEditor(showEditor);
  }, [showEditor])

  useEffect(() => {
    if (setDisplayList === true) {
      setData("");
      setTitle("")
      setShowEditor(false);
      hideRow(false);
      getAllMemorialHallMessage();
      setMemorialMessage([])
    }
  }, [setDisplayList])

  const handleChange = (newData: string) => {
    setData(newData);
    setDataObject({ ...dataObject, contentData: newData })
  };

  const getAllMemorialHallMessage = () => {
    if (memorial_id) {
      ApiGet(`memorialHall/getAllMemorialHallMessageByID/${memorial_id}`)
        .then((res: any) => {
          setMemorialMessages(res?.data?.memorialMessageData)
        })
    }
  };

  useEffect(() => {
    getAllMemorialHallMessage()
  }, [])

  useEffect(() => {

    if (editMessage === true) {
      setData("");
      setTitle("")
      toggleEditor();
      ApiPost(`memorialHall/getMemorialMessageByID/${MemorialMessage[0]}`, {})
        .then((res: any) => {
          setData(res?.data?.content);
          setTitle(res?.data?.title)
          setEditFlag()
          getAllMemorialHallMessage();
        })
    }
  }, [editMessage])

  const handleEditMessage = () => {
    // setShowEditor(true)
    // setEditId(messageId);
    // Edit(messageContent)
  };

  const Delete = () => {
    const idlist = MemorialMessage.map((m: any) => m).join(",")
    ApiPost(`memorialHall/deleteMemorialMessageByIdAdmin`, { id: idlist })
      .then((res: any) => {
        setSelectCheck(false)
        getAllMemorialHallMessage();
        setSelectCheck(true);
      })
  }

  const handlecheck = (message: any) => {
    const findMessage = MemorialMessage.findIndex((data: any) => data === message?.id)
    if (findMessage < 0) {
      setMemorialMessage([...MemorialMessage, message.id])

    } else {
      const values = [...MemorialMessage];
      values.splice(findMessage, 1);
      setMemorialMessage(values)
    }
  }

  useEffect(() => {
    setDataObject({ ...dataObject, id: MemorialMessage })
  }, [MemorialMessage])

  useEffect(() => {
    Post(dataObject)
  }, [dataObject])

  const handleChangeTitle = (e: any) => {
    setTitle(e.target.value)
    setDataObject({ ...dataObject, title: e.target.value })
  }

  return (
    <>
      {showEditor ? (
        <>
          <div className="memorial-message-title">
            <input type="text" placeholder="제목을 입력하세요." name="name"
              value={title}
              onChange={(e: any) => handleChangeTitle(e)}
            />
            {/* <p>공개</p> */}
          </div>
          <div className="editor-view">
            <MessageCkEditor
              memorial_id={memorial_id}
              onChange={handleChange}
              onEdit={handleEditMessage}
              data={data}
            />
          </div>
        </>
      ) : (
        <>
          <div className="memorial-message-hedar">
            <h1 className="hedar-text">그가 남긴 이야기...</h1>
            <button onClick={toggleEditor} className="hedar-btn">
              조문보 추가하기
            </button>
          </div>

          {MemorialMessages.map((message: any, index:number) => {
            return (

                <div className="full-msg-content"  key={index}>
                  <div className="ck-content d-flex">
                    {selectCheck &&
                      <input
                        type="checkbox"
                        onChange={() => handlecheck(message)}
                        className="checkbox-input  checkbox-input-memorial-message"
                      />
                    }
                    {ReactHtmlParser(message?.content)}
                  </div>
                </div>


            );
          })}
        </>
      )}

      {/* <div className="memorial-message-display">
        <button onClick={() => Delete()} className="memorial-message-footer">
          삭제
        </button>
      </div> */}
      {!showEditor &&
        (<div className="memorial-message-display">
          <button onClick={() => Delete()} className="memorial-message-delete">
            삭제
          </button>
        </div>)
      }

    </>
  );
}

export default MemorialMessage;
