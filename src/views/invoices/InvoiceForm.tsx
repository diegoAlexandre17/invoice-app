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

const invoiceSchema = z.object({
  name: z.string().min(1, "nameRequired").max(60, "maxLength60"),
  id: z.string().max(15, "maxLength15").optional(),
  email: z.email("emailRequired"),
  phone: z.string().max(15, "maxLength15").optional(),
  address: z.string().max(60, "maxLength60").optional(),
});

const InvoiceForm = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(
    /* <CompanyFormData> */ {
      resolver: zodResolver(invoiceSchema),
      defaultValues: {
        name: "",
        id: "",
        address: "",
        phone: "",
        email: "",
      },
    }
  );

  const onSubmit = (data) => {
    console.log(data);
  };

  const loading = false;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-2xl">
              {t("invoice.newInvoice")}
            </CardTitle>
            <CardDescription>{t("invoice.invoiceTxt")}</CardDescription>
          </div>
        </CardHeader>

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
          </div>
        </CardContent>

        <div className="flex gap-2 justify-end me-4">
          <Button
            //   onClick={handleCancel}
            variant="outline"
            size="lg"
            type="button"
            //   disabled={updateCompanyMutation.isPending || isUploadingLogo}
          >
            <X className="h-4 w-4 mr-2" />
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            size="lg"
            //   disabled={updateCompanyMutation.isPending || isUploadingLogo}
          >
            <Save className="h-4 w-4 mr-2" />
            {t("common.save")}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default InvoiceForm;
