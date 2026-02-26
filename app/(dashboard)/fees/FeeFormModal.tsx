"use client";

import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
} from "@/components/ui/Credenza";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createFee, updateFee } from "@/actions/fee";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const GATEWAYS = [
    { value: "sicoob", label: "Sicoob" },
    { value: "digitopay", label: "Digitopay" },
];

type FeeFormData = Omit<Fee, "id" | "created_at" | "updated_at" | "user">;

const defaultValues: FeeFormData = {
    user_id: 0,
    limit_withdrawal: "",
    limit_per_day_withdrawal_user: "",
    limit_per_day_withdrawal: "",
    minimum_withdrawal: "",
    minimum_deposit: "",
    max_deposit: "",
    max_deposit_per_day: "",
    fee_withdrawal: "",
    fee_deposit: "",
    fee_withdrawal_fixed: "",
    fee_deposit_fixed: "",
    gateway_deposit_app: "sicoob",
    gateway_withdrawal_app: "sicoob",
    gateway_deposit_painel: "sicoob",
    gateway_withdrawal_painel: "sicoob",
    gateway_deposit: "sicoob",
    gateway_withdrawal: "sicoob",
    deposit_fixed_fee_threshold: "",
    withdrawal_fixed_fee_threshold: "",
    enabled_percent_fee_withdrawal: false,
    enabled_percent_fee_deposit: false,
};

const inputClass = `
    h-9 px-3 w-full rounded-lg text-sm
    bg-[oklch(from_var(--background)_calc(l+0.06)_c_h)]
    border border-[oklch(from_var(--foreground)_l_c_h_/_0.08)]
    text-foreground placeholder:text-[oklch(from_var(--foreground)_l_c_h_/_0.35)]
    hover:border-[oklch(from_var(--primary)_l_c_h_/_0.4)]
    focus:border-[oklch(from_var(--primary)_l_c_h_/_0.7)]
    focus:shadow-[0_0_0_2px_oklch(from_var(--primary)_l_c_h_/_0.15)]
    transition-all duration-200 outline-none
`;

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-medium text-foreground/50 mb-1.5">{children}</p>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-3 mt-5 first:mt-0">
        {children}
    </p>
);

const GatewaySelect = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) => (
    <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-sm w-full">
            <SelectValue />
        </SelectTrigger>
        <SelectContent>
            {GATEWAYS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                    {g.label}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);

interface FeeFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fee?: Fee | null;
}

const FeeFormModal = ({ open, onOpenChange, fee }: FeeFormModalProps) => {
    const router = useRouter();
    const isEdit = !!fee;

    const [form, setForm] = useState<FeeFormData>(() =>
        fee
            ? {
                  user_id: fee.user_id,
                  limit_withdrawal: fee.limit_withdrawal,
                  limit_per_day_withdrawal_user:
                      fee.limit_per_day_withdrawal_user,
                  limit_per_day_withdrawal: fee.limit_per_day_withdrawal,
                  minimum_withdrawal: fee.minimum_withdrawal,
                  minimum_deposit: fee.minimum_deposit,
                  max_deposit: fee.max_deposit,
                  max_deposit_per_day: fee.max_deposit_per_day,
                  fee_withdrawal: fee.fee_withdrawal,
                  fee_deposit: fee.fee_deposit,
                  fee_withdrawal_fixed: fee.fee_withdrawal_fixed,
                  fee_deposit_fixed: fee.fee_deposit_fixed,
                  gateway_deposit_app: fee.gateway_deposit_app,
                  gateway_withdrawal_app: fee.gateway_withdrawal_app,
                  gateway_deposit_painel: fee.gateway_deposit_painel,
                  gateway_withdrawal_painel: fee.gateway_withdrawal_painel,
                  gateway_deposit: fee.gateway_deposit,
                  gateway_withdrawal: fee.gateway_withdrawal,
                  deposit_fixed_fee_threshold: fee.deposit_fixed_fee_threshold,
                  withdrawal_fixed_fee_threshold:
                      fee.withdrawal_fixed_fee_threshold,
                  enabled_percent_fee_withdrawal:
                      fee.enabled_percent_fee_withdrawal,
                  enabled_percent_fee_deposit: fee.enabled_percent_fee_deposit,
              }
            : defaultValues,
    );

    const [loading, setLoading] = useState(false);

    const set = (key: keyof FeeFormData, value: string | number | boolean) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async () => {
        setLoading(true);
        const res = isEdit
            ? await updateFee(fee!.id, form)
            : await createFee(form);
        setLoading(false);

        if (res.success) {
            toast.success(isEdit ? "Taxa atualizada" : "Taxa criada");
            onOpenChange(false);
            router.refresh();
        } else {
            toast.error(res.msg ?? "Houve um erro");
        }
    };

    return (
        <Credenza
            open={open}
            onOpenChange={(o) => {
                if (!loading) onOpenChange(o);
            }}
        >
            <CredenzaContent className="max-w-2xl">
                <CredenzaHeader>
                    <CredenzaTitle>
                        {isEdit ? "Editar Taxa" : "Nova Taxa"}
                    </CredenzaTitle>
                </CredenzaHeader>

                <CredenzaBody>
                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="pb-2">
                            {/* Identificação */}
                            <SectionTitle>Identificação</SectionTitle>
                            <div>
                                <FieldLabel>ID do Usuário</FieldLabel>
                                <input
                                    type="number"
                                    className={inputClass}
                                    value={form.user_id || ""}
                                    onChange={(e) =>
                                        set("user_id", Number(e.target.value))
                                    }
                                    disabled={isEdit}
                                    placeholder="ID do usuário"
                                />
                            </div>

                            {/* Limites de Saque */}
                            <SectionTitle>Limites de Saque</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <FieldLabel>Limite de Saque</FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={form.limit_withdrawal}
                                        onChange={(e) =>
                                            set(
                                                "limit_withdrawal",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Mínimo de Saque</FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={form.minimum_withdrawal}
                                        onChange={(e) =>
                                            set(
                                                "minimum_withdrawal",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>
                                        Limite Diário (Painel/App)
                                    </FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={
                                            form.limit_per_day_withdrawal_user
                                        }
                                        onChange={(e) =>
                                            set(
                                                "limit_per_day_withdrawal_user",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Limite Diário (API)</FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={form.limit_per_day_withdrawal}
                                        onChange={(e) =>
                                            set(
                                                "limit_per_day_withdrawal",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Limites de Depósito */}
                            <SectionTitle>Limites de Depósito</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <FieldLabel>Mínimo de Depósito</FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={form.minimum_deposit}
                                        onChange={(e) =>
                                            set(
                                                "minimum_deposit",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Máximo de Depósito</FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={form.max_deposit}
                                        onChange={(e) =>
                                            set("max_deposit", e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>
                                        Máximo de Depósito por Dia
                                    </FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={form.max_deposit_per_day}
                                        onChange={(e) =>
                                            set(
                                                "max_deposit_per_day",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Taxas */}
                            <SectionTitle>Taxas</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <FieldLabel>Taxa de Saque (%)</FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={form.fee_withdrawal}
                                        onChange={(e) =>
                                            set(
                                                "fee_withdrawal",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>
                                        Taxa de Depósito (%)
                                    </FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={form.fee_deposit}
                                        onChange={(e) =>
                                            set("fee_deposit", e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Taxa Fixa de Saque</FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={form.fee_withdrawal_fixed}
                                        onChange={(e) =>
                                            set(
                                                "fee_withdrawal_fixed",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>
                                        Taxa Fixa de Depósito
                                    </FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={form.fee_deposit_fixed}
                                        onChange={(e) =>
                                            set(
                                                "fee_deposit_fixed",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>
                                        Limite p/ Taxa % (Saque)
                                    </FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={
                                            form.withdrawal_fixed_fee_threshold
                                        }
                                        onChange={(e) =>
                                            set(
                                                "withdrawal_fixed_fee_threshold",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>
                                        Limite p/ Taxa % (Depósito)
                                    </FieldLabel>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={form.deposit_fixed_fee_threshold}
                                        onChange={(e) =>
                                            set(
                                                "deposit_fixed_fee_threshold",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Taxa percentual ativa */}
                            <SectionTitle>Taxa Percentual</SectionTitle>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center justify-between gap-4 cursor-pointer">
                                    <span className="text-sm text-foreground/80">
                                        Ativar taxa percentual de saque
                                    </span>
                                    <Switch
                                        checked={
                                            form.enabled_percent_fee_withdrawal
                                        }
                                        onCheckedChange={(v) =>
                                            set(
                                                "enabled_percent_fee_withdrawal",
                                                v,
                                            )
                                        }
                                    />
                                </label>
                                <label className="flex items-center justify-between gap-4 cursor-pointer">
                                    <span className="text-sm text-foreground/80">
                                        Ativar taxa percentual de depósito
                                    </span>
                                    <Switch
                                        checked={
                                            form.enabled_percent_fee_deposit
                                        }
                                        onCheckedChange={(v) =>
                                            set(
                                                "enabled_percent_fee_deposit",
                                                v,
                                            )
                                        }
                                    />
                                </label>
                            </div>

                            <SectionTitle>Gateways</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <FieldLabel>Depósito (App)</FieldLabel>
                                    <GatewaySelect
                                        value={form.gateway_deposit_app}
                                        onChange={(v) =>
                                            set("gateway_deposit_app", v)
                                        }
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Saque (App)</FieldLabel>
                                    <GatewaySelect
                                        value={form.gateway_withdrawal_app}
                                        onChange={(v) =>
                                            set("gateway_withdrawal_app", v)
                                        }
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Depósito (Painel)</FieldLabel>
                                    <GatewaySelect
                                        value={form.gateway_deposit_painel}
                                        onChange={(v) =>
                                            set("gateway_deposit_painel", v)
                                        }
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Saque (Painel)</FieldLabel>
                                    <GatewaySelect
                                        value={form.gateway_withdrawal_painel}
                                        onChange={(v) =>
                                            set("gateway_withdrawal_painel", v)
                                        }
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Depósito (API)</FieldLabel>
                                    <GatewaySelect
                                        value={form.gateway_deposit}
                                        onChange={(v) =>
                                            set("gateway_deposit", v)
                                        }
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Saque (API)</FieldLabel>
                                    <GatewaySelect
                                        value={form.gateway_withdrawal}
                                        onChange={(v) =>
                                            set("gateway_withdrawal", v)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </CredenzaBody>

                <CredenzaFooter>
                    <button
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="
                            inline-flex items-center justify-center h-9 px-4
                            rounded-lg text-sm font-medium
                            bg-foreground/8 text-foreground/70
                            hover:bg-foreground/12
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors duration-150
                        "
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="
                            inline-flex items-center gap-2 justify-center h-9 px-4
                            rounded-lg text-sm font-medium
                            bg-primary text-primary-foreground
                            hover:bg-primary/90
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors duration-150
                        "
                    >
                        {loading && (
                            <div className="h-3.5 w-3.5 rounded-full border-2 border-transparent border-t-primary-foreground animate-spin" />
                        )}
                        {isEdit ? "Salvar" : "Criar"}
                    </button>
                </CredenzaFooter>
            </CredenzaContent>
        </Credenza>
    );
};

export default FeeFormModal;
