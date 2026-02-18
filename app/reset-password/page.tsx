import AuthLayout from "../component/auth/authlayout";
import ResetPasswordForm from "../component/auth/resetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="">
      <h1 style={{ fontSize: "25px", fontWeight: "600", color: "white" }}>
        Create New <span style={{ color: "#B6FF00" }}>Password</span>
      </h1>

      <p style={{ marginTop: "8px", fontSize: "14px", color: "#d1d5db" }}>
        Enter your new password below
      </p>

      <ResetPasswordForm />
    </AuthLayout>
  );
}
