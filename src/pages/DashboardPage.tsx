import { useMemo, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { Star, Pause, X, ChevronDown, Loader2, ChevronUp } from 'lucide-react';
import { useTests } from '../hooks/useTests';

type DateRange = '7days' | '30days' | 'all';

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isTestOnDay = (test: { createdAt?: string | number | Date }, targetDate: Date) => {
  if (!test.createdAt) return false;
  const d = new Date(test.createdAt);
  if (isNaN(d.getTime())) return false;
  return isSameDay(d, targetDate);
};

export const DashboardPage = () => {
  const { data: tests = [], isLoading } = useTests();

  const [dateRange, setDateRange] = useState<DateRange>('7days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const stats = useMemo(() => {
    if (!tests.length) return null;

    const now = new Date();
    const nowTime = now.getTime();

    let daysCount = 7;
    if (dateRange === '30days') {
      daysCount = 30;
    } else if (dateRange === 'all') {
      const timestamps = tests
        .map(t => (t.createdAt ? new Date(t.createdAt).getTime() : NaN))
        .filter(t => !isNaN(t));

      if (timestamps.length > 0) {
        const minTimestamp = Math.min(...timestamps);
        const diffDays = Math.ceil((nowTime - minTimestamp) / (1000 * 3600 * 24));
        daysCount = Math.max(diffDays + 1, 7);
      } else {
        daysCount = 30;
      }
    }

    const filteredTests = tests.filter(test => {
      if (dateRange === 'all') return true;
      const testDate = test.createdAt ? new Date(test.createdAt).getTime() : nowTime;
      const diffDays = (nowTime - testDate) / (1000 * 3600 * 24);
      return diffDays <= daysCount;
    });

    const inProgress = filteredTests.filter(t => t.status?.toLowerCase() === 'in-progress').length;
    const onHoldOrPlanned = filteredTests.filter(t => t.status?.toLowerCase() === 'planned').length;
    const failed = filteredTests.filter(t => t.status?.toLowerCase() === 'failed').length;
    const completed = filteredTests.filter(t => t.status?.toLowerCase() === 'completed').length;

    let totalTestedParticipants = 0;
    let totalParticipants = 0;
    let totalSuccessRate = 0;

    filteredTests.forEach(test => {
      totalParticipants += test.participants || 0;
      totalTestedParticipants += Math.round((test.participants || 0) * ((test.progress || 0) / 100));
      totalSuccessRate += test.successRate || 0;
    });

    const nonTestedParticipants = Math.max(0, totalParticipants - totalTestedParticipants);
    const avgApprovalRate = filteredTests.length ? Math.round(totalSuccessRate / filteredTests.length) : 0;

    const testingProcessData = [
      { name: 'Completed', value: completed, fill: '#3b82f6' },
      { name: 'In Progress', value: inProgress, fill: '#bfdbfe' },
      { name: 'Planned/Failed', value: onHoldOrPlanned + failed, fill: '#1d4ed8' },
    ];

    const peopleTestedData = [
      { name: 'Tested', value: totalTestedParticipants, fill: '#3b82f6' },
      { name: 'Non-tested', value: nonTestedParticipants, fill: '#eff6ff' },
    ];

    const testedPercentage = totalParticipants ? Math.round((totalTestedParticipants / totalParticipants) * 100) : 0;
    const completedPercentage = filteredTests.length ? Math.round((completed / filteredTests.length) * 100) : 0;

    const rangeDates = Array.from({ length: daysCount }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (daysCount - 1 - i));
      return d;
    });

    const totalTestsTrendData = rangeDates.map((targetDate) => {
      const prevTargetDate = new Date(targetDate);
      prevTargetDate.setDate(prevTargetDate.getDate() - daysCount);

      const currentCount = tests.filter(t => isTestOnDay(t, targetDate)).length;
      const previousCount = tests.filter(t => isTestOnDay(t, prevTargetDate)).length;

      return {
        date: targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        current: currentCount,
        previous: previousCount,
      };
    });

    const dynamicApprovalRatesData = rangeDates.map(dateObj => {
      const dayTests = tests.filter(t => isTestOnDay(t, dateObj));
      const rate = dayTests.length
        ? Math.round(dayTests.reduce((acc, t) => acc + (t.successRate || 0), 0) / dayTests.length)
        : 0;

      return {
        date: dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        rate,
        benchmark: 60
      };
    });

    const dynamicTestedDrugsData = rangeDates.map(dateObj => {
      const dayTests = tests.filter(t => isTestOnDay(t, dateObj));
      const dayCompleted = dayTests.filter(t => t.status?.toLowerCase() === 'completed').length;
      const dayAwaiting = dayTests.filter(t => t.status?.toLowerCase() !== 'completed').length;

      return {
        day: daysCount <= 7
          ? dateObj.toLocaleDateString('en-US', { weekday: 'short' })[0]
          : dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        completed: dayCompleted,
        awaiting: dayAwaiting
      };
    });

    return {
      inProgress,
      onHoldOrPlanned,
      failed,
      testingProcessData,
      peopleTestedData,
      avgApprovalRate,
      testedPercentage,
      completedPercentage,
      filteredTestsCount: filteredTests.length,
      totalTestsTrendData,
      dynamicApprovalRatesData,
      dynamicTestedDrugsData
    };
  }, [tests, dateRange]);

  const dateLabel = dateRange === '7days' ? 'Last 7 days' : dateRange === '30days' ? 'Last 30 days' : 'All time';

  if (isLoading) {
    return (
      <div className="p-8 bg-background-primary min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  const trendData = stats?.totalTestsTrendData || [];
  const firstTick = trendData[0]?.date;
  const midTick = trendData[Math.floor(trendData.length / 2)]?.date;
  const lastTick = trendData[trendData.length - 1]?.date;
  const xTicks = [firstTick, midTick, lastTick].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-[1600px] bg-background-primary font-sans space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark tracking-tight">Testing Dashboard</h1>
        <p className="text-sm text-brand-secondary mt-1">Uncover insights into your testing processes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-border-primary pb-6">

            <div className="rounded-2xl flex items-center space-x-3">
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl transform"></div>
                <div className="w-10 h-10 bg-emerald-500 rounded-xl absolute flex items-center justify-center text-white">
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-brand-dark text-xl">{stats?.inProgress || 0} tests</h4>
                <p className="text-sm text-brand-secondary mt-0.5">In progress</p>
              </div>
            </div>

            <div className="rounded-2xl flex items-center space-x-3">
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 bg-amber-100 rounded-xl transform"></div>
                <div className="w-10 h-10 bg-amber-400 rounded-xl absolute flex items-center justify-center text-white">
                  <Pause className="w-5 h-5 fill-current" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-brand-dark text-xl">{stats?.onHoldOrPlanned || 0} tests</h4>
                <p className="text-sm text-brand-secondary mt-0.5">Planned / On hold</p>
              </div>
            </div>

            <div className="rounded-2xl flex items-center space-x-3">
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 bg-rose-100 rounded-xl transform"></div>
                <div className="w-10 h-10 bg-rose-400 rounded-xl absolute flex items-center justify-center text-white">
                  <X className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-brand-dark text-xl">{stats?.failed || 0} tests</h4>
                <p className="text-sm text-brand-secondary mt-0.5">Failed</p>
              </div>
            </div>

          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-brand-dark">Total tests</h3>
                <p className="text-sm text-brand-secondary mt-0.5">Testing results received in all areas</p>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex bg-white items-center justify-between w-[200px] space-x-2 border border-primary text-brand-secondary text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-background-primary transition"
                >
                  <span>{dateLabel}</span>
                  {isDropdownOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-brand-secondary" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-brand-secondary" />
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute w-full text-brand-secondary font-medium right-0 mt-2 bg-white border border-border-primary rounded-lg shadow-lg z-10 overflow-hidden">
                    <button onClick={() => { setDateRange('7days'); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-xs hover:bg-background-primary">Last 7 days</button>
                    <button onClick={() => { setDateRange('30days'); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-xs hover:bg-background-primary">Last 30 days</button>
                    <button onClick={() => { setDateRange('all'); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-xs hover:bg-background-primary">All time</button>
                  </div>
                )}
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={true} horizontal={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="date"
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                    tick={{ fill: '#56627D', fontSize: 11, dy: 8 }}
                    tickFormatter={(value) => xTicks.includes(value) ? value : ''}
                    interval={0}
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Line
                    type="linear"
                    dataKey="current"
                    stroke="#3874FF"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="linear"
                    dataKey="previous"
                    stroke="#60A5FA"
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div className="bg-white p-5 rounded-2xl border border-border-primary shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold text-brand-dark">Total tested drugs</h4>
                <div className="text-xl font-bold text-brand-dark mt-1">{stats?.filteredTestsCount || 0}</div>
              </div>
              <p className="text-sm text-brand-secondary mt-0.5">{dateLabel}</p>
            </div>

            <div className="h-28 my-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.dynamicTestedDrugsData || []} barCategoryGap="100%">
                  <Bar dataKey="completed" fill="#3874FF" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="awaiting" fill="#E5EDFF" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1 text-[11px] pt-2 border-t border-border-primary">
              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-1.5 text-brand-secondary text-sm">
                  <span className="w-[18px] h-[9px] rounded bg-brand-primary inline-block"></span>
                  <span>Completed</span>
                </span>
                <span className="font-semibold text-brand-secondary text-sm">{stats?.completedPercentage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-1.5 text-brand-secondary text-sm">
                  <span className="w-[18px] h-[9px] rounded bg-[#E5EDFF] inline-block"></span>
                  <span>Awaiting results</span>
                </span>
                <span className="font-semibold text-brand-secondary text-sm">{100 - (stats?.completedPercentage || 0)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-primary shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-brand-dark">
                <h4 className="text-xl font-bold">Avg approval rate</h4>
                <div className="text-xl font-bold mt-1">{stats?.avgApprovalRate || 0}%</div>
              </div>
              <p className="text-sm text-brand-secondary mt-0.5">{dateLabel}</p>
            </div>

            <div className="h-28 my-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.dynamicApprovalRatesData || []}>
                  <Line type="monotone" dataKey="rate" stroke="#3874FF" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="benchmark" stroke="#E5EDFF" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between text-[11px] text-brand-secondary pt-2 border-t border-border-primary">
              <span>{stats?.dynamicApprovalRatesData?.[0]?.date || 'N/A'}</span>
              <span>
                {stats?.dynamicApprovalRatesData?.[
                  (stats?.dynamicApprovalRatesData?.length || 1) - 1
                ]?.date || 'N/A'}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-primary shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold text-brand-dark">Testing process</h4>
              <p className="text-sm text-brand-secondary mt-0.5">{dateLabel}</p>
            </div>

            <div className="h-28 relative my-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.testingProcessData || []}
                    innerRadius={30}
                    outerRadius={42}
                    paddingAngle={3}
                    dataKey="value"
                  />
                </PieChart>
              </ResponsiveContainer>
              <span className="absolute text-xs font-bold text-brand-dark">{stats?.completedPercentage}%</span>
            </div>

            <div className="space-y-1 text-[11px]">
              {(stats?.testingProcessData || []).map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <span className="flex items-center space-x-1.5 text-brand-secondary text-sm truncate">
                    <span className="w-[18px] h-[9px] rounded inline-block shrink-0" style={{ backgroundColor: item.fill }}></span>
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-semibold text-brand-secondary text-sm ml-1">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-primary shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-bold text-brand-dark leading-tight">Number of people tested</h4>
              <p className="text-sm text-brand-secondary mt-0.5">{dateLabel}</p>
            </div>

            <div className="h-28 relative my-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.peopleTestedData || []}
                    startAngle={180}
                    endAngle={0}
                    innerRadius={32}
                    outerRadius={44}
                    paddingAngle={0}
                    dataKey="value"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1 text-[11px] text-brand-secondary">
              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-1.5 text-sm">
                  <span className="w-[18px] h-[9px] rounded bg-brand-primary inline-block"></span>
                  <span>Tested</span>
                </span>
                <span className="font-semibold text-sm text-brand-secondary">{stats?.testedPercentage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-1.5 text-sm">
                  <span className="w-[18px] h-[9px] rounded bg-[#E5EDFF] inline-block"></span>
                  <span>Non-tested</span>
                </span>
                <span className="font-semibold text-sm">{100 - (stats?.testedPercentage || 0)}%</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;