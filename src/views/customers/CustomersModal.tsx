import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { supabase } from "@/supabase/client";
import { useState } from "react";
import SweetModal from "@/components/modals/SweetAlert";
import { useAuth } from "@/hooks/useAuth";

const customerSchema = z.object({
  name: z.string().min(1, "nameRequired").max(15, "maxLength60"),
  email: z.email("emailRequired"),
  phone: z.string().max(15, "maxLength15").optional(),
  id: z.string().max(15, "maxLength15").optional(),
  address: z.string().max(15, "maxLength60").optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomersModal = ({ isOpen, onClose }: CustomersModalProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      id: "",
      address: "",
    },
  });

  const onSubmit = async (formData: CustomerFormData) => {
    if (!user) {
      setError("root", { message: "Usuario no autenticado" });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("customers").insert({
        name: formData.name,
        email: formData.email ?? null,
        phone: formData.phone ?? null,
        id_number: formData.id ?? null,
        address: formData.address ?? null,
        user_id: user.id,
      });

      if (error) {
        console.log("Error inserting customer:", error);
        if (error.code === "23505") {
          return setError("email", { message: "emailHasBeenUsed" });
        }

        setError("root", { message: error.message });
        return;
      }

      if (!error) {
        SweetModal(
          "success",
          t("common.success"),
          t("customers.createCustomerSuccess"),
          t("common.Ok")
        );
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

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t(`customers.${"addCustomer"}`)}</DialogTitle>
          <DialogDescription>
            {t(`customers.${"addCustomerTxt"}`)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {`${t("common.name")} *`}
            </Label>
            <div className="col-span-3">
              <Input
                id="name"
                {...register("name")}
                className={
                  errors.name ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.name && (
                <small className="text-red-500 mt-1">
                  {t(`errorsForm.${errors.name.message}`)}
                </small>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              {`${t("common.email")} *`}
            </Label>
            <div className="col-span-3">
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={
                  errors.email ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.email && (
                <small className="text-red-500 mt-1">
                  {t(`errorsForm.${errors.email.message}`)}
                </small>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              {`${t("customers.phone")}`}
            </Label>
            <div className="col-span-3">
              <Input
                id="phone"
                {...register("phone")}
                className={
                  errors.phone ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.phone && (
                <small className="text-red-500 mt-1">
                  {t(`errorsForm.${errors.phone.message}`)}
                </small>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">
              ID
            </Label>
            <div className="col-span-3">
              <Input
                id="id"
                {...register("id")}
                className={
                  errors.id ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.id && (
                <small className="text-red-500 mt-1">
                  {t(`errorsForm.${errors.id.message}`)}
                </small>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              {`${t("customers.address")}`}
            </Label>
            <div className="col-span-3">
              <Input
                id="address"
                {...register("address")}
                className={
                  errors.address ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.address && (
                <small className="text-red-500 mt-1">
                  {t(`errorsForm.${errors.address.message}`)}
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
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? t("common.loading") : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomersModal;
