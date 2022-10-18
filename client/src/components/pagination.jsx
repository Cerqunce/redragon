export default function Pagination({ postsPerPage, totalPosts, paginate }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  //   return (
  //     <nav>
  //       <ul className="pagination">
  //         {pageNumbers.map((number) => (
  //           <li key={number} className="page-item">
  //             <a onClick={() => paginate(number)} href="!#" className="page-link">
  //               {number}
  //             </a>
  //           </li>
  //         ))}
  //       </ul>
  //     </nav>
  //   );
  return (
    <div className="row">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="pagination-wrap">
              <ul>
                <li>
                  <a href="/">Prev</a>
                </li>
                <li>
                  <a href="/">1</a>
                </li>
                <li>
                  <a className="active" href="/">
                    2
                  </a>
                </li>
                <li>
                  <a href="/">3</a>
                </li>
                <li>
                  <a href="/">Next</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
