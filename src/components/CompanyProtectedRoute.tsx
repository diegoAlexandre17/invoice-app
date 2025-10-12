import { getCurrentUserCompany } from '@/utils/checkUserCompany';
import Loader from './general/Loader';
import { Link } from 'react-router-dom';
import { Building, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface CompanyProtectedRouteProps {
  children: React.ReactNode;
}

export function CompanyProtectedRoute({ children }: CompanyProtectedRouteProps) {
  const { t } = useTranslation();
  const { 
    data: hasCompany, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['userCompany'],
    queryFn: getCurrentUserCompany,

  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold">
              {t('navigation.connectionError')}
            </CardTitle>
            <CardDescription>
              {t('navigation.connectionErrorMessage')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('navigation.tryAgainLater')}
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link to="/admin/dashboard">
                {t('navigation.backToDashboard')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasCompany) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl font-semibold">
              {t('navigation.accessRestricted')}
            </CardTitle>
            <CardDescription>
              {t('navigation.companyDataRequired')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('navigation.companyInfoRequired')}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/admin/company" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {t('navigation.configureCompany')}
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/admin/dashboard">
                  {t('navigation.backToDashboard')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}