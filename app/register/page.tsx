import AuthLayout from "../component/auth/authlayout";
import RegisterForm from "../component/auth/registration";

export default function RegisterPage() {
  return (
    <AuthLayout title="">
      <h1 style={{ fontSize: "25px", fontWeight: "600", color: "white" }}>
        Create Account
      </h1>

      <p style={{ marginTop: "8px", fontSize: "14px", color: "#d1d5db" }}>
        Please Enter Your Credentials To Proceed
      </p>

      <RegisterForm />
    </AuthLayout>
  );
}
