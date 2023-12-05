import { useLocation } from "react-router-dom";
import useSWR from "swr";
import Loading from "../../components/loading/Loading";
// import GridNews from "../../components/gridNews/GridNews";
// import Pagination from "../../components/pagination/Pagination";
import EmptyResults from "../../components/emptyResults/EmptyResults";
import { domainApi } from "../../requestMethods";
import { userRequest } from "../../requestMethods";
import { Context } from "../../context/Context";
import { useContext } from "react";
// dayjs
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const Registrations = () => {
  const { user } = useContext(Context);
  const { pathname } = useLocation();
  const path = pathname.split("/")[2];
  // console.log(semester, startTime, startEnd, year);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(
    user?.isAdmin
      ? `${domainApi}/registrations/`
      : `${domainApi}/registrations/${path}`,
    fetcher
  );
  if (error) return <div className="error">Failed to load</div>;

  let registrations;
  if (user?.isAdmin) {
    registrations = data?.registrations;
  } else {
    registrations = data;
  }
  console.log(registrations);
  // const page = data?.page;
  // const totalPages = data?.total_pages;
  // console.log(data);
  const handleDelete = async (id, roomId) => {
    // console.log(id, roomId);
    try {
      await userRequest.delete(`/registrations/${id}`, {
        data: { username: user.username, roomId },
      });
      // window.location.replace("/");
      alert("Đã xoá chỗ ở khỏi người dùng này");
    } catch (err) {
      console.log(err);
    }
  };

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
      await userRequest.put(`/registrations/${id}`, {
        confirm: true,
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
        registrations.length > 0 ? (
          <>
            <div
              className="content read"
              style={{ marginBottom: "40px", minHeight: "50vh" }}
            >
              <h2>Xem Lịch Sử ở KTX</h2>
              <table>
                <thead>
                  <tr>
                    <td># Mã phòng</td>
                    <td>Người dùng</td>
                    <td>Giá phòng</td>
                    <td>Loại phòng</td>
                    <td>Ngày bất đầu</td>
                    <td>Ngày kết thúc</td>
                    <td>Học kỳ</td>
                    <td>Năm học</td>
                    <td>Trạng thái</td>
                    {user?.isAdmin && <td>Xác nhận</td>}
                    {user?.isAdmin && <td></td>}
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration._id}>
                      <td data-label="# Mã phòng">
                        <span>{registration.roomId}</span>
                      </td>
                      <td data-label="Người dùng">
                        <span>{registration.username}</span>
                      </td>
                      <td data-label="Giá phòng">
                        <span>
                          {registration.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                          VNĐ
                        </span>
                      </td>
                      <td data-label="Loại phòng">
                        <span>{registration.categories[0]}</span>
                      </td>
                      <td data-label="Ngày bất đầu">
                        <span>
                          {dayjs(registration.startTime).format("LL")}
                        </span>
                      </td>
                      <td data-label="Ngày kết thúc">
                        <span>{dayjs(registration.startEnd).format("LL")}</span>
                      </td>
                      <td data-label="Học kỳ">
                        <span>{registration.semester}</span>
                      </td>
                      <td data-label="Năm học">
                        <span>{registration.year}</span>
                      </td>
                      <td data-label="Trạng thái">
                        <span>
                          {registration.confirm === true
                            ? "Đã xác nhận ✅"
                            : "Chưa xác nhận"}
                        </span>
                        {registration?.dateConfirm &&
                          dayjs(registration?.dateConfirm).format("LL")}
                      </td>
                      {user?.isAdmin && (
                        <td data-label="Xác nhận">
                          <span>
                            {registration.confirm === true && (
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
                            {registration.confirm === false && (
                              <button
                                className="create-contact"
                                onClick={() => handleUpdate(registration._id)}
                              >
                                Xác nhận
                              </button>
                            )}
                          </span>
                        </td>
                      )}
                      {user?.isAdmin && (
                        <td className="actions">
                          <div
                            className="trash"
                            onClick={() => handleDelete(registration._id, registration.roomId)}
                          >
                            <i className="fas fa-trash fa-xs"></i>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <Pagination page={page} total_pages={totalPages} /> */}
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

export default Registrations;
