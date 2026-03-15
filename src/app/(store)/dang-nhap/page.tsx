"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";
import "@/styles/components/auth.scss";

const loginSchema = z.object({
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(12, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? (searchParams.get("from") === "admin" ? "/admin" : "/tai-khoan");

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setServerError("");

    const result = await signIn("credentials", {
      phone: data.phone,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setServerError("Số điện thoại hoặc mật khẩu không đúng.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="rethink-auth">
      <div className="rethink-auth__card">
        <div className="rethink-auth__logo">
          <span>VTNN Tư Hồ</span>
          <p>Vật tư nông nghiệp chất lượng cao</p>
        </div>

        <h1 className="rethink-auth__title">Đăng nhập</h1>

        <form className="rethink-auth__form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {serverError && (
            <div className="rethink-auth__server-error">{serverError}</div>
          )}

          <div className="rethink-auth__form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <div className="rethink-auth__input-wrap">
              <Phone />
              <input
                id="phone"
                type="tel"
                placeholder="0912 345 678"
                className={errors.phone ? "error" : ""}
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <span className="rethink-auth__error-msg">{errors.phone.message}</span>
            )}
          </div>

          <div className="rethink-auth__form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="rethink-auth__input-wrap">
              <Lock />
              <input
                id="password"
                placeholder="Nhập mật khẩu"
                className={errors.password ? "error" : ""}
                {...register("password")}
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                className="rethink-auth__input-wrap__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className="rethink-auth__error-msg">{errors.password.message}</span>
            )}
          </div>

          <div className="rethink-auth__forgot">
            <Link href="/quen-mat-khau">Quên mật khẩu?</Link>
          </div>

          <button type="submit" className="rethink-auth__submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="rethink-auth__divider">hoặc</div>

        <p className="rethink-auth__footer">
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
