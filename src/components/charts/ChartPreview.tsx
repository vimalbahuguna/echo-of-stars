import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Stars, Circle, Download, Share2 } from "lucide-react";
import html2canvas from 'html2canvas';
import VedicChart from './VedicChart';

interface Planet {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
}

interface ChartPreviewProps {
  chartData?: {
    name?: string;
    planets?: Planet[];
    interpretation?: string;
    astrologicalSystem?: string;
  };
  isDemo?: boolean;
}

const SAMPLE_PLANETS: Planet[] = [
  { name: "Sun", sign: "Taurus", degree: 25.3, house: 10, retrograde: false },
  { name: "Moon", sign: "Cancer", degree: 12.7, house: 12, retrograde: false },
  { name: "Mercury", sign: "Gemini", degree: 8.1, house: 11, retrograde: false },
  { name: "Venus", sign: "Aries", degree: 19.5, house: 9, retrograde: false },
  { name: "Mars", sign: "Leo", degree: 2.9, house: 1, retrograde: false },
  { name: "Jupiter", sign: "Sagittarius", degree: 14.2, house: 5, retrograde: true },
  { name: "Saturn", sign: "Capricorn", degree: 28.6, house: 6, retrograde: false },
  { name: "Uranus", sign: "Aquarius", degree: 6.4, house: 7, retrograde: false },
  { name: "Neptune", sign: "Pisces", degree: 11.8, house: 8, retrograde: true },
  { name: "Pluto", sign: "Scorpio", degree: 22.1, house: 4, retrograde: false }
];

const HOUSE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
];

const ChartPreview = ({ chartData, isDemo = false }: ChartPreviewProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const planets = chartData?.planets || SAMPLE_PLANETS;
  
  const handleDownload = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current, {
        backgroundColor: null, // Use element's background
        scale: 2, // Higher scale for better quality
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${chartData?.name || 'birth-chart'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const handleShare = () => {
    const subject = `Check out my Birth Chart!`;
    const body = `I generated my birth chart using Echo of Stars and wanted to share it with you. You can generate your own here: ${window.location.origin}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Prepare data for pie chart (house distribution)
  const houseData = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    count: planets.filter(p => p.house === i + 1).length,
    color: HOUSE_COLORS[i]
  })).filter(h => h.count > 0);

  return (
    <div className="space-y-6">
      <div ref={chartRef} className="p-4 sm:p-6 bg-card rounded-lg">
        {isDemo && (
          <Card className="bg-accent/5 border-accent/20 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-accent">
                <Stars className="w-4 h-4" />
                <span className="text-sm font-medium">Sample Birth Chart - Jane Doe</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Born May 15, 1990 at 2:30 PM in New York, USA
              </p>
            </CardContent>
          </Card>
        )}

        {chartData?.astrologicalSystem === 'vedic' ? (
          <VedicChart planets={planets} />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Planetary Positions Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stars className="w-5 h-5 text-primary" />
                  Planetary Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Planet</TableHead>
                      <TableHead>Sign</TableHead>
                      <TableHead>Degree</TableHead>
                      <TableHead>House</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planets.map((planet) => (
                      <TableRow key={planet.name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {planet.name}
                            {planet.retrograde && (
                              <Badge variant="outline" className="text-xs">R</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{planet.sign}</TableCell>
                        <TableCell>{planet.degree.toFixed(1)}°</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{planet.house}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* House Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Circle className="w-5 h-5 text-accent" />
                  House Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={houseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ house, count }) => `House ${house}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {houseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chart Interpretation */}
        {chartData?.interpretation && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>AI Interpretation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {chartData.interpretation}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default ChartPreview;
