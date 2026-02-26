import { getSpecificUser } from "@/actions/users";

export default async function SpecificUserPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;

    if (!id) {
        return;
    }

    const res = await getSpecificUser(id);

    return (
        <main>
            <section className="py-5 px-8 flex items-center justify-between w-full border-b-gradient bg-background z-50">
                <p className="font-semibold text-lg">Usuários</p>
            </section>
        </main>
    );
}
