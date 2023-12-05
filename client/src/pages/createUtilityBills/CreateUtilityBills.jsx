// import { useLocation } from "react-router-dom";
// import useSWR from "swr";
// import Loading from "../../components/loading/Loading";
// import EmptyResults from "../../components/emptyResults/EmptyResults";
// import { domainApi } from "../../requestMethods";
import { publicRequest, userRequest } from "../../requestMethods";
import { Context } from "../../context/Context";
import { useContext, useEffect, useState } from "react";
// dayjs
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const CreateUtilityBill = () => {
  const { user } = useContext(Context);
  // new add
  const [rooms, setRooms] = useState("");
  const [roomId, setRoomId] = useState("");
  const [month, setMonth] = useState("");
  const [electricityBill, setElectricityBill] = useState("");
  const [waterBill, setWaterBill] = useState("");
  const [paymentDay, setPaymentDay] = useState("");
  const [semester, setSemester] = useState("");
  const now = new Date();
  const year = now.getFullYear().toString();

  useEffect(() => {
    const getRooms = async () => {
      const res = await publicRequest.get("/rooms/");
      setRooms(res.data.rooms);
    };
    getRooms();
  }, []);

  // const handleDelete = async (id, roomId) => {
  //   // console.log(id, roomId);
  //   try {
  //     await userRequest.delete(`/registrations/${id}`, {
  //       data: { username: user.username, roomId },
  //     });
  //     // window.location.replace("/");
  //     alert("Đã xoá chỗ ở khỏi người dùng này");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleUtilityBill = async () => {
    const newUtilityBill = {
      roomId,
      month,
      electricityBill,
      waterBill,
      paymentDay,
      semester,
      year,
    };
    try {
      await userRequest.post("/utilitybills", newUtilityBill);
      // console.log(newUtilityBill)
      alert("Tạo đơn thành công");
    } catch (err) {
      console.log(err);
    }
  };

  // const handleUpdate = async (id) => {
  //   try {
  //     await userRequest.put(`/registrations/${id}`, {
  //       confirm: true,
  //       dateConfirm: new Date(),
  //     });
  //     alert("Đã xác nhận");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <div
      className="content read"
      style={{ marginBottom: "40px", minHeight: "50vh" }}
    >
      <h2>Tạo hoá đơn điện nước</h2>
      <table>
        <thead>
          <tr>
            <td># Mã phòng</td>
            <td>Tháng</td>
            <td>Tiền điện</td>
            <td>Tiền nước</td>
            <td>Ngày thanh toán</td>
            <td>Học kỳ</td>
            {user?.isAdmin && <td>Tạo hoá đơn</td>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="# Mã phòng">
              <span>
                <select
                  onChange={(e) => {
                    setRoomId(e.target.value);
                  }}
                >
                  <option style={{ display: "none" }}>Chọn phòng</option>
                  {rooms &&
                    rooms.map((room) => (
                      <option
                        key={room._id}
                        style={{ color: "black" }}
                        value={room.name}
                      >
                        {room.name}
                      </option>
                    ))}
                </select>
              </span>
            </td>
            <td data-label="Tháng">
              <span>
                <input
                  style={{
                    width: "110px",
                  }}
                  type="text"
                  placeholder="Nhập tháng"
                  onChange={(e) => setMonth(e.target.value)}
                />
              </span>
            </td>
            <td data-label="Tiền điện">
              <span>
                <input
                  style={{
                    width: "110px",
                  }}
                  type="text"
                  placeholder="Tiền điện"
                  onChange={(e) => setElectricityBill(e.target.value)}
                />
              </span>
            </td>
            <td data-label="Tiền nước">
              <span>
                <input
                  style={{
                    width: "110px",
                  }}
                  type="text"
                  placeholder="Tiền nước"
                  onChange={(e) => setWaterBill(e.target.value)}
                />
              </span>
            </td>
            <td data-label="Ngày thanh toán">
              <span>
                <input
                  type="date"
                  onChange={(e) => setPaymentDay(e.target.value)}
                />
              </span>
            </td>
            <td data-label="Học kỳ">
              <span>
                <select
                  onChange={(e) => {
                    setSemester(e.target.value);
                  }}
                >
                  <option style={{ display: "none" }}>Chọn học kỳ</option>
                  <option style={{ color: "black" }} value="1">
                    Học kỳ 1
                  </option>
                  <option style={{ color: "black" }} value="2">
                    Học kỳ 2
                  </option>
                  <option style={{ color: "black" }} value="3">
                    Học kỳ 3
                  </option>
                </select>
              </span>
            </td>
            {user?.isAdmin && (
              <td data-label="Tạo hoá đơn">
                <span>
                  <button
                    className="create-contact"
                    onClick={handleUtilityBill}
                  >
                    Tạo hoá đơn
                  </button>
                </span>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CreateUtilityBill;
