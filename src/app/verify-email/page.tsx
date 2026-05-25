"use client";
import React from "react";
import { Button, Input } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { verifyEmail } from "@/lib/api/auth.api";
import { mapApiError } from "@/lib/axios";
import { toast } from "sonner";

export default function VerifyEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
    },
  });

  const router = useRouter();
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const onSubmit = async (data: { code: string }) => {
    setError("");
    setIsLoading(true);
    try {
      if (!email) {
        setError("Email not found");
        toast.error("Email not found");
        return;
      }
      await verifyEmail(email, data.code);
      toast.success("Email verified successfully");
      router.push("/login?verified=true");
    } catch (err: unknown) {
      const parsedError = mapApiError(err, {
        badRequest: "Invalid verification code. Please try again.",
        tooManyRequests: "Too many attempts. Try again later.",
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
    <>
      <h1>Verify Your Email</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-auto mt-20 flex w-full max-w-md flex-col justify-center gap-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <Input
          id="verification-code"
          type="text"
          placeholder="Enter verification code"
          {...register("code")}
        />

        <Button className="w-full" type="submit">
          Verify
        </Button>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </form>
    </>
  );
}
