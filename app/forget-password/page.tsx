import AuthLayout from "../component/auth/authlayout";
import ForgotPasswordForm from "../component/auth/forgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="">
      <h1 style={{ fontSize: "25px", fontWeight: "600", color: "white" }}>
        Reset Your <span style={{ color: "#B6FF00" }}>Password</span>
      </h1>

      <p style={{ marginTop: "8px", fontSize: "14px", color: "#d1d5db" }}>
        Enter your email address and we'll send you a link to reset your password
      </p>

      <ForgotPasswordForm />
    </AuthLayout>
  );
}
