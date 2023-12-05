// import { useLocation } from "react-router-dom";
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

const HistoryContacts = () => {
  const { user } = useContext(Context);
  // const { pathname } = useLocation();
  // const path = pathname.split("/")[2];
  // console.log(semester, startTime, startEnd, year);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(
    user?.isAdmin
      ? `${domainApi}/contacts/`
      : `${domainApi}/contacts/${user?.username}`,
    fetcher
  );
  if (error) return <div className="error">Failed to load</div>;

  let contacts;
  if (user?.isAdmin) {
    contacts = data?.contacts;
  } else {
    contacts = data;
  }
  console.log(data);
  // const page = data?.page;
  // const totalPages = data?.total_pages;
  // console.log(data);
  const handleDelete = async (id) => {
    // console.log(id, roomId);
    try {
      await userRequest.delete(`/contacts/${id}`, {
        data: { username: user.username },
      });
      // window.location.replace("/");
      alert("Đã xoá yêu cầu này");
    } catch (err) {
      console.log(err);
    }
  };

  // const handlecontact = async (contactId, price, categories) => {
  //   const newcontact = {
  //     contactId: contactId,
  //     username: user.username,
  //     price: price,
  //     categories: categories,
  //   };
  //   try {
  //     await userRequest.post("/contacts", newcontact);
  //     alert("Đăng ký thành công");
  //     // console.log(newcontact);
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
      await userRequest.put(`/contacts/${id}`, {
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
        contacts.length > 0 ? (
          <>
            <div
              className="content read historyContact"
              style={{ marginBottom: "40px", minHeight: "50vh" }}
            >
              <h2>Xem Phiếu Yêu Cầu</h2>
              <table>
                <thead>
                  <tr>
                    <td># Mã phòng</td>
                    <td>Tên</td>
                    <td>Số Phone</td>
                    <td>MSSV</td>
                    <td>Tiêu đề</td>
                    <td>Mô tả</td>
                    <td>Trạng thái</td>
                    {user?.isAdmin && <td>Xác nhận</td>}
                    {user?.isAdmin && <td></td>}
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td data-label="# Mã phòng">
                        <span>{contact.roomId}</span>
                      </td>
                      <td data-label="Tên">
                        <span>{contact.name}</span>
                      </td>
                      <td data-label="Số Phone">
                        <span>
                          {contact.phone}
                        </span>
                      </td>
                      <td data-label="MSSV">
                        <span>{contact.mssv}</span>
                      </td>
                      <td data-label="Tiêu đề">
                        <span>
                        {contact.title}
                        </span>
                      </td>
                      <td data-label="Mô tả">
                        <span>{contact.desc}</span>
                      </td>
                      <td data-label="Trạng thái">
                        <span>
                          {contact.confirm === true
                            ? "Đã xác nhận ✅"
                            : "Chưa xác nhận"}
                        </span>
                        {contact?.dateConfirm &&
                          dayjs(contact?.dateConfirm).format("LL")}
                      </td>
                      {user?.isAdmin && (
                        <td data-label="Xác nhận">
                          <span>
                            {contact.confirm === true && (
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
                            {contact.confirm === false && (
                              <button
                                className="create-contact"
                                onClick={() => handleUpdate(contact._id)}
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
                            onClick={() => handleDelete(contact._id)}
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

export default HistoryContacts;
