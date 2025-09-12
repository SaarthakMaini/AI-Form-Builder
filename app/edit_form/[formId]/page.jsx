"use client"

import { JsonForms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { eq,and } from 'drizzle-orm'
import React, {useEffect, useState} from 'react'
import { db } from '@/configs'
import { ArrowLeft, Share, SquareArrowOutUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FormUi from './_components/FormUi'
import { toast } from 'sonner'
import Controller from './_components/Controller'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


function EditForm({params}) {
  const {user} = useUser()
  const [jsonForm, setJsonForm] = useState([]);
  const router = useRouter()
  const [updateTrigger, setUpdatetrigger] = useState()
  const [record, setRecord] = useState([])
  const [selectedTheme, setSelectedTheme] = useState('light')
  const [selectedBackground, setSelectedBackground] = useState('bg-white')
  const [selectedStyle, setSelectedStyle] = useState({
    style: 'border-solid',
    width: 'border',
    color: 'border-gray-300',
    radius: 'rounded'
  })

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
    
    if (result[0].theme) {
      setSelectedTheme(result[0].theme)
    }
    if (result[0].background) {
      setSelectedBackground(result[0].background)
    }
    if (result[0].style) {
      try {
        setSelectedStyle(JSON.parse(result[0].style))
      } catch (error) {
        console.error('Error parsing style:', error)
        
        setSelectedStyle({
          style: 'border-solid',
          width: 'border',
          color: 'border-gray-300',
          radius: 'rounded'
        })
      }
    }
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

  const updateControllerFields = async (value, columnName) => {
    try {
      const result = await db.update(JsonForms).set({
        [columnName]: value
      }).where(and(eq(JsonForms.id, record.id),eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))
      toast('Updated')
    } catch (error) {
      console.error('Error updating controller fields:', error)
      toast('Error updating')
    }
  }
  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
      <h2
        className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold"
        onClick={() => router.back()}
      >
        <ArrowLeft /> Back
      </h2>
      <div className="flex gap-2">
      <Link href={`/aiform/${record.id}`} target="_blank">
      <Button className="flex gap-2"><SquareArrowOutUpRight className="h-5 w-5"/>Live Preview</Button>
      </Link>
      <Button><Share className="flex gap-2"/>Share</Button>
      </div>
      </div>
  

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    <div className="p-5 border rounded-lg shadow-md">
      <Controller 
        selectedTheme={selectedTheme} 
        onThemeChange={(value) => {
          setSelectedTheme(value)
          updateControllerFields(value, 'theme')
        }} 
        selectedBackground={selectedBackground} 
        onBackgroundChange={(value) => {
          setSelectedBackground(value)
          updateControllerFields(value, 'background')
        }}
        selectedStyle={selectedStyle}
        onStyleChange={(value) => {
          setSelectedStyle(value)
          updateControllerFields(JSON.stringify(value), 'style')
        }}
      />
    </div>
    <div className={`md:col-span-2 border rounded-lg p-5 flex justify-center ${selectedBackground || 'bg-white'}`}>
      <div className="w-full max-w-[600px] max-h-[80vh] overflow-y-auto rounded-lg">
        { record && <FormUi jsonForm={jsonForm} onFieldUpdate={onFieldUpdate} deleteField={(index) => deleteField(index)} selectedTheme={selectedTheme} selectedBackground={selectedBackground} selectedStyle={selectedStyle}/>}
      </div>
    </div>
  </div>
</div>
  )
}

export default EditForm