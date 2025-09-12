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
    // Safe defaults
    const defaultStyle = { style: 'border-solid', width: 'border', color: 'border-gray-300', radius: 'rounded' }
    let parsedStyle = defaultStyle
    try {
        parsedStyle = record?.style ? JSON.parse(record.style) : defaultStyle
    } catch (e) {
        parsedStyle = defaultStyle
    }

    return (
        <div className={`min-h-screen w-full flex items-center justify-center px-4 sm:px-8 py-10 ${record?.background || 'bg-white'}`}>
            <FormUi 
                jsonForm={jsonForm}
                onFieldUpdate={()=>{}}
                deleteField={()=>{}}
                selectedStyle={parsedStyle}
                selectedTheme={record?.theme || 'light'}
                editable={false}
            />
        </div>
    )
}

export default LiveAiForm