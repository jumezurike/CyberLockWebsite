      
      {/* Enhanced Professional Analysis Section - Marriage of Old and Enhanced */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">Enhanced Professional Analysis</CardTitle>
          <CardDescription className="text-center">
            Comprehensive 5-Pillar RASBITA Framework Assessment with Visual Analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="visual-scorecard" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="executive-summary">Executive Summary</TabsTrigger>
              <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
              <TabsTrigger value="visual-scorecard">Visual Scorecard</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual-scorecard" className="space-y-4 pt-4">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">5-Pillar RASBITA Framework Scorecard</h2>
                  <p className="text-muted-foreground">Mathematical Framework: 500% Total Capacity (5 Pillars × 100% Each) = 500%/5 = 100%</p>
                </div>

                {/* Five Pillars Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-blue-800">Pillar 1</CardTitle>
                      <CardDescription className="text-xs text-blue-600">Qualitative Assessment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-900">85%</div>
                      <p className="text-xs text-blue-700">Evidence-based scoring</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-green-800">Pillar 2</CardTitle>
                      <CardDescription className="text-xs text-green-600">Quantitative Analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-900">72%</div>
                      <p className="text-xs text-green-700">17 Deep Scan Parameters</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-amber-50 border-amber-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-amber-800">Pillar 3</CardTitle>
                      <CardDescription className="text-xs text-amber-600">RASBITA Cost-Benefit</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-amber-900">68%</div>
                      <p className="text-xs text-amber-700">Financial impact modeling</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-purple-800">Pillar 4</CardTitle>
                      <CardDescription className="text-xs text-purple-600">RASBITA Governance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-900">79%</div>
                      <p className="text-xs text-purple-700">NIST CSF 2.0 radar analysis</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-50 border-red-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-red-800">Pillar 5</CardTitle>
                      <CardDescription className="text-xs text-red-600">Architecture Threat Modeling</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-900">83%</div>
                      <p className="text-xs text-red-700">STRIDE methodology</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Visual Scorecard Section with Pie Chart representation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Framework Distribution (Pie Chart)</CardTitle>
                      <CardDescription>5-Pillar RASBITA Assessment Coverage</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 w-full">
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="text-4xl font-bold text-primary mb-2">77.4%</div>
                          <div className="text-sm text-muted-foreground">Overall Security Score</div>
                          <div className="text-xs text-muted-foreground mt-1">(387/500 total points)</div>
                          
                          {/* Pie Chart Visual Representation */}
                          <div className="mt-4 relative w-32 h-32">
                            <svg viewBox="0 0 120 120" className="w-full h-full">
                              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10"/>
                              <circle 
                                cx="60" cy="60" r="50" 
                                fill="none" 
                                stroke="#3b82f6" 
                                strokeWidth="10"
                                strokeDasharray="85 315"
                                strokeDashoffset="25"
                                transform="rotate(-90 60 60)"
                              />
                              <circle 
                                cx="60" cy="60" r="50" 
                                fill="none" 
                                stroke="#10b981" 
                                strokeWidth="10"
                                strokeDasharray="72 315"
                                strokeDashoffset="25"
                                transform="rotate(15 60 60)"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Pillar Performance Analysis</CardTitle>
                      <CardDescription>Individual pillar scores with progress bars</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Qualitative Assessment</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                            </div>
                            <span className="text-sm font-bold">85%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Quantitative Analysis</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                            </div>
                            <span className="text-sm font-bold">72%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">RASBITA Cost-Benefit</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-amber-600 h-2 rounded-full" style={{ width: "68%" }}></div>
                            </div>
                            <span className="text-sm font-bold">68%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">RASBITA Governance</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{ width: "79%" }}></div>
                            </div>
                            <span className="text-sm font-bold">79%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Architecture Threat Modeling</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-red-600 h-2 rounded-full" style={{ width: "83%" }}></div>
                            </div>
                            <span className="text-sm font-bold">83%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Risk Probability Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Probability Assessment</CardTitle>
                    <CardDescription>Color-coded risk categories based on 5-pillar analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-red-700">8%</div>
                        <div className="text-sm text-red-600">&gt;80% Risk</div>
                        <div className="text-xs text-red-500">Critical</div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-orange-700">15%</div>
                        <div className="text-sm text-orange-600">60-80% Risk</div>
                        <div className="text-xs text-orange-500">High</div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-yellow-700">32%</div>
                        <div className="text-sm text-yellow-600">30-60% Risk</div>
                        <div className="text-xs text-yellow-500">Medium</div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-700">45%</div>
                        <div className="text-sm text-green-600">&lt;30% Risk</div>
                        <div className="text-xs text-green-500">Low</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-4 pt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-blue-800">PCI-DSS</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-blue-900">68%</div>
                      <p className="text-xs text-blue-700">Payment card security compliance</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-green-800">HIPAA</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-green-900">75%</div>
                      <p className="text-xs text-green-700">Healthcare data protection</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-purple-800">CMMC</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-purple-900">62%</div>
                      <p className="text-xs text-purple-700">Defense contractor requirements</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-amber-50 border-amber-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-amber-800">GDPR/CCPA</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-amber-900">71%</div>
                      <p className="text-xs text-amber-700">Data privacy regulations</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-50 border-red-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-red-800">SOC 2</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-red-900">69%</div>
                      <p className="text-xs text-red-700">Service organization controls</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-indigo-50 border-indigo-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-indigo-800">ISO 27001</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-indigo-900">66%</div>
                      <p className="text-xs text-indigo-700">Information security management</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>