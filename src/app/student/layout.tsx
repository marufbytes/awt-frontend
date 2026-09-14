import { AuthProvider } from "@/lib/student/auth-context";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
