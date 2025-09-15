"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/configs";
import { JsonForms, userResponses } from "@/configs/schema";
import { eq, desc, count, sql, inArray } from "drizzle-orm";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar,
  Eye,
  Download,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AnalyticsChart from './_components/AnalyticsChart';
import { RWebShare } from "react-web-share";

function Analytics() {
  const { user } = useUser();
  const [analyticsData, setAnalyticsData] = useState({
    totalForms: 0,
    totalResponses: 0,
    totalViews: 0,
    responseRate: 0,
    topForms: [],
    recentResponses: [],
    responseTrends: [],
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      
      if (!userEmail) {
        setLoading(false);
        return;
      }

      const allForms = await db
        .select()
        .from(JsonForms)
        .where(eq(JsonForms.createdBy, userEmail));

      const totalForms = allForms.length;
      
      let totalResponses = 0;
      let allResponses = [];
      
      if (totalForms > 0) {
        const formIds = allForms.map(form => form.id);
        
        if (formIds.length > 0) {
          allResponses = await db
            .select()
            .from(userResponses)
            .where(inArray(userResponses.formRef, formIds));
          
          totalResponses = allResponses.length;
        }
      }

      const formResponseCounts = {};
      allResponses.forEach(response => {
        formResponseCounts[response.formRef] = (formResponseCounts[response.formRef] || 0) + 1;
      });

      const topFormsResult = allForms.map(form => ({
        formId: form.id,
        formTitle: form.jsonform,
        responseCount: formResponseCounts[form.id] || 0,
        createdAt: form.createdAt
      })).sort((a, b) => b.responseCount - a.responseCount).slice(0, 5);

      const recentResponsesResult = allResponses
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(response => {
          const form = allForms.find(f => f.id === response.formRef);
          return {
            responseId: response.id,
            jsonResponse: response.jsonResponse,
            createdAt: response.createdAt,
            formTitle: form?.jsonform || 'Unknown Form',
            formId: response.formRef
          };
        });

      const monthlyStats = {};
      allResponses.forEach(response => {
        const month = response.createdAt.substring(0, 7);
        monthlyStats[month] = (monthlyStats[month] || 0) + 1;
      });

      const monthlyStatsResult = Object.entries(monthlyStats)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6);

      const responseRate = totalForms > 0 ? (totalResponses / totalForms).toFixed(1) : 0;

      setAnalyticsData({
        totalForms,
        totalResponses,
        totalViews: totalResponses * 3,
        responseRate: parseFloat(responseRate),
        topForms: topFormsResult || [],
        recentResponses: recentResponsesResult || [],
        responseTrends: monthlyStatsResult || [],
        monthlyStats: monthlyStatsResult || []
      });

    } catch (error) {
      console.error("Error fetching analytics data:", error);
      
      setAnalyticsData({
        totalForms: 0,
        totalResponses: 0,
        totalViews: 0,
        responseRate: 0,
        topForms: [],
        recentResponses: [],
        responseTrends: [],
        monthlyStats: []
      });
    } finally {
      setLoading(false);
    }
  };

  const parseJsonForm = (jsonString) => {
    try {
      return jsonString ? JSON.parse(jsonString) : null;
    } catch (err) {
      return null;
    }
  };

  const parseJsonResponse = (jsonString) => {
    try {
      return jsonString ? JSON.parse(jsonString) : null;
    } catch (err) {
      return null;
    }
  };

  const exportAnalyticsReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      user: user?.primaryEmailAddress?.emailAddress,
      summary: {
        totalForms: analyticsData.totalForms,
        totalResponses: analyticsData.totalResponses,
        totalViews: analyticsData.totalViews,
        averageResponsesPerForm: analyticsData.responseRate
      },
      topForms: analyticsData.topForms.map(form => ({
        formId: form.formId,
        formTitle: parseJsonForm(form.formTitle)?.formTitle || 'Untitled',
        responseCount: form.responseCount,
        createdAt: form.createdAt
      })),
      monthlyTrends: analyticsData.monthlyStats,
      recentResponses: analyticsData.recentResponses.map(response => ({
        responseId: response.responseId,
        formTitle: parseJsonForm(response.formTitle)?.formTitle || 'Untitled',
        createdAt: response.createdAt,
        formId: response.formId
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (analyticsData.totalForms === 0 && analyticsData.totalResponses === 0) {
    return (
      <div className="p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your form performance and user engagement</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
          <BarChart3 className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Data Yet</h2>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Create your first form and start collecting responses to see analytics here.
          </p>
          <Button className="flex gap-2">
            <FileText className="h-4 w-4" />
            Create Your First Form
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your form performance and user engagement</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex gap-2 cursor-pointer" onClick={exportAnalyticsReport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
         
          {analyticsData.topForms.length > 0 && (
            <RWebShare
              data={{
                text:
                  (parseJsonForm(analyticsData.topForms[0].formTitle)?.formSubheading ||
                    "Build your form in seconds with AI Form Builder") ,
                url:
                  process.env.NEXT_PUBLIC_BASE_URL +
                  '/aiform/' +
                  analyticsData.topForms[0].formId,
                title: parseJsonForm(analyticsData.topForms[0].formTitle)?.formTitle || 'AI Form',
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <Button size="sm" className="flex gap-2 shrink-0 cursor-pointer">
                <Share2 className="h-4 w-4" />
                Share Dashboard
              </Button>
            </RWebShare>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalForms}</div>
            <p className="text-xs text-muted-foreground">
              Active forms in your account
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalResponses}</div>
            <p className="text-xs text-muted-foreground">
              All-time form submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Estimated form views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Responses/Form</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.responseRate}</div>
            <p className="text-xs text-muted-foreground">
              Average responses per form
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Performing Forms
            </CardTitle>
            <CardDescription>
              Your forms ranked by response count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topForms.length > 0 ? (
                analyticsData.topForms.map((form, index) => {
                  const parsedForm = parseJsonForm(form.formTitle);
                  const maxResponses = Math.max(...analyticsData.topForms.map(f => f.responseCount));
                  const percentage = maxResponses > 0 ? (form.responseCount / maxResponses) * 100 : 0;
                  
                  return (
                    <div key={form.formId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          <h3 className="font-semibold text-sm">
                            {parsedForm?.formTitle || 'Untitled Form'}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {parsedForm?.formSubheading || 'No description'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{form.responseCount} responses</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-8">No forms found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Responses
            </CardTitle>
            <CardDescription>
              Latest form submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.recentResponses.length > 0 ? (
                analyticsData.recentResponses.map((response) => {
                  const parsedForm = parseJsonForm(response.formTitle);
                  const parsedResponse = parseJsonResponse(response.jsonResponse);
                  
                  return (
                    <div key={response.responseId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {parsedForm?.formTitle || 'Untitled Form'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {response.createdAt} • Response #{response.responseId}
                        </p>
                        {parsedResponse && Object.keys(parsedResponse).length > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            {Object.keys(parsedResponse)[0]}: {String(parsedResponse[Object.keys(parsedResponse)[0]]).substring(0, 30)}...
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-8">No recent responses</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <AnalyticsChart
          title="Response Distribution"
          description="Responses across all your forms"
          data={analyticsData.topForms.length > 0 ? 
            analyticsData.topForms.map(form => {
              const parsedForm = parseJsonForm(form.formTitle);
              return {
                label: parsedForm?.formTitle?.substring(0, 15) + (parsedForm?.formTitle?.length > 15 ? '...' : '') || 'Form ' + form.formId,
                value: form.responseCount
              };
            }) : 
            [{
              label: 'No responses yet',
              value: 0
            }]
          }
          type="bar"
        />

        <AnalyticsChart
          title="Quick Stats"
          description="Key metrics overview"
          data={[
            {
              label: 'Total Forms',
              value: analyticsData.totalForms
            },
            {
              label: 'Total Responses',
              value: analyticsData.totalResponses
            },
            {
              label: 'Avg per Form',
              value: Math.round(analyticsData.responseRate * 10) / 10
            },
            {
              label: 'Est. Views',
              value: Math.round(analyticsData.totalViews / 10) * 10
            }
          ]}
          type="bar"
        />
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Insights
            </CardTitle>
            <CardDescription>
              Key metrics and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Best Performing Form</h4>
                  <p className="text-sm text-gray-700">
                    {analyticsData.topForms[0] ? 
                      parseJsonForm(analyticsData.topForms[0].formTitle)?.formTitle || 'Untitled Form' : 
                      'No forms yet'
                    }
                  </p>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {analyticsData.topForms[0]?.responseCount || 0}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Total Engagement</h4>
                  <p className="text-sm text-gray-700">All-time responses</p>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {analyticsData.totalResponses}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Average per Form</h4>
                  <p className="text-sm text-gray-700">Response rate</p>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {analyticsData.responseRate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;
