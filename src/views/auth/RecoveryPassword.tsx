import { useTranslation } from "../../hooks/useTranslation";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/supabase/client";
import SweetModal from "@/components/modals/SweetAlert";

// Esquema de validación con Zod
const recoverySchema = z.object({
  email: z.email("emailRequired"),
});

// Tipo TypeScript derivado del esquema
type RecoveryFormData = z.infer<typeof recoverySchema>;

const RecoveryPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData: RecoveryFormData) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: "/login",
        }
      );

      if (error) {
        setError("root", { message: error.message });
        return;
      }

      if (!error) {
        SweetModal(
          "success",
          t("common.success"),
          t("auth.recoverPasswordSuccess"),
          t("common.Ok")
        );

        navigate("/login");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="min-h-screen flex">
        {/* Left Column */}
        <div className="w-full lg:w-[40%] flex items-center justify-center bg-gray-50 p-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="flex items-center justify-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {t("auth.loginSubtitle")}
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    {`${t("common.email")} *`}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t("auth.emailPlaceholder")}
                    className={`w-full ${
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <small className="text-red-500 mt-1">
                      {t(`auth.${errors.email.message}`)}
                    </small>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? t("common.loading") : t("auth.recover")}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  <Link
                    to="/"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    {t("common.goBack")}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column*/}
        <div className="hidden lg:flex md:w-[60%] reset-background relative"></div>
      </div>
    </>
  );
};

export default RecoveryPassword;
