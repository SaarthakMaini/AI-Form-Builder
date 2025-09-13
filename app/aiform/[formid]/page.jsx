"use client"
import { JsonForms } from '@/configs/schema'
import React, {useEffect, useState} from 'react'
import {eq} from 'drizzle-orm'
import {db} from '@/configs'
import FormUi from '@/app/edit_form/[formId]/_components/FormUi'

function LiveAiForm({params}){
    const [record, setRecord] = useState();
    const [jsonForm, setJsonForm] = useState()
    useEffect(() => {
        console.log(params)
        params && GetFormData()
    }, [params])

    const GetFormData = async () =>{
        const result = await db.select().from(JsonForms).where(eq(JsonForms.id, Number(params?.formid)))
        setRecord(result[0])
        setJsonForm(JSON.parse(result[0].jsonform))
        console.log(result)
    }

    const defaultStyle = { style: 'border-solid', width: 'border', color: 'border-gray-300', radius: 'rounded' }
    let parsedStyle = defaultStyle
    try {
        parsedStyle = record?.style ? JSON.parse(record.style) : defaultStyle
    } catch (e) {
        parsedStyle = defaultStyle
    }

    if (!record || !jsonForm) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>Loading form...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen w-full flex items-center justify-center px-4 sm:px-8 py-10 ${record?.background || 'bg-white'}`}>
      <div className="flex justify-center w-full">
        <div className="w-full max-w-3xl">
          <FormUi
            jsonForm={jsonForm}
            onFieldUpdate={() => {}}
            deleteField={() => {}}
            selectedStyle={parsedStyle}
            selectedTheme={record?.theme || 'light'}
            editable={false}
            showSubmit={true}
            formId={record.id}
          />
        </div>
      </div>
    </div>
    )
}

export default LiveAiForm