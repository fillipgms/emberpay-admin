"use server";

import axios from "axios";
import { getSession } from "./auth";
import { redirect } from "next/navigation";
import { getFriendlyHttpErrorMessage } from "@/lib/httpError";

export async function getConfigs() {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/configs`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            },
        );

        return res.data;
    } catch (error) {
        const apiMessage = (error as { response?: { data?: { msg?: string } } })
            ?.response?.data?.msg;
        if (
            axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 403)
        ) {
            redirect("/login");
        }

        throw Error(
            apiMessage ||
                getFriendlyHttpErrorMessage(
                    error,
                    "Houve um erro, tente novamente",
                ),
        );
    }
}

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

export async function updateConfigs(configs: Configs) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    const {
        limit_withdrawal,
        limit_per_day_withdrawal_user,
        limit_per_day_withdrawal,
        minimum_withdrawal,
        minimum_deposit,
        max_deposit,
        max_deposit_per_day,
        fee_withdrawal,
        fee_deposit,
        fee_withdrawal_fixed,
        fee_deposit_fixed,
        gateway_deposit_app,
        gateway_withdrawal_app,
        gateway_deposit_painel,
        gateway_withdrawal_painel,
        gateway_deposit,
        gateway_withdrawal,
        deposit_fixed_fee_threshold,
        withdrawal_fixed_fee_threshold,
        enabled_percent_fee_withdrawal,
        enabled_percent_fee_deposit,
        pix_cashin_api,
        pix_cashin_app,
        pix_cashin_painel,
        pix_cashout_api,
        pix_cashout_app,
        pix_cashout_painel,
        withdrawal_delay_minutes,
        auto_approve_withdrawal,
        sandbox_mode,
    } = configs;

    try {
        const res = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/configs`,
            {
                limit_withdrawal,
                limit_per_day_withdrawal_user,
                limit_per_day_withdrawal,
                minimum_withdrawal,
                minimum_deposit,
                max_deposit,
                max_deposit_per_day,
                fee_withdrawal,
                fee_deposit,
                fee_withdrawal_fixed,
                fee_deposit_fixed,
                gateway_deposit_app,
                gateway_withdrawal_app,
                gateway_deposit_painel,
                gateway_withdrawal_painel,
                gateway_deposit,
                gateway_withdrawal,
                deposit_fixed_fee_threshold,
                withdrawal_fixed_fee_threshold,
                enabled_percent_fee_withdrawal,
                enabled_percent_fee_deposit,
                pix_cashin_api,
                pix_cashin_app,
                pix_cashin_painel,
                pix_cashout_api,
                pix_cashout_app,
                pix_cashout_painel,
                withdrawal_delay_minutes,
                auto_approve_withdrawal,
                sandbox_mode,
            },
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            },
        );

        return {
            success: true,
            data: res.data,
        };
    } catch (error) {
        const apiMessage = (error as { response?: { data?: { msg?: string } } })
            ?.response?.data?.msg;
        if (
            axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 403)
        ) {
            redirect("/login");
        }

        return {
            success: false,
            msg:
                apiMessage ||
                getFriendlyHttpErrorMessage(
                    error,
                    "Houve um erro, tente novamente",
                ),
        };
    }
}
