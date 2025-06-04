// BACKUP OF FIRST DUPLICATE IDENTITY BEHAVIOR SECTION - 2025-06-03
// This is the content from lines 1089-1189 before removal

<TabsContent value="identity-behavior" className="space-y-6">
  <div className="border rounded-md p-4">
    <h3 className="font-medium mb-4">13. Identity Behavior & Hygiene</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Track and manage identity behaviors, authentication practices, and security hygiene measures.
    </p>
    
    {/* 1. Identification Section */}
    <div className="border rounded-md p-4 mb-6">
      <h4 className="font-medium mb-4">1. Identification</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="identityBehaviorHygiene.identificationMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identification Method</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select identification method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="username">Username</SelectItem>
                  <SelectItem value="email">Email Address</SelectItem>
                  <SelectItem value="employee-id">Employee ID</SelectItem>
                  <SelectItem value="badge">Badge Number</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="identityBehaviorHygiene.identityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identity Type</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select identity type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="service-account">Service Account</SelectItem>
                  <SelectItem value="system-account">System Account</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
    
    {/* Basic UWA Records placeholder */}
    <div className="mt-6 p-4 border rounded-md">
      <h4 className="font-medium mb-2">UWA Records</h4>
      <p className="text-sm text-muted-foreground">
        UWA records will be displayed here when available.
      </p>
    </div>
    
    <div className="flex justify-end space-x-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          const deviceTab = document.querySelector('[value="device-inventory"]') as HTMLElement;
          if (deviceTab) deviceTab.click();
        }}
      >
        Previous Step
      </Button>
      <Button 
        type="button"
        onClick={() => {
          const contactTab = document.querySelector('[value="contact"]') as HTMLElement;
          if (contactTab) contactTab.click();
        }}
      >
        Next Step
      </Button>
    </div>
  </div>
</TabsContent>