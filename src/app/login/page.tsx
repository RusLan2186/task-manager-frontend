"use client";

import { FormField, Title } from "@/components";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { login } from "@/lib/api/auth.api";
import { mapApiError } from "@/lib/axios";
import type { Login } from "@/lib/validators";
import { loginSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { toast } from "sonner";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();
  const { refetchUser } = useAuth();

  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  React.useEffect(() => {
    if (verified) {
      toast.success("Email verified. You can now log in.");
    }
  }, [verified]);

  const onSubmit = async (data: Login) => {
    setError("");
    setIsLoading(true);
    try {
      await login(data);
      await refetchUser();
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err: unknown) {
      const parsedError = mapApiError(err, {
        badRequest: "Invalid email or password.",
        unauthorized: "Invalid email or password.",
        forbidden: "Please verify your email before logging in.",
        tooManyRequests: "Too many login attempts. Try again later.",
      });
      if (parsedError.shouldLog) {
        console.error("Login failed:", err);
      }

      setError(parsedError.message);
      toast.error(parsedError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col m-auto mt-20 w-full max-w-md bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="">
        <Title className="mb-6 text-center" text="Login" size="lg" />

        <div className="flex flex-col gap-5">
          <FormField label="Email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              disabled={isLoading}
            />
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              disabled={isLoading}
            />
          </FormField>

          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-500 mt-4 p-3 bg-red-50 rounded border border-red-200">
            {error}
          </p>
        )}
      </form>

      <div className="mt-4 text-center flex flex-col gap-4">
        <a
          className="text-green-600 font-bold"
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
        >
          <Button variant="outline" className="w-full flex items-center gap-5">
            <Image src="/google.avif" alt="Google" width={20} height={20} />
            Login with Google
          </Button>
        </a>

        <a
          className="text-green-600 font-bold"
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}
        >
          <Button variant="outline" className="w-full flex items-center gap-5">
            <Image src="/github.png" alt="Fithub" width={25} height={25} />
            Login with GitHub
          </Button>
        </a>
      </div>
    </div>
  );
}
