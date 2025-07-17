import { useTranslation } from "../hooks/useTranslation";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

const Login = () => {
  const { t } = useTranslation();

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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  {t("auth.loginTitle")}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  {t("auth.loginSubtitle")}
                </p>
              </div>
            </div>

            <form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t("common.email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder={t("auth.emailPlaceholder")}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t("common.password")}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder={t("auth.passwordPlaceholder")}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    {t("auth.forgotPassword")}
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                {t("auth.loginButton")}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {t("auth.noAccount")}{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    {t("auth.signUp")}
                  </a>
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
