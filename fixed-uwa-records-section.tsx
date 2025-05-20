// This is the updated UWA Records table with green highlighting for components used to create the UWA

export const updatedUwaRecordsSection = `
<div className="mt-4 border rounded-md p-3">
  <h6 className="text-xs font-medium mb-2">UWA Records</h6>
  <p className="text-xs text-muted-foreground mb-2">
    This table shows all UWA records and the components used to create each UWA. 
    Highlighted fields with values were used to derive the UWA.
  </p>
  <div className="overflow-x-auto">
    <table className="min-w-full border-collapse text-xs">
      <thead className="bg-muted/30">
        <tr>
          <th className="py-1 px-2 text-left font-medium border">UWA</th>
          <th className="py-1 px-2 text-left font-medium border">Identity type</th>
          <th className="py-1 px-2 text-left font-medium border">Identification method</th>
          <th className="py-1 px-2 text-left font-medium border">ServerID</th>
          <th className="py-1 px-2 text-left font-medium border">UUID</th>
          <th className="py-1 px-2 text-left font-medium border">SN</th>
          <th className="py-1 px-2 text-left font-medium border">MAKE/MODEL</th>
          <th className="py-1 px-2 text-left font-medium border">OS</th>
          <th className="py-1 px-2 text-left font-medium border">Server/OWNER/COMPANY</th>
          <th className="py-1 px-2 text-left font-medium border">MAC</th>
          <th className="py-1 px-2 text-left font-medium border">UWA/N SHADOW</th>
          <th className="py-1 px-2 text-left font-medium border">ENVIRONMENT</th>
          <th className="py-1 px-2 text-left font-medium border">IP address</th>
          <th className="py-1 px-2 text-left font-medium border">EIN/BIZ #</th>
          <th className="py-1 px-2 text-left font-medium border">ADDRESS</th>
          <th className="py-1 px-2 text-left font-medium border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {uwaRecords.length > 0 ? (
          uwaRecords.map((record, index) => (
            <tr key={index} className={index === uwaRecords.length - 1 ? "bg-green-50" : ""}>
              {/* UWA Value - Read-only */}
              <td className="py-1 px-2 border bg-amber-50 font-medium">
                {record.uwaValue}
              </td>
              
              {/* Identity Type */}
              <td className={\`py-1 px-2 border \${isUsedInUwa(record, 'identityType') ? 'bg-green-50 font-medium' : ''}\`}>
                {editingRecord === record.id && editingField === 'identityType' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'identityType', record.identityType || '')}
                  >
                    {isUsedInUwa(record, 'identityType') ? record.identityType : '-'}
                  </div>
                )}
              </td>
              
              {/* Identification Method */}
              <td className={\`py-1 px-2 border \${isUsedInUwa(record, 'identificationMethod') ? 'bg-green-50 font-medium' : ''}\`}>
                {editingRecord === record.id && editingField === 'identificationMethod' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'identificationMethod', record.identificationMethod || '')}
                  >
                    {isUsedInUwa(record, 'identificationMethod') ? record.identificationMethod : '-'}
                  </div>
                )}
              </td>
              
              {/* Server ID */}
              <td className={\`py-1 px-2 border \${isUsedInUwa(record, 'serverId') ? 'bg-green-50 font-medium' : ''}\`}>
                {editingRecord === record.id && editingField === 'serverId' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'serverId', record.serverId || '')}
                  >
                    {isUsedInUwa(record, 'serverId') ? record.serverId : '-'}
                  </div>
                )}
              </td>
              
              {/* UUID */}
              <td className={\`py-1 px-2 border \${isUsedInUwa(record, 'instanceUUID') ? 'bg-green-50 font-medium' : ''}\`}>
                {editingRecord === record.id && editingField === 'instanceUUID' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'instanceUUID', record.instanceUUID || '')}
                  >
                    {isUsedInUwa(record, 'instanceUUID') ? record.instanceUUID : '-'}
                  </div>
                )}
              </td>
              
              {/* Serial Number */}
              <td className="py-1 px-2 border">
                {editingRecord === record.id && editingField === 'serialNumber' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'serialNumber', record.serialNumber || '')}
                  >
                    {record.serialNumber || '-'}
                  </div>
                )}
              </td>
              
              {/* Make/Model */}
              <td className="py-1 px-2 border">
                {editingRecord === record.id && editingField === 'makeModel' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'makeModel', record.makeModel || '')}
                  >
                    {record.makeModel || '-'}
                  </div>
                )}
              </td>
              
              {/* OS */}
              <td className={\`py-1 px-2 border \${isUsedInUwa(record, 'osName') ? 'bg-green-50 font-medium' : ''}\`}>
                {editingRecord === record.id && editingField === 'osName' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'osName', record.osName || '')}
                  >
                    {isUsedInUwa(record, 'osName') ? record.osName : '-'}
                  </div>
                )}
              </td>
              
              {/* Company Name */}
              <td className="py-1 px-2 border">
                {editingRecord === record.id && editingField === 'companyName' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'companyName', record.companyName || '')}
                  >
                    {record.companyName || '-'}
                  </div>
                )}
              </td>
              
              {/* MAC Address */}
              <td className="py-1 px-2 border">
                {editingRecord === record.id && editingField === 'macAddress' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'macAddress', record.macAddress || '')}
                  >
                    {record.macAddress || '-'}
                  </div>
                )}
              </td>
              
              {/* UWA Shadow */}
              <td className="py-1 px-2 border">
                {editingRecord === record.id && editingField === 'uwaShadow' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'uwaShadow', record.uwaShadow || '')}
                  >
                    {record.uwaShadow || '-'}
                  </div>
                )}
              </td>
              
              {/* Environment */}
              <td className={\`py-1 px-2 border \${isUsedInUwa(record, 'environment') ? 'bg-green-50 font-medium' : ''}\`}>
                {editingRecord === record.id && editingField === 'environment' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'environment', record.environment || '')}
                  >
                    {isUsedInUwa(record, 'environment') ? record.environment : '-'}
                  </div>
                )}
              </td>
              
              {/* IP Address */}
              <td className="py-1 px-2 border">
                {editingRecord === record.id && editingField === 'ipAddress' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'ipAddress', record.ipAddress || '')}
                  >
                    {record.ipAddress || '-'}
                  </div>
                )}
              </td>
              
              {/* EIN/Business Number */}
              <td className="py-1 px-2 border">
                {editingRecord === record.id && editingField === 'einBusinessNumber' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'einBusinessNumber', record.einBusinessNumber || '')}
                  >
                    {record.einBusinessNumber || '-'}
                  </div>
                )}
              </td>
              
              {/* Address */}
              <td className={\`py-1 px-2 border \${isUsedInUwa(record, 'address') ? 'bg-green-50 font-medium' : ''}\`}>
                {editingRecord === record.id && editingField === 'address' ? (
                  <input 
                    type="text" 
                    className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-text"
                    onClick={() => handleEditStart(record.id, 'address', record.address || '')}
                  >
                    {isUsedInUwa(record, 'address') ? record.address : '-'}
                  </div>
                )}
              </td>
              
              {/* Actions */}
              <td className="py-1 px-2 border">
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this UWA record?')) {
                        // Delete UWA record from database
                        if (typeof record.id === 'number') {
                          fetch(\`/api/uwas/\${record.id}\`, {
                            method: 'DELETE'
                          }).then(response => {
                            if (response.ok) {
                              // Remove from local state
                              setUwaRecords(uwaRecords.filter(r => r.id !== record.id));
                              toast({
                                title: "Record Deleted",
                                description: "UWA record has been permanently removed.",
                                variant: "default",
                              });
                            } else {
                              toast({
                                title: "Delete Failed",
                                description: "Could not delete record from database.",
                                variant: "destructive",
                              });
                            }
                          });
                        }
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={16} className="py-3 px-2 text-center text-muted-foreground">
              No UWA records found. Generate a UWA to create a record.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  
  <div className="mt-2 flex justify-end">
    <Button 
      size="sm" 
      variant="outline"
      onClick={() => {
        // Export UWA records to CSV
        exportUwaRecordsToCsv();
      }}
    >
      <Download className="h-3 w-3 mr-1" /> Export Records
    </Button>
  </div>
</div>
`;