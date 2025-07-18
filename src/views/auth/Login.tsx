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

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z.email("emailRequired"),
  password: z.string().min(1, "passwordRequired"),
});

// Tipo TypeScript derivado del esquema
type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: LoginFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError("root", { message: error.message });
        return;
      }

      navigate("/admin");
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
        {/* Left Column - Background Image */}
        <div className="hidden lg:flex md:w-[60%] login-background relative">
          {/* Optional overlay or content for the image */}
          <div className="w-full h-full bg-opacity-20 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
              <p className="text-xl">Sign in to your account</p>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
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
                    placeholder={t("auth.passwordPlaceholder")}
                    className={`w-full ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                    {...register("password")}
                  />
                  {errors.password && (
                    <small className="text-red-500 mt-1">
                      {t(`auth.${errors.password.message}`)}
                    </small>
                  )}
                </div>
              </div>

              {/* Error general del formulario */}
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errors.root.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    {t("auth.forgotPassword")}
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? t("common.loading") : t("auth.loginButton")}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {t("auth.noAccount")}{" "}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    {t("auth.signUp")}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
