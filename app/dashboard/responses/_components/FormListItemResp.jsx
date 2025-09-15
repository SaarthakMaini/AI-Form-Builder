"use client"

import React from 'react'
import { Download, Share, Eye } from 'lucide-react';
import { RWebShare } from 'react-web-share';
import { Button } from '@/components/ui/button';
import Link from 'next/link'

function FormListItemResp({jsonForm, formRecord, responseCount, onExportCSV}) {
  const handleExportCSV = () => {
    if (responseCount === 0) {
      alert('No responses to export for this form');
      return;
    }
    onExportCSV(formRecord.formId, jsonForm?.formTitle || 'Untitled Form');
  };
  return (
    <div className="border shadow-sm rounded-lg p-4 h-full flex flex-col justify-between min-w-0">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Responses:</span>
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full">
            {responseCount}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          Form #{formRecord?.formId}
        </span>
      </div>

      <div className="flex-grow min-h-0">
        <h2 className="font-bold text-lg text-black break-words mb-2">
          {jsonForm?.formTitle || 'Untitled Form'}
        </h2>
        <h3 className="font-medium text-sm text-gray-600 break-words mb-4">
          {jsonForm?.formSubheading || 'No description available'}
        </h3>
        
        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {responseCount}
            </div>
            <div className="text-sm text-gray-600">
              {responseCount === 1 ? 'Response' : 'Responses'} Received
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex flex-col gap-2">
        <Button 
          onClick={handleExportCSV}
          disabled={responseCount === 0}
          className="w-full flex gap-2 cursor-pointer"
          variant={responseCount === 0 ? "outline" : "default"}
        >
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
        
        <div className="flex gap-2">
          <RWebShare
            data={{
              text: jsonForm?.formSubheading + " , Build your form in seconds with AI Form Builder",
              url: process.env.NEXT_PUBLIC_BASE_URL + '/aiform/' + formRecord?.formId,
              title: jsonForm?.formTitle,
            }}
            onClick={() => console.log("shared successfully!")}
          >
            <Button size="sm" variant="outline" className="flex gap-2 flex-1 cursor-pointer">
              <Share className="h-4 w-4" />
              Share
            </Button>
          </RWebShare>

          <Link href={'/edit_form/' + formRecord?.formId} className="flex-1">
            <Button size="sm" className="flex gap-2 w-full cursor-pointer">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FormListItemResp