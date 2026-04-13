import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In | Tarkam Admin"
        description="Login panel admin untuk mengelola frontend Tarkam dan tarkam-api."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
