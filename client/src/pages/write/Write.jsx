import axios from "axios";
import "./write.scss";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { userRequest } from "../../requestMethods";
import { FileUploader } from "react-drag-drop-files";
import { SvgDelete } from "../../components/svgs/SvgDelete";
import Spinner from "../../components/spinner/Spinner";

const Write = () => {
  useEffect(() => {
    document.title = "Tạo phòng";
  }, []);

  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [maxUser, setMaxUser] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [thumbs, setThumbs] = useState([]);
  const { user } = useContext(Context);
  if (!user.isAdmin) {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.href="/";
  }
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  // console.log(base64);
  const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "jfif"];

  // CKEditor
  const editorConfiguration = {
    mediaEmbed: { previewsInData: true },
  };

  // blob images selected
  const handleFiles = (e) => {
    setFiles([...files, ...e]);
    const blob = [...e].map((file) => URL.createObjectURL(file));
    setThumbs([...thumbs, ...blob]);
  };

  // delete selected image
  const handleDeleteSelectedImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setThumbs(thumbs.filter((_, i) => i !== index));
    URL.revokeObjectURL(thumbs[index]);
  };

  const handleSubmit = async (e) => {
    setIsUploading(true);
    e.preventDefault();
    const newRoom = {
      username: user.username,
      name,
      desc,
      categories,
      price,
      maxUser,
    };
    console.log(newRoom);

    if (files) {
      try {
        const list = await Promise.all(
          Object.values(files).map(async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "folder_posts");
            const uploadRes = await axios.post(
              "https://api.cloudinary.com/v1_1/dp5a2zjnz/image/upload",
              data
            );
            const { secure_url, public_id } = uploadRes.data;
            // newPost.photo = secure_url;
            return {
              src: secure_url,
              public_id: public_id,
            };
          })
        );
        // console.log(list);
        try {
          newRoom.photos = list;
          // const res = await userRequest.post("/rooms", newRoom);
          await userRequest.post("/rooms", newRoom);
          setIsUploading(true);
          thumbs.map((thumb) => URL.revokeObjectURL(thumb));
          // navigate("/room/" + res.data.name);
          navigate("/");
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="write">
      <div className="write__wrapper">
        <form className="write__form" onSubmit={handleSubmit}>
          <div className="write__formGroup">
            <div className="write__formWrapper">
              Thêm Hình Ảnh
              <div className="write__imageWrapper">
                {thumbs &&
                  thumbs.map((thumb, index) => (
                    <figure key={index} className="write__thumb">
                      <img src={thumb} alt="" />
                      <span
                        className="write__iconDelete"
                        onClick={() => handleDeleteSelectedImage(index)}
                      >
                        <SvgDelete color="#d63232" />
                      </span>
                    </figure>
                  ))}
              </div>
              <FileUploader
                id="fileInput"
                classes="drop_area"
                type="file"
                label="Tải lên hoặc thả tệp ngay tại đây"
                name="file"
                multiple
                hoverTitle="Thả ở đây"
                types={fileTypes}
                handleChange={(e) => handleFiles(e)}
              />
            </div>
          </div>
          <div className="write__formGroup" style={{ marginBottom: "24px" }}>
            <input
              type="text"
              className="write__input"
              placeholder="Tên Phòng"
              autoFocus={true}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              className="write__input"
              style={{ fontSize: "16px" }}
              placeholder="Sức Chứa"
              onChange={(e) => setMaxUser(e.target.value)}
            />
            <input
              type="number"
              className="write__input"
              style={{ fontSize: "16px" }}
              placeholder="Giá Phòng"
              onChange={(e) => setPrice(e.target.value)}
            />
            <select
              onChange={(e) => {
                setCategories([e.target.value]);
              }}
            >
              <option style={{ display: "none" }}>Chọn loại phòng</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className="write__formGroup">
            <CKEditor
              editor={ClassicEditor}
              config={editorConfiguration}
              className="write__textarea"
              onChange={(event, editor) => {
                setDesc(editor.getData());
                // console.log( { event, editor, data } );
              }}
            />
          </div>
          <button className="write__submit" type="submit">
            {isUploading ? <Spinner color="white" /> : "Tạo phòng"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Write;
