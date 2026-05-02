import { ClerkProvider } from "@clerk/nextjs";
import "./auth.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <div className="auth-layout">
        {children}
      </div>
    </ClerkProvider>
  );
}
