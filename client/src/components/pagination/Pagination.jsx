import React from "react";
import './pagination.scss';
import { Link, useLocation } from "react-router-dom";
import { SvgArrowRight } from "../svgs/SvgArrowRight";
import { SvgArrowLeft } from "../svgs/SvgArrowLeft";

const Pagination = ({ total_pages, page }) => {
  const handleBackTopTop = () => {
    window.scrollTo({ top: 0 });
  }
  const { pathname, search } = useLocation();
  let searchPath = search.split("&")[0];
  // console.log(searchPath);
  if (pathname === "/search") {
    return (
      <div className="pagination">
        {page === 1 && (<button className="pagination__arrowPrev disabled"><SvgArrowLeft color="#0f2f7f" /><p>Trang trước</p></button>)}
        {page > 1 && (<Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page - 1}`}><button className="pagination__arrowPrev"><SvgArrowLeft color="#0f2f7f" /><p>Trang trước</p></button></Link>)}
        <ul className="pagination__pageNumbers">
          {page > 3 && total_pages > 4 ? (
            <>
            <Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=1`}><li>1</li></Link>
            <li className="dots">...</li>
            </>
          ) : null}
    
          {page === total_pages && total_pages > 3 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page - 3}`}><li>{page - 3}</li></Link>
          ) : null}
          {page === total_pages && total_pages > 2 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page - 2}`}><li>{page - 2}</li></Link>
          ) : null}
          {page - 2 > 0 && page > 3 && page > total_pages-2 && page < total_pages ? (
            <Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page - 2}`}><li>{page - 2}</li></Link>
          ) : null}
          {page - 2 > 0 && page < 4 && total_pages > 3 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page - 2}`}><li>{page - 2}</li></Link>
          ) : null}
          {page - 1 > 0 && (<Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page - 1}`}><li>{page - 1}</li></Link>)}
          {/* active */}
          <Link className="active" onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page}`}><li>{page}</li></Link>
          {/* end active */}
    
          {page + 1 < total_pages+1 && (
            <Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page + 1}`}><li>{page + 1}</li></Link>
          )}
          {/* page != 3 only for total_pages = 5 */}
          {page + 2 < total_pages+1 && page > 2 && page > total_pages-3 && page !== 3 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page + 2}`}><li>{page + 2}</li></Link>
          ) : null}
          {page < 2 && total_pages > 2 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page + 2}`}><li>{page + 2}</li></Link>
          ) : null}
          {page === 1 && total_pages > 3 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page + 3}`}><li>{page + 3}</li></Link>
          ) : null}
          {page === 2 && total_pages > 3 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page + 2}`}><li>{page + 2}</li></Link>
          ) : null}
          
          {/* Only for total_pages = 5 */}
          {page === 3 && total_pages === 5 ? (
            <>
            <li className="dots">...</li>
            <Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${total_pages}`}><li>{total_pages}</li></Link>
            </>
          ) : null}
    
          {page < total_pages-2 && total_pages > 4 ? (
            <>
            <li className="dots">...</li>
            <Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${total_pages}`}><li>{total_pages}</li></Link>
            </>
          ) : null}
        </ul>
        {page < total_pages && (<Link onClick={handleBackTopTop} to={`${pathname}${searchPath}&page=${page + 1}`}><button className="pagination__arrowNext"><p>Trang tiếp theo</p><SvgArrowRight color="#0f2f7f" /></button></Link>)}
        {page === total_pages && (<button className="pagination__arrowNext disabled"><p>Trang tiếp theo</p><SvgArrowRight color="#0f2f7f" /></button>)}
      </div>
    );

  } else {
    return (
      <div className="pagination">
        {page === 1 && (<button className="pagination__arrowPrev disabled"><SvgArrowLeft color="#0f2f7f" /><p>Trang trước</p></button>)}
        {page > 1 && (<Link onClick={handleBackTopTop} to={`${pathname}?page=${page - 1}`}><button className="pagination__arrowPrev"><SvgArrowLeft color="#0f2f7f" /><p>Trang trước</p></button></Link>)}
        <ul className="pagination__pageNumbers">
          {page > 3 && total_pages > 4 ? (
            <>
            <Link onClick={handleBackTopTop} to={`${pathname}?page=1`}><li>1</li></Link>
            <li className="dots">...</li>
            </>
          ) : null}
  
          {page === total_pages && total_pages > 3 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}?page=${page - 3}`}><li>{page - 3}</li></Link>
          ) : null}
          {page === total_pages && total_pages > 2 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}?page=${page - 2}`}><li>{page - 2}</li></Link>
          ) : null}
          {page - 2 > 0 && page > 3 && page > total_pages-2 && page < total_pages ? (
            <Link onClick={handleBackTopTop} to={`${pathname}?page=${page - 2}`}><li>{page - 2}</li></Link>
          ) : null}
          {page - 2 > 0 && page < 4 && total_pages > 3 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}?page=${page - 2}`}><li>{page - 2}</li></Link>
          ) : null}
          {page - 1 > 0 && (<Link onClick={handleBackTopTop} to={`${pathname}?page=${page - 1}`}><li>{page - 1}</li></Link>)}
          {/* active */}
          <Link className="active" onClick={handleBackTopTop} to={`${pathname}?page=${page}`}><li>{page}</li></Link>
          {/* end active */}
  
          {page + 1 < total_pages+1 && (
            <Link onClick={handleBackTopTop} to={`${pathname}?page=${page + 1}`}><li>{page + 1}</li></Link>
          )}
          {/* page != 3 only for total_pages = 5 */}
          {page + 2 < total_pages+1 && page > 2 && page > total_pages-3 && page !== 3 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}?page=${page + 2}`}><li>{page + 2}</li></Link>
          ) : null}
          {page < 2 && total_pages > 2 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}?page=${page + 2}`}><li>{page + 2}</li></Link>
          ) : null}
          {page === 1 && total_pages > 3 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}?page=${page + 3}`}><li>{page + 3}</li></Link>
          ) : null}
          {page === 2 && total_pages > 3 ? (
            <Link onClick={handleBackTopTop} to={`${pathname}?page=${page + 2}`}><li>{page + 2}</li></Link>
          ) : null}
          
          {/* Only for total_pages = 5 */}
          {page === 3 && total_pages === 5 ? (
            <>
            <li className="dots">...</li>
            <Link onClick={handleBackTopTop} to={`${pathname}?page=${total_pages}`}><li>{total_pages}</li></Link>
            </>
          ) : null}
  
          {page < total_pages-2 && total_pages > 4 ? (
            <>
            <li className="dots">...</li>
            <Link onClick={handleBackTopTop} to={`${pathname}?page=${total_pages}`}><li>{total_pages}</li></Link>
            </>
          ) : null}
        </ul>
        {page < total_pages && (<Link onClick={handleBackTopTop} to={`${pathname}?page=${page + 1}`}><button className="pagination__arrowNext"><p>Trang tiếp theo</p><SvgArrowRight color="#0f2f7f" /></button></Link>)}
        {page === total_pages && (<button className="pagination__arrowNext disabled"><p>Trang tiếp theo</p><SvgArrowRight color="#0f2f7f" /></button>)}
      </div>
    );
  }
};

export default Pagination;