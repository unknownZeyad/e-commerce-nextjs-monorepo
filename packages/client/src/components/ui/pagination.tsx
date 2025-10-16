import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { memo, ReactNode } from 'react';
import { useURLParams } from '../../hooks/use-url-params';
import { Button } from './button';

function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useURLParams();
  if (!totalPages) return null;

  const currentPage = Number(searchParams.get('page')) || 1;
  const hasNext = totalPages > currentPage
  const hasPrev = currentPage > 1

  function next() {
    if (hasNext) searchParams.set('page', `${currentPage + 1}`);
  }

  function previous() {
    if (hasPrev) searchParams.set('page', `${currentPage - 1}`);
  }

  const showLeftSideBreaker = currentPage > 3;
  const showRightSideBreaker = currentPage < totalPages - 2;

  const leftBreakerTarget = Math.floor((1 + currentPage) / 2);
  const rightBreakerTarget = Math.floor((currentPage + totalPages) / 2);

  return (
    <div className="flex w-full dark:text-zinc-300 items-center justify-between">
      <div className="flex h-[30px] gap-2 w-fit items-center">
        <Button
          type="button"
          variant="secondary"
          disabled={!hasPrev}
          onClick={previous}
          className="pr-3 pl-2 h-full !py-0"
        >
          <HiChevronLeft className="text-2xl" />
          <span>Previous</span>
        </Button>

          
        <PageBtn totalPages={totalPages} targetPage={1}>{1}</PageBtn>

        {showLeftSideBreaker && (
          <PageBtn totalPages={totalPages} targetPage={leftBreakerTarget}>...</PageBtn>
        )}

        {currentPage > 2 && (
          <PageBtn totalPages={totalPages} targetPage={currentPage - 1}>
            {currentPage - 1}
          </PageBtn>
        )}

        {currentPage > 1 && currentPage < totalPages && (
          <PageBtn totalPages={totalPages} targetPage={currentPage}>
            {currentPage}
          </PageBtn>
        )}

        {currentPage < totalPages - 1 && (
          <PageBtn totalPages={totalPages} targetPage={currentPage + 1}>
            {currentPage + 1}
          </PageBtn>
        )}

        {showRightSideBreaker && (
          <PageBtn totalPages={totalPages} targetPage={rightBreakerTarget}>...</PageBtn>
        )}

        {totalPages > 1 && (
          <PageBtn totalPages={totalPages} targetPage={totalPages}>{totalPages}</PageBtn>
        )}

        <Button
          onClick={next}
          type="button"
          variant="secondary"
          className="pl-3 pr-2 h-full !py-0"
          disabled={!hasNext}
        >
          <span>Next</span>
          <HiChevronRight className="text-2xl" />
        </Button>
      </div>
    </div>
  );
}

export default (Pagination);

function PageBtn({ totalPages, targetPage, children }: {
  totalPages: number,
  targetPage: number,
  children: ReactNode
}) {
  const searchParams = useURLParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  
  function navigate() {
    const canNavigate =
      targetPage > 0 && targetPage <= totalPages && currentPage !== targetPage;
    if (canNavigate) searchParams.set('page', `${targetPage}`);
  }

  return (
    <Button 
      type="button" 
      size='sm'
      className='h-full'
      variant={currentPage === targetPage ? "default" : "secondary"}
      onClick={navigate}
    >
      {children}
    </Button>
  );
}
