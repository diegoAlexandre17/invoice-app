import { useState } from "react";
import { Edit, Save, X, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

// Zod schema for company validation
const companySchema = z.object({
  name: z.string().min(1, "El nombre de la empresa es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  identification: z.string().min(1, "El número de identificación es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  email: z
    .string()
    .email("Debe ser un email válido")
    .min(1, "El email es requerido"),
  logo: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

const Company = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Mock data - replace with real data from your API/database
  const mockCompanyData: CompanyFormData = {
    name: "Mi Empresa S.A.S",
    address: "Calle 123 #45-67, Bogotá, Colombia",
    identification: "900.123.456-7",
    phone: "+57 1 234 5678",
    email: "contacto@miempresa.com",
    logo: "", // URL del logo o base64
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: mockCompanyData,
  });

  const watchedValues = watch();

  // Función para manejar el cambio de archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamaño del archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo debe ser menor a 5MB");
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        alert("Solo se permiten archivos de imagen");
        return;
      }

      // Crear URL de preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setValue("logo", result); // Actualizar el valor en react-hook-form
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setLogoPreview(mockCompanyData.logo || "");
    reset(mockCompanyData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLogoPreview("");
    reset(mockCompanyData);
  };

  const onSubmit = (data: CompanyFormData) => {
    console.log("Datos del formulario:", data);
    // Here you would typically save the data to your API/database
    setIsEditing(false);
    setLogoPreview("");
  };

  

  console.log(isEditing);

  return (
    
      <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-6">
        <div>
          <CardTitle className="text-2xl">Información de la Empresa</CardTitle>
          <CardDescription>
            {isEditing
              ? "Edita la información de tu empresa"
              : "Datos registrados de la empresa"}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              type="button"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          ) : (
            <>
              <Button type="submit" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                type="button"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Nombre de la empresa - Columna completa en móvil, primera columna en desktop */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nombre de la Empresa
            </Label>
            {isEditing ? (
              <div>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Ingresa el nombre de la empresa"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {watchedValues.name}
              </p>
            )}
          </div>

          {/* Número de identificación - Segunda columna */}
          <div className="space-y-2">
            <Label htmlFor="identification" className="text-sm font-medium">
              Número de Identificación
            </Label>
            {isEditing ? (
              <div>
                <Input
                  id="identification"
                  {...register("identification")}
                  placeholder="Ej: 900.123.456-7"
                  className={errors.identification ? "border-red-500" : ""}
                />
                {errors.identification && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.identification.message}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {watchedValues.identification}
              </p>
            )}
          </div>

          {/* Dirección - Primera columna, segunda fila */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Dirección
            </Label>
            {isEditing ? (
              <div>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="Ingresa la dirección completa"
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {watchedValues.address}
              </p>
            )}
          </div>

          {/* Teléfono - Segunda columna, segunda fila */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Teléfono
            </Label>
            {isEditing ? (
              <div>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="Ej: +57 1 234 5678"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {watchedValues.phone}
              </p>
            )}
          </div>

          {/* Correo electrónico - Ocupa toda la fila en ambas vistas */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Correo Electrónico
            </Label>
            {isEditing ? (
              <div>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="contacto@empresa.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {watchedValues.email}
              </p>
            )}
          </div>

          {/* Logo de la empresa - Al final ocupando todo el ancho */}
          <div className="space-y-2 md:col-span-2 pt-4 border-t">
            <Label htmlFor="logo" className="text-sm font-medium">
              Logo de la Empresa
            </Label>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  {(logoPreview || watchedValues.logo) && (
                    <div className="relative">
                      <img
                        src={logoPreview || watchedValues.logo || "/placeholder.svg"}
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
                      Formatos soportados: JPG, PNG, GIF. Máximo 5MB.
                    </p>
                  </div>
                </div>
                {errors.logo && (
                  <p className="text-sm text-red-500">{errors.logo.message}</p>
                )}
              </div>
            ) : (
              <div className="bg-muted p-3 rounded-md">
                {watchedValues.logo ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={watchedValues.logo || "/placeholder.svg"}
                      alt="Logo de la empresa"
                      className="w-12 h-12 object-contain border rounded bg-white"
                    />
                    <span className="text-sm text-muted-foreground">Logo cargado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Building2 className="w-12 h-12 p-2 border rounded bg-white" />
                    <span className="text-sm">Sin logo</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    
  );
};

export default Company;
