              {/* 13. Identity Behavior & Hygiene Tab */}
              <TabsContent value="identity-behavior" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">13. Identity Behavior & Hygiene</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track and manage identity behaviors, authentication practices, and security hygiene measures.
                  </p>

                  {/* Universal Identity Verification System (UIVS) Section */}
                  <div className="border rounded-md p-4 mb-6 bg-blue-50">
                    <h4 className="font-medium text-blue-700 mb-2">Universal Identity Verification System (UIVS)</h4>
                    <p className="text-sm mb-4">
                      For organizations with multiple users, we recommend using our Identity Management system to import and manage all your users in one place with our patented Universal Identity Verification System (UIVS).
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        type="button" 
                        variant="default" 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/identity-management";
                        }}
                      >
                        <UserPlus className="w-4 h-4 mr-2" /> Manage User Identities
                      </Button>
                      <Button 
                        type="button" 
                        variant="default" 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        onClick={(e) => {
                          e.preventDefault();
                          const csvHeader = "user_id,first_name,last_name,email,role,department,identity_type,access_level,government_id_type,government_id_issuing_authority,mfa_enabled,mfa_type,location,manager,employment_status,last_password_change,last_security_training,system_access,typical_login_hours,login_anomaly_threshold,inactive_account_days,credential_exposure_check,session_timeout_minutes,privilege_escalation_alerts,federation_source";
                          const sampleData = [
                            "EMP001,John,Smith,john.smith@example.com,IT Manager,Information Technology,human,privileged,drivers_license,NY-DMV,yes,app+sms,Headquarters,jane.doe@example.com,Full Time,2025-04-15,2025-03-01,\"ERP, CRM, IT Admin Portal\",9:00-17:00,medium,30,yes,60,yes,Active Directory",
                            "EMP002,Sarah,Johnson,sarah.johnson@example.com,Finance Director,Finance,human,admin,state_id,CA-DMV,yes,hardware,Headquarters,executive@example.com,Full Time,2025-04-20,2025-03-01,\"ERP, Finance Portal, Expense System\",8:00-18:00,high,30,yes,30,yes,Okta SSO"
                          ];
                          const csvContent = csvHeader + "\n" + sampleData.join("\n");
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.setAttribute('href', url);
                          link.setAttribute('download', 'user-identity-template.csv');
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <FileDown className="w-4 h-4 mr-2" /> Download Template
                      </Button>
                    </div>
                  </div>

                  {/* 1. Standard Authentication */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">1. Standard Authentication</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.usernamePassword"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Username / Password</FormLabel>
                              <FormDescription>Traditional username and password authentication</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.employeeId"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Employee ID</FormLabel>
                              <FormDescription>Unique employee identifier for authentication</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.certificate"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Certificate</FormLabel>
                              <FormDescription>Digital certificate-based authentication</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.smartCard"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Smart Card</FormLabel>
                              <FormDescription>Smart card authentication system</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.singleSignOn"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Single Sign-On</FormLabel>
                              <FormDescription>SSO authentication integration</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.tokenBased"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Token-Based</FormLabel>
                              <FormDescription>Token-based authentication</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* 2. Advanced Authentication */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">2. Advanced Authentication</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.uwaAuth"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>UWA (Universal Wallet Address)</FormLabel>
                              <FormDescription>Patented Universal Wallet Address authentication</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.mfaAuth"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>MFA (Multi-Factor Authentication)</FormLabel>
                              <FormDescription>Multiple authentication factors required</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* 3. Biometric */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">3. Biometric</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.fingerprint"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Fingerprint</FormLabel>
                              <FormDescription>Fingerprint biometric authentication</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.voice"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Voice</FormLabel>
                              <FormDescription>Voice recognition authentication</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.facial"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Facial</FormLabel>
                              <FormDescription>Facial recognition authentication</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.iris"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Iris</FormLabel>
                              <FormDescription>Iris scanning authentication</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* 4. Government ID */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">4. Government ID</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.driversLicense"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Driver License</FormLabel>
                              <FormDescription>Driver's license for identification</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.passport"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Passport</FormLabel>
                              <FormDescription>Passport for identification</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.nationalId"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>National ID</FormLabel>
                              <FormDescription>National identification card</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.militaryId"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Military ID</FormLabel>
                              <FormDescription>Military identification card</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.stateId"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>State ID</FormLabel>
                              <FormDescription>State-issued identification</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.birthCertificate"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Birth Certificate</FormLabel>
                              <FormDescription>Birth certificate for identification</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.socialSecurityCard"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Social Security Card</FormLabel>
                              <FormDescription>Social Security card for identification</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.citizenshipCertificate"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Certificate of Citizenship</FormLabel>
                              <FormDescription>Certificate of citizenship for identification</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
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
              </TabsContent>