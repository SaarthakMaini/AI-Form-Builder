"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function AnalyticsChart({ title, description, data, type = 'bar' }) {
  const maxValue = Math.max(...data.map(item => item.value));
  
  const renderBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="text-gray-500">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderLineChart = () => (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-32">
        {data.map((item, index) => {
          const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="bg-gray-700 w-8 rounded-t transition-all duration-300 hover:bg-gray-800"
                style={{ height: `${height}%` }}
                title={`${item.label}: ${item.value}`}
              />
              <span className="text-xs text-gray-500 mt-2">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {type === 'bar' ? renderBarChart() : renderLineChart()}
      </CardContent>
    </Card>
  );
}

export default AnalyticsChart;
