import ResetPasswordForm from "./reset-password-form";

export const instant = false;

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token, error } = await searchParams;

  return (
    <ResetPasswordForm
      token={token ?? ""}
      invalidToken={error === "INVALID_TOKEN"}
    />
  );
}
