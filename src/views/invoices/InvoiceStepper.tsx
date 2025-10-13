import { useState } from "react";
import { useTranslation } from "react-i18next";
import Stepper from "@/components/ui/stepper";
import InvoiceForm from "./InvoiceForm";
import InvoiceViewer from "./InvoiceViewer";
import type { InvoiceFormData } from "./types";

const InvoiceStepper = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InvoiceFormData | null>(null);

  const steps = [
  {
    id: 1,
    title: t("invoice.newInvoice"),
    description: t("invoice.invoiceTxt"),
  },
  {
    id: 2,
    title: t("invoice.preview"),
    description: t("invoice.previewDescription"),
  },
];

  const handleNext = () => {
    // Esta función será llamada desde el formulario cuando esté válido
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleFormNext = (data: InvoiceFormData) => {
    // Guardar los datos y avanzar al siguiente paso
    setFormData(data);
    handleNext();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Stepper steps={steps} currentStep={currentStep} />

      <div className="mt-8">
        {currentStep === 1 && (
          <InvoiceForm
            key={formData ? 'with-data' : 'empty'}
            onNext={handleFormNext}
            initialData={formData || undefined}
          />
        )}
        {currentStep === 2 && formData && (
          <InvoiceViewer formData={formData} handlePrevious={handlePrevious} />
        )}
      </div>

      {/* <StepperNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        nextButtonText={
          currentStep === 1 ? t('common.next') : t('common.finish')
        }
        previousButtonText={t('common.back')}
        nextButtonDisabled={currentStep === 1} // Deshabilitar en el paso 1
      /> */}
    </div>
  );
};

export default InvoiceStepper;
