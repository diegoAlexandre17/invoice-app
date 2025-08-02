import { useTranslation } from "react-i18next";

const TextErrorSmall = ({ error } : { error: string | undefined }) => {
  const { t } = useTranslation();
  return (
    <small className="text-red-500 mt-1">
      {t(`auth.${error}`)}
    </small>
  );
};

export default TextErrorSmall;
