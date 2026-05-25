"use client";

import { FormField, Title } from "@/components";
import { Button, Input } from "@/components/ui";
import { mapApiError } from "@/lib/axios";
import { registerUser } from "@/lib/api/auth.api";
import type { Register } from "@/lib/validators";
import { registerSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const onSubmit = async (data: Register) => {
    setError("");
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success("Registration successful. Check your email for the code.");
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      const parsedError = mapApiError(err, {
        badRequest: "Please check the entered data.",
        conflict: "A user with this email already exists.",
        unprocessable: "Please check the entered data.",
        tooManyRequests: "Too many registration attempts. Try again later.",
      });

      if (parsedError.shouldLog) {
        console.error("Registration failed:", err);
      }

      setError(parsedError.message);
      toast.error(parsedError.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-md bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Title className="mb-6 text-center" text="Register" size="lg" />

          <div className="flex flex-col gap-5">
            <FormField label="Name" error={errors.name?.message}>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                {...register("name")}
                disabled={isLoading}
              />
            </FormField>

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
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-4 p-3 bg-red-50 rounded border border-red-200">
              {error}
            </p>
          )}
        </form>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          <span>or continue with</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="text-center flex flex-col gap-4">
          <a
            className="text-green-600 font-bold"
            href="http://localhost:5000/auth/google"
          >
            <Button
              variant="outline"
              className="w-full flex items-center gap-5"
            >
              <Image src="/google.avif" alt="Google" width={20} height={20} />
              Continue with Google
            </Button>
          </a>

          <a
            className="text-green-600 font-bold"
            href="http://localhost:5000/auth/github"
          >
            <Button
              variant="outline"
              className="w-full flex items-center gap-5"
            >
              <Image src="/github.png" alt="GitHub" width={25} height={25} />
              Continue with GitHub
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
