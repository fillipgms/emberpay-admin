import { getAccountImages, getSpecificAccount } from "@/actions/accounts";
import AccountActions from "./AccountActions";
import Image from "next/image";

const DetailRow = ({
    label,
    value,
}: {
    label: string;
    value: string | null | undefined;
}) => (
    <div className="flex flex-col gap-0.5">
        <p className="text-xs font-medium uppercase tracking-widest text-foreground/40">
            {label}
        </p>
        <p className="text-sm font-medium text-foreground">
            {value ?? <span className="text-foreground/30">—</span>}
        </p>
    </div>
);

export default async function AccountDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;

    if (!id) return null;

    const [account, images]: [AccountDetail, AccountImage[]] =
        await Promise.all([
            getSpecificAccount(id),
            getAccountImages(id),
        ]);

    const imageList: AccountImage[] = Array.isArray(images) ? images : [];

    return (
        <main>
            <section className="py-5 px-8 flex items-center justify-between w-full border-b-gradient bg-background z-50">
                <p className="font-semibold text-lg">Contas</p>
                {account && <AccountActions id={id} />}
            </section>

            {account && (
                <>
                    <section className="py-5 px-8 flex flex-col gap-6 w-full border-b-gradient bg-background z-50">
                        <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                            Informações pessoais
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            <DetailRow label="Nome" value={account.name} />
                            <DetailRow label="E-mail" value={account.email} />
                            <DetailRow
                                label="Documento"
                                value={account.document}
                            />
                            <DetailRow label="Tipo" value={account.type} />
                            <DetailRow label="Telefone" value={account.phone} />
                            <DetailRow
                                label="Data de Nascimento"
                                value={account.birth_date}
                            />
                            <DetailRow
                                label="Criado em"
                                value={account.created_at}
                            />
                        </div>
                    </section>

                    {account.address && (
                        <section className="py-5 px-8 flex flex-col gap-6 w-full border-b-gradient bg-background z-50">
                            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                                Endereço
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                <DetailRow
                                    label="Logradouro"
                                    value={account.address.logradouro}
                                />
                                <DetailRow
                                    label="Número"
                                    value={account.address.numero}
                                />
                                <DetailRow
                                    label="Bairro"
                                    value={account.address.bairro}
                                />
                                <DetailRow
                                    label="Cidade"
                                    value={account.address.cidade}
                                />
                                <DetailRow
                                    label="Estado"
                                    value={account.address.estado}
                                />
                                <DetailRow
                                    label="CEP"
                                    value={account.address.cep}
                                />
                                {account.address.complemento && (
                                    <DetailRow
                                        label="Complemento"
                                        value={account.address.complemento}
                                    />
                                )}
                            </div>
                        </section>
                    )}

                    {imageList.length > 0 && (
                        <section className="py-5 px-8 flex flex-col gap-6 w-full border-b-gradient bg-background z-50">
                            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                                Documentos
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {imageList.map((img) => (
                                    <div
                                        key={img.id}
                                        className="flex flex-col gap-2"
                                    >
                                        {img.type && (
                                            <p className="text-xs font-medium uppercase tracking-widest text-foreground/40">
                                                {img.type}
                                            </p>
                                        )}
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-foreground/10 bg-foreground/5">
                                            <Image
                                                src={img.url}
                                                alt={img.type ?? "Documento"}
                                                fill
                                                className="object-contain"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </main>
    );
}
