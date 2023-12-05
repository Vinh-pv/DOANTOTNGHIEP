import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./singlePost.scss";
import axios from "axios";
import { Context } from "../../context/Context";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import Loading from "../loading/Loading";
import Tabs from "../tabs/Tabs";
import Advertisement from "../advertisement/Advertisement";
import IconNews from '../../assets/icons-base/news.svg';
import ImgAds from "../../assets/images/advertisement2.jpg";
// import { SvgPicture } from "../svgs/SvgPicture";
import { publicRequest, userRequest } from "../../requestMethods";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LazyLoad from "react-lazyload";
import { FileUploader } from "react-drag-drop-files";
// dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { SvgDelete } from "../svgs/SvgDelete";
import Spinner from "../spinner/Spinner";
dayjs.locale('vi');
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

export default function SinglePost() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState(false);
  const { user } = useContext(Context);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [photo, setPhoto] = useState("");
  const [thumbs, setThumbs] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [photosDelete, setPhotosDelete] = useState([]);
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  // cats lấy từ mongodb cho select option
  const [cats, setCats] = useState([]);
  const [updateMode, setUpdateMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  // console.log(objectUrl);
  const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "jfif"];

  // CKEditor
  const editorConfiguration = {
    mediaEmbed: {previewsInData: true}
  };

  // blob images selected
  const handleFiles = (e) => {
    setFiles([...files, ...e]);
    const blob = [...e].map((file) => URL.createObjectURL(file));
    setThumbs([...thumbs, ...blob]);
  }
  // files.length > 0 && console.log(files);
  // files.length > 0 && console.log(thumbs);
  // console.log(photos);
  // console.log(photosDelete);

  // delete selected image
  const handleDeleteSelectedImage = (index) => {
    setFiles((files.filter((_, i) => i !== index)))
    setThumbs((thumbs.filter((_, i) => i !== index)))
    URL.revokeObjectURL(thumbs[index])
  }

  // delete photos
  const handleDeletePhotos = (img) => {
    setPhotos((photos.filter((photo) => photo !== img)))
    // setPhotosDelete((prev) => prev.concat(photos.filter((photo) => photo === img)))
    setPhotosDelete([...photosDelete, ...photos.filter((photo) => photo === img)])
  }

  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      const res = await publicRequest.get(`/rooms/${path}`);
      document.title = `Phòng ${res.data.name} - Ký túc xá`;
      setPost(res.data);
      setName(res.data.name);
      setPhotos(res.data.photos);
      setDesc(res.data.desc);
      setCategories(res.data.categories);
      setPhotos(res.data.photos);
      setLoading(false);
      setPhoto(null);
      const timer = setTimeout(() => {
        setPhoto(res.data.photo);
      }, 200);
      return () => clearTimeout(timer);
    };
    getPost();
  }, [path]);
  
  useEffect(() => {
    const getCats = async () => {
      const res = await publicRequest.get("/categories/");
      setCats(res.data);
    };
    getCats();
  }, []);


  const handleDelete = async () => {
    try {
      await userRequest.delete(`/posts/${post._id}`, {
        data: { username: user.username },
      });
      window.location.replace("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    setIsUploading(true);
    const newPost = {
      username: user.username,
      name,
      desc,
      categories,
      photosDelete
    };

    if (files) {
      try {
        const list = await Promise.all(
          Object.values(files).map(async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "folder_posts");
            const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dp5a2zjnz/image/upload", data);
            const { secure_url, public_id } = uploadRes.data;
            // newPost.photo = secure_url;
            return {
              src: secure_url,
              public_id: public_id,
            };
          })
        );
        console.log([...photos, ...list]);

        try {
          newPost.photos = [...photos, ...list];
          await userRequest.put(`/posts/${post._id}`, newPost);
          // setUpdateMode(false);
          setIsUploading(false);
          // window.scrollTo({ top: 0 });
          window.location.reload();
        } catch (err) {
          setError(true);
          setIsUploading(false);
          setTimeout(() => {
            setError(false);
          }, 2000);
        }

      } catch (err) {
        console.log(err)
      }
    }
  };

  const shimmer = (w, h) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#ebebeb" offset="20%" />
          <stop stop-color="#f5f5f5" offset="50%" />
          <stop stop-color="#ebebeb" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#ebebeb" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;
  const toBase64 = (str) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="singlePost">
          <div className="singlePost__wrapper">
            <div className="singlePost__heading">
              {updateMode ? (
                <>
                  <select onChange={(e) => {
                    setCategories([e.target.value]);
                    setCategory([e.target.value]);
                    }}>
                    <option style={{ display: "none" }}>Chọn thể loại</option>
                    {cats.map((item) => (
                      <option key={item._id} value={item.cat}>{item.name}</option>
                    ))}
                  </select>
                  
                  {category[0] === "economy" && (
                    <select onChange={(e) => setCategories([...category, e.target.value])}>
                      <option style={{ display: "none" }}>Danh mục phụ</option>
                      <option value="innovation">Sự đổi mới</option>
                      <option value="tourism">Du lịch</option>
                    </select>
                  )}

                  {category[0] === "society" && (
                    <select onChange={(e) => setCategories([...category, e.target.value])}>
                      <option style={{ display: "none" }}>Danh mục phụ</option>
                      <option value="civil-protection">Bảo Vệ công dân</option>
                      <option value="education">Giáo dục</option>
                      <option value="housing">Nhà ở</option>
                      <option value="urban-planning">Quy hoạch đô thị</option>
                    </select>
                  )}
                </>
              ) : (
                <div>
                  {categories.map((c, index) => {
                      let cat;
                      if (c === "innovation" || c === "tourism") {
                        cat = "economy";
                      } else if (c === "civil-protection" || c === "education" || c === "housing" || c === "urban-planning") {
                        cat = "society";
                      } else {
                        cat = null;
                      }
                      if (cat) {
                        return (
                          <Link key={index} to={`/articles/category/${cat}/${c}`} className="singlePost__tag">
                            <span>
                              {[
                                c === "economy" ? "Kinh tế" :
                                  c === "innovation" ? "Sự đổi mới" :
                                  c === "tourism" ? "Du lịch" :
                                c === "culture" ? "Văn hoá" :
                                c === "politics" ? "Chính trị" :
                                c === "society" ? "Xã hội" :
                                  c === "civil-protection" ? "Bảo vệ công dân" :
                                  c === "education" ? "Giáo dục" :
                                  c === "housing" ? "Nhà ở" :
                                  c === "urban-planning" ? "Quy hoạch đô thị" :
                                c === "mobility" ? "Tính di động" :
                                c === "environment" ? "Môi trường" :
                                c === "sports" ? "Thể thao" : "",
                              ]}
                            </span>
                          </Link>
                        );
                      } else {
                        return (
                          <Link key={index} to={`/articles/category/${c}`} className="singlePost__tag">
                            <span>
                              {[
                                c === "economy" ? "Kinh tế" :
                                c === "culture" ? "Văn hoá" :
                                c === "politics" ? "Chính trị" :
                                c === "society" ? "Xã hội" :
                                c === "mobility" ? "Tính di động" :
                                c === "environment" ? "Môi trường" :
                                c === "sports" ? "Thể thao" : "",
                              ]}
                            </span>
                          </Link>
                        );
                      }
                    })
                  }
                </div>
              )}
              {updateMode ? (
                <input
                  className="singlePost__mainTitle update"
                  type="text"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <h1 className="singlePost__mainTitle">
                  {name}
                </h1>
              )}
              <ul className="singlePost__info">
                <li className="singlePost__date">{dayjs(post.createdAt).format('LL')}</li>
                <li className="singlePost__author">
                  <b>Logo.</b>
                </li>
                <li className="singlePost__type">
                  <img src={IconNews} alt="" />
                  <b>Tin tức</b>
                </li>
              </ul>
            </div>
            <div className="singlePost__container">
              <div className="singlePost__leftContent">
                {updateMode ? (
                  <>
                    <div className="singlePost__imageWrapper">
                      {thumbs && (
                        thumbs.map((thumb, index) => (
                          <figure key={index} className="singlePost__thumb">
                            <img src={thumb} alt="" />
                            <span className="singlePost__iconDelete"
                              onClick={() => handleDeleteSelectedImage(index)}
                            >
                              <SvgDelete color="#d63232" />
                            </span>
                          </figure>
                        ))
                      )}
                    </div>
                    <FileUploader id="fileInput"
                      classes="drop_area"
                      type="file"
                      label= "Tải lên hoặc thả tệp ngay tại đây"
                      name="file"
                      multiple
                      hoverTitle="Thả ở đây"
                      types={fileTypes}
                      handleChange={(e) => handleFiles(e)} 
                    />

                    {post.photo && (
                      <figure className="singlePost__image">
                        <LazyLoadImage
                          src={photo}
                          alt={post.title}
                          effect="blur"
                          placeholderSrc={ post.base64 || post.base64 || `data:image/svg+xml;base64,${toBase64(shimmer(32, 32))}`}
                        />
                      </figure>
                    )}
                    {photos && 
                      <>
                        {photos.map((img) => {
                          return (
                            <LazyLoad
                              key={img._id}
                              placeholder={<div className="placeholder" style={{ backgroundImage: `url(${img.base64})` }}></div>}
                              once={true}
                              height={500}
                              offset={-100}
                              debounce={150}
                            >
                            <figure className="singlePost__image">
                              <LazyLoadImage
                                src={img.src || photo}
                                alt={post.title}
                                effect="blur"
                                placeholderSrc={ img.base64 || post.base64 || `data:image/svg+xml;base64,${toBase64(shimmer(32, 32))}`}
                              />
                              
                              <span className="singlePost__iconDelete"
                                style={{ width: "40px", height: "40px" }}
                                onClick={() => handleDeletePhotos(img)}
                              >
                                <SvgDelete color="#d63232" />
                              </span>
                              </figure>
                          </LazyLoad>
                          )
                        })}
                      </>
                    }
                  </>
                ) : post.photo ? (
                  <>
                    <figure className="singlePost__image">
                    <LazyLoadImage
                      src={photo}
                      alt={post.title}
                      effect="blur"
                      placeholderSrc={ post.base64 || post.base64 || `data:image/svg+xml;base64,${toBase64(shimmer(32, 32))}`}
                    />
                    </figure>
                  </>
                  
                ) : (
                  <>
                  {photos.map((img) => {
                    return (
                      <LazyLoad
                        key={img._id}
                        placeholder={<div className="placeholder" style={{ backgroundImage: `url(${img.base64})` }}></div>}
                        once={true}
                        height={500}
                        offset={-100}
                        debounce={150}
                      >
                      <figure className="singlePost__image">
                        <LazyLoadImage
                          src={img.src || photo}
                          alt={post.title}
                          effect="blur"
                          placeholderSrc={ img.base64 || post.base64 || `data:image/svg+xml;base64,${toBase64(shimmer(32, 32))}`}
                        />
                        </figure>
                    </LazyLoad>
                    )
                  })}
                </>
                )}
                {updateMode ? (
                  <div className="singlePost__header">
                    <div className="singlePost__edit">
                      <i
                        className="singlePost__icon cancle"
                        onClick={() => setUpdateMode(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="none"
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          className="icon icon-tabler icon-tabler-x"
                          viewBox="0 0 24 24"
                        >
                          <path stroke="none" d="M0 0h24v24H0z"></path>
                          <path d="M18 6L6 18"></path>
                          <path d="M6 6L18 18"></path>
                        </svg>
                      </i>
                    </div>
                  </div>
                ) : (
                  <div className="singlePost__header">
                    {post.username === user?.username && (
                      <div className="singlePost__edit">
                        <i
                          className="singlePost__icon edit"
                          onClick={() => setUpdateMode(true)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="none"
                            stroke="#FFF"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path stroke="none" d="M0 0h24v24H0z"></path>
                            <path d="M4 20h4L18.5 9.5a1.5 1.5 0 00-4-4L4 16v4"></path>
                            <path d="M13.5 6.5L17.5 10.5"></path>
                          </svg>
                        </i>
                        <i
                          className="singlePost__icon delete"
                          onClick={handleDelete}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="none"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path stroke="none" d="M0 0h24v24H0z"></path>
                            <path d="M4 7L20 7"></path>
                            <path d="M10 11L10 17"></path>
                            <path d="M14 11L14 17"></path>
                            <path d="M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"></path>
                          </svg>
                        </i>
                      </div>
                    )}
                  </div>
                )}
                <div className="singlePost__text">
                  {updateMode ? (
                    <CKEditor 
                      editor={ ClassicEditor }
                      config={ editorConfiguration }
                      className="singlePost__descriptionInput"
                      data={desc}
                      onChange={( event, editor ) => {
                        setDesc(editor.getData());
                        // console.log( { event, editor } );
                      }}
                    />
                  ) : (
                    <p className="singlePost__description" dangerouslySetInnerHTML={{__html: desc}}></p>
                  )}
                  {updateMode && (
                    <button className="singlePost__updateBtn" onClick={handleUpdate}>
                      {isUploading ? <Spinner /> : "Cập nhật"}
                    </button>
                  )}
                  {error && (
                    <div style={{ color: "red" }}>Vui lòng đổi tiêu đề khác</div>
                  )}
                  <canvas style={{ display: "none" }} id="canvas" width="32" height="32"></canvas>
                </div>
              </div>
              <div className="singlePost__rightContent">
                <Tabs />
                <Advertisement photo={ImgAds} placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAEAsMDgwKEA4NDhIREBMYKBoYFhYYMSMlHSg6Mz08OTM4N0BIXE5ARFdFNzhQbVFXX2JnaGc+TXF5cGR4XGVnY//bAEMBERISGBUYLxoaL2NCOEJjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY//AABEIACAAGAMBIgACEQEDEQH/xAAZAAACAwEAAAAAAAAAAAAAAAAABQMEBgL/xAAoEAACAQMCBAYDAAAAAAAAAAABAgMAERIEIQUiMVEGE0FhgcEUcaH/xAAWAQEBAQAAAAAAAAAAAAAAAAABAAL/xAAYEQADAQEAAAAAAAAAAAAAAAAAARECIf/aAAwDAQACEQMRAD8A1hmje74bgXDE9t6VaCWVlnVmwVHNrrYi5y+OvarmjjeMsS+WQI5j7UuBlSXiZVoxIoXAubKCFvc79N6xisYE0Zi4kksZ5XYG9u+1FSSBI/xlEhlKyC7kDck3+6K3AZNE/ltHEwcSb3B29Pek/iDgmr4nqopNOkYscTdgLDuf1WneGHUhPNXLA5qbkWNiPs0p4o76WaFdMJHMjEdOVdtrkdBf136fNWG8ujE0ctA0CxJigeKzYqbrceg26UVZg007wRSzYvMUXO23NYX/ALRU33gQ/9k=" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
