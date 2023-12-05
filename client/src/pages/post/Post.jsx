import "./post.scss";
import SinglePost from "../../components/singlePost/SinglePost";
import RelatedPages from "../../components/relatedPages/RelatedPages";

const Post = () => {
  return (
    <div className="post">
      <SinglePost />
      <RelatedPages />
    </div>
  );
};

export default Post;
