"use server";

import axios from "axios";
import { getSession } from "./auth";
import { getFriendlyHttpErrorMessage } from "@/lib/httpError";
import { redirect } from "next/navigation";

export async function getUsersData(
    search?: string,
    auto_approve_withdrawal?: string,
    enabled_withdraw?: string,
    enabled_deposit?: string,
    balance?: string,
    in_filter?: string,
    out_filter?: string,
    page?: string,
) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (auto_approve_withdrawal)
        params.append("auto_approve_withdrawal", auto_approve_withdrawal);
    if (enabled_withdraw) params.append("enabled_withdraw", enabled_withdraw);
    if (enabled_deposit) params.append("enabled_deposit", enabled_deposit);
    if (balance) params.append("balance", balance);
    if (in_filter) params.append("in", in_filter);
    if (out_filter) params.append("out", out_filter);
    if (page) params.append("page", page);

    try {
        const res = await axios(
            `${process.env.NEXT_PUBLIC_API_URL}/users?${params.toString()}`,
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

export async function getSpecificUser(id: string) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    try {
        const res = await axios(
            `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`,
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
