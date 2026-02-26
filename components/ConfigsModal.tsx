"use client";

import { useEffect, useState } from "react";
import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "./ui/Credenza";
import { GearIcon } from "@phosphor-icons/react";
import { getConfigs, updateConfigs } from "@/actions/configs";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface Configs {
    id: number;
    auto_approve_withdrawal: boolean;
    created_at: string | null;
    days_blocked: string | null;
    fee_deposit: number;
    fee_deposit_fixed: number;
    fee_withdraw_crypto: number;
    fee_withdrawal: number;
    fee_withdrawal_fixed: number;
    gateway_deposit: string;
    gateway_deposit_app: string;
    gateway_deposit_painel: string;
    gateway_withdrawal: string;
    gateway_withdrawal_app: string;
    gateway_withdrawal_painel: string;
    limit_per_day_withdrawal: number;
    limit_per_day_withdrawal_user: number;
    limit_withdraw_crypto_per_day: number;
    limit_withdrawal: number;
    max_deposit: number;
    max_deposit_per_day: number;
    max_withdrawal_crypto: number;
    min_withdrawal_crypto: number;
    minimum_deposit: number;
    minimum_withdrawal: number;
    operating_hours: string | null;
    pix_cashin_api: boolean;
    pix_cashin_app: boolean;
    pix_cashin_painel: boolean;
    pix_cashout_api: boolean;
    pix_cashout_app: boolean;
    pix_cashout_painel: boolean;
    rate_limit_per_minute: number;
    sandbox_mode: boolean;
    updated_at: string | null;
    withdrawal_delay_minutes: number;
    withdrawal_fixed_fee_threshold: number;
    deposit_fixed_fee_threshold: number;
    enabled_percent_fee_withdrawal: boolean;
    enabled_percent_fee_deposit: boolean;
}

const FieldRow = ({
    label,
    description,
    children,
}: {
    label: string;
    description?: string;
    children: React.ReactNode;
}) => (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border/40 last:border-0">
        <div className="flex flex-col gap-0.5 min-w-0">
            <Label className="text-sm font-medium text-foreground">
                {label}
            </Label>
            {description && (
                <p className="text-xs text-foreground/50">{description}</p>
            )}
        </div>
        <div className="shrink-0">{children}</div>
    </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-2 mt-4 first:mt-0">
        {children}
    </p>
);

const ConfigsModal = () => {
    const [configs, setConfigs] = useState<Configs | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;

        const fetchConfigs = async () => {
            setLoading(true);
            try {
                const res = await getConfigs();
                if (res?.status === 1) {
                    setConfigs(res.data);
                } else {
                    setOpen(false);
                    toast.error(
                        "Houve um erro ao carregar configurações, tente novamente mais tarde",
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchConfigs();
    }, [open]);

    const set = <K extends keyof Configs>(key: K, value: Configs[K]) => {
        setConfigs((prev) => prev && { ...prev, [key]: value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (!configs) return;
            const res = await updateConfigs(configs);

            if (!res?.success) {
                toast.error("Erro ao salvar configurações.");
                toast.error(res?.msg);
            } else {
                toast.success("Configurações salvas com sucesso.");
            }
        } catch {
            toast.error("Erro ao salvar configurações.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Credenza open={open} onOpenChange={setOpen}>
            <CredenzaTrigger asChild>
                <button className="flex items-center gap-2 w-full">
                    <GearIcon className="text-foreground" weight="duotone" />
                    Configurações
                </button>
            </CredenzaTrigger>
            <CredenzaContent className="max-h-[85vh] flex flex-col max-w-3xl">
                <CredenzaHeader className="shrink-0 border-b border-border/40 pb-4">
                    <CredenzaTitle className="text-lg font-semibold">
                        Configurações
                    </CredenzaTitle>
                </CredenzaHeader>

                <CredenzaBody className="flex-1 overflow-y-auto py-4">
                    {loading || !configs ? (
                        <div className="flex items-center justify-center h-48 text-foreground/40 text-sm">
                            {loading ? "Carregando..." : "Sem dados"}
                        </div>
                    ) : (
                        <Tabs defaultValue="gateways">
                            <TabsList className="w-full flex gap-1 bg-foreground/5 p-1 rounded-lg h-auto">
                                <TabsTrigger
                                    value="gateways"
                                    className="flex-1 text-xs"
                                >
                                    Gateways
                                </TabsTrigger>
                                <TabsTrigger
                                    value="taxas"
                                    className="flex-1 text-xs"
                                >
                                    Taxas
                                </TabsTrigger>
                                <TabsTrigger
                                    value="limites"
                                    className="flex-1 text-xs"
                                >
                                    Limites
                                </TabsTrigger>
                                <TabsTrigger
                                    value="pix"
                                    className="flex-1 text-xs"
                                >
                                    PIX
                                </TabsTrigger>
                                <TabsTrigger
                                    value="geral"
                                    className="flex-1 text-xs"
                                >
                                    Geral
                                </TabsTrigger>
                            </TabsList>

                            {/* GATEWAYS */}
                            <TabsContent value="gateways" className="mt-4">
                                <SectionTitle>Depósito</SectionTitle>
                                <FieldRow
                                    label="Gateway Padrão"
                                    description="Gateway utilizado por padrão nos depósitos"
                                >
                                    <Input
                                        value={configs.gateway_deposit}
                                        onChange={(e) =>
                                            set(
                                                "gateway_deposit",
                                                e.target.value,
                                            )
                                        }
                                        className="w-36 text-sm h-8"
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Gateway App"
                                    description="Gateway para depósitos via aplicativo"
                                >
                                    <Input
                                        value={configs.gateway_deposit_app}
                                        onChange={(e) =>
                                            set(
                                                "gateway_deposit_app",
                                                e.target.value,
                                            )
                                        }
                                        className="w-36 text-sm h-8"
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Gateway Painel"
                                    description="Gateway para depósitos via painel"
                                >
                                    <Input
                                        value={configs.gateway_deposit_painel}
                                        onChange={(e) =>
                                            set(
                                                "gateway_deposit_painel",
                                                e.target.value,
                                            )
                                        }
                                        className="w-36 text-sm h-8"
                                    />
                                </FieldRow>

                                <SectionTitle>Saque</SectionTitle>
                                <FieldRow
                                    label="Gateway Padrão"
                                    description="Gateway utilizado por padrão nos saques"
                                >
                                    <Input
                                        value={configs.gateway_withdrawal}
                                        onChange={(e) =>
                                            set(
                                                "gateway_withdrawal",
                                                e.target.value,
                                            )
                                        }
                                        className="w-36 text-sm h-8"
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Gateway App"
                                    description="Gateway para saques via aplicativo"
                                >
                                    <Input
                                        value={configs.gateway_withdrawal_app}
                                        onChange={(e) =>
                                            set(
                                                "gateway_withdrawal_app",
                                                e.target.value,
                                            )
                                        }
                                        className="w-36 text-sm h-8"
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Gateway Painel"
                                    description="Gateway para saques via painel"
                                >
                                    <Input
                                        value={
                                            configs.gateway_withdrawal_painel
                                        }
                                        onChange={(e) =>
                                            set(
                                                "gateway_withdrawal_painel",
                                                e.target.value,
                                            )
                                        }
                                        className="w-36 text-sm h-8"
                                    />
                                </FieldRow>
                            </TabsContent>

                            {/* TAXAS */}
                            <TabsContent value="taxas" className="mt-4">
                                <SectionTitle>Depósito</SectionTitle>
                                <FieldRow
                                    label="Taxa de Depósito (%)"
                                    description="Percentual cobrado sobre depósitos"
                                >
                                    <Input
                                        type="number"
                                        value={configs.fee_deposit}
                                        onChange={(e) =>
                                            set(
                                                "fee_deposit",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-28 text-sm h-8"
                                        min={0}
                                        step={0.01}
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Taxa Fixa de Depósito (R$)"
                                    description="Valor fixo cobrado por depósito"
                                >
                                    <Input
                                        type="number"
                                        value={configs.fee_deposit_fixed}
                                        onChange={(e) =>
                                            set(
                                                "fee_deposit_fixed",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-28 text-sm h-8"
                                        min={0}
                                        step={0.01}
                                    />
                                </FieldRow>

                                <SectionTitle>Saque</SectionTitle>
                                <FieldRow
                                    label="Taxa de Saque (%)"
                                    description="Percentual cobrado sobre saques"
                                >
                                    <Input
                                        type="number"
                                        value={configs.fee_withdrawal}
                                        onChange={(e) =>
                                            set(
                                                "fee_withdrawal",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-28 text-sm h-8"
                                        min={0}
                                        step={0.01}
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Taxa Fixa de Saque (R$)"
                                    description="Valor fixo cobrado por saque"
                                >
                                    <Input
                                        type="number"
                                        value={configs.fee_withdrawal_fixed}
                                        onChange={(e) =>
                                            set(
                                                "fee_withdrawal_fixed",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-28 text-sm h-8"
                                        min={0}
                                        step={0.01}
                                    />
                                </FieldRow>

                                <SectionTitle>Cripto</SectionTitle>
                                <FieldRow
                                    label="Taxa de Saque Cripto (%)"
                                    description="Percentual cobrado sobre saques em cripto"
                                >
                                    <Input
                                        type="number"
                                        value={configs.fee_withdraw_crypto}
                                        onChange={(e) =>
                                            set(
                                                "fee_withdraw_crypto",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-28 text-sm h-8"
                                        min={0}
                                        step={0.01}
                                    />
                                </FieldRow>

                                <SectionTitle>
                                    Limiar de Taxa Percentual
                                </SectionTitle>
                                <FieldRow
                                    label="Threshold Depósito (R$)"
                                    description="Valor acima do qual a taxa percentual de depósito é ativada"
                                >
                                    <Input
                                        type="number"
                                        value={
                                            configs.deposit_fixed_fee_threshold
                                        }
                                        onChange={(e) =>
                                            set(
                                                "deposit_fixed_fee_threshold",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-28 text-sm h-8"
                                        min={0}
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Threshold Saque (R$)"
                                    description="Valor acima do qual a taxa percentual de saque é ativada"
                                >
                                    <Input
                                        type="number"
                                        value={
                                            configs.withdrawal_fixed_fee_threshold
                                        }
                                        onChange={(e) =>
                                            set(
                                                "withdrawal_fixed_fee_threshold",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-28 text-sm h-8"
                                        min={0}
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Ativar Taxa % de Depósito"
                                    description="Habilita a cobrança percentual sobre depósitos"
                                >
                                    <Switch
                                        checked={
                                            configs.enabled_percent_fee_deposit
                                        }
                                        onCheckedChange={(v) =>
                                            set(
                                                "enabled_percent_fee_deposit",
                                                v,
                                            )
                                        }
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Ativar Taxa % de Saque"
                                    description="Habilita a cobrança percentual sobre saques"
                                >
                                    <Switch
                                        checked={
                                            configs.enabled_percent_fee_withdrawal
                                        }
                                        onCheckedChange={(v) =>
                                            set(
                                                "enabled_percent_fee_withdrawal",
                                                v,
                                            )
                                        }
                                    />
                                </FieldRow>
                            </TabsContent>

                            {/* LIMITES */}
                            <TabsContent value="limites" className="mt-4">
                                <SectionTitle>Depósito</SectionTitle>
                                <FieldRow label="Depósito Mínimo (R$)">
                                    <Input
                                        type="number"
                                        value={configs.minimum_deposit}
                                        onChange={(e) =>
                                            set(
                                                "minimum_deposit",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-32 text-sm h-8"
                                        min={0}
                                    />
                                </FieldRow>
                                <FieldRow label="Depósito Máximo (R$)">
                                    <Input
                                        type="number"
                                        value={configs.max_deposit}
                                        onChange={(e) =>
                                            set(
                                                "max_deposit",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-32 text-sm h-8"
                                        min={0}
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Máximo por Dia (R$)"
                                    description="Limite total de depósitos por dia"
                                >
                                    <Input
                                        type="number"
                                        value={configs.max_deposit_per_day}
                                        onChange={(e) =>
                                            set(
                                                "max_deposit_per_day",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-32 text-sm h-8"
                                        min={0}
                                    />
                                </FieldRow>

                                <SectionTitle>Saque</SectionTitle>
                                <FieldRow label="Saque Mínimo (R$)">
                                    <Input
                                        type="number"
                                        value={configs.minimum_withdrawal}
                                        onChange={(e) =>
                                            set(
                                                "minimum_withdrawal",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-32 text-sm h-8"
                                        min={0}
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Limite por Saque (R$)"
                                    description="Valor máximo por operação"
                                >
                                    <Input
                                        type="number"
                                        value={configs.limit_withdrawal}
                                        onChange={(e) =>
                                            set(
                                                "limit_withdrawal",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-32 text-sm h-8"
                                        min={0}
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Limite Diário (R$)"
                                    description="Total de saques permitidos por dia"
                                >
                                    <Input
                                        type="number"
                                        value={configs.limit_per_day_withdrawal}
                                        onChange={(e) =>
                                            set(
                                                "limit_per_day_withdrawal",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-32 text-sm h-8"
                                        min={0}
                                    />
                                </FieldRow>
                                <FieldRow label="Limite Diário por Usuário (R$)">
                                    <Input
                                        type="number"
                                        value={
                                            configs.limit_per_day_withdrawal_user
                                        }
                                        onChange={(e) =>
                                            set(
                                                "limit_per_day_withdrawal_user",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-32 text-sm h-8"
                                        min={0}
                                    />
                                </FieldRow>

                                <SectionTitle>Cripto</SectionTitle>
                                <FieldRow label="Saque Mínimo Cripto">
                                    <Input
                                        type="number"
                                        value={configs.min_withdrawal_crypto}
                                        onChange={(e) =>
                                            set(
                                                "min_withdrawal_crypto",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-32 text-sm h-8"
                                        min={0}
                                        step={0.0001}
                                    />
                                </FieldRow>
                                <FieldRow label="Saque Máximo Cripto">
                                    <Input
                                        type="number"
                                        value={configs.max_withdrawal_crypto}
                                        onChange={(e) =>
                                            set(
                                                "max_withdrawal_crypto",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-32 text-sm h-8"
                                        min={0}
                                    />
                                </FieldRow>
                                <FieldRow label="Limite Diário Cripto">
                                    <Input
                                        type="number"
                                        value={
                                            configs.limit_withdraw_crypto_per_day
                                        }
                                        onChange={(e) =>
                                            set(
                                                "limit_withdraw_crypto_per_day",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-32 text-sm h-8"
                                        min={0}
                                    />
                                </FieldRow>
                            </TabsContent>

                            {/* PIX */}
                            <TabsContent value="pix" className="mt-4">
                                <SectionTitle>
                                    Cash In (Recebimento)
                                </SectionTitle>
                                <FieldRow
                                    label="PIX Cash In via API"
                                    description="Permite recebimentos PIX pela API"
                                >
                                    <Switch
                                        checked={configs.pix_cashin_api}
                                        onCheckedChange={(v) =>
                                            set("pix_cashin_api", v)
                                        }
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="PIX Cash In via App"
                                    description="Permite recebimentos PIX pelo aplicativo"
                                >
                                    <Switch
                                        checked={configs.pix_cashin_app}
                                        onCheckedChange={(v) =>
                                            set("pix_cashin_app", v)
                                        }
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="PIX Cash In via Painel"
                                    description="Permite recebimentos PIX pelo painel"
                                >
                                    <Switch
                                        checked={configs.pix_cashin_painel}
                                        onCheckedChange={(v) =>
                                            set("pix_cashin_painel", v)
                                        }
                                    />
                                </FieldRow>

                                <SectionTitle>
                                    Cash Out (Pagamento)
                                </SectionTitle>
                                <FieldRow
                                    label="PIX Cash Out via API"
                                    description="Permite pagamentos PIX pela API"
                                >
                                    <Switch
                                        checked={configs.pix_cashout_api}
                                        onCheckedChange={(v) =>
                                            set("pix_cashout_api", v)
                                        }
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="PIX Cash Out via App"
                                    description="Permite pagamentos PIX pelo aplicativo"
                                >
                                    <Switch
                                        checked={configs.pix_cashout_app}
                                        onCheckedChange={(v) =>
                                            set("pix_cashout_app", v)
                                        }
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="PIX Cash Out via Painel"
                                    description="Permite pagamentos PIX pelo painel"
                                >
                                    <Switch
                                        checked={configs.pix_cashout_painel}
                                        onCheckedChange={(v) =>
                                            set("pix_cashout_painel", v)
                                        }
                                    />
                                </FieldRow>
                            </TabsContent>

                            {/* GERAL */}
                            <TabsContent value="geral" className="mt-4">
                                <SectionTitle>Comportamento</SectionTitle>
                                <FieldRow
                                    label="Aprovação Automática de Saques"
                                    description="Aprova saques automaticamente sem revisão manual"
                                >
                                    <Switch
                                        checked={
                                            configs.auto_approve_withdrawal
                                        }
                                        onCheckedChange={(v) =>
                                            set("auto_approve_withdrawal", v)
                                        }
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Modo Sandbox"
                                    description="Ativa o ambiente de testes, transações não são reais"
                                >
                                    <Switch
                                        checked={configs.sandbox_mode}
                                        onCheckedChange={(v) =>
                                            set("sandbox_mode", v)
                                        }
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Atraso no Saque (min)"
                                    description="Tempo de espera em minutos antes de processar saques"
                                >
                                    <Input
                                        type="number"
                                        value={configs.withdrawal_delay_minutes}
                                        onChange={(e) =>
                                            set(
                                                "withdrawal_delay_minutes",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-28 text-sm h-8"
                                        min={0}
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Rate Limit (req/min)"
                                    description="Máximo de requisições por minuto por usuário"
                                >
                                    <Input
                                        type="number"
                                        value={configs.rate_limit_per_minute}
                                        onChange={(e) =>
                                            set(
                                                "rate_limit_per_minute",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-28 text-sm h-8"
                                        min={1}
                                    />
                                </FieldRow>

                                <SectionTitle>Restrições</SectionTitle>
                                <FieldRow
                                    label="Dias Bloqueados"
                                    description="Dias da semana sem operações (ex: 0,6 para Dom e Sáb)"
                                >
                                    <Input
                                        value={configs.days_blocked ?? ""}
                                        onChange={(e) =>
                                            set(
                                                "days_blocked",
                                                e.target.value || null,
                                            )
                                        }
                                        placeholder="ex: 0,6"
                                        className="w-32 text-sm h-8"
                                    />
                                </FieldRow>
                                <FieldRow
                                    label="Horário de Funcionamento"
                                    description="Intervalo permitido (ex: 08:00-22:00)"
                                >
                                    <Input
                                        value={configs.operating_hours ?? ""}
                                        onChange={(e) =>
                                            set(
                                                "operating_hours",
                                                e.target.value || null,
                                            )
                                        }
                                        placeholder="08:00-22:00"
                                        className="w-36 text-sm h-8"
                                    />
                                </FieldRow>
                            </TabsContent>
                        </Tabs>
                    )}
                </CredenzaBody>

                {configs && !loading && (
                    <div className="shrink-0 border-t border-border/40 pt-4 px-4 md:px-0 pb-2 flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="min-w-24"
                        >
                            {saving ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                )}
            </CredenzaContent>
        </Credenza>
    );
};

export default ConfigsModal;
