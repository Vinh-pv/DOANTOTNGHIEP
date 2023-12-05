import React, { useContext, useEffect, useState } from "react";
import "./contacts.scss";
import { Context } from "../../context/Context";
import { userRequest } from "../../requestMethods";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const { user } = useContext(Context);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mssv, setMssv] = useState("");
  const [roomId, setRoomId] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Liên hệ - Quản lý KTX.";
  }, []);

  const handleContact = async () => {
    const newContact = {
      username: user?.username,
      name,
      phone,
      mssv,
      roomId,
      title,
      desc,
    }
    try {
      await userRequest.post("/contacts", newContact);
      alert("Gửi đơn thành công");
      navigate("/historyContacts");
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="contacts">
      <div className="contacts__wrapper">
        <div className="contacts__left">
          <h2 className="contacts__title">Liên Hệ</h2>
          <p>Số điện thoại: 0123456789</p>
        </div>

        <div className="contacts__right">
          <div className="contacts__formHeading">
            <h2>Gửi Yêu Cầu Sửa Chửa</h2>
            <p>
              Bạn có ý kiên thất mất hoặc đang có nhu cầu sử dụng KTX vui lòng
              gửi thông tin về chúng tôi, chúng tôi sẽ phản hồi lại bạn trong
              thời gian sớm nhất
            </p>
          </div>
          <div className="contacts__form">
            <div className="contacts__formWrapper">
              <div className="contacts__aside">
                <input
                  type="text"
                  className="contacts__input"
                  placeholder="Tên"
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  className="contacts__input"
                  placeholder="Số điện thoại"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="contacts__aside">
                <input
                  type="text"
                  className="contacts__input"
                  placeholder="MSSV"
                  onChange={(e) => setMssv(e.target.value)}
                />
                <input
                  type="text"
                  className="contacts__input"
                  placeholder="Mã phòng"
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </div>
            </div>
            <input
              type="text"
              className="contacts__input"
              placeholder="Tiêu đề"
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              name=""
              placeholder="Tin nhắn"
              id=""
              cols="30"
              rows="10"
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
            <button onClick={handleContact}>Gửi</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
