import { setValue } from "@/redux/auth.slice";
import { RootState } from "@/redux/store";
import { handleGetCurrentUser } from "@/utils/axios/auth.axios";
import refresh from "@/utils/helpers/refresh";
import { useRouter } from "next/router";
import React, { FC, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

interface PersistLayoutProps {
    children: React.ReactNode
}

const PersistLayout: FC<PersistLayoutProps> = ({ children }) => {

    const token = useSelector<RootState>(state => state.auth.token) as string
    const forceLogout = useSelector<RootState>(state => state.auth.forceLogout) as boolean
    const dispatch = useDispatch()

    const router = useRouter()

    useQuery('/auth/current', handleGetCurrentUser, {
        enabled: !!token,
        onSuccess: (data) => {
            dispatch(setValue({ user: { ...data } }))
        }
    })

    const firstMount = useRef(true);

    useEffect(() => {
        firstMount.current && refresh().catch(err => {
            console.log(err);
        })
        return () => {
            firstMount.current = false
        }
    }, [])

    useEffect(() => {
        forceLogout && router.push('/login')
    }, [forceLogout, router])

    return <>{children}</>;
};

export default PersistLayout;
