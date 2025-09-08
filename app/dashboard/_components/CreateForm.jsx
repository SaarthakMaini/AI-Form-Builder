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

const PROMPT=", On the basis of description please give form in json format with form title, form subheading with form having Form field, form name, placeholder name, and form label, fieldType, field required in Json format"

function CreateForm() {
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState();
  const {user} = useUser()
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
        console.log("New Form ID:" + resp)
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
            <DialogClose asChild>
                <Button diabled={loading} onClick={onCreateForm}>Create</Button>
            </DialogClose>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default CreateForm