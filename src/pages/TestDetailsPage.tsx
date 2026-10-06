import { useParams } from '@tanstack/react-router';
import { MapPin, Clock, Calendar, ArrowRight, Loader2, Check, X, Pause } from 'lucide-react';
import { useTest, useUpdateTestStatus } from '../hooks/useTests';
import { type TestRecord, type TestStatus } from '../types/test';

const formatEventDateRange = (start?: string, end?: string) => {
  if (!start || !end) return 'Dates not specified';
  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const startStr = startDate.toLocaleDateString('en-US', options);
  const endStr = endDate.toLocaleDateString('en-US', { ...options, year: 'numeric' });

  return `${startStr} - ${endStr}`;
};

const generateCalendarLink = (test: TestRecord) => {
  if (!test.startDate || !test.endDate) return '';

  const formatGoogleCalendarDate = (dateStr: string, timeStr: string = '00:00') => {
    const date = new Date(`${dateStr}T${timeStr}:00`);
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  };

  const start = formatGoogleCalendarDate(test.startDate, test.startTime || '00:00');
  const end = formatGoogleCalendarDate(test.endDate, test.endTime || '23:59');
  const location = [
    test.location?.address,
    test.location?.city,
    test.location?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: test.name,
    details: test.description || 'Clinical trial event',
    location,
    dates: `${start}/${end}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const TestDetailsPage = () => {
  const { testId } = useParams({ from: '/tests/$testId' });

  const { data: test, isLoading } = useTest(testId);

  const updateStatusMutation = useUpdateTestStatus();

  const handleStatusChange = (newStatus: TestStatus) => {
    if (!testId) return;
    updateStatusMutation.mutate({ id: testId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-background-primary min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-8 bg-background-primary min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-brand-dark">Test not found</h2>
        <p className="text-brand-secondary mt-2">The requested ID: {testId} does not exist.</p>
      </div>
    );
  }

  const isUpdating = updateStatusMutation.isPending;
  const locationName = test.location?.name || test.manufacturer;
  const addressZip = test.location?.address || '';
  const mapSrc = `https://maps.google.com/maps?q=${test.location?.lat || 0},${test.location?.lng || 0}&z=14&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${test.location?.address || ''} ${test.location?.city || ''} ${test.location?.country || ''}`.trim()
  )}`;

  const renderActionButton = () => {
    const normalizedStatus = test.status?.toLowerCase();

    if (normalizedStatus === 'planned') {
      return (
        <button
          onClick={() => handleStatusChange('in-progress')}
          disabled={isUpdating}
          className="flex-1 bg-brand-primary hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Start Process</span>}
        </button>
      );
    }

    if (normalizedStatus === 'in-progress') {
      return (
        <button
          onClick={() => handleStatusChange('planned')}
          disabled={isUpdating}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          {isUpdating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Process</span>
            </>
          )}
        </button>
      );
    }

    if (normalizedStatus === 'completed') {
      return (
        <button
          disabled
          className="flex-1 bg-emerald-500 text-white font-medium py-3 px-4 rounded-xl cursor-default flex items-center justify-center space-x-2"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>Completed</span>
        </button>
      );
    }

    if (normalizedStatus === 'failed') {
      return (
        <button
          disabled
          className="flex-1 bg-rose-500 text-white font-medium py-3 px-4 rounded-xl cursor-not-allowed opacity-80 flex items-center justify-center space-x-2"
        >
          <X className="w-5 h-5 stroke-[3]" />
          <span>Process Failed</span>
        </button>
      );
    }

    return null;
  };

  return (
    <div className="bg-background-primary font-sans flex flex-col lg:flex-row">
      <div className="flex-1 pr-4 lg:pr-8">
        <div className="bg-white border border-border-primary rounded-xl p-6 mb-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-dark mb-2">
              {test.name} - {test.description?.toLowerCase()}
            </h1>
            <p className="text-sm text-brand-secondary">
              {locationName}, {test.location?.city}
            </p>
          </div>

          <div className="bg-white border border-border-primary px-4 py-6 mb-10 flex flex-col sm:flex-row gap-8">
            <div className="flex-1 relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[#C7EBFF] rounded-lg flex items-center justify-center text-[#25A7EF]">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-brand-dark">Location</h3>
              </div>
              <p className="text-sm text-brand-secondary leading-relaxed pr-4">
                {addressZip}<br />
                {test.location?.city} {test.location?.country}
              </p>
              <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-px bg-background-primary" />
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[#C7EBFF] rounded-lg flex items-center justify-center text-[#25A7EF]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-brand-dark">Date & Time</h3>
              </div>
              <p className="text-sm text-brand-secondary leading-relaxed">
                {formatEventDateRange(test.startDate, test.endDate)}<br />
                {test.startTime} - {test.endTime}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {renderActionButton()}

            <button
              type="button"
              onClick={() => {
                const normalizedStatus = test.status?.toLowerCase();
                if (normalizedStatus === 'failed' || normalizedStatus === 'completed') return;

                const calendarLink = generateCalendarLink(test);
                if (calendarLink) {
                  window.open(calendarLink, '_blank', 'noopener,noreferrer');
                }
              }}
              disabled={test.status?.toLowerCase() === 'failed' || test.status?.toLowerCase() === 'completed'}
              className={`
                ${test.status?.toLowerCase() === 'failed' || test.status?.toLowerCase() === 'completed' ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white'}
                flex-1 bg-background-primary border border-border-primary
                text-brand-primary font-medium py-3 px-4 rounded-xl transition-colors
                flex items-center justify-center space-x-2
              `}
            >
              <Calendar className="w-4 h-4" />
              <span>Add to Calendar</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-brand-dark mb-4">About this event</h2>
          <p className="text-sm text-brand-secondary leading-relaxed">
            {test.description} We will be conducting clinical trials of the new drug "{test.name},"
            which is designed to treat specific conditions. We are going to test its effectiveness
            on {test.participants} patients who have been suffering from this disorder.
            The upcoming clinical trials will allow us to evaluate the safety and efficacy of the drug,
            as well as obtain important data for its registration and release on the market.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[400px] border-l border-border-primary px-8">
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-brand-dark mb-4">Manufacturer</h3>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#0F1353] rounded-lg shadow-sm"></div>
            <span className="text-sm font-medium text-brand-secondary">{test.manufacturer}</span>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-2xl font-bold text-brand-dark mb-4">Location</h3>

          <div className="w-full h-48 bg-background-primary rounded-xl overflow-hidden mb-4 border border-border-primary">
            <iframe
              width="100%"
              height="100%"
              src={mapSrc}
              title="Event Location"
            />
          </div>

          <div className="flex justify-between items-center text-sm mb-4">
            <span className="font-medium text-brand-dark">{addressZip}</span>
            <span className="text-brand-secondary">{test.location?.city} {test.location?.country}</span>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full border border-border-primary hover:bg-background-primary text-brand-primary font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Get directions</span>
          </a>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-brand-dark mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {test.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#E3E6ED] text-brand-dark dark:bg-slate-700 dark:text-brand-secondary text-xs font-medium px-3 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetailsPage;