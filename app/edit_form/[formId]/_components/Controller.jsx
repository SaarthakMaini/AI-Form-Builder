"use client"
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { themes } from "@/app/_data/Themes"
import { backgrounds } from "@/app/_data/Backgrounds"
import { borderStyles, borderWidths, borderColors, borderRadius } from "@/app/_data/BorderStyles"
import { Button } from "@/components/ui/button"

const Controller = ({ selectedTheme, onThemeChange, selectedBackground, onBackgroundChange, selectedStyle, onStyleChange }) => {
  const [showMoreBackgrounds, setShowMoreBackgrounds] = useState(false)
  const [showMoreStyles, setShowMoreStyles] = useState(false)
  
  const visibleBackgrounds = showMoreBackgrounds ? backgrounds : backgrounds.slice(0, 6)
  
  const handleStyleChange = (type, value) => {
    const newStyle = { ...selectedStyle, [type]: value }
    onStyleChange(newStyle)
  }
  
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold mb-2">Select Theme</h2>
        <Select value={selectedTheme} onValueChange={onThemeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No theme</SelectItem>
            {themes.filter((t) => t !== 'none').map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h2 className="font-semibold mb-2">Background</h2>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {visibleBackgrounds.map((bg) => (
            <button
              key={bg.value}
              onClick={() => onBackgroundChange(bg.value)}
              className={`p-2 rounded border text-xs text-left flex items-center gap-2 ${
                selectedBackground === bg.value ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
              }`}
            >
              <div
                className="w-4 h-4 rounded border"
                style={{ 
                  background: bg.preview.startsWith('#') ? bg.preview : bg.preview,
                  backgroundImage: bg.preview.startsWith('linear-gradient') ? bg.preview : undefined
                }}
              />
              <span className="truncate">{bg.name}</span>
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMoreBackgrounds(!showMoreBackgrounds)}
          className="w-full"
        >
          {showMoreBackgrounds ? 'Show Less' : 'Show More'}
        </Button>
      </div>
      
      <div>
        <h2 className="font-semibold mb-2">Border Style</h2>
        
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium mb-2">Style</h3>
            <Select 
              value={selectedStyle?.style || 'border-solid'} 
              onValueChange={(value) => handleStyleChange('style', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Border Style" />
              </SelectTrigger>
              <SelectContent>
                {borderStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Width</h3>
            <Select 
              value={selectedStyle?.width || 'border'} 
              onValueChange={(value) => handleStyleChange('width', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Border Width" />
              </SelectTrigger>
              <SelectContent>
                {borderWidths.map((width) => (
                  <SelectItem key={width.value} value={width.value}>
                    {width.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Color</h3>
            <div className="grid grid-cols-3 gap-2">
              {borderColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleStyleChange('color', color.value)}
                  className={`p-2 rounded border text-xs flex items-center gap-2 ${
                    selectedStyle?.color === color.value ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: color.preview }}
                  />
                  <span className="truncate">{color.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Radius</h3>
            <Select 
              value={selectedStyle?.radius || 'rounded'} 
              onValueChange={(value) => handleStyleChange('radius', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Border Radius" />
              </SelectTrigger>
              <SelectContent>
                {borderRadius.map((radius) => (
                  <SelectItem key={radius.value} value={radius.value}>
                    {radius.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Controller