import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HexColorPicker } from "react-colorful";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Palette, Save, XCircle, Eye, Loader2, Check, Moon, Sun, Monitor, Sparkles, Copy, Download, Upload, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Theme, ThemeColors, GradientColors } from "@/types/theme";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GradientColorPicker } from "@/components/GradientColorPicker";
import { LivePreviewPanel } from "@/components/LivePreviewPanel";
import { useTranslation } from "react-i18next";

const defaultNewTheme: Theme = {
  name: "New Theme",
  is_default: false,
  colors: {
    primary: "hsl(222.2 47.4% 11.2%)",
    accent: "hsl(217.2 91.2% 59.8%)",
    background: "hsl(222.2 84% 4.9%)",
    foreground: "hsl(210 40% 98%)",
    card: "hsl(222.2 47.4% 11.2%)",
    cardForeground: "hsl(210 40% 98%)",
    popover: "hsl(222.2 47.4% 11.2%)",
    popoverForeground: "hsl(210 40% 98%)",
    primaryForeground: "hsl(210 40% 98%)",
    secondary: "hsl(217.2 32.4% 17.5%)",
    secondaryForeground: "hsl(210 40% 98%)",
    muted: "hsl(217.2 32.4% 17.5%)",
    mutedForeground: "hsl(218 2.2% 67.5%)",
    accentForeground: "hsl(210 40% 98%)",
    destructive: "hsl(0 62.8% 30.6%)",
    destructiveForeground: "hsl(210 40% 98%)",
    border: "hsl(217.2 32.4% 17.5%)",
    input: "hsl(217.2 32.4% 17.5%)",
    ring: "hsl(217.2 91.2% 59.8%)",
  },
  gradients: {
    backgroundGradient: "linear-gradient(135deg, hsl(222.2 84% 4.9%) 0%, hsl(217.2 32.4% 17.5%) 100%)",
    foregroundGradient: "linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(218 2.2% 67.5%) 100%)",
    primaryGradient: "linear-gradient(135deg, hsl(222.2 47.4% 11.2%) 0%, hsl(217.2 91.2% 59.8%) 100%)",
    secondaryGradient: "linear-gradient(135deg, hsl(217.2 32.4% 17.5%) 0%, hsl(217.2 32.4% 25%) 100%)",
    accentGradient: "linear-gradient(135deg, hsl(217.2 91.2% 59.8%) 0%, hsl(217.2 91.2% 69.8%) 100%)",
    cardGradient: "linear-gradient(135deg, hsl(222.2 47.4% 11.2%) 0%, hsl(217.2 32.4% 17.5%) 100%)",
  },
};

// Predefined theme templates
const themeTemplates = [
  {
    name: "themeSettings.cosmicDark",
    colors: {
      primary: "hsl(222.2 47.4% 11.2%)",
      accent: "hsl(217.2 91.2% 59.8%)",
      background: "hsl(222.2 84% 4.9%)",
      foreground: "hsl(210 40% 98%)",
      card: "hsl(222.2 47.4% 11.2%)",
      cardForeground: "hsl(210 40% 98%)",
      popover: "hsl(222.2 47.4% 11.2%)",
      popoverForeground: "hsl(210 40% 98%)",
      primaryForeground: "hsl(210 40% 98%)",
      secondary: "hsl(217.2 32.4% 17.5%)",
      secondaryForeground: "hsl(210 40% 98%)",
      muted: "hsl(217.2 32.4% 17.5%)",
      mutedForeground: "hsl(218 2.2% 67.5%)",
      accentForeground: "hsl(210 40% 98%)",
      destructive: "hsl(0 62.8% 30.6%)",
      destructiveForeground: "hsl(210 40% 98%)",
      border: "hsl(217.2 32.4% 17.5%)",
      input: "hsl(217.2 32.4% 17.5%)",
      ring: "hsl(217.2 91.2% 59.8%)",
    }
  },
  {
    name: "themeSettings.mysticLight",
    colors: {
      primary: "hsl(222.2 84% 4.9%)",
      accent: "hsl(217.2 91.2% 59.8%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)",
      card: "hsl(0 0% 100%)",
      cardForeground: "hsl(222.2 84% 4.9%)",
      popover: "hsl(0 0% 100%)",
      popoverForeground: "hsl(222.2 84% 4.9%)",
      primaryForeground: "hsl(210 40% 98%)",
      secondary: "hsl(210 40% 96%)",
      secondaryForeground: "hsl(222.2 84% 4.9%)",
      muted: "hsl(210 40% 96%)",
      mutedForeground: "hsl(215.4 16.3% 46.9%)",
      accentForeground: "hsl(210 40% 98%)",
      destructive: "hsl(0 84.2% 60.2%)",
      destructiveForeground: "hsl(210 40% 98%)",
      border: "hsl(214.3 31.8% 91.4%)",
      input: "hsl(214.3 31.8% 91.4%)",
      ring: "hsl(222.2 84% 4.9%)",
    }
  },
  {
    name: "themeSettings.celestialPurple",
    colors: {
      primary: "hsl(263.4 70% 50.4%)",
      accent: "hsl(270 95.2% 75.3%)",
      background: "hsl(224 71.4% 4.1%)",
      foreground: "hsl(210 20% 98%)",
      card: "hsl(224 71.4% 4.1%)",
      cardForeground: "hsl(210 20% 98%)",
      popover: "hsl(224 71.4% 4.1%)",
      popoverForeground: "hsl(210 20% 98%)",
      primaryForeground: "hsl(210 20% 98%)",
      secondary: "hsl(215 27.9% 16.9%)",
      secondaryForeground: "hsl(210 20% 98%)",
      muted: "hsl(215 27.9% 16.9%)",
      mutedForeground: "hsl(217.9 10.6% 64.9%)",
      accentForeground: "hsl(224 71.4% 4.1%)",
      destructive: "hsl(0 62.8% 30.6%)",
      destructiveForeground: "hsl(210 20% 98%)",
      border: "hsl(215 27.9% 16.9%)",
      input: "hsl(215 27.9% 16.9%)",
      ring: "hsl(263.4 70% 50.4%)",
    }
  }
];

const ThemeSettings = () => {
  const { t } = useTranslation();
  const { themes, activeTheme, isLoadingThemes, addOrUpdateTheme, deleteTheme, selectActiveTheme } = useTheme();
  const { toast } = useToast();
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedColorKey, setSelectedColorKey] = useState<string>('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleEditTheme = (theme: Theme) => {
    setEditingTheme({ ...theme });
  };

  const handleNewTheme = () => {
    setEditingTheme({ ...defaultNewTheme, name: `${t('themeSettings.newTheme')} ${themes.length + 1}` });
  };

  const handleTemplateSelect = (template: typeof themeTemplates[0]) => {
    setEditingTheme({ 
      ...defaultNewTheme, 
      name: t(template.name),
      colors: { ...template.colors }
    });
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

  const handleGradientChange = (gradientKey: keyof GradientColors, gradient: string) => {
    if (editingTheme) {
      setEditingTheme(prev => ({
        ...prev!,
        gradients: {
          ...prev!.gradients,
          [gradientKey]: gradient,
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
      setEditingTheme(null);
      toast({
        title: t('themeSettings.toasts.themeSaved'),
        description: `${t('themeSettings.toasts.themeSaved')} "${editingTheme.name}".`,
      });
    }
  };

  const handleDeleteTheme = async (themeId: string) => {
    if (!window.confirm("Are you sure you want to delete this theme?")) return;
    setIsSaving(true);
    const success = await deleteTheme(themeId);
    setIsSaving(false);
    if (success && editingTheme?.id === themeId) {
      setEditingTheme(null);
    }
  };

  const handleApplyTheme = (theme: Theme) => {
    selectActiveTheme(theme);
  };

  const exportTheme = (theme: Theme) => {
    const themeData = JSON.stringify(theme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.replace(/\s+/g, '_').toLowerCase()}_theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: t('themeSettings.toasts.themeExported'),
      description: `${t('themeSettings.toasts.themeExported')} "${theme.name}".`,
    });
  };

  const copyThemeColors = (theme: Theme) => {
    const colorsText = Object.entries(theme.colors)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    navigator.clipboard.writeText(colorsText);
    toast({
      title: t('themeSettings.toasts.colorsCopied'),
      description: t('themeSettings.toasts.colorsCopied'),
    });
  };

  const colorGroups = {
    [t('themeSettings.baseColors')]: ["background", "foreground", "primary", "accent"],
    "Text & UI Colors": ["primaryForeground", "secondaryForeground", "mutedForeground", "accentForeground", "destructiveForeground"],
    [t('themeSettings.componentBackgrounds')]: ["card", "popover", "secondary", "muted", "destructive"],
    "Borders & Inputs": ["border", "input", "ring"],
  };

  return (
    <div className="space-y-6 p-4 min-h-screen bg-background/50">
      <Card className="bg-gradient-to-br from-card/80 to-secondary/10 border-2 border-border/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/30">
          <CardTitle className="text-3xl font-bold flex items-center gap-3 text-foreground">
            <Palette className="w-8 h-8 text-primary" />
            {t('themeSettings.title')}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {t('themeSettings.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="themes" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 border border-border/30">
              <TabsTrigger value="themes" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/30">
                <Palette className="w-4 h-4" />
                My Themes
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/30">
                <Sparkles className="w-4 h-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/30" disabled={!editingTheme}>
                <Eye className="w-4 h-4" />
                Editor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="themes" className="space-y-4 mt-6">
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border border-border/30">
                <h3 className="text-xl font-semibold text-foreground">Your Themes</h3>
                <Button onClick={handleNewTheme} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Theme
                </Button>
              </div>

              {isLoadingThemes ? (
                <div className="flex items-center justify-center h-48 bg-card/30 rounded-lg border border-border/30">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-3 text-muted-foreground">Loading your themes...</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] border-2 rounded-lg p-4 bg-card/20 border-border/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themes.map(theme => (
                      <Card 
                        key={theme.id || theme.name} 
                        className={`relative transition-all duration-200 hover:shadow-lg border-2 ${
                          activeTheme.id === theme.id 
                            ? "ring-2 ring-primary shadow-lg bg-primary/10 border-primary/50" 
                            : "hover:bg-secondary/30 border-border/50 hover:border-primary/30"
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              {activeTheme.id === theme.id ? (
                                <Check className="h-5 w-5 text-primary" />
                              ) : (
                                <Palette className="h-5 w-5 text-muted-foreground" />
                              )}
                              {theme.name}
                            </span>
                            {theme.is_default && (
                              <Badge variant="secondary" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(theme.colors).slice(0, 8).map(([key, value]) => (
                              <div 
                                key={key} 
                                className="w-6 h-6 rounded-full border-2 border-foreground/20 shadow-md ring-1 ring-border/50 hover:ring-2 hover:ring-primary/50 transition-all" 
                                style={{ backgroundColor: value as string }} 
                                title={`${key}: ${value}`}
                              />
                            ))}
                            {Object.keys(theme.colors).length > 8 && (
                              <div className="w-6 h-6 rounded-full border-2 border-foreground/20 bg-muted/80 flex items-center justify-center text-xs font-medium text-foreground shadow-md ring-1 ring-border/50">
                                +{Object.keys(theme.colors).length - 8}
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2 pt-2">
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditTheme(theme)} 
                              disabled={isSaving}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyThemeColors(theme)}
                              disabled={isSaving}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => exportTheme(theme)}
                              disabled={isSaving}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant={activeTheme.id === theme.id ? "secondary" : "default"}
                              size="sm" 
                              onClick={() => handleApplyTheme(theme)} 
                              disabled={activeTheme.id === theme.id || isSaving}
                            >
                              {activeTheme.id === theme.id ? "Active" : "Apply"}
                            </Button>
                            {!theme.is_default && (
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleDeleteTheme(theme.id!)} 
                                disabled={isSaving}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Theme Templates</h3>
                <p className="text-sm text-muted-foreground">Choose a template to start customizing</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themeTemplates.map((template, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:bg-secondary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {template.name === "Cosmic Dark" && <Moon className="h-5 w-5 text-blue-500" />}
                        {template.name === "Mystic Light" && <Sun className="h-5 w-5 text-yellow-500" />}
                        {template.name === "Celestial Purple" && <Sparkles className="h-5 w-5 text-purple-500" />}
                        {template.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(template.colors).slice(0, 8).map(([key, value]) => (
                          <div 
                            key={key} 
                            className="w-6 h-6 rounded-full border-2 border-background shadow-sm" 
                            style={{ backgroundColor: value }} 
                            title={`${key}: ${value}`}
                          />
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full"
                        variant="outline"
                      >
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="editor" className="space-y-4">
              {editingTheme && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Editing: {editingTheme.name}</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setEditingTheme(null)}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button onClick={handleSaveTheme} disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Theme
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="theme-name" className="text-base font-medium">Theme Name</Label>
                        <Input
                          id="theme-name"
                          value={editingTheme.name}
                          onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-medium">Color Palette</Label>
                        <div className="mt-3 space-y-4">
                          {Object.entries(colorGroups).map(([groupName, colorKeys]) => (
                            <div key={groupName} className="space-y-2">
                              <h4 className="text-sm font-medium text-muted-foreground">{groupName}</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {colorKeys.map((colorKey) => (
                                  <div key={colorKey} className="flex items-center gap-2 p-2 rounded-lg border border-border/30 bg-card/30">
                                    <div 
                                      className="w-8 h-8 rounded-md border-2 border-foreground/20 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                                      style={{ backgroundColor: editingTheme.colors[colorKey as keyof ThemeColors] }}
                                      onClick={() => {
                                        setSelectedColorKey(colorKey);
                                        setShowColorPicker(true);
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <Label className="text-xs font-medium text-foreground">
                                        {colorKey.replace(/([A-Z])/g, ' $1').trim()}
                                      </Label>
                                      <Input
                                        value={editingTheme.colors[colorKey as keyof ThemeColors]}
                                        onChange={(e) => handleColorChange(colorKey as keyof ThemeColors, e.target.value)}
                                        className="text-xs h-6 mt-1"
                                      />
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedColorKey(colorKey);
                                        setShowColorPicker(true);
                                      }}
                                      className="p-1 h-6 w-6"
                                    >
                                      <Palette className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {showColorPicker && selectedColorKey && (
                        <Card className="p-4 border-2 border-primary/30 bg-card/95 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Palette className="h-5 w-5 text-primary" />
                              Color Picker - {selectedColorKey.replace(/([A-Z])/g, ' $1').trim()}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-background/50 p-4 rounded-lg border border-border/50">
                              <HexColorPicker
                                color={editingTheme.colors[selectedColorKey as keyof ThemeColors]}
                                onChange={(color) => setEditingTheme({
                                  ...editingTheme,
                                  colors: { ...editingTheme.colors, [selectedColorKey]: color }
                                })}
                              />
                            </div>
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/30">
                              <Label className="text-sm font-medium text-foreground">Current Color:</Label>
                              <div className="flex items-center gap-3 mt-2">
                                <div 
                                  className="w-8 h-8 rounded-md border-2 border-foreground/20 shadow-sm"
                                  style={{ backgroundColor: editingTheme.colors[selectedColorKey as keyof ThemeColors] }}
                                />
                                <code className="text-sm font-mono bg-background/80 px-2 py-1 rounded border text-foreground">
                                  {editingTheme.colors[selectedColorKey as keyof ThemeColors]}
                                </code>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => setShowColorPicker(false)}
                                className="bg-primary hover:bg-primary/90"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Done
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm" 
                                onClick={() => setShowColorPicker(false)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Gradient Controls Section */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Gradient Colors
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Configure gradient colors for backgrounds and elements
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {Object.entries(editingTheme.gradients || {}).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                              <GradientColorPicker
                                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                value={value}
                                onChange={(newGradient) => handleGradientChange(key as keyof GradientColors, newGradient)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base font-medium">Quick Actions</Label>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyThemeColors(editingTheme)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Colors
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => exportTheme(editingTheme)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </Button>
                        </div>
                      </div>

                      {/* Live Preview Section */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Live Preview
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            See how your theme looks in real-time
                          </p>
                        </div>
                        
                        <LivePreviewPanel theme={editingTheme} className="border-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettings;