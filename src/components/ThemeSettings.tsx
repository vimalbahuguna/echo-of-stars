import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HexColorPicker } from "react-colorful"; // Assuming this library is available or will be installed
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Palette, Save, XCircle, Eye, Loader2 } from "lucide-react";
import { useThemeManager } from "@/hooks/useThemeManager";
import { Theme, ThemeColors } from "@/types/theme";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const defaultNewTheme: Theme = {
  name: "New Theme",
  is_default: false,
  colors: {
    primary: "#007bff",
    accent: "#6c757d",
    background: "#ffffff",
    foreground: "#212529",
    card: "#f8f9fa",
    cardForeground: "#212529",
    popover: "#ffffff",
    popoverForeground: "#212529",
    primaryForeground: "#ffffff",
    secondary: "#e9ecef",
    secondaryForeground: "#212529",
    muted: "#f8f9fa",
    mutedForeground: "#6c757d",
    accentForeground: "#ffffff",
    destructive: "#dc3545",
    destructiveForeground: "#ffffff",
    border: "#dee2e6",
    input: "#e9ecef",
    ring: "#007bff",
  },
};

const ThemeSettings = () => {
  const { themes, activeTheme, isLoadingThemes, addOrUpdateTheme, deleteTheme, selectActiveTheme } = useThemeManager();
  const { toast } = useToast();
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditTheme = (theme: Theme) => {
    setEditingTheme({ ...theme });
  };

  const handleNewTheme = () => {
    setEditingTheme({ ...defaultNewTheme, name: `New Theme ${themes.length + 1}` });
  };

  const handleColorChange = (colorKey: keyof ThemeColors, color: string) => {
    if (editingTheme) {
      setEditingTheme(prev => ({
        ...prev!,
        colors: {
          ...prev!.colors,
          [colorKey]: color,
        },
      }));
    }
  };

  const handleSaveTheme = async () => {
    if (!editingTheme) return;
    setIsSaving(true);
    const success = await addOrUpdateTheme(editingTheme);
    setIsSaving(false);
    if (success) {
      setEditingTheme(null); // Clear form after saving
    }
  };

  const handleDeleteTheme = async (themeId: string) => {
    if (!window.confirm("Are you sure you want to delete this theme?")) return;
    setIsSaving(true);
    const success = await deleteTheme(themeId);
    setIsSaving(false);
    if (success && editingTheme?.id === themeId) {
      setEditingTheme(null); // Clear form if the deleted theme was being edited
    }
  };

  const handleApplyTheme = (theme: Theme) => {
    selectActiveTheme(theme);
  };

  const colorGroups = {
    "Base Colors": ["background", "foreground", "primary", "accent"],
    "Text & UI Colors": ["primaryForeground", "secondaryForeground", "mutedForeground", "accentForeground", "destructiveForeground"],
    "Component Backgrounds": ["card", "popover", "secondary", "muted", "destructive"],
    "Borders & Inputs": ["border", "input", "ring"],
  };

  return (
    <div className="space-y-6 p-4">
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Theme Management</CardTitle>
          <CardDescription>Create, edit, delete, and apply custom themes for your website.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleNewTheme} className="mb-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Theme
          </Button>

          {isLoadingThemes ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading themes...</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] border rounded-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map(theme => (
                  <Card key={theme.id || theme.name} className={`relative bg-gray-700 text-white ${activeTheme.id === theme.id ? "border-2 border-primary shadow-lg" : ""}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Palette className="h-5 w-5 text-muted-foreground" /> {theme.name}
                      </CardTitle>
                      {theme.is_default && (
                        <Badge variant="secondary" className="absolute top-2 right-2">Default</Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(theme.colors).map(([key, value]) => (
                          <div key={key} className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: value }} title={key}></div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTheme(theme)} disabled={isSaving}>
                        <Eye className="mr-2 h-4 w-4" /> View/Edit
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleApplyTheme(theme)} disabled={activeTheme.id === theme.id || isSaving}>
                        Apply
                      </Button>
                      {!theme.is_default && (
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteTheme(theme.id!)} disabled={isSaving}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {editingTheme && (
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {editingTheme.id ? "Edit Theme" : "Create New Theme"}
            </CardTitle>
            <CardDescription>
              Adjust the colors for your theme. Changes will be applied instantly for preview.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="themeName">Theme Name</Label>
                <Input
                  id="themeName"
                  value={editingTheme.name}
                  onChange={(e) => setEditingTheme(prev => ({ ...prev!, name: e.target.value }))}
                  disabled={editingTheme.is_default || isSaving}
                />
              </div>
              {Object.entries(colorGroups).map(([groupName, colorKeys]) => (
                <div key={groupName} className="space-y-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <h4 className="text-lg font-semibold">{groupName}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {colorKeys.map(colorKey => (
                      <div key={colorKey} className="space-y-2">
                        <Label htmlFor={colorKey}>{colorKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                        <Input
                          id={colorKey}
                          type="text"
                          value={editingTheme!.colors[colorKey as keyof ThemeColors]}
                          onChange={(e) => handleColorChange(colorKey as keyof ThemeColors, e.target.value)}
                          disabled={editingTheme!.is_default || isSaving}
                        />
                        <HexColorPicker
                          color={editingTheme!.colors[colorKey as keyof ThemeColors]}
                          onChange={(color) => handleColorChange(colorKey as keyof ThemeColors, color)}
                          className="w-full !important"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Theme Preview</h3>
              <div
                className="p-4 rounded-md border h-96 overflow-y-auto"
                style={Object.fromEntries(Object.entries(editingTheme.colors).map(([key, value]) => [`--${key}`, value]))}
              >
                <p className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>Primary Text Example</p>
                <p style={{ color: 'var(--accent)' }}>Accent Text Example</p>
                <Button
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primaryForeground)',
                    borderColor: 'var(--border)',
                  }}
                  className="mt-2"
                >
                  Primary Button
                </Button>
                <Button
                  style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--secondaryForeground)',
                    borderColor: 'var(--border)',
                  }}
                  className="mt-2 ml-2"
                >
                  Secondary Button
                </Button>
                <Card
                  style={{
                    backgroundColor: 'var(--card)',
                    color: 'var(--cardForeground)',
                    borderColor: 'var(--border)',
                  }}
                  className="mt-4 p-3"
                >
                  <CardTitle style={{ color: 'var(--cardForeground)' }}>Card Title</CardTitle>
                  <CardDescription style={{ color: 'var(--mutedForeground)' }}>Card description text.</CardDescription>
                </Card>
                <div className="mt-4 p-2 rounded-md" style={{ backgroundColor: 'var(--popover)', color: 'var(--popoverForeground)', border: '1px solid var(--border)' }}>
                  <p className="text-sm">Popover Example</p>
                </div>
                <p className="text-sm mt-2" style={{ color: 'var(--mutedForeground)' }}>Muted text example.</p>
                <Button
                  variant="destructive"
                  style={{
                    backgroundColor: 'var(--destructive)',
                    color: 'var(--destructiveForeground)',
                    borderColor: 'var(--border)',
                  }}
                  className="mt-2"
                >
                  Destructive Button
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingTheme(null)} disabled={isSaving}>
              <XCircle className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSaveTheme} disabled={isSaving || editingTheme.is_default}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Theme
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ThemeSettings;