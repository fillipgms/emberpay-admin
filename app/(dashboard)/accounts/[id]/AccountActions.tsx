"use client";

import { approveAccount, rejectAccount } from "@/actions/accounts";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AccountActions = ({ id }: { id: string }) => {
    const router = useRouter();
    const [loadingApprove, setLoadingApprove] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);

    const handleApprove = async () => {
        setLoadingApprove(true);
        const res = await approveAccount(id);
        setLoadingApprove(false);

        if (res.success) {
            toast.success("Conta aprovada com sucesso");
            router.push("/accounts");
        } else {
            toast.error(res.msg ?? "Houve um erro ao aprovar a conta");
        }
    };

    const handleReject = async () => {
        setLoadingReject(true);
        const res = await rejectAccount(id);
        setLoadingReject(false);

        if (res.success) {
            toast.success("Conta rejeitada");
            router.push("/accounts");
        } else {
            toast.error(res.msg ?? "Houve um erro ao rejeitar a conta");
        }
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={handleReject}
                disabled={loadingReject || loadingApprove}
                className="
                    inline-flex items-center gap-2 h-9 px-4
                    rounded-lg text-sm font-medium
                    bg-red-500/10 text-red-600 dark:text-red-400
                    hover:bg-red-500/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-150
                "
            >
                {loadingReject ? (
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-transparent border-t-red-500 animate-spin" />
                ) : (
                    <XIcon size={14} weight="bold" />
                )}
                Rejeitar
            </button>

            <button
                onClick={handleApprove}
                disabled={loadingApprove || loadingReject}
                className="
                    inline-flex items-center gap-2 h-9 px-4
                    rounded-lg text-sm font-medium
                    bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
                    hover:bg-emerald-500/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-150
                "
            >
                {loadingApprove ? (
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
                ) : (
                    <CheckIcon size={14} weight="bold" />
                )}
                Aprovar
            </button>
        </div>
    );
};

export default AccountActions;
