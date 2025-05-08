import { useState, useEffect } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button, } from "@heroui/react";
import { Tabs, Tab } from "@heroui/react";

import { useNavigate } from "react-router";

import { saveAuthData } from "../../utils/authStorage";
import { formatErrorMessage } from "../../utils/formatErrorMessage";

import { auth } from "../../api/auth";

import type { Key } from "react";

type Mode = 'login' | 'register';


const AuthForm = () => {
    const [mode, setMode] = useState<Mode>("login");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | string[] | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        setError(null)
    }, [mode])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const { email, password } = data;

        const result = await auth(email as string, password as string, mode);

        if ("statusCode" in result) {
            setError(formatErrorMessage(result))
            setIsLoading(false)
        } else {
            saveAuthData(result);
            navigate("/");
        }
    };

    const handleChangeMode = (key: Key) => {
        setMode(key as Mode)
    }

    return (
        <div className="w-full max-w-xs mx-auto border-1 rounded-md border-grey-900 p-10 bg-white ">
            <h1 className="text-3xl font-bold text-center text-black mb-6">PARKING</h1>
            <Tabs
                variant="underlined"
                onSelectionChange={handleChangeMode}
                selectedKey={mode}
                size='lg'
            >
                <Tab key="login" title="Вход" />
                <Tab key="register" title="Регистрация" />
            </Tabs>

            <Form onSubmit={handleSubmit}
                className="mt-4">
                <Input
                    labelPlacement="outside"
                    placeholder="Email"
                    radius="sm"
                    label="Email"
                    name="email"
                    required
                />
                <Input
                    radius="sm"
                    label="Пароль"
                    name="password"
                    type="password"
                    labelPlacement="outside"
                    placeholder="Password"
                    required
                />
                <Button type="submit" className="w-full mt-4" radius="sm" color="primary" isLoading={isLoading}>
                    {mode === "login" ? "Войти" : "Зарегистрироваться"}
                </Button>

                {error && (
                    <div className="text-red-600 w-full center text-sm mt-2">{error}</div>
                )}

            </Form>
        </div>
    );
};

export default AuthForm;
