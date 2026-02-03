import AuthLayout from "../component/auth/authlayout";
import LoginForm from "../component/auth/loginform";

export default function LoginPage() {
  return (
    <AuthLayout title="">
      <h1 style={{ fontSize: "25px", fontWeight: "600", color: "white" }}>
        Welcome To <span style={{ color: "#B6FF00" }}>HealthSync</span>
      </h1>

      <p style={{ marginTop: "8px", fontSize: "14px", color: "#d1d5db" }}>
        Hello There, Please Sign In To Continue
      </p> 

      <LoginForm />
      
    </AuthLayout>
  );
}
