"use client"

import { JsonForms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { eq,and } from 'drizzle-orm'
import React, {useEffect, useState} from 'react'
import { db } from '@/configs'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FormUi from './_components/FormUi'
import { toast } from 'sonner'


function EditForm({params}) {
  const {user} = useUser()
  const [jsonForm, setJsonForm] = useState([]);
  const router = useRouter()
  const [updateTrigger, setUpdatetrigger] = useState()
  const [record, setRecord] = useState([])

  useEffect(() =>{
    user && getFormData()
  }, [user])
  const getFormData = async () =>{
    console.log("Email Address of User: ",user?.primaryEmailAddress?.emailAddress)
    console.log(JsonForms.createdBy)
    const result = await db.select().from(JsonForms).
    where(and(eq(JsonForms.id, params?.formId),eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))
    setRecord(result[0])
    setJsonForm(JSON.parse(result[0].jsonform))
  }
  useEffect(()=>{
    if(updateTrigger ){
        setJsonForm(jsonForm);
        updateJsonFormInDb()
    }
  }, [updateTrigger])

  const onFieldUpdate = (value, index) => {
    jsonForm.fields[index].label = value.label
    jsonForm.fields[index].placeholder = value.placeholder
    setUpdatetrigger(Date.now())
  }

  const updateJsonFormInDb = async () => {
    const result = await db.update(JsonForms).set({
        jsonform : jsonForm
    }).where(and(eq(JsonForms.id, record.id),eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))
    toast('Updated')
    console.log(result)
  }

  const deleteField = (indexToRemove) =>{
    const result = jsonForm.fields.filter((item, index) => index != indexToRemove)
    jsonForm.fields = result
    setUpdatetrigger(Date.now())
  }

  return (
    <div className="p-10">
  <h2
    className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold"
    onClick={() => router.back()}
  >
    <ArrowLeft /> Back
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    <div className="p-5 border rounded-lg shadow-md">Controller</div>
    <div className="md:col-span-2 border rounded-lg p-5 flex justify-center">
      <div className="w-full max-w-[600px] max-h-[80vh] overflow-y-auto">
        <FormUi jsonForm={jsonForm} onFieldUpdate={onFieldUpdate} deleteField={(index) => deleteField(index)} />
      </div>
    </div>
  </div>
</div>
  )
}

export default EditForm