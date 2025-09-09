import React from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import FieldEdit from "./FieldEdit"

function FormUi({ jsonForm , onFieldUpdate, deleteField}) {
  return (
    <div className="border p-5 space-y-6 md:w-[600px]">
      <h2 className="font-bold text-center text-2xl">{jsonForm?.formTitle}</h2>
      <h2 className="text-sm text-gray-400 text-center">
        {jsonForm?.formSubheading}
      </h2>

      {jsonForm?.fields?.map((field, index) => (
        <div
          key={index}
          className="space-y-2 border rounded-lg p-3 relative bg-gray-50"
        >
          <div className="flex justify-between items-center">
            {field.fieldType !== "checkbox" && (
              <Label htmlFor={field.name} className="font-medium">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
            )}
            <FieldEdit defaultValue={field} onUpdate={(value) => onFieldUpdate(value, index)} deleteField={() => deleteField(index)}/>
          </div>

          {field.fieldType === "select" && (
            <Select
              required={field.required}
              defaultValue={
                field.options?.find((opt) => opt.selected)?.value || undefined
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt, idx) => {
                  const optionValue =
                    opt.value && opt.value.trim() !== ""
                      ? opt.value
                      : `__placeholder_${idx}`
                  return (
                    <SelectItem
                      key={idx}
                      value={optionValue}
                      disabled={opt.disabled}
                    >
                      {opt.label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )}

          {field.fieldType === "radio" && (
            <RadioGroup
              required={field.required}
              defaultValue={
                field.options?.find((opt) => opt.selected)?.value || undefined
              }
            >
              {field.options?.map((opt, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={opt.value}
                    id={`${field.name}-${idx}`}
                  />
                  <Label htmlFor={`${field.name}-${idx}`}>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {field.fieldType === "checkbox" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                required={field.required}
                defaultChecked={field.defaultValue || false}
              />
              <Label htmlFor={field.name}>
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
            </div>
          )}

          {field.fieldType === "textarea" && (
            <Textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              defaultValue={field.defaultValue}
            />
          )}

          {[
            "text",
            "email",
            "password",
            "number",
            "url",
            "tel",
            "search",
            "date",
            "time",
            "datetime-local",
            "month",
            "week",
            "color",
            "file",
            "range",
          ].includes(field.fieldType) && (
            <Input
              id={field.name}
              name={field.name}
              type={field.fieldType}
              placeholder={field.placeholder}
              required={field.required}
              min={field.min}
              max={field.max}
              step={field.step}
              defaultValue={field.defaultValue}
              accept={field.accept}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default FormUi
