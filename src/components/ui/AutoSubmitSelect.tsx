"use client";

import { useRouter } from "next/navigation";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export default function AutoSubmitSelect({ children, ...props }: Props) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const form = e.target.form as HTMLFormElement | null;
    if (!form) return;
    const data = new FormData(form);
    data.set(e.target.name, e.target.value);
    const qs = new URLSearchParams([...data.entries()] as [string, string][]).toString();
    const action = form.getAttribute("action") ?? "";
    router.push(`${action}${qs ? "?" + qs : ""}`);
  }

  return (
    <select {...props} onChange={handleChange}>
      {children}
    </select>
  );
}
