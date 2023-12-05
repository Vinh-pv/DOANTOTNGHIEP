// import { useLocation } from "react-router-dom";
import useSWR from "swr";
import Loading from "../../components/loading/Loading";
// import EmptyResults from "../../components/emptyResults/EmptyResults";
import { domainApi } from "../../requestMethods";
import { userRequest, publicRequest } from "../../requestMethods";
import { Context } from "../../context/Context";
import { useContext, useEffect, useState } from "react";
// dayjs
import dayjs from "dayjs";
import "dayjs/locale/vi";
import EmptyResults from "../../components/emptyResults/EmptyResults";
dayjs.locale("vi");
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const UtilityBill = () => {
  const { user } = useContext(Context);
  // const { pathname } = useLocation();
  // const path = pathname.split("/")[2];
  // console.log(semester, startTime, startEnd, year);
  const [roomRegistration, setRoomRegistration] = useState();
  console.log(roomRegistration?.roomId);

  useEffect(() => {
    const getRoomRegistration = async () => {
      const res = await publicRequest.get(`/registrations/${user.username}`);
      setRoomRegistration({...res.data[0]});
    };
    getRoomRegistration();
  }, [user.username]);

  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(`${domainApi}/utilityBills`, fetcher);
  if (error) return <div className="error">Failed to load</div>;

  let utilityBills = [];
  if (user?.isAdmin) {
    utilityBills = data?.utilityBills
  } else {
    utilityBills = data?.utilityBills.filter((e) => e.roomId === roomRegistration?.roomId);
  }
  // console.log(utilityBills);
  // const page = data?.page;
  // const totalPages = data?.total_pages;
  // console.log(data);
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

  // const handleRegistration = async (registrationId, price, categories) => {
  //   const newRegistration = {
  //     registrationId: registrationId,
  //     username: user.username,
  //     price: price,
  //     categories: categories,
  //   };
  //   try {
  //     await userRequest.post("/registrations", newRegistration);
  //     alert("Đăng ký thành công");
  //     // console.log(newRegistration);
  //     // window.location.href="/";
  //   } catch (err) {
  //     console.log(err);
  //     alert(
  //       "Đăng ký không thành công do bạn đã đăng ký trước đó hoặc phòng hết chỗ!"
  //     );
  //   }
  // };

  const handleUpdate = async (id) => {
    try {
      await userRequest.put(`/utilitybills/${id}`, {
        status: true,
        dateConfirm: new Date(),
      });
      alert("Đã xác nhận");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {data ? (
        utilityBills?.length > 0 ? (
          <>
            <div
              className="content read"
              style={{ marginBottom: "40px", minHeight: "50vh" }}
            >
              <h2>Thông tin điện nước</h2>
              <table>
                <thead>
                  <tr>
                    <td># Mã phòng</td>
                    <td>Tháng</td>
                    <td>Tiền điện</td>
                    <td>Tiền nước</td>
                    <td>Ngày thanh toán</td>
                    <td>Học kỳ</td>
                    <td>Năm học</td>
                    <td>Trạng thái</td>
                    {user?.isAdmin && <td>Xác nhận</td>}
                  </tr>
                </thead>
                <tbody>
                  {utilityBills.map((item) => (
                    <tr key={item._id}>
                      <td data-label="# Mã phòng">
                        <span>{item.roomId}</span>
                      </td>
                      <td data-label="Tháng">
                        <span>{item.month}</span>
                      </td>
                      <td data-label="Tiền điện">
                        <span>
                          {item.electricityBill
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                      </td>
                      <td data-label="Tiền nước">
                        <span>
                          {item.waterBill
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                      </td>
                      <td data-label="Ngày thanh toán">
                        <span>{dayjs(item.paymentDay).format("LL")}</span>
                      </td>
                      <td data-label="Học kỳ">
                        <span>{item.semester}</span>
                      </td>
                      <td data-label="Năm học">
                        <span>{item.year}</span>
                      </td>
                      <td data-label="Trạng thái">
                        <span>
                          {item.status === true
                            ? "Đã xác nhận ✅"
                            : "Chưa xác nhận"}
                        </span>
                        {item?.dateConfirm &&
                          dayjs(item?.dateConfirm).format("LL")}
                      </td>
                      {user?.isAdmin && (
                        <td data-label="Xác nhận">
                          <span>
                            {item.status === true && (
                              <button
                                className="create-contact"
                                style={{
                                  backgroundColor: "#868686",
                                  cursor: "default",
                                }}
                              >
                                Xác nhận
                              </button>
                            )}
                            {item.status === false && (
                              <button
                                className="create-contact"
                                onClick={() => handleUpdate(item._id)}
                              >
                                Xác nhận
                              </button>
                            )}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyResults />
        )
      ) : (
        <Loading />
      )}
    </>
  );
};

export default UtilityBill;
