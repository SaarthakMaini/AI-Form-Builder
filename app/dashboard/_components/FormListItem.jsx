import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Share, Trash } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/configs';
import { eq, and } from 'drizzle-orm';
import { toast } from 'sonner';
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
import { useUser } from '@clerk/nextjs';
import { JsonForms } from '@/configs/schema';
import { RWebShare } from "react-web-share";

const FormListItem = ({ jsonForm, formRecord, refreshData }) => {
  const { user } = useUser();

  const onDeleteForm = async () => {
    const result = await db.delete(JsonForms).where(
      and(
        eq(JsonForms.id, formRecord.id),
        eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
    );
    if (result) {
      toast('Form Deleted!');
      refreshData();
    }
  };

  return (
    <div className="border shadow-sm rounded-lg p-4 h-full flex flex-col justify-between min-w-0">
      <div className="flex justify-between">
        <h2></h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash className="h-5 w-5 text-red-600 cursor-pointer hover:scale-105 transition-all" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your form and remove its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteForm()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex-grow min-h-0">
        <h2 className="font-bold text-lg text-black break-words">
          {jsonForm?.formTitle}
        </h2>
        <h2 className="font-bold text-sm text-gray-500 break-words">
          {jsonForm?.formSubheading}
        </h2>
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
              formRecord?.id,
            title: jsonForm?.formTitle,
          }}
          onClick={() => console.log("shared successfully!")}
        >
          <Button size="sm" variant="outline" className="flex gap-2 shrink-0">
            <Share className="h-5 w-5" />
            Share
          </Button>
        </RWebShare>

        <Link href={'/edit_form/' + formRecord?.id}>
          <Button size="sm" className="flex gap-2 shrink-0">
            <Edit className="h-5 w-5" />
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FormListItem;
