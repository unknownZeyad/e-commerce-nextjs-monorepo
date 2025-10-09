import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { memo, ReactNode } from 'react';
import { useURLParams } from '../../hooks/use-url-params';
import { Button } from './button';

type TPaginationInfos = {
  current: number;
  pages: number;
  has_next: boolean;
  has_previous: boolean;
};

function Pagination({ page, total }: { page: TPaginationInfos; total: number }) {
  const searchParams = useURLParams();
  if (!page) return null;

  const { current, pages, has_next, has_previous } = page;
  const currentPage = Number(searchParams.get('page')) || 1;

  function next() {
    if (has_next) searchParams.set('page', `${currentPage + 1}`);
  }

  function previous() {
    if (has_previous) searchParams.set('page', `${currentPage - 1}`);
  }

  const showLeftSideBreaker = currentPage > 3;
  const showRightSideBreaker = currentPage < pages - 2;

  const leftBreakerTarget = Math.floor((1 + currentPage) / 2);
  const rightBreakerTarget = Math.floor((currentPage + pages) / 2);

  return (
    <div className="flex w-full dark:text-zinc-300 items-center justify-between">
      <div className="flex gap-2 w-fit items-center">
        <Button
          type="button"
          variant="secondary"
          disabled={!has_previous}
          onClick={previous}
          className="pr-3 pl-2"
        >
          <HiChevronLeft className="h-[1.8rem] w-[1.8rem]" />
          <span>Previous</span>
        </Button>

          
        <PageBtn page={page} targetPage={1}>{1}</PageBtn>

        {showLeftSideBreaker && (
          <PageBtn page={page} targetPage={leftBreakerTarget}>...</PageBtn>
        )}

        {currentPage > 2 && (
          <PageBtn page={page} targetPage={currentPage - 1}>
            {currentPage - 1}
          </PageBtn>
        )}

        {currentPage > 1 && currentPage < pages && (
          <PageBtn page={page} targetPage={currentPage}>
            {currentPage}
          </PageBtn>
        )}

        {currentPage < pages - 1 && (
          <PageBtn page={page} targetPage={currentPage + 1}>
            {currentPage + 1}
          </PageBtn>
        )}

        {showRightSideBreaker && (
          <PageBtn page={page} targetPage={rightBreakerTarget}>...</PageBtn>
        )}

        {pages > 1 && (
          <PageBtn page={page} targetPage={pages}>{pages}</PageBtn>
        )}

        <Button
          onClick={next}
          type="button"
          variant="secondary"
          className="pl-3 pr-2"
          disabled={!has_next}
        >
          <span>Next</span>
          <HiChevronRight className="h-[1.8rem] w-[1.8rem]" />
        </Button>
      </div>
    </div>
  );
}

export default (Pagination);

function PageBtn({ page, targetPage, children }: {
  page: TPaginationInfos,
  targetPage: number,
  children: ReactNode
}) {
  const searchParams = useURLParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  
  function navigate() {
    const canNavigate =
      targetPage > 0 && targetPage <= page.pages && currentPage !== targetPage;
    if (canNavigate) searchParams.set('page', `${targetPage}`);
  }

  return (
    <Button 
      type="button" 
      size='sm'
      variant={currentPage === targetPage ? "default" : "secondary"}
      onClick={navigate}
    >
      {children}
    </Button>
  );
}
