"use client"

import { useEffect, useState } from 'react';
import { useFilter } from "../context/FilterProvider";

interface PaginationProps {
  pageSize: number,
  itemSize?: number
}

const Pagination = ({ pageSize, itemSize = 0 }: PaginationProps) => {
  const { page, setPage } = useFilter();
  const [pageNums, setPageNums] = useState<(number | '...')[]>([]);

  const totalPage = Math.ceil(itemSize / pageSize); 
  const currentPage = Math.min(Math.max(page, 1), totalPage);

  useEffect(() => {
    const handleArrowKeyDown = (e: KeyboardEvent) => {
      if (e.key == 'ArrowRight') {
        handleNextPage()
      }

      if (e.key == 'ArrowLeft') {
        handlePrevPage();
      }
    };

    window.addEventListener('keydown', handleArrowKeyDown);
    return () => window.removeEventListener('keydown', handleArrowKeyDown);
  }, []);

  useEffect(() => {
    generatePageNumbers();
  }, [page, setPage]);

  /**
   * Handle switch to the next page
   */
  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setPage(currentPage + 1);
    }
  };

  /**
   * Handle switch to the previous page
   */
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  /**
   * Generate pagination numbers with ellipsis
   */
  const generatePageNumbers = () => {
    const pageNumbers: (number | '...')[] = [];

    if (totalPage <= 6) {
      // If total pages are 6 or less, show all pages
      for (let i = 1; i <= totalPage; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        // Show first 5 pages and ellipsis
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
      } else if (currentPage >= totalPage - 2) {
        // Show ellipsis and last 5 pages
        pageNumbers.push('...');
        for (let i = totalPage - 4; i <= totalPage; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show ellipsis, current-1, current, current+1, and ellipsis
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 2);
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push(currentPage + 2);
        pageNumbers.push('...');
      }
    }

    setPageNums(pageNumbers);
  };

  return (<>
    <div className="flex justify-between items-center w-full md:w-[85%] mx-auto mt-3 gap-x-3">
      <button
        className={`${currentPage > 1 ? 'text-secondary' : 'text-disableText cursor-text'} font-tangerineBold text-2xl`}
        onClick={currentPage > 1 ? handlePrevPage : () => {}}
        aria-label="Previous Page"
      >
        Previous
      </button>

      {/* Pages */}
      <div className="flex justify-between items-center gap-x-5">
        { pageNums.map((pageNum, i) => (
            pageNum !== '...' ? (
              <button
                key={i}
                className={`${page == Number(pageNum) ? 'font-tangerineBold scale-150 text-secondary' : 'font-tangerine'} text-2xl text-primary`}
                onClick={() => setPage(Number(pageNum))}
              >
                {pageNum}
              </button>
            ) : (
              <span key={i} className="font-tangerine text-primary text-3xl">...</span>
            )
        ))}
      </div>

      {/* Next */}
      <button
        className={`${currentPage < totalPage ? 'text-secondary' : 'text-disableText cursor-text'} font-tangerineBold text-2xl`}
        onClick={currentPage < totalPage ? handleNextPage : () => {}}
        aria-label="Next Page"
      >
        Next
      </button>
    </div>
  </>);
};

export default Pagination;