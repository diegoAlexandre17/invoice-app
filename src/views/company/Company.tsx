import { useState, useEffect } from "react";
import { Edit, Save, X, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/general/Loader";
import SweetModal from "@/components/modals/SweetAlert";
import TextErrorSmall from "@/components/general/TextErrorSmall";

// Tipos para los datos de la empresa
interface CompanyData {
  id?: string;
  user_id?: string;
  name: string;
  address: string;
  identification: string;
  phone: string;
  email: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}

type CompanyFormData = Omit<
  CompanyData,
  "id" | "user_id" | "created_at" | "updated_at"
>;

// Zod schema for company validation
const companySchema = z.object({
  name: z.string().min(1, "nameRequired").max(60, "maxLength60"),
  email: z.email("emailRequired"),
  address: z.string().min(1, "addressRequired").max(120, "maxLength120"),
  identification: z.string().min(1, "identificationRequired").max(15, "maxLength60"),
  phone: z.string().min(1, "phoneRequired").max(15, "maxLength15"),
  logo: z.string().optional(),
});

const Company = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query para obtener los datos de la empresa
  const {
    data: companyData,
    isPending: loading,
    isSuccess,
  } = useQuery<CompanyData | null>({
    queryKey: ["company", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("company")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(); // Usar maybeSingle() en lugar de single()

      if (error) {
        console.error("Error fetching company data:", error);
        throw error;
      }

      return data as CompanyData | null;
    },
    enabled: !!user,
    // Solo ejecutar la query cuando hay un usuario
  });

  // Mutation para crear/actualizar empresa
  const updateCompanyMutation = useMutation({
    mutationFn: async (companyFormData: CompanyFormData) => {
      if (!user) throw new Error("Usuario no autenticado");

      const companyWithUserId = {
        ...companyFormData,
        user_id: user.id,
      };

      // Actualizar empresa existente
      const { data, error } = await supabase
        .from("company")
        .update(companyWithUserId)
        .eq("user_id", user.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidar y refetch la query de company
      queryClient.invalidateQueries({ queryKey: ["company", user?.id] });
      SweetModal(
        "success",
        t("common.success"),
        t("company.updateCompanySuccess"),
        t("common.Ok")
      );
    },
    onError: (error) => {
      console.error("Error saving company data:", error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      address: "",
      identification: "",
      phone: "",
      email: "",
      logo: "",
    },
  });

  // Efecto para ejecutar código cuando la consulta es exitosa
  useEffect(() => {
    if (isSuccess && companyData) {
      reset({
        name: companyData.name || "",
        address: companyData.address || "",
        identification: companyData.identification || "",
        phone: companyData.phone || "",
        email: companyData.email || "",
        logo: companyData.logo || "",
      });
    }
  }, [isSuccess, companyData, reset]);

  console.log("Company data:", companyData);

  // Función para manejar el cambio de archivo (comentada porque no se usa actualmente)
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     // Validar tamaño del archivo (5MB máximo)
  //     if (file.size > 5 * 1024 * 1024) {
  //       alert("El archivo debe ser menor a 5MB");
  //       return;
  //     }

  //     // Validar tipo de archivo
  //     if (!file.type.startsWith("image/")) {
  //       alert("Solo se permiten archivos de imagen");
  //       return;
  //     }

  //     // Crear URL de preview
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const result = e.target?.result as string;
  //       setLogoPreview(result);
  //       setValue("logo", result); // Actualizar el valor en react-hook-form
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleEdit = () => {
    setIsEditing(true);
    setLogoPreview("");
    reset();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLogoPreview("");
    reset();
  };

  const onSubmit = (data: CompanyFormData) => {
    console.log("Datos del formulario:", data);

    const dataToSend = {
      name: data.name,
      address: data.address,
      identification: data.identification,
      phone: data.phone,
      email: data.email,
    };

    // Guardar los datos usando la mutation
    updateCompanyMutation.mutate(dataToSend, {
      onSuccess: () => {
        setIsEditing(false);
        setLogoPreview("");
        console.log("Empresa guardada exitosamente");
      },
      onError: (error: any) => {
        console.error("Error al guardar la empresa:", error);
        // Aquí podrías mostrar un toast o mensaje de error
      },
    });
  };

  // Mostrar loader mientras se cargan los datos
  if (loading && !companyData) {
    return <Loader />;
  }

  // return (<h1>hola</h1>)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-6">
          <div>
            <CardTitle className="text-2xl">
              {t("company.companyInfo")}
            </CardTitle>
            <CardDescription>{t("company.companyInfoTxt")}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="lg"
              onClick={handleEdit}
              disabled={isEditing || loading}
              type="button"
            >
              <Edit className="h-4 w-4 mr-2" />
              {loading ? t("common.loading") : t("common.edit")}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {t("company.name")}
              </Label>
              {isEditing ? (
                <div>
                  <Input
                    id="name"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <TextErrorSmall error={t(`errorsForm.${errors.name.message}`)} />
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {companyData?.name}
                </p>
              )}
            </div>

            {/* id */}
            <div className="space-y-2">
              <Label htmlFor="identification" className="text-sm font-medium">
                {t("company.identification")}
              </Label>
              {isEditing ? (
                <div>
                  <Input
                    id="identification"
                    {...register("identification")}
                    className={errors.identification ? "border-red-500" : ""}
                  />

                  {errors.identification && (
                    <TextErrorSmall
                      error={t(`errorsForm.${errors.identification.message}`)}
                    />
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {companyData?.identification}
                </p>
              )}
            </div>

            {/* address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                {`${t("customers.address")}`}
              </Label>
              {isEditing ? (
                <div>
                  <Input
                    id="address"
                    {...register("address")}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    
                    <TextErrorSmall
                      error={t(`errorsForm.${errors.address.message}`)}
                    />
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {companyData?.address}
                </p>
              )}
            </div>

            {/* phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                {`${t("customers.phone")}`}
              </Label>
              {isEditing ? (
                <div>
                  <Input
                    id="phone"
                    {...register("phone")}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <TextErrorSmall
                      error={t(`errorsForm.${errors.phone.message}`)}
                    />
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {companyData?.phone}
                </p>
              )}
            </div>

            {/* email */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {`${t("common.email")}`}
              </Label>
              {isEditing ? (
                <div>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <TextErrorSmall
                      error={t(`errorsForm.${errors.email.message}`)}
                    />
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {companyData?.email}
                </p>
              )}
            </div>

            {/* Logo */}
            {/* <div className="space-y-2 md:col-span-2 pt-4 border-t">
              <Label htmlFor="logo" className="text-sm font-medium">
                {t("company.logo")}
              </Label>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    {(logoPreview || companyData?.logo) && (
                      <div className="relative">
                        <img
                          src={
                            logoPreview ||
                            companyData?.logo ||
                            "/placeholder.svg"
                          }
                          alt="Logo preview"
                          className="w-16 h-16 object-contain border rounded-md bg-white"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("company.formatSupported")}
                      </p>
                    </div>
                  </div>
                  {errors.logo && (
                    <small className="text-red-500 mt-1">
                      {t(`errorsForm.${errors.logo.message}`)}
                    </small>
                  )}
                </div>
              ) : (
                <div className="bg-muted p-3 rounded-md">
                  {companyData?.logo ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={companyData?.logo || "/placeholder.svg"}
                        alt="Logo de la empresa"
                        className="w-12 h-12 object-contain border rounded bg-white"
                      />
                      <span className="text-sm text-muted-foreground">
                        Logo cargado
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Building2 className="w-12 h-12 p-2 border rounded bg-white" />
                      <span className="text-sm">Sin logo</span>
                    </div>
                  )}
                </div>
              )}
            </div> */}
          </div>
        </CardContent>

        {isEditing && (
          <div className="flex gap-2 justify-end me-4">
            <Button
              onClick={handleCancel}
              variant="outline"
              size="lg"
              type="button"
              disabled={updateCompanyMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={updateCompanyMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateCompanyMutation.isPending
                ? t("common.loading")
                : t("common.save")}
            </Button>
          </div>
        )}
      </Card>
    </form>
  );
};

export default Company;
