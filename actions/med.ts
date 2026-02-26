"use server";

import axios from "axios";
import { getSession } from "./auth";
import { redirect } from "next/navigation";
import { getFriendlyHttpErrorMessage } from "@/lib/httpError";

export async function getMedData(user?: string, page?: string) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    const params = new URLSearchParams();
    if (user) params.append("user", user);
    if (page) params.append("page", page);

    try {
        const res = await axios(
            `${process.env.NEXT_PUBLIC_API_URL}/med?${params.toString()}`,
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

export async function revertMed(id: number) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    try {
        const res = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/med/${id}`,
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

export async function finishMed(id: number) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    try {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/med_finished/${id}`,
            {},
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
