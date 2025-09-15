"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/configs";
import { JsonForms, userResponses } from "@/configs/schema";
import { eq, desc, count } from "drizzle-orm";
import FormListItemResp from "./_components/FormListItemResp";

function Responses() {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      GetFormList();
    }
  }, [user]);

  const GetFormList = async () => {
    try {
      const result = await db
        .select({
          formId: JsonForms.id,
          formTitle: JsonForms.jsonform,
          formCreatedBy: JsonForms.createdBy,
          formCreatedAt: JsonForms.createdAt,
          theme: JsonForms.theme,
          background: JsonForms.background,
          style: JsonForms.style,
          responseCount: count(userResponses.id)
        })
        .from(JsonForms)
        .leftJoin(userResponses, eq(JsonForms.id, userResponses.formRef))
        .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(JsonForms.id)
        .orderBy(desc(JsonForms.id));
      setFormList(result || []);
    } catch (err) {
      console.error("Error fetching forms with response counts:", err);
      setFormList([]);
    } finally {
      setLoading(false);
    }
  };

  const parseJsonForm = (jsonString) => {
    try {
      return jsonString ? JSON.parse(jsonString) : null;
    } catch (err) {
      console.error("Error parsing JSON:", err);
      return null;
    }
  };

  const exportToCSV = async (formId, formTitle) => {
    try {
      const responses = await db
        .select({
          jsonResponse: userResponses.jsonResponse,
          createdAt: userResponses.createdAt,
          createdBy: userResponses.createdBy
        })
        .from(userResponses)
        .where(eq(userResponses.formRef, formId));

      if (responses.length === 0) {
        alert('No responses to export for this form');
        return;
      }

      const csvData = [];
      const headers = new Set();
      
      responses.forEach(response => {
        try {
          const data = JSON.parse(response.jsonResponse);
          Object.keys(data).forEach(key => headers.add(key));
        } catch (e) {
          console.error('Error parsing response:', e);
        }
      });

      headers.add('Response Date');
      headers.add('Respondent');

      csvData.push(Array.from(headers));

      responses.forEach(response => {
        try {
          const data = JSON.parse(response.jsonResponse);
          const row = Array.from(headers).map(header => {
            if (header === 'Response Date') return response.createdAt;
            if (header === 'Respondent') return response.createdBy || 'Anonymous';
            return data[header] || '';
          });
          csvData.push(row);
        } catch (e) {
          console.error('Error parsing response:', e);
        }
      });

      const csvContent = csvData.map(row => 
        row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${formTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV');
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl flex items-center justify-between">
        Responses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {formList.length > 0 ? (
          formList.map((form) => (
            <FormListItemResp
              key={form.formId}
              formRecord={form}
              jsonForm={parseJsonForm(form.formTitle)}
              responseCount={form.responseCount}
              onExportCSV={exportToCSV}
            />
          ))
        ) : (
          <p className="text-gray-500 mt-4">No forms found.</p>
        )}
      </div>
    </div>
  );
}

export default Responses;
