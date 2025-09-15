"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/configs";
import { JsonForms, userResponses } from "@/configs/schema";
import { eq, desc } from "drizzle-orm";
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
          responseId: userResponses.id,
          jsonResponse: userResponses.jsonResponse,
          responseCreatedAt: userResponses.createdAt,
          responseCreatedBy: userResponses.createdBy,
          formId: JsonForms.id,
          formTitle: JsonForms.jsonform,
          formCreatedBy: JsonForms.createdBy,
          formCreatedAt: JsonForms.createdAt,
          theme: JsonForms.theme,
          background: JsonForms.background,
          style: JsonForms.style
        })
        .from(userResponses)
        .innerJoin(JsonForms, eq(userResponses.formRef, JsonForms.id))
        .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(userResponses.id));
      setFormList(result || []);
    } catch (err) {
      console.error("Error fetching responses:", err);
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

  const parseJsonResponse = (jsonString) => {
    try {
      return jsonString ? JSON.parse(jsonString) : null;
    } catch (err) {
      console.error("Error parsing response JSON:", err);
      return null;
    }
  };

  const handleDeleteResponse = (responseId) => {
    setFormList(prevList => prevList.filter(response => response.responseId !== responseId));
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl flex items-center justify-between">
        Responses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {formList.length > 0 ? (
          formList.map((response) => (
            <FormListItemResp
              key={response.responseId}
              responseRecord={response}
              jsonForm={parseJsonForm(response.formTitle)}
              jsonResponse={parseJsonResponse(response.jsonResponse)}
              onDelete={handleDeleteResponse}
            />
          ))
        ) : (
          <p className="text-gray-500 mt-4">No responses found.</p>
        )}
      </div>
    </div>
  );
}

export default Responses;
