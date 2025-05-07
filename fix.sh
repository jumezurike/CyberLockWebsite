#!/bin/bash
# Create a backup
cp client/src/components/sos2a/questionnaire-form-fixed.tsx client/src/components/sos2a/questionnaire-form-fixed.tsx.bak

# Fix the missing closing parenthesis
sed -i '3761s/                  <\/div>/                  <\/div>\n                  )}/' client/src/components/sos2a/questionnaire-form-fixed.tsx

# Check if the fix was applied
grep -A 3 -B 3 "Classification Section" client/src/components/sos2a/questionnaire-form-fixed.tsx
