import { useLocation } from "react-router-dom";
import useSWR from "swr";
import GridNews from "../../components/gridNews/GridNews"
import ContentList from "../../components/contentList/ContentList";
import Loading from "../../components/loading/Loading";
import EmptyResults from "../../components/emptyResults/EmptyResults";
import { domainApi } from "../../requestMethods";

const Articles = () => {
  const { search, pathname } = useLocation();
  const cat = pathname.split("/")[3];
  const subCat = pathname.split("/")[4];
  const pagePath = search.split("=")[1] || 1;
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(subCat ? `${domainApi}/posts?cat=${subCat}&page=${pagePath}&num_results_on_page=10` : cat ? `${domainApi}/posts?cat=${cat}&page=${pagePath}&num_results_on_page=10` : search ? `${domainApi}/posts${search}&num_results_on_page=10` : `${domainApi}/posts?num_results_on_page=10`, fetcher);
  if (error) return <div className="error">Failed to load</div>;

  const posts = data?.posts;
  const page = data?.page;
  const totalPages = data?.total_pages;
  
  return (
    <div className="articles" style={{ minHeight: "100vh" }}>
      {data ? (
        posts.length > 0 ? (
        <>
          <GridNews posts={posts} cat={cat} subCat={subCat} articles={true} page={page} />
          <ContentList posts={posts} totalPages={totalPages} page={page} />
        </>
        ) : (
          <EmptyResults />
        )
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Articles