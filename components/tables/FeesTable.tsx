"use client";

import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";
import {
    AllCommunityModule,
    type ColDef,
    ICellRendererParams,
    ModuleRegistry,
} from "ag-grid-community";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { deleteFee } from "@/actions/fee";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FeeFormModal from "@/app/(dashboard)/fees/FeeFormModal";

ModuleRegistry.registerModules([AllCommunityModule]);

const FeesTable = ({ fees }: { fees: Fee[] }) => {
    const router = useRouter();
    const [editFee, setEditFee] = useState<Fee | null>(null);
    const [deletingFee, setDeletingFee] = useState<Fee | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDelete = async () => {
        if (!deletingFee) return;
        setDeleteLoading(true);
        const res = await deleteFee(deletingFee.id);
        setDeleteLoading(false);

        if (res.success) {
            toast.success("Taxa excluída");
            setDeletingFee(null);
            router.refresh();
        } else {
            toast.error(res.msg ?? "Houve um erro ao excluir");
        }
    };

    const colDefs = useMemo<ColDef[]>(
        () => [
            {
                headerName: "ID",
                field: "id",
                pinned: "left",
                width: 80,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center h-full w-full">
                        <span className="font-mono text-xs text-foreground/60">
                            #{p.value}
                        </span>
                    </div>
                ),
            },
            {
                headerName: "Usuário",
                field: "user_id",
                suppressMovable: true,
                minWidth: 200,
                cellRenderer: (p: ICellRendererParams) => {
                    const fee = p.data as Fee;
                    return (
                        <div className="flex flex-col h-full w-full justify-center gap-0.5">
                            <p className="leading-none text-sm font-medium truncate">
                                {fee.user?.name ?? (
                                    <span className="text-foreground/40">
                                        ID {p.value}
                                    </span>
                                )}
                            </p>
                            {fee.user?.email && (
                                <p className="text-xs text-foreground/50 truncate">
                                    {fee.user.email}
                                </p>
                            )}
                        </div>
                    );
                },
            },
            {
                headerName: "Saque %",
                field: "fee_withdrawal",
                suppressMovable: true,
                width: 110,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-end h-full w-full pr-2">
                        <span className="text-sm font-medium">
                            {p.value}%
                        </span>
                    </div>
                ),
            },
            {
                headerName: "Depósito %",
                field: "fee_deposit",
                suppressMovable: true,
                width: 120,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-end h-full w-full pr-2">
                        <span className="text-sm font-medium">
                            {p.value}%
                        </span>
                    </div>
                ),
            },
            {
                headerName: "Taxa Fixa Saque",
                field: "fee_withdrawal_fixed",
                suppressMovable: true,
                minWidth: 150,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-end h-full w-full pr-2">
                        <span className="text-sm">R$ {p.value}</span>
                    </div>
                ),
            },
            {
                headerName: "Taxa Fixa Depósito",
                field: "fee_deposit_fixed",
                suppressMovable: true,
                minWidth: 160,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-end h-full w-full pr-2">
                        <span className="text-sm">R$ {p.value}</span>
                    </div>
                ),
            },
            {
                headerName: "Gateway Depósito",
                field: "gateway_deposit",
                suppressMovable: true,
                minWidth: 160,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center h-full w-full">
                        <span className="px-2 py-1 bg-foreground/5 rounded text-xs font-medium capitalize">
                            {p.value}
                        </span>
                    </div>
                ),
            },
            {
                headerName: "Gateway Saque",
                field: "gateway_withdrawal",
                suppressMovable: true,
                minWidth: 150,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center h-full w-full">
                        <span className="px-2 py-1 bg-foreground/5 rounded text-xs font-medium capitalize">
                            {p.value}
                        </span>
                    </div>
                ),
            },
            {
                headerName: "Ações",
                suppressMovable: true,
                minWidth: 110,
                maxWidth: 120,
                cellRenderer: (p: ICellRendererParams) => {
                    const fee = p.data as Fee;
                    return (
                        <div className="flex items-center justify-center gap-1.5 h-full w-full">
                            <button
                                onClick={() => setEditFee(fee)}
                                className="
                                    inline-flex items-center justify-center h-7 w-7
                                    rounded-md
                                    bg-primary/10 text-primary
                                    hover:bg-primary/20
                                    transition-colors duration-150
                                "
                                title="Editar"
                            >
                                <PencilSimpleIcon size={13} weight="bold" />
                            </button>
                            <button
                                onClick={() => setDeletingFee(fee)}
                                className="
                                    inline-flex items-center justify-center h-7 w-7
                                    rounded-md
                                    bg-red-500/10 text-red-600 dark:text-red-400
                                    hover:bg-red-500/20
                                    transition-colors duration-150
                                "
                                title="Excluir"
                            >
                                <TrashIcon size={13} weight="bold" />
                            </button>
                        </div>
                    );
                },
            },
        ],
        [],
    );

    return (
        <>
            <div className="ag-theme-quartz w-full" style={{ height: "auto" }}>
                <AgGridReact
                    columnDefs={colDefs}
                    domLayout="autoHeight"
                    rowData={fees}
                    defaultColDef={{
                        cellClass: "bg-background text-foreground",
                        minWidth: 100,
                        headerClass:
                            "bg-background text-foreground/60 font-semibold text-xs uppercase tracking-wide",
                        sortable: false,
                    }}
                    rowHeight={60}
                    animateRows={true}
                />
            </div>

            <FeeFormModal
                open={!!editFee}
                onOpenChange={(o) => !o && setEditFee(null)}
                fee={editFee}
            />

            <AlertDialog
                open={!!deletingFee}
                onOpenChange={(o) => !o && setDeletingFee(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir taxa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita. A taxa do usuário{" "}
                            <strong>
                                {deletingFee?.user?.name ??
                                    `ID ${deletingFee?.user_id}`}
                            </strong>{" "}
                            será removida permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteLoading}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleteLoading ? (
                                <div className="h-3.5 w-3.5 rounded-full border-2 border-transparent border-t-white animate-spin" />
                            ) : (
                                "Excluir"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default FeesTable;
