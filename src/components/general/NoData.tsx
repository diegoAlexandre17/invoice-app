import { FileMinus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface NoDataProps {
  color?: string
  size?: number
  text?: string
  textColor?: string
}

const NoData = ({ color = 'gray-500', size = 48, text, textColor }: NoDataProps) => {
  const { t } = useTranslation()

  return (
    <div className={`flex flex-col items-center text-center text-${color} my-2 relative`}>
      <FileMinus size={size} />
      {text ? (
        <small className="mt-2">{text}</small>
      ) : (
        <small className={`${textColor ? `text-${textColor}` : ''}`}>{t('common.noData')}</small>
      )}
    </div>
  )
}

export default NoData
