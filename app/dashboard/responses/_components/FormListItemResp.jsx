"use client"

import React, { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Share, Trash } from 'lucide-react';
import { RWebShare } from 'react-web-share';
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import { db } from '@/configs';
import { userResponses } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';

function FormListItemResp({jsonForm, jsonResponse, responseRecord, onDelete}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteResponse = async () => {
    if (!responseRecord?.responseId) {
      toast.error('Invalid response ID');
      return;
    }

    setIsDeleting(true);
    try {
      await db
        .delete(userResponses)
        .where(eq(userResponses.id, responseRecord.responseId));
      
      toast.success('Response deleted successfully');
      onDelete && onDelete(responseRecord.responseId);
    } catch (error) {
      console.error('Error deleting response:', error);
      toast.error('Failed to delete response');
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="border shadow-sm rounded-lg p-4 h-full flex flex-col justify-between min-w-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">
              Response #{responseRecord?.responseId} • {responseRecord?.responseCreatedAt}
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Trash className="h-4 w-4 text-red-600 cursor-pointer hover:scale-105 transition-all" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this response.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteResponse}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Response'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
    
          <div className="flex-grow min-h-0">
            <h2 className="font-bold text-lg text-black break-words mb-2">
              {jsonForm?.formTitle}
            </h2>
            <h3 className="font-medium text-sm text-gray-600 break-words mb-3">
              {jsonForm?.formSubheading}
            </h3>
            
            {/* Display response data */}
            <div className="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Response Data:</h4>
              {jsonResponse && Object.keys(jsonResponse).length > 0 ? (
                <div className="space-y-1">
                  {Object.entries(jsonResponse).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="font-medium text-gray-600">{key}:</span>
                      <span className="ml-1 text-gray-800">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No response data available</p>
              )}
            </div>
          </div>
    
          <hr className="my-4" />
    
          <div className="flex justify-between">
            <RWebShare
              data={{
                text:
                  jsonForm?.formSubheading +
                  " , Build your form in seconds with AI Form Builder",
                url:
                  process.env.NEXT_PUBLIC_BASE_URL +
                  '/aiform/' +
                  responseRecord?.formId,
                title: jsonForm?.formTitle,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <Button size="sm" variant="outline" className="flex gap-2 shrink-0">
                <Share className="h-4 w-4" />
                Share Form
              </Button>
            </RWebShare>
    
            <Link href={'/edit_form/' + responseRecord?.formId}>
              <Button size="sm" className="flex gap-2 shrink-0">
                <Edit className="h-4 w-4" />
                View Form
              </Button>
            </Link>
          </div>
        </div>
  )
}

export default FormListItemResp