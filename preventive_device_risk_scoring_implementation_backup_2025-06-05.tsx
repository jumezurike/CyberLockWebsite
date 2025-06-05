// BACKUP: Preventive Device Risk Scoring - Risk Calculation Function
// Date: June 5, 2025
// Location: client/src/components/sos2a/questionnaire-form.tsx (lines 333-343)

// Calculate device risk score based on Section #3 security risks
const calculateDeviceRisk = (deviceType: string, ipAddress?: string) => {
  const formValues = form.getValues();
  const organizationSecurityRisks = [
    ...(formValues.securityRisks || []),
    ...(formValues.websiteVulnerabilities || []),
    ...(formValues.endDeviceVulnerabilities || [])
  ];

  return calculateDeviceRiskScore(organizationSecurityRisks, deviceType);
};

// BACKUP: Auto-Population Enhancement for Device Risk Score Field
// Location: client/src/components/sos2a/questionnaire-form.tsx (lines 5147-5200)

<FormField
  control={form.control}
  name="deviceInventoryTracking.deviceRiskScore"
  render={({ field }) => {
    const deviceType = form.watch("deviceInventoryTracking.deviceType");
    const ipAddress = form.watch("deviceInventoryTracking.ipAddress");
    const calculatedScore = deviceType ? calculateDeviceRisk(deviceType, ipAddress || "") : 0;
    
    return (
      <FormItem>
        <FormLabel>Device Risk Score</FormLabel>
        <FormDescription>
          Auto-calculated from Section #3 security risks. Override with SIEM/EDR data if available.
        </FormDescription>
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-md">
            <span className="text-sm text-gray-600">Calculated Score:</span>
            <Badge 
              variant={
                calculatedScore >= 80 ? "destructive" :
                calculatedScore >= 60 ? "default" :
                calculatedScore >= 40 ? "secondary" : "outline"
              }
            >
              {calculatedScore}/100
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => field.onChange(calculatedScore)}
            >
              Use Calculated
            </Button>
          </div>
          <FormControl>
            <Input 
              type="number" 
              min="0" 
              max="100" 
              placeholder={`Auto-calculated: ${calculatedScore} (override if needed)`}
              {...field}
              onChange={e => {
                const value = e.target.value === '' ? undefined : Number(e.target.value);
                field.onChange(value);
              }}
            />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    );
  }}
/>

// BACKUP: Auto-Display Risk Assessment Section
// Location: client/src/components/sos2a/questionnaire-form.tsx (lines 4856-4897)

{/* Automatic Device Risk Score Display */}
<div className="border rounded-md p-4 bg-blue-50">
  <h5 className="font-medium mb-3 text-blue-800">Automatic Device Risk Assessment</h5>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        Risk Score (Based on Section #3 Security Risks):
      </p>
      <div className="flex items-center space-x-3">
        {(() => {
          const deviceType = form.watch("deviceInventoryTracking.deviceType");
          const ipAddress = form.watch("deviceInventoryTracking.ipAddress");
          const riskScore = deviceType ? calculateDeviceRisk(deviceType, ipAddress || "") : 0;
          const riskLevel = getRiskLevelFromScore(riskScore);
          
          return (
            <>
              <Badge 
                variant={
                  riskScore >= 80 ? "destructive" :
                  riskScore >= 60 ? "default" :
                  riskScore >= 40 ? "secondary" : "outline"
                }
                className="text-lg px-3 py-1"
              >
                {riskScore}/100
              </Badge>
              <span className="text-sm font-medium">
                {riskLevel}
              </span>
            </>
          );
        })()}
      </div>
    </div>
    <div className="space-y-2">
      <p className="text-xs text-gray-500">
        This score is automatically calculated based on your organization's security risks from Section #3 and the device type selected above.
      </p>
    </div>
  </div>
</div>