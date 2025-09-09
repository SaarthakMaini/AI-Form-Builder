"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/configs/AiModel.mjs'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const PROMPT=`You are a form generator. Based on the given description, return a JSON object with the following structure:\n\n{ "formTitle": "string", "formSubheading": "string", "fields": [ { "name": "string", "label": "string", "placeholder": "string", "fieldType": "string", "required": true | false, "options": [ { "value": "string", "label": "string", "disabled": true | false, "selected": true | false } ], "min": number, "max": number, "step": number, "defaultValue": "string|number", "accept": "string" } ] }`;

function CreateForm() {
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);
  const {user} = useUser()
  const route = useRouter()


  const onCreateForm = async () =>{
    console.log(userInput);
    setLoading(true)
    const result = await chatSession.sendMessage("Description:" + userInput + PROMPT);
    console.log(result.response.text())
    if(result.response.text()){
        const resp = await db.insert(JsonForms).values({
            jsonform: result.response.text(),
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD/MM/yyyy')
        }).returning({id: JsonForms.id})
        console.log("New Form ID:" + resp[0].id)
        if(resp[0].id){
            route.push('/edit_form/' + resp[0].id)
        }
        setLoading(false)
    }
    setLoading(false)
  }
  return (
    <Dialog>
  <DialogTrigger asChild><Button>+ Create Form</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Form</DialogTitle>
      <DialogDescription>
        <Textarea className="my-2" placeholder="Write Description of Your Form" onChange={(event) => setUserInput(event.target.value)} />
        <div className="flex gap-2 my-3 justify-end">
            <DialogClose asChild>
                <Button variant="destructive">Cancel</Button>
            </DialogClose>
                <Button diabled={loading} onClick={onCreateForm}>{loading?<Loader2 className="animate-spin"/>:'Create'}</Button>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default CreateForm