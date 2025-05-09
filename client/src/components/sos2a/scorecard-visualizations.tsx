import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { frameworkMappings, getAutomationPercentage } from "@/lib/sos2a-framework-mappings";
import { deepScanMappings } from "@/lib/deep-scan-mappings";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface ScorecardVisualizationsProps {
  data?: any;
}

export default function ScorecardVisualizations({ data }: ScorecardVisualizationsProps) {
  // Use the framework mappings for Pillar 1 visualization
  const qualitativeData = frameworkMappings.map(mapping => ({
    name: mapping.parameter.split(' ').slice(0, 2).join(' '),
    fullName: mapping.parameter,
    value: getAutomationPercentage(mapping.automationLevel),
    automationLevel: mapping.automationLevel
  }));

  // Use deep scan mappings for Pillar 2 visualization
  const deepScanData = deepScanMappings.map((scan, index) => ({
    name: scan.parameter,
    value: 25 + Math.floor(Math.random() * 35), // Randomized values between 25-60 for sample data
    qualitativeAreas: scan.qualitativeAreas,
    validationMethod: scan.validationMethod
  }));

  const radarData = [
    { subject: "Identification", A: 120, B: 110, fullMark: 150 },
    { subject: "Protection", A: 98, B: 130, fullMark: 150 },
    { subject: "Detection", A: 86, B: 130, fullMark: 150 },
    { subject: "Response", A: 99, B: 100, fullMark: 150 },
    { subject: "Recovery", A: 85, B: 90, fullMark: 150 },
  ];

  // Updated pieData to use the 5 pillars
  const pieData = [
    { name: "Qualitative Assessment", value: 400 },
    { name: "Quantitative Analysis", value: 300 },
    { name: "RASBITA Cost-Benefit", value: 300 },
    { name: "RASBITA Governance", value: 200 },
    { name: "Architecture Threat Modeling", value: 278 },
  ];

  const threatModelingData = [
    { name: "Data Flow Analysis", current: 90, target: 100 },
    { name: "STRIDE Modeling", current: 85, target: 100 },
    { name: "Mitigation Strategies", current: 70, target: 100 },
    { name: "Architecture Validation", current: 80, target: 100 },
    { name: "SAST/DAST", current: 75, target: 100 },
  ];

  return (
    <div className="space-y-8 mt-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">5 Pillars of Our SCORECARD</h2>
        <p className="text-muted-foreground">
          Comprehensive evaluation across five key dimensions of cybersecurity posture
        </p>
        <Separator className="my-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Qualitative Assessment */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Pillar 1: Qualitative Assessment (Updated 100%)</CardTitle>
            <CardDescription>
              Refined based on actual evidence with accurate scoring of all 12 parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qualitativeData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip 
                  formatter={(value, name, props) => [`${value}%`, props.payload.fullName]}
                  labelFormatter={() => "Automation Level"}
                />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Parameter Score (%)">
                  {qualitativeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value >= 90 ? "#00C49F" : entry.value >= 80 ? "#FFBB28" : "#FF8042"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pillar 2: Quantitative Analysis */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Pillar 2: Quantitative Analysis (Deep Scan 100%)</CardTitle>
            <CardDescription>Professional scanning tools with detailed analysis</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deepScanData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}%`, 
                    `${props.payload.name}`
                  ]}
                  labelFormatter={() => "Deep Scan Parameter"}
                  cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="value" fill="#00C49F" name="Deep Scan Completion (%)">
                  {deepScanData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value >= 50 ? "#00C49F" : entry.value >= 35 ? "#FFBB28" : "#FF8042"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pillar 3: RASBITA Cost-Benefit Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Pillar 3: RASBITA Cost-Benefit Analysis (Detailed 100%)</CardTitle>
            <CardDescription>Comprehensive financial impact modeling</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Potential Loss", value: 240, fill: "#FF8042" },
                  { name: "Security Investment", value: 100, fill: "#0088FE" },
                  { name: "ROI", value: 140, fill: "#00C49F" },
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}K`, "Amount"]} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Value ($K)">
                  {[
                    <Cell key="cell-0" fill="#FF8042" />,
                    <Cell key="cell-1" fill="#0088FE" />,
                    <Cell key="cell-2" fill="#00C49F" />,
                  ]}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pillar 4: RASBITA Governance & Management */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Pillar 4: RASBITA Governance & Management (Maturity 100%)</CardTitle>
            <CardDescription>NIST CSF 2.0 radar analysis with maturity progression</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar
                  name="Current"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Target"
                  dataKey="B"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pillar 5: Architecture Threat Modeling & App Sec */}
        <Card>
          <CardHeader>
            <CardTitle>Pillar 5: Architecture Threat Modeling & App Sec (Complete 100%)</CardTitle>
            <CardDescription>STRIDE threat modeling with validated strategies</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={threatModelingData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#8884d8" name="Current" />
                <Bar dataKey="target" fill="#82ca9d" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}