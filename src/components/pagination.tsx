"use client"

import { useEffect, useState } from 'react';
import { useFilter } from "../context/FilterProvider";

interface PaginationProps {
  pageSize: number,
  itemSize?: number
}

const Pagination = ({ pageSize, itemSize = 0 }: PaginationProps) => {
  const { page, setPage } = useFilter();
  const totalPage = Math.ceil(itemSize / pageSize); 
  const currentPage = Math.min(Math.max(page, 1), totalPage);

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
   * 
   */
  // const getPaginationRange = () => {
  //   const range: (string | number)[] = [];
  //   const siblingCount = 2;
  //   const totalPageNumbers = siblingCount * 2 + 5;

  //   if (totalPage <= totalPageNumbers) {
  //     // If the total pages are less than the pagination numbers, show all pages
  //     for (let i = 1; i <= totalPage; i++) {
  //       range.push(i);
  //     }
  //   } else {
  //     const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  //     const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPage);

  //     const showLeftEllipsis = leftSiblingIndex > 2;
  //     const showRightEllipsis = rightSiblingIndex < totalPage - 1;

  //     range.push(1);

  //     // if (showLeftEllipsis) {
  //     //   range.push('...');
  //     // }
  // };

  return (<>
    <div className="flex justify-between items-center w-[85%] mx-auto mt-3">
      <button
        className={`${currentPage > 1 ? 'text-secondary' : 'text-disableText cursor-text'} font-tangerineBold text-2xl`}
        onClick={currentPage > 1 ? handlePrevPage : () => {}}
        aria-label="Previous Page"
      >
        Previous
      </button>

      {/* Pages */}
      <div className="flex justify-between items-center gap-x-5">
        {totalPage > 7 ? (
          <>

          </>
        ) : (
          Array.from({ length: totalPage}, (_, i) => (
            <button
              key={i}
              className={`${page == i + 1 ? 'font-tangerineBold scale-150 text-secondary' : 'font-tangerine'} text-2xl text-primary`}
              onClick={() => setPage(i + 1)}
            >
                {i + 1}
            </button>
          ))
        )}
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