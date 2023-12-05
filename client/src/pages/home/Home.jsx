import { Link, useLocation } from "react-router-dom";
import useSWR from "swr";
import Loading from "../../components/loading/Loading";
// import GridNews from "../../components/gridNews/GridNews";
import Pagination from "../../components/pagination/Pagination";
import EmptyResults from "../../components/emptyResults/EmptyResults";
import { domainApi } from "../../requestMethods";
import { Context } from "../../context/Context";
import { useContext, useState } from "react";
import { userRequest } from "../../requestMethods";

const Home = () => {
  const { user } = useContext(Context);
  const { search, pathname } = useLocation();
  const cat = pathname.split("/")[3];
  const subCat = pathname.split("/")[4];
  const pagePath = search.split("=")[1] || 1;
  // new add
  const [semester, setSemester] = useState("");
  const [startTime, setStartTime] = useState("");
  const [startEnd, setStartEnd] = useState("");
  const now = new Date();
  const year = now.getFullYear().toString();
  // console.log(semester, startTime, startEnd, year);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(
    subCat
      ? `${domainApi}/rooms?cat=${subCat}&page=${pagePath}&num_results_on_page=3`
      : cat
      ? `${domainApi}/rooms?cat=${cat}&page=${pagePath}&num_results_on_page=3`
      : search
      ? `${domainApi}/rooms${search}&num_results_on_page=3`
      : `${domainApi}/rooms?num_results_on_page=3`,
    fetcher
  );
  if (error) return <div className="error">Failed to load</div>;

  const rooms = data?.rooms;
  const page = data?.page;
  const totalPages = data?.total_pages;
  // console.log(data);
  const handleDelete = async (id) => {
    try {
      await userRequest.delete(`/rooms/${id}`, {
        data: { username: user.username },
      });
      window.location.replace("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleRegistration = async (roomId, price, categories) => {
    const newRegistration = {
      roomId: roomId,
      username: user.username,
      price: price,
      categories: categories,
      semester,
      year,
      startTime,
      startEnd,
    };
    try {
      await userRequest.post("/registrations", newRegistration);
      alert("Đăng ký thành công");
      // console.log(newRegistration);
      // window.location.href="/";
    } catch (err) {
      console.log(err);
      alert(
        "Đăng ký không thành công do bạn đã đăng ký trước đó hoặc phòng hết chỗ!"
      );
    }
  };

  return (
    <>
      {data ? (
        rooms.length > 0 ? (
          <>
            <div className="content read">
              <h2>Xem Tình Trạng KTX</h2>
              {user?.isAdmin && (
              <Link to="/write" className="create-contact">
                Tạo phòng
              </Link>
              )}
              {!user?.isAdmin && (
              <Link to={`/registrations/${user?.username}`} className="create-contact">
                Lịch sử đăng ký
              </Link>
              )}
              <table>
                <thead>
                  <tr>
                    <td># Mã phòng</td>
                    <td>Hình ảnh</td>
                    <td>Giá phòng</td>
                    <td>Loại phòng</td>
                    <td>Sức chứa</td>
                    <td width={120}>Trạng thái</td>
                    <td>Đã ở</td>
                    <td>Còn trống</td>
                    <td>Mô tả</td>
                    {!user?.isAdmin && (
                      <>
                        <td>Học kỳ</td>
                        <td>Bất đầu</td>
                        <td>Kết thúc</td>
                        <td width={110}>Đăng ký</td>
                      </>
                    )}
                    {user?.isAdmin && <td></td>}
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room._id}>
                      <td data-label="# Mã phòng">
                        <span>{room.name}</span>
                      </td>
                      <td data-label="Hình ảnh">
                        <span>
                          <img
                            style={{ width: "100px" }}
                            src={room.photos[0]?.src}
                            alt="alt"
                          />
                        </span>
                      </td>
                      <td data-label="Giá phòng">
                        <span>
                          {room.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                          VNĐ
                        </span>
                      </td>
                      <td data-label="Loại phòng">
                        <span>{room.categories[0]}</span>
                      </td>
                      <td data-label="Sức chứa">
                        <span>{room.maxUser}</span>
                      </td>
                      <td data-label="Trạng thái">
                        <span>
                          {room?.used > 0 ? "Đang sử dụng" : "Chưa sử dụng"}
                        </span>
                      </td>
                      <td data-label="Đã ở">
                        <span>{room?.used}</span>
                      </td>
                      <td data-label="Còn trống">
                        <span>{room.maxUser - room?.used}</span>
                      </td>
                      <td data-label="Mô tả">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: room.desc.replace(/<[^>]+>/g, ""),
                          }}
                        ></span>
                      </td>
                      {!user?.isAdmin && (
                        <>
                          <td data-label="Học kỳ">
                            <span>
                              <select
                                onChange={(e) => {
                                  setSemester(e.target.value);
                                }}
                              >
                                <option style={{ display: "none" }}>
                                  Chọn học kỳ
                                </option>
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
                          <td data-label="Bất đầu">
                            <span>
                              <input
                                type="date"
                                onChange={(e) => setStartTime(e.target.value)}
                              />
                            </span>
                          </td>
                          <td data-label="Kết thúc">
                            <span>
                              <input
                                type="date"
                                onChange={(e) => setStartEnd(e.target.value)}
                              />
                            </span>
                          </td>
                          <td data-label="Đăng ký">
                            <span>
                              {room.maxUser - room?.used === 0 ? (
                                <button
                                  className="create-contact"
                                  style={{
                                    backgroundColor: "#868686",
                                    cursor: "default",
                                  }}
                                >
                                  Hết phòng
                                </button>
                              ) : (
                                <button
                                  className="create-contact"
                                  onClick={() =>
                                    handleRegistration(
                                      room.name,
                                      room.price,
                                      room.categories[0]
                                    )
                                  }
                                >
                                  Đăng ký
                                </button>
                              )}
                            </span>
                          </td>
                        </>
                      )}
                      {user?.isAdmin && (
                        <td className="actions">
                          <Link to={`/room/edit/${room.name}`} className="edit">
                            <i className="fas fa-pen fa-xs"></i>
                          </Link>
                          <div
                            className="trash"
                            onClick={() => handleDelete(room._id)}
                          >
                            <i className="fas fa-trash fa-xs"></i>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination page={page} total_pages={totalPages} />
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

export default Home;
