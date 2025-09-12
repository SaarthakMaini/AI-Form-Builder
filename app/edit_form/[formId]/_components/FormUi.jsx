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
import FormIframe from "./FormIframe"
import { Button } from "@/components/ui/button"

function FormUi({ jsonForm , onFieldUpdate, deleteField, selectedTheme, selectedBackground, selectedStyle, editable=true}) {
  
  const getBorderClasses = () => {
    if (!selectedStyle) return 'border rounded'
    const { style, width, color, radius } = selectedStyle
    return `${style || 'border-solid'} ${width || 'border'} ${color || 'border-gray-300'} ${radius || 'rounded'}`
  }

  return (
    <div>
      {selectedTheme === 'none' ? (
        <div className={`${getBorderClasses()} p-5 space-y-6 w-full max-w-[600px]`}>
          <h2 className="font-bold text-center text-2xl">{jsonForm?.formTitle}</h2>
          <h2 className="text-sm text-gray-400 text-center">
            {jsonForm?.formSubheading}
          </h2>
          <div className="space-y-6">
            {jsonForm?.fields?.map((field, index) => (
              <div key={index} className={`space-y-2 ${getBorderClasses()} p-3 relative`}>
                <div className="flex justify-between items-center">
                  {field.fieldType !== "checkbox" && (
                    <Label htmlFor={field.name} className="font-medium">
                      {field.label}{" "}
                      {field.required && <span className="text-red-500">*</span>}
                    </Label>
                  )}
                  {editable && (
                    <FieldEdit defaultValue={field} onUpdate={(value) => onFieldUpdate(value, index)} deleteField={() => deleteField(index)}/>
                  )}
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
                        <RadioGroupItem value={opt.value} id={`${field.name}-${idx}`} />
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
          {editable && (<Button className="mb-7">Submit</Button>)}
        </div>
      ) : (
        <FormIframe theme={selectedTheme || 'light'} className="h-full w-full">
          <div className={`${getBorderClasses()} p-5 space-y-6 w-full max-w-[600px] h-full min-h-screen`}>
            <h2 className="font-bold text-center text-2xl">{jsonForm?.formTitle}</h2>
            <h2 className="text-sm text-gray-400 text-center">
              {jsonForm?.formSubheading}
            </h2>
            <div className="space-y-6">
              {jsonForm?.fields?.map((field, index) => (
                <div
                  key={index}
                  className={`space-y-2 ${getBorderClasses()} p-3 relative bg-base-200`}
                >
                  <div className="flex justify-between items-center">
                    {field.fieldType !== "checkbox" && (
                      <label htmlFor={field.name} className="label p-0">
                        <span className="label-text font-medium">
                          {field.label}{" "}
                          {field.required && <span className="text-red-500">*</span>}
                        </span>
                      </label>
                    )}
                    {editable && <FieldEdit defaultValue={field} onUpdate={(value) => onFieldUpdate(value, index)} deleteField={() => deleteField(index)}/>}
                  </div>

                  {field.fieldType === "select" && (
                    <select
                      id={field.name}
                      name={field.name}
                      className="select select-bordered w-full"
                      required={field.required}
                      defaultValue={field.options?.find((opt) => opt.selected)?.value || ""}
                    >
                      <option value="" disabled>
                        {field.placeholder || "Select an option"}
                      </option>
                      {field.options?.map((opt, idx) => {
                        const optionValue =
                          opt.value && opt.value.trim() !== "" ? opt.value : `__placeholder_${idx}`
                        return (
                          <option key={idx} value={optionValue} disabled={opt.disabled}>
                            {opt.label}
                          </option>
                        )
                      })}
                    </select>
                  )}

                  {field.fieldType === "radio" && (
                    <div className="space-y-2">
                      {field.options?.map((opt, idx) => (
                        <label key={idx} className="label cursor-pointer justify-start gap-2 p-0">
                          <input
                            type="radio"
                            name={field.name}
                            value={opt.value}
                            defaultChecked={opt.selected}
                            required={field.required}
                            className="radio radio-primary"
                          />
                          <span className="label-text">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.fieldType === "checkbox" && (
                    <label className="label cursor-pointer justify-start gap-2 p-0">
                      <input
                        type="checkbox"
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        defaultChecked={field.defaultValue || false}
                        className="checkbox checkbox-primary"
                      />
                      <span className="label-text">
                        {field.label}{" "}
                        {field.required && <span className="text-red-500">*</span>}
                      </span>
                    </label>
                  )}

                  {field.fieldType === "textarea" && (
                    <textarea
                      id={field.name}
                      name={field.name}
                      className="textarea textarea-bordered w-full"
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
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.fieldType}
                      className="input input-bordered w-full"
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
            {editable && (<button type="button" className="btn btn-primary mb-7">Submit</button>)}
          </div>
        </FormIframe>
      )}
    </div>
  )
}

export default FormUi
