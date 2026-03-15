"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { User, Phone, Lock, Eye, EyeOff } from "lucide-react";
import "@/styles/components/auth.scss";

const registerSchema = z
  .object({
    name: z.string().min(2, "Tên ít nhất 2 ký tự"),
    phone: z
      .string()
      .regex(/^(0|\+84)[3-9]\d{8}$/, "Số điện thoại không hợp lệ"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setServerError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        password: data.password,
      }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setServerError(json.error ?? "Đăng ký thất bại, thử lại sau.");
      setLoading(false);
      return;
    }

    // Auto sign-in after register
    await signIn("credentials", {
      phone: data.phone,
      password: data.password,
      redirect: false,
    });

    setLoading(false);
    router.push("/tai-khoan");
    router.refresh();
  };

  return (
    <div className="rethink-auth">
      <div className="rethink-auth__card">
        <div className="rethink-auth__logo">
          <span>VTNN Tư Hồ</span>
          <p>Vật tư nông nghiệp chất lượng cao</p>
        </div>

        <h1 className="rethink-auth__title">Đăng ký tài khoản</h1>

        <form className="rethink-auth__form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {serverError && (
            <div className="rethink-auth__server-error">{serverError}</div>
          )}

          <div className="rethink-auth__form-group">
            <label htmlFor="name">Họ và tên</label>
            <div className="rethink-auth__input-wrap">
              <User />
              <input
                id="name"
                type="text"
                placeholder="Nguyễn Văn A"
                className={errors.name ? "error" : ""}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <span className="rethink-auth__error-msg">{errors.name.message}</span>
            )}
          </div>

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
                placeholder="Ít nhất 6 ký tự"
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

          <div className="rethink-auth__form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <div className="rethink-auth__input-wrap">
              <Lock />
              <input
                id="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                className={errors.confirmPassword ? "error" : ""}
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
              />
              <button
                type="button"
                className="rethink-auth__input-wrap__toggle"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="rethink-auth__error-msg">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button type="submit" className="rethink-auth__submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="rethink-auth__divider">hoặc</div>

        <p className="rethink-auth__footer">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
