"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import "@/styles/components/contact.scss";
import "@/styles/components/auth.scss";

const schema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ và tên"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ").max(12, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  subject: z.string().optional(),
  message: z.string().min(10, "Nội dung ít nhất 10 ký tự"),
});

type ContactForm = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ContactForm) => {
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("server error");
      setSubmitted(true);
    } catch {
      setServerError("Có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline.");
    }
  };

  return (
    <div className="rethink-contact">
      <div className="rethink-contact__header">
        <h1>Liên hệ với chúng tôi</h1>
        <p>Đội ngũ hỗ trợ của VTNN Tư Hồ luôn sẵn sàng giải đáp mọi thắc mắc của bạn</p>
      </div>

      <div className="rethink-contact__layout">
        {/* Form */}
        <div className="rethink-contact__form-card">
          <h2 className="rethink-contact__form-title">Gửi tin nhắn cho chúng tôi</h2>

          {submitted ? (
            <div className="rethink-contact__success">
              <CheckCircle size={40} style={{ margin: "0 auto 12px", display: "block", color: "#2E7D32" }} />
              Tin nhắn đã được gửi thành công!
              <p>Chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ làm việc.</p>
            </div>
          ) : (
            <form className="rethink-contact__form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {serverError && (
                <div className="rethink-auth__server-error">{serverError}</div>
              )}

              <div className="rethink-contact__form-row">
                <div className="rethink-contact__form-group">
                  <label htmlFor="name">Họ và tên *</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className={errors.name ? "error" : ""}
                    {...register("name")}
                  />
                  {errors.name && <span className="rethink-auth__error-msg">{errors.name.message}</span>}
                </div>

                <div className="rethink-contact__form-group">
                  <label htmlFor="phone">Số điện thoại *</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="098 99 77 884"
                    className={errors.phone ? "error" : ""}
                    {...register("phone")}
                  />
                  {errors.phone && <span className="rethink-auth__error-msg">{errors.phone.message}</span>}
                </div>
              </div>

              <div className="rethink-contact__form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className={errors.email ? "error" : ""}
                  {...register("email")}
                />
                {errors.email && <span className="rethink-auth__error-msg">{errors.email.message}</span>}
              </div>

              <div className="rethink-contact__form-group">
                <label htmlFor="subject">Chủ đề</label>
                <select id="subject" {...register("subject")}>
                  <option value="">-- Chọn chủ đề --</option>
                  <option value="product">Tư vấn sản phẩm</option>
                  <option value="order">Hỏi về đơn hàng</option>
                  <option value="delivery">Vận chuyển &amp; giao hàng</option>
                  <option value="return">Đổi trả hàng</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div className="rethink-contact__form-group">
                <label htmlFor="message">Nội dung *</label>
                <textarea
                  id="message"
                  placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                  className={errors.message ? "error" : ""}
                  {...register("message")}
                />
                {errors.message && <span className="rethink-auth__error-msg">{errors.message.message}</span>}
              </div>

              <button type="submit" className="rethink-contact__submit" disabled={isSubmitting}>
                <Send size={16} />
                {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
              </button>
            </form>
          )}
        </div>

        {/* Info sidebar */}
        <div className="rethink-contact__info">
          <div className="rethink-contact__info-card">
            <h3>Thông tin liên hệ</h3>

            <div className="rethink-contact__info-item">
              <MapPin size={18} />
              <span>
                <strong>Địa chỉ</strong>
                98 Ấp Thạnh Lập, xã Thạnh Phú, huyện Thạnh Hóa, tỉnh Long An
              </span>
            </div>

            <div className="rethink-contact__info-item">
              <Phone size={18} />
              <span>
                <strong>Hotline</strong>
                098 99 77 884
              </span>
            </div>

            <div className="rethink-contact__info-item">
              <Mail size={18} />
              <span>
                <strong>Email</strong>
                vtnntuho.2010@gmail.com
              </span>
            </div>

            <div className="rethink-contact__info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48"><path fill="#2962ff" d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10c4.722,0,8.883-2.348,11.417-5.931V36H15z"></path><path fill="#eee" d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z"></path><path fill="#2962ff" d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z"></path><path fill="#2962ff" d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z"></path><path fill="#2962ff" d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z"></path><path fill="#2962ff" d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z"></path></svg>
              <span>
                <strong>Zalo</strong>
                <a href="https://zalo.me/0989977884" target="_blank" rel="noopener noreferrer"
                  style={{ color: "#0068FF", fontWeight: 600 }}>
                  098 99 77 884
                </a>
              </span>
            </div>
          </div>

          <div className="rethink-contact__info-card">
            <h3>Giờ làm việc</h3>
            <table className="rethink-contact__hours">
              <tbody>
                <tr><td>Thứ 2 – Chủ nhật</td><td>7:00 – 22:00</td></tr>
              </tbody>
            </table>
          </div>

          <div className="rethink-contact__info-card">
            <h3>
              <Clock size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
              Thời gian phản hồi
            </h3>
            <div className="rethink-contact__info-item">
              <span>Hotline: Phản hồi <strong style={{ display: "inline" }}>ngay lập tức</strong> trong giờ làm việc</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
