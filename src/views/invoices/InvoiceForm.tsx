import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import TextErrorSmall from "@/components/general/TextErrorSmall";
import type { InvoiceFormData } from "./types";

interface InvoiceFormProps {
  onNext?: (formData: InvoiceFormData) => void;
  initialData?: InvoiceFormData;
}

const invoiceItemSchema = z.object({
  description: z.string().min(1, "nameRequired").max(120, "maxLength120"),
  quantity: z.number().min(1, "quantityRequired"),
  unitPrice: z.number().min(0, "priceRequired"),
});

const invoiceSchema = z.object({
  name: z.string().min(1, "nameRequired").max(60, "maxLength60"),
  id: z.string().max(15, "maxLength15").optional(),
  email: z.email("emailRequired"),
  phone: z.string().max(15, "maxLength15").optional(),
  address: z.string().max(60, "maxLength60").optional(),
  items: z.array(invoiceItemSchema).min(1, "itemsRequired"),
  notes: z.string().max(500, "maxLength500").optional(),
});

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onNext, initialData }) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    mode: "onTouched", // Validar cuando el usuario toque los campos
    defaultValues: {
      name: "",
      id: "",
      address: "",
      phone: "",
      email: "",
      notes: "",
      items: [],
    },
  });

  // Restablecer el formulario cuando cambien los datos iniciales
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        id: initialData.id || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        notes: initialData.notes || "",
        items: initialData.items || [],
      });
    }
  }, [initialData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  const handleNext = (data: InvoiceFormData) => {
    console.log("Formulario válido, avanzando al siguiente paso:", data);
    console.log("Datos del cliente:", data);
    onNext?.(data);
  };

  // Estado para el nuevo item
  const [newItem, setNewItem] = useState({
    description: "",
    quantity: 1,
    unitPrice: 1,
  });

  // Función para agregar un nuevo item
  const addItem = () => {
    if (newItem.description.trim() === "") return;
    
    append({
      description: newItem.description,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
    });
    
    setNewItem({ description: "", quantity: 1, unitPrice: 0 });
  };

  // Función para calcular el total de un item
  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  // Función para calcular el subtotal
  const calculateSubtotal = () => {
    return watchedItems?.reduce((sum, item) => {
      return sum + calculateItemTotal(item.quantity || 0, item.unitPrice || 0);
    }, 0) || 0;
  };

  return (
    <div>
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {`${t("customers.customerName")}*`}
              </Label>

              <div>
                <Input
                  id="name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <TextErrorSmall
                    error={t(`errorsForm.${errors.name.message}`)}
                  />
                )}
              </div>
            </div>

            {/* id */}
            <div className="space-y-2">
              <Label htmlFor="id" className="text-sm font-medium">
                {"ID"}
              </Label>

              <div>
                <Input
                  id="id"
                  {...register("id")}
                  className={errors.id ? "border-red-500" : ""}
                />

                {errors.id && (
                  <TextErrorSmall
                    error={t(`errorsForm.${errors.id.message}`)}
                  />
                )}
              </div>
            </div>

            {/* email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {`${t("common.email")}*`}
              </Label>

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
            </div>

            {/* address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                {`${t("customers.address")}`}
              </Label>

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
            </div>

            {/* phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                {`${t("customers.phone")}`}
              </Label>

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
            </div>

            {/* notes */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                {`${t("invoice.notes") || "Notas"}`}
              </Label>

              <div>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  className={errors.notes ? "border-red-500" : ""}
                  placeholder={t("invoice.notesPlaceholder") || "Ingresa notas adicionales para la factura (opcional)"}
                />
                {errors.notes && (
                  <TextErrorSmall
                    error={t(`errorsForm.${errors.notes.message}`)}
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de Items de la Factura */}
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="text-xl">
            {t("invoice.invoiceItems") || "Items de la Factura"}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* Mostrar error si no hay items */}
          {errors.items && (
            <div className="mb-4">
              <TextErrorSmall
                error={t(`errorsForm.${errors.items.message}`) || "Se requiere al menos un item"}
              />
            </div>
          )}
          
          {/* Formulario para agregar nuevo item */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                {t("invoice.description") || "Descripción"}
              </Label>
              <Input
                id="description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                placeholder={
                  t("invoice.descriptionPlaceholder") ||
                  "Descripción del producto o servicio"
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                {t("invoice.quantity") || "Cantidad"}
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    quantity: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice" className="text-sm font-medium">
                {t("invoice.unitPrice")}
              </Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={newItem.unitPrice}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    unitPrice: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="flex items-end">
              <Button type="button" onClick={addItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t("invoice.addItem")}
              </Button>
            </div>
          </div>

          {/* Lista de items */}
          {fields.length > 0 && (
            <div className="space-y-4">
              {fields.map((field, index) => {
                const item = watchedItems?.[index];
                return (
                  <div key={field.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-700">
                        {t("invoice.item") || "Item"} #{index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">
                          {t("invoice.description") || "Descripción"}
                        </Label>
                        <p className="text-sm">{item?.description}</p>
                      </div>

                      <div>
                        <Label className="text-xs text-gray-500">
                          {t("invoice.quantity") || "Cantidad"}
                        </Label>
                        <p className="text-sm">{item?.quantity}</p>
                      </div>

                      <div>
                        <Label className="text-xs text-gray-500">
                          {t("invoice.unitPrice") || "Precio Unitario"}
                        </Label>
                        <p className="text-sm">${item?.unitPrice?.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-2">
                      <div className="text-right">
                        <Label className="text-xs text-gray-500">
                          {t("invoice.itemTotal") || "Total del item:"}
                        </Label>
                        <p className="text-lg font-semibold text-green-600">
                          ${calculateItemTotal(item?.quantity || 0, item?.unitPrice || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Subtotal */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="text-right">
                    <Label className="text-sm text-gray-600">
                      {"Subtotal:"}
                    </Label>
                    <p className="text-2xl font-bold text-green-600">
                      ${calculateSubtotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>{t("invoice.noItems") || "No hay items agregados aún"}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botón Siguiente */}
      <div className="mt-6 flex justify-end">
        <Button 
          type="button" 
          onClick={handleSubmit(handleNext)}
          className="px-8 py-2"
        >
          {t('common.next')}
        </Button>
      </div>
    </div>
  );
};

export default InvoiceForm;
