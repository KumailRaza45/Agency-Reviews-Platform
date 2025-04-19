import { useEffect, useState } from "react";
import { usePagination } from "../../Context/PaginationContext";
import ArrowRight from "../../assets/Icons/ArrowRight.svg";
import ArrowLeft from "../../assets/Icons/arrow-left.svg";

const Pagination = ({ dataCount, type }) => {
  const { currentPage, setCurrentPage, itemsPerPage } = usePagination();

  const [perPageItemCount, setPerPageItemCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage === totalPages) {
      setCurrentPage(1);
    }
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (type === "for-leads") {
      setPerPageItemCount(5)
      setTotalPages(Math.ceil(dataCount / 5))
    }
    else {
      setPerPageItemCount(itemsPerPage)
      console.log(Math.ceil(dataCount / itemsPerPage), "Math.ceil(dataCount / itemsPerPage)");

      setTotalPages(Math.ceil((dataCount) / itemsPerPage))
    }
  }, [itemsPerPage, type, dataCount])

  return (
    <>
      {dataCount > 5 && (
        <div className="mx-[5%] xl:mx-auto max-w-[1216px] flex items-center justify-center mt-10">
          <nav aria-label="Page navigation" className="w-full">
            <ul className={`inline-flex -space-x-px text-base items-center h-10 flex-wrap justify-between sm:justify-center w-full`}>
              <li className={`${currentPage > 1 ? 'sm:flex' : 'sm:hidden'}`}>
              <button
                  onClick={handlePreviousPage} disabled={currentPage === 1}
                  className="gap-2 flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-grey-300 rounded-lg sm:rounded-none sm:rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <img src={ArrowLeft} className="w-5" alt="Arrow Left" />
                  <span className="hidden sm:block font-inter text-sm not-italic font-semibold">
                    Previous
                  </span>
                </button>
              </li>
              <li className="sm:hidden">Page {currentPage} of {totalPages}</li>
              {Array.from(
                { length: totalPages },
                (_, index) =>
                  (index < totalPages && (index < 3 || index > totalPages - 3)) && (
                    <>
                      <li
                        key={index}
                        className={`hidden sm:block page-item ${((currentPage === index + 1) || (currentPage > 3 && index === 2 && currentPage < totalPages - 1))
                          ? "bg-primaryColor text-whiteColor"
                          : ""
                          } ${(currentPage === 1 && index + 1 === 1) ? "rounded-l-lg" : ""}
                        ${(index + 1 === currentPage && currentPage === totalPages) ? "rounded-r-lg" : ""}
                        `}
                      >
                        <button
                          onClick={() => { if ((currentPage > 3 && index === 2 && currentPage < totalPages - 1)) { setCurrentPage(currentPage) } else { setCurrentPage(index + 1) } }}
                          //  gray-300
                          className={`flex items-center justify-center font-inter text-sm not-italic font-semibold px-4 h-10 leading-tight text-gray-500 bg-white border border-gray600 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${(currentPage === 1 && index + 1 === 1) ? "rounded-l-lg" : ""
                            } ${(index + 1 === currentPage && currentPage === totalPages) ? "rounded-r-lg" : ""} `}
                        >
                          {(currentPage > 3 && index === 2 && currentPage < totalPages - 1) ? currentPage : index + 1}
                        </button>
                      </li>

                      {
                        (totalPages > 3 && index > 1 && index < 3) &&
                        <li
                          key={index}
                          className={`hidden sm:block page-item ${(currentPage === 1 && index + 1 === 1) ? "rounded-l-lg" : ""}
                        ${(index + 1 === currentPage && currentPage === totalPages) ? "rounded-r-lg" : ""}
                        `}
                        >
                          <button
                            //  gray-300
                            className={`flex items-center justify-center font-inter text-sm not-italic font-semibold px-4 h-10 leading-tight text-gray-500 bg-white border border-gray600 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${(currentPage === 1 && index + 1 === 1) ? "rounded-l-lg" : ""
                              } ${(index + 1 === currentPage && currentPage === totalPages) ? "rounded-r-lg" : ""} `}
                          >
                            {"..."}
                          </button>
                        </li>
                      }
                    </>
                  )
              )}
              {
                currentPage < totalPages &&
                <li>
                  <button
                    onClick={handleNextPage}
                    //  gray-300
                    className="gap-2 flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray600 rounded-lg sm:rounded-none sm:rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="hidden sm:block font-inter text-sm not-italic font-semibold">
                      Next
                    </span>
                    <img src={ArrowRight} className="w-5" alt="Arrow Right" />
                  </button>
                </li>
              }

            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default Pagination;
