import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { memo, ReactNode } from 'react';
import { useURLParams } from '../../hooks/use-url-params';

type TPaginationInfos = {
  current: number;
  pages: number;
  has_next: boolean;
  has_previous: boolean;
};

const pageSize = 10;

const LABELS = {
  en: {
    showing: 'Showing',
    to: 'to',
    of: 'of',
    results: 'results',
    prev: 'Previous',
    next: 'Next',
  },
  ar: {
    showing: 'عرض',
    to: 'إلى',
    of: 'من',
    results: 'نتيجة',
    prev: 'السابق',
    next: 'التالي',
  },
} as const;

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

  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  return (
    <div className="flex w-full dark:text-zinc-300 items-center justify-between">
      <p className="ml-[0.8rem] text-[1.4rem]">
        S{' '}
        <span className="font-[600]">{pages > 1 ? start : 1}</span> {labels.to}{' '}
        <span className="font-[600]">{end}</span>{' '}
        {total && (
          <>
            {labels.of} <span className="font-[600]">{total}</span> {labels.results}
          </>
        )}
      </p>

      <div className="flex gap-2 w-fit items-center">
        <Button
          type="button"
          variant="pagination"
          disabled={!has_previous}
          onClick={previous}
          className="pr-[1.2rem] pl-[0.6rem]"
        >
          <HiChevronLeft className="h-[1.8rem] w-[1.8rem]" />
          <span>{labels.prev}</span>
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
          variant="pagination"
          className="pl-[1.2rem] pr-[0.6rem]"
          disabled={!has_next}
        >
          <span>{labels.next}</span>
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
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  
  function navigate() {
    const canNavigate =
      targetPage > 0 && targetPage <= page.pages && currentPage !== targetPage;
    if (canNavigate) searchParams.set('page', `${targetPage}`);
  }

  return (
    <Button 
      type="button" 
      variant="pagination" 
      active={currentPage === targetPage}
      onClick={navigate}
      className={(active) =>
        cn(
          active && 'bg-brand-600 text-white',
          'py-[0.6rem] min-w-[3.5rem] text-[1.4rem] px-[0.6rem]'
        )
      }
    >
      {children}
    </Button>
  );
}
