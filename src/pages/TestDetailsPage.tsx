import { useParams } from '@tanstack/react-router';

export const TestDetailsPage = () => {
  const { testId } = useParams({ from: '/tests/$testId' });

  return (
    <div className="p-6">
      <h1>Test ID: {testId}</h1>
    </div>
  );
};