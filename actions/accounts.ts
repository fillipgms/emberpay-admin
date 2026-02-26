"use server";

import axios from "axios";
import { getSession } from "./auth";
import { getFriendlyHttpErrorMessage } from "@/lib/httpError";
import { redirect } from "next/navigation";

export async function getAccountsData(
    search?: string,
    verify?: string,
    page?: string,
) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (verify && verify !== "all") params.append("verify", verify);
    if (page) params.append("page", page);

    try {
        const res = await axios(
            `${process.env.NEXT_PUBLIC_API_URL}/accounts?${params.toString()}`,
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

export async function getSpecificAccount(id: string) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    try {
        const res = await axios(
            `${process.env.NEXT_PUBLIC_API_URL}/accounts/${id}`,
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

export async function getAccountImages(id: string) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    try {
        const res = await axios(
            `${process.env.NEXT_PUBLIC_API_URL}/images/${id}`,
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

export async function approveAccount(id: string) {
    const session = await getSession();
    if (!session?.accessToken) {
        return { success: false, msg: "Não autenticado" };
    }

    try {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/accounts/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            },
        );

        return { success: true, data: res.data };
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
                    "Houve um erro ao aprovar a conta",
                ),
        };
    }
}

export async function rejectAccount(id: string) {
    const session = await getSession();
    if (!session?.accessToken) {
        return { success: false, msg: "Não autenticado" };
    }

    try {
        const res = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/accounts/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            },
        );

        return { success: true, data: res.data };
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
                    "Houve um erro ao rejeitar a conta",
                ),
        };
    }
}
