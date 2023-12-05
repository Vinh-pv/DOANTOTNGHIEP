import { useEffect, useState } from 'react';
import Posts from '../../components/posts/Posts';
import Sidebar from '../../components/sidebar/Sidebar';
import './home.scss';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import Paginationv2 from '../../components/paginationv2/Paginationv2';
// import Pagination from '../../components/pagination/Pagination';

export default function HomeUseEffect() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const { search } = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => { 
      setIsLoading(true);
      const res = await axios.get("/posts" + search);
      setPosts(res.data.posts);
      setPage(res.data.page);
      setTotalPages(res.data.total_pages);
      console.log(res.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 400);
    }
    fetchPosts();
  }, [search]);
  return (
    <>
      <div className="home">
        <Posts isLoading={isLoading} posts={posts} />
        <Sidebar />
      </div>
      {totalPages > 0 && <Paginationv2 total_pages={totalPages} page={page} />}
      {/* {totalPages > 0 && <Pagination total_pages={totalPages} page={page} />} */}
    </>
  )
}
