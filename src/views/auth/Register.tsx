import { useTranslation } from "../../hooks/useTranslation";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/supabase/client";
import SweetModal from "@/components/modals/SweetAlert";
import TextErrorSmall from "@/components/general/TextErrorSmall";
import HCaptcha from "@hcaptcha/react-hcaptcha";

// Esquema de validación con Zod
const registerSchema = z.object({
  name: z.string().min(1, "nameRequired"),
  email: z.email("emailRequired"),
  password: z
    .string()
    .min(8, "passwordRequired8")
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "passwordRequiredPattern"),
});

// Tipo TypeScript derivado del esquema
type RegisterFormData = z.infer<typeof registerSchema>;
const captchaKey = import.meta.env.VITE_HCAPTCHA_SITEKEY;

const Register = () => {
  const captcha = useRef<HCaptcha>(null);

  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (formData: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          captchaToken,
          data: {
            first_name: formData.name,
          },
        },
      });

      if (error) {
        setError("root", { message: error.message });
        return;
      }

      if (authData && !error) {
        SweetModal(
          "success",
          t("auth.registerSuccessTitle"),
          t("auth.validateEmail"),
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
      captcha?.current?.resetCaptcha();
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="min-h-screen flex">
        {/* Left Column - Background Image */}
        <div className="hidden lg:flex md:w-[60%] register-background relative"></div>

        {/* Right Column - Login Form */}
        <div className="w-full lg:w-[40%] flex items-center justify-center bg-gray-50 p-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="flex items-center justify-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {t("auth.registerTitle")}
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    {`${t("common.name")} *`}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("auth.namePlaceholder")}
                    className={`w-full ${
                      errors.name ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    {...register("name")}
                  />
                  {errors.name && (
                    <TextErrorSmall error={t(`auth.${errors.name.message}`)} />
                  )}
                </div>

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
                    <TextErrorSmall error={t(`auth.${errors.email.message}`)} />
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
                    <TextErrorSmall
                      error={t(`auth.${errors.password.message}`)}
                    />
                  )}
                </div>
              </div>

              {/* Error general del formulario */}
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errors.root.message}</p>
                </div>
              )}

              <div className="flex justify-center">
                <HCaptcha
                  ref={captcha}
                  sitekey={captchaKey}
                  onVerify={(token) => {
                    console.log("verificado token", token);
                    setCaptchaToken(token);
                  }}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || !captchaToken}
              >
                {isLoading ? t("common.loading") : t("auth.registerButton")}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {t("auth.haveAccount")}{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    {t("auth.signIn")}
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

export default Register;
