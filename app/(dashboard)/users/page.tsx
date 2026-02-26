import { getUsersData } from "@/actions/users";
import PaginationControls from "@/components/Pagination";
import UsersTable from "@/components/tables/UsersTable";
import UserFilters from "./UserFilters";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string }>;
}) {
    const params = await searchParams;
    const search = params.search;
    const auto_approve_withdrawal = params.auto_approve_withdrawal;
    const enabled_withdraw = params.enabled_withdraw;
    const enabled_deposit = params.enabled_deposit;
    const balance = params.balance;
    const in_filter = params.in;
    const out_filter = params.out;
    const page = params.page;

    const res = (await getUsersData(
        search,
        auto_approve_withdrawal,
        enabled_withdraw,
        enabled_deposit,
        balance,
        in_filter,
        out_filter,
        page,
    )) as UsersResponse;

    const data = res?.data ?? [];

    return (
        <main>
            <section className="py-5 px-8 flex items-center justify-between w-full border-b-gradient bg-background z-50">
                <p className="font-semibold text-lg">Usuários</p>
            </section>

            <UserFilters />

            <section className="py-5 px-8 flex flex-col items-center justify-between w-full border-b-gradient bg-background z-50">
                <UsersTable users={data} />
                {res && (
                    <PaginationControls
                        currentPage={res.current_page}
                        lastPage={res.last_page}
                        hasNextPage={!!res.next_page_url}
                        hasPrevPage={!!res.prev_page_url}
                        baseUrl="/users"
                        searchParams={params}
                    />
                )}
            </section>
        </main>
    );
}
