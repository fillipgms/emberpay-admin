"use server";

import axios from "axios";
import { getSession } from "./auth";
import { redirect } from "next/navigation";
import { getFriendlyHttpErrorMessage } from "@/lib/httpError";

export async function getTransactionsData(
    filter?: string,
    user?: string,
    status?: string,
    apply?: string,
    start_date?: string,
    end_date?: string,
    search?: string,
) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    const params = new URLSearchParams();
    if (filter) params.append("filter", filter);
    if (user) params.append("user", user);
    if (status) params.append("status", status);
    if (apply) params.append("apply", apply);
    if (start_date) params.append("start_date", start_date);
    if (end_date) params.append("end_date", end_date);
    if (search) params.append("search", search);

    try {
        const res = await axios(
            `${process.env.NEXT_PUBLIC_API_URL}/transactions?${params.toString()}`,
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

export async function approveTransaction(id: string) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    try {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/transaction/approve/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            },
        );

        return {
            success: true,
            msg: res.data.msg,
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

export async function returnTransaction(id: string) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    try {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/transaction/refund/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            },
        );

        return {
            success: true,
            msg: res.data.msg,
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
