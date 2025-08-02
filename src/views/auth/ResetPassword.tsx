import { useTranslation } from "../../hooks/useTranslation";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/supabase/client";
import SweetModal from "@/components/modals/SweetAlert";
import { useAuth } from "@/hooks/useAuth";
import TextErrorSmall from "@/components/general/TextErrorSmall";

const recoverySchema = z.object({
  password: z
    .string()
    .min(8, "passwordRequired8")
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "passwordRequiredPattern"),
});

// Tipo TypeScript derivado del esquema
type RecoveryFormData = z.infer<typeof recoverySchema>;

const RessetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      SweetModal(
        "error",
        t("common.error"),
        t("auth.notAuthorized"),
        t("common.Ok")
      );
      navigate("/login");
    }
  }, [user, loading, navigate, t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (formData: RecoveryFormData) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: formData.password,
      });

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
      <div className="absolute top-4 right-4 z-20 text-white">
        <LanguageSwitcher />
      </div>
      <div className="min-h-screen flex">
        {/* Left Column */}
        <div className="w-full lg:w-[40%] flex items-center justify-center bg-gray-50 p-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="flex items-center justify-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {t("auth.recoveryTitle")}
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    {`${t("common.password")} *`}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder={t("auth.passwordResetPlaceholder")}
                    className={`w-full ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                    {...register("password")}
                  />
                  {errors.password && (
                    <TextErrorSmall error={t(`auth.${errors.password.message}`)} />
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? t("common.loading") : t("common.save")}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column*/}
        <div className="hidden lg:flex md:w-[60%] reset-background relative"></div>
      </div>
    </>
  );
};

export default RessetPassword;
