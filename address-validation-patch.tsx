// This file contains the patches needed for the application

// 1. Address Input Validation Function to Prevent IP Addresses
// Add this function to the questionnaire-form-fixed.tsx file
const isIpAddress = (value: string): boolean => {
  // Regular expression for matching IPv4 and IPv6 addresses
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^[A-F0-9:]+$/i;
  return ipRegex.test(value);
};

// 2. Modified BusinessAddress Field with IP Address Validation
// Replace the existing businessAddress FormField with this in questionnaire-form-fixed.tsx
/*
<FormField
  control={form.control}
  name="businessAddress"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Business/Office/Home Address</FormLabel>
      <FormControl>
        <Input 
          placeholder="Enter business, office, or home address" 
          {...field} 
          onChange={(e) => {
            const value = e.target.value;
            // Check if the value looks like an IP address
            if (isIpAddress(value)) {
              // Show an error toast notification
              toast({
                title: "Invalid Address Format",
                description: "Please enter a physical address, not an IP address.",
                variant: "destructive",
              });
              // Clear the field or keep the previous value
              // Option 1: Clear the field
              field.onChange("");
              // Option 2: Keep the previous value (uncomment to use)
              // e.preventDefault();
            } else {
              // Update the field value normally
              field.onChange(value);
            }
          }}
        />
      </FormControl>
      <FormDescription>
        Enter a physical business, office, or home address. IP addresses are not allowed.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
*/

// 3. Change for Address field label in Identity Components table
// Find the table row with "Address" and replace with:
/*
<tr className="hover:bg-muted/5">
  <td className="py-2 px-3 border-r font-medium">Business/Office/Home Address</td>
  <td className="py-2 px-3 border-r">
    <Checkbox 
      checked={true} 
      className="data-[state=checked]:bg-primary" 
    />
  </td>
  <td className="py-2 px-3 border-r">
    <Checkbox 
      className="data-[state=checked]:bg-primary" 
    />
  </td>
  <td className="py-2 px-3 border-r">
    <Checkbox 
      disabled 
      className="data-[state=checked]:bg-primary" 
    />
  </td>
  <td className="py-2 px-3">
    <Checkbox 
      disabled 
      className="data-[state=checked]:bg-primary" 
    />
  </td>
</tr>
*/