import { Link, Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeSettings from "@/components/ThemeSettings";

const SettingsPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end mb-4">
        <Link to="/">
          <Button variant="outline">
            {t("settingsPage.backToDashboard")}
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">{t("settingsPage.title")}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t("settingsPage.menu.title")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Link to="/settings/themes">
              <Button variant="ghost" className="w-full justify-start">{t("settingsPage.menu.themes")}</Button>
            </Link>
            {/* Add more settings links here */}
          </CardContent>
        </Card>
        
        <div className="lg:col-span-3">
          {/* This is where nested routes will render, for now directly render ThemeSettings */}
          <ThemeSettings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
