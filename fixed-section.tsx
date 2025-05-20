// This is the corrected section for the identity-behavior tab in the questionnaire form

<TabsContent value="identity-behavior" className="space-y-6">
  <div className="border rounded-md p-4">
    <h3 className="font-medium mb-4">13. Identity Behavior & Hygiene</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Track and manage identity behaviors, authentication practices, and access patterns.
    </p>
    
    <div className="space-y-6">
      {/* 1. Identification */}
      <div className="border rounded-md p-4 mb-6">
        <h4 className="font-medium mb-4">1. Identification</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="identityBehaviorHygiene.userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormDescription>
                  Employee ID, service account name
                </FormDescription>
                <FormControl>
                  <Input placeholder="Enter user ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="identityBehaviorHygiene.fullNameRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name / Role</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name and role" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="identityBehaviorHygiene.contactInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Info</FormLabel>
                <FormDescription>
                  Email, phone for emergency access
                </FormDescription>
                <FormControl>
                  <Input placeholder="Enter contact information" {...field} />
                </FormControl>
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
                    <SelectItem value="human">Human</SelectItem>
                    <SelectItem value="machine">Machine</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="third-party">Third-Party</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <SelectItem value="device-id">Device ID</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* UWA Records Table Section */}
      <div className="space-y-4 mt-8">
        <div className="bg-muted/10 p-4 rounded-md">
          <h3 className="font-medium mb-2">UWA+Components</h3>
          <p className="text-sm text-muted-foreground">
            Components used to derive this identity's Universal Wallet Address
          </p>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead>UWA</TableHead>
                <TableHead>Identity type</TableHead>
                <TableHead>ID method</TableHead>
                <TableHead>ServerID</TableHead>
                <TableHead>UUID</TableHead>
                <TableHead>SN</TableHead>
                <TableHead>MAKE/MODEL</TableHead>
                <TableHead>Entity type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Sample production data rows */}
              <TableRow>
                <TableCell className="font-mono text-xs">CLX-PR8c4-47ae-bebe-4087c52abdf4</TableCell>
                <TableCell>Machine</TableCell>
                <TableCell>Serial Number</TableCell>
                <TableCell>srv-34522</TableCell>
                <TableCell className="font-mono text-xs">1c-49ca-47ae-bebe-4087c52abdf4</TableCell>
                <TableCell>HX653-9871</TableCell>
                <TableCell>Dell PowerEdge R740</TableCell>
                <TableCell>
                  <Badge variant="outline" className="lowercase">
                    virtual machine
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs">CLX-PD-31a8ji-ebhs-39j5-acdoi4</TableCell>
                <TableCell>Machine</TableCell>
                <TableCell>Serial Number</TableCell>
                <TableCell>srv-67891</TableCell>
                <TableCell className="font-mono text-xs">a8d45c3f...</TableCell>
                <TableCell>JK129-556P</TableCell>
                <TableCell>HPE ProLiant DL380</TableCell>
                <TableCell>
                  <Badge variant="outline" className="lowercase">
                    Virtual machine
                  </Badge>
                  <div className="mt-1">
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-xs">
                      Yes
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.querySelector('[value="device-inventory"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
        >
          Previous Step
        </Button>
        <Button 
          type="button"
          onClick={() => document.querySelector('[value="contact"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
        >
          Next Step
        </Button>
      </div>
    </div>
  </div>
</TabsContent>