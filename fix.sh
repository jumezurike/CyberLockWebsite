#!/bin/bash

# Make a backup of the current file
cp client/src/components/sos2a/questionnaire-form-fixed.tsx client/src/components/sos2a/questionnaire-form-fixed.tsx.bak

# Replace "Address" with "Business/Office/Home Address" in the table
sed -i 's/font-medium">Address</font-medium">Business\/Office\/Home Address</' client/src/components/sos2a/questionnaire-form-fixed.tsx