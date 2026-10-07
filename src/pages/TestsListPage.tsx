import { useEffect, useMemo, useState } from 'react';
import {
  useTable,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';
import { Check, X, Loader2, ChevronRight } from 'lucide-react';
import { useTests } from '../hooks/useTests';
import { type TestRecord } from '../types/test';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const renderStatusBadge = (status?: string) => {
  const normalizedStatus = status?.toLowerCase();

  switch (normalizedStatus) {
    case 'in-progress':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-brand-primary border border-brand-primary">
          In progress
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
          Completed
        </span>
      );
    case 'planned':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
          Planned
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
          Failed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-background-primary text-brand-secondary">
          {status || 'Unknown'}
        </span>
      );
  }
};

const PAGE_SIZE = 10;
const columnHelper = createColumnHelper<{}, TestRecord>();

export const TestsListPage = () => {
  const { data: tests = [], isLoading } = useTests();
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const handleResize = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  const visibleTests = useMemo(
    () => (showAll ? tests : tests.slice(0, PAGE_SIZE)),
    [showAll, tests]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'NAME',
        cell: (info) => (
          <Link
            to="/tests/$testId"
            params={{ testId: info.row.original.id }}
            className="text-brand-primary font-medium text-sm hover:underline tracking-tight"
          >
            {info.getValue()}
          </Link>
        ),
      }),
      columnHelper.accessor(
        (row) => row.location?.name || row.manufacturer,
        {
          id: 'location',
          header: 'LOCATION',
          cell: (info) => (
            <span className="text-brand-secondary text-sm">
              {info.getValue()}
            </span>
          ),
        }
      ),
      columnHelper.accessor('startDate', {
        header: 'START DATE',
        cell: (info) => (
          <span className="text-brand-secondary text-sm">
            {formatDate(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('endDate', {
        header: 'END DATE',
        cell: (info) => (
          <span className="text-brand-secondary text-sm">
            {formatDate(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('successRate', {
        header: 'SUCCESS REACTION',
        cell: (info) => {
          const test = info.row.original;
          const isSuccess = (info.getValue() ?? 0) >= 50 && test.status !== 'failed';

          return (
            <div className="flex items-center justify-start">
              {isSuccess ? (
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor('progress', {
        header: 'PROCESS',
        cell: (info) => {
          const test = info.row.original;
          const total = test.participants || 100;
          const progressValue = info.getValue() || 0;
          const current = Math.round(total * (progressValue / 100));

          return (
            <div className="w-36 space-y-1.5">
              <div className="text-xs font-semibold text-brand-secondary">
                {current} / {total}
              </div>
              <div className="w-full bg-[#D8DCE8] h-1 overflow-hidden">
                <div
                  className="bg-[#25B003] h-full transition-all duration-300"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: (info) => renderStatusBadge(info.getValue()),
      }),
    ],
    []
  ) as ReturnType<typeof columnHelper.accessor>[];

  const filteredColumns = useMemo(
    () => (isMobile ? [columns[0], columns[columns.length - 1]] : columns),
    [columns, isMobile]
  );

  const table = useTable<{}, TestRecord>({
    data: visibleTests,
    columns: filteredColumns,
    features: {},
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: PAGE_SIZE,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 bg-background-primary min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  const startItem = tests.length > 0 ? 1 : 0;
  const endItem = showAll ? tests.length : Math.min(PAGE_SIZE, tests.length);

  return (
    <div className="bg-background-primary min-h-screen font-sans space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark tracking-tight">
          List of medications in development
        </h1>
        <p className="text-sm text-brand-secondary mt-1">
          Brief summary of testing processes
        </p>
      </div>

      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-t border-border-primary text-sm text-brand-dark uppercase tracking-wider"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`py-3 text-left border-b border-border-primary ${
                        isMobile && header.id !== 'name' && header.id !== 'status' ? 'hidden' : ''
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getAllCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`py-6 whitespace-nowrap border-b border-border-primary ${
                          isMobile && cell.column.id !== 'name' && cell.column.id !== 'status' ? 'hidden' : ''
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-brand-secondary text-sm"
                  >
                    No testing programs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="py-4 border-b border-border-primary flex items-center gap-2 text-sm text-brand-secondary">
          <div>
            {startItem} to {endItem} items of {tests.length}
          </div>

          <div className="flex items-center space-x-4">
            {!showAll && tests.length > PAGE_SIZE && (
              <button
                onClick={() => setShowAll(true)}
                className="flex items-center space-x-1 text-brand-primary font-medium hover:underline"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestsListPage;