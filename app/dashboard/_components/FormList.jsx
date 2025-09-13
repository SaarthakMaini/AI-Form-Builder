"use client"

import { React, useEffect, useState } from 'react';
import { JsonForms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/configs';
import FormListItem from './FormListItem';

const FormList = () => {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);

  useEffect(() => {
    user && GetFormList();
  }, [user]);

  const GetFormList = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(JsonForms.id));
    setFormList(result);
    console.log(result);
  };

  const parseJsonForm = (jsonString) => {
    try {
      return jsonString ? JSON.parse(jsonString) : null;
    } catch (error) {
      console.error('Error parsing JSON form:', error);
      console.error('Problematic JSON:', jsonString);
      return null;
    }
  };

  return (
    <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-5 items-stretch">
      {formList.map((form) => (
        <div key={form.id} className="min-w-0">
          <FormListItem
            jsonForm={parseJsonForm(form.jsonform)}
            formRecord={form}
            refreshData={GetFormList}
          />
        </div>
      ))}
    </div>
  );
};

export default FormList;
