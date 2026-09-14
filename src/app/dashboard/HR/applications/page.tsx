import { cookies } from 'next/headers';
import ApplicationsTable from '@/components/ApplicationsTable';

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function ApplicationsPage({searchParams}: PageProps) 
{

  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 5;

  const search = params.search || '';
  const status = params.status || 'All';
  const internshipId = params.internshipId || '';

  const query = new URLSearchParams();

  query.set('page', String(page));
  query.set('limit', String(limit));

  if (search) {
    query.set('search', search);
  }

  if (status !== 'All') {
    query.set('status', status);
  }

  if (internshipId) {
    query.set('internshipId', internshipId);
  }

  // Get cookies
  const cookieStore = await cookies();

  const response = await fetch(
    `http://localhost:3000/application/company?${query.toString()}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    return (
      <div className="p-3 text-rose-600 bg-rose-50 rounded-lg text-xs font-medium text-center border border-rose-200">
        Failed to load applications.
      </div>
    );
  }

  // Get Response Data
  const data = await response.json();

  return (
    <div className="p-3 space-y-3 font-sans">

      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Company Applications
        </h1>

        <p className="text-xs text-slate-500">
          Manage and review applicant submissions.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">

        <ApplicationsTable
          applications={data.data || []}
          currentPage={data.page || page}
          itemsPerPage={data.limit || limit}
          totalItems={data.total || 0}
          search={search}
          status={status}
          internshipId={internshipId}
        />

      </div>

    </div>
  );
}
