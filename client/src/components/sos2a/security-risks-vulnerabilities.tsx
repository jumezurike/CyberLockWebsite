// This is a reference file for the Security Risks & Vulnerabilities section
// Use this as guidance when updating the questionnaire-form.tsx file

{/* Security Risks & Vulnerabilities Tab */}
<TabsContent value="risks" className="space-y-6">
  <div className="border rounded-md p-4 mb-6 bg-orange-50 border-orange-200">
    <h3 className="font-medium mb-4">Security Risks & Vulnerabilities</h3>
    <FormDescription className="mb-4">
      This section helps us identify your organization's primary security concerns and specific vulnerabilities 
      that may be present in your systems and infrastructure.
    </FormDescription>
    
    <FormField
      control={form.control}
      name="primaryConcerns"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">
              {form.watch('industry') === 'healthcare'
                ? "Select your healthcare organization's primary security concerns"
                : "Select your organization's primary security concerns"}
            </FormLabel>
            <FormDescription>
              This helps us prioritize recommendations based on your most pressing concerns.
            </FormDescription>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryConcernOptions.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name="primaryConcerns"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, option.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== option.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>

  {/* Website Vulnerabilities Section */}
  <div className="border rounded-md p-4 mb-6 bg-orange-50 border-orange-200">
    <h3 className="font-medium mb-4">Website Vulnerabilities</h3>
    <FormDescription className="mb-4">
      If your organization operates a website, select any potential vulnerabilities that might exist in your web infrastructure.
    </FormDescription>
    
    <FormField
      control={form.control}
      name="websiteVulnerabilities"
      render={() => (
        <FormItem>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {websiteVulnerabilityOptions.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name="websiteVulnerabilities"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...(field.value || []), option.id]
                              : (field.value || [])?.filter(
                                  (value) => value !== option.id
                                );
                            field.onChange(updatedValue);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>

  {/* End Device Vulnerabilities Section */}
  <div className="border rounded-md p-4 mb-6 bg-orange-50 border-orange-200">
    <h3 className="font-medium mb-4">End Device Security Vulnerabilities</h3>
    <FormDescription className="mb-4">
      Select any potential vulnerabilities related to your organization's end-user devices (computers, mobile devices, etc.).
    </FormDescription>
    
    <FormField
      control={form.control}
      name="endDeviceVulnerabilities"
      render={() => (
        <FormItem>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {endDeviceVulnerabilityOptions.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name="endDeviceVulnerabilities"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...(field.value || []), option.id]
                              : (field.value || [])?.filter(
                                  (value) => value !== option.id
                                );
                            field.onChange(updatedValue);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>

  {/* Conditional Notice Based on Infrastructure Mode */}
  {form.watch('operationMode')?.includes('commercial-internet') && (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-6">
      <h4 className="text-sm font-medium text-amber-800 mb-1">Commercial Internet Risk Alert</h4>
      <p className="text-sm text-amber-700">
        Using commercial internet introduces additional security concerns. We recommend implementing proper network 
        segmentation, strong firewall rules, and regular security assessments.
      </p>
    </div>
  )}
  
  {form.watch('internetPresence')?.includes('website') && (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-6">
      <h4 className="text-sm font-medium text-amber-800 mb-1">Website Vulnerability Guidance</h4>
      <p className="text-sm text-amber-700">
        Operating a website increases your attack surface. Consider implementing Web Application Firewalls (WAF), 
        regular security scans, and secure coding practices to mitigate web-specific vulnerabilities.
      </p>
    </div>
  )}
</TabsContent>