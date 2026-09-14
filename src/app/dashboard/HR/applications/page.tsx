import { cookies } from 'next/headers';
import ApplicationsTable from '@/components/ApplicationsTable';

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 5;
  const search = params.search || '';
  const status = params.status || 'All';
  const internshipId = params.internshipId || '';

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search && { search }),
    ...(status !== 'All' && { status }),
    ...(internshipId && { internshipId }),
  });

  const cookieStore = await cookies();
  const res = await fetch(`http://localhost:3000/application/company?${query}`, {
    headers: { Cookie: cookieStore.toString() },
    cache: 'no-store',
  });

  if (!res.ok) {
    return (
      <div className="p-3 text-rose-600 bg-rose-50 rounded-lg text-xs font-medium text-center border border-rose-200">
        Failed to load applications.
      </div>
    );
  }

  const data = await res.json();

  return (
    <div className="p-3 space-y-3 font-sans">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Company Applications</h1>
        <p className="text-xs text-slate-500">Manage and review applicant submissions.</p>
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
