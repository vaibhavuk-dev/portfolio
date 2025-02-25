// pages/index.js
"use client"
import { useState } from 'react';
import Head from 'next/head';
import { ArrowRight, Upload, Download, Camera, Loader2 } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [viewportHeight, setViewportHeight] = useState(1024);
  const [fullPage, setFullPage] = useState(true);
  const [waitStrategy, setWaitStrategy] = useState('networkidle0');
  const [fileName, setFileName] = useState(`screenshot_${new Date().toISOString()}.jpg`);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false); // Reset success state
    
    try {
      // Show user feedback that process has started
      console.log(`Capturing screenshot for ${url} with viewport ${viewportWidth}x${viewportHeight}`);
      
      // Prepare request data
      const requestData = {
        url,
        viewportWidth,
        viewportHeight,
        fullPage,
        waitStrategy,
        fileName,
      };

      console.log('Request data:', requestData);
      
      // Make the actual API request to our backend
      const response = await fetch('/api/web-screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      // Parse the JSON response
      const data = await response.json();
      
      // Handle successful response
      if (response.ok && data.success) {
        console.log('Screenshot captured successfully:', data);
        setSuccess(true);
        
        // Optional: If you want to offer the screenshot for download
        if (data.path) {
          // Create download link for the screenshot
          const downloadLink = document.createElement('a');
          downloadLink.href = data.path;
          downloadLink.download = fileName;
          // Trigger download programmatically (uncomment to enable auto-download)
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
        
        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        // Handle server-side errors
        console.error('Server returned an error:', data);
        alert(`Error: ${data.message || 'Failed to capture screenshot'}`);
      }
    } catch (error : any) {
      // Handle client-side errors
      console.error('Request failed:', error);
      alert(`Request failed: ${error.message || 'Unknown error occurred'}`);
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Web Scraper | Advanced Screenshot Tool</title>
        <meta name="description" content="Capture high-quality screenshots of any website" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Web Capture Pro</h1>
            <p className="text-gray-600 max-w-md">
              Generate high-quality screenshots from any website with our advanced headless browser tool
            </p>
          </div>

          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Camera className="mr-2 h-5 w-5 text-indigo-600" />
                Screenshot Configuration
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* URL Input */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com"
                  required
                />
              </div>

              {/* Viewport Settings */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Viewport Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="viewportWidth" className="block text-xs text-gray-500 mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      id="viewportWidth"
                      value={viewportWidth}
                      onChange={(e) => setViewportWidth(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      min="320"
                      max="3840"
                    />
                  </div>
                  <div>
                    <label htmlFor="viewportHeight" className="block text-xs text-gray-500 mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      id="viewportHeight"
                      value={viewportHeight}
                      onChange={(e) => setViewportHeight(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      min="240"
                      max="2160"
                    />
                  </div>
                </div>
              </div>

              {/* Screenshot Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Screenshot Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fullPage"
                      checked={fullPage}
                      onChange={(e) => setFullPage(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="fullPage" className="ml-2 block text-sm text-gray-700">
                      Capture full page (scrolling)
                    </label>
                  </div>

                  <div>
                    <label htmlFor="waitStrategy" className="block text-xs text-gray-500 mb-1">
                      Wait Strategy
                    </label>
                    <select
                      id="waitStrategy"
                      value={waitStrategy}
                      onChange={(e) => setWaitStrategy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="networkidle0">Network Idle (0 connections)</option>
                      <option value="networkidle2">Network Idle (≤ 2 connections)</option>
                      <option value="domcontentloaded">DOM Content Loaded</option>
                      <option value="load">Page Load Complete</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="fileName" className="block text-xs text-gray-500 mb-1">
                      Output Filename
                    </label>
                    <input
                      type="text"
                      id="fileName"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="screenshot.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Capture Screenshot
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              {success && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Screenshot saved as {fileName}!
                </div>
              )}
            </form>
          </div>

          {/* Additional Information */}
          <div className="mt-8 w-full max-w-3xl">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <h3 className="font-medium text-indigo-800 mb-2">Advanced Features</h3>
              <ul className="space-y-1 text-sm text-indigo-700">
                <li>• Headless Chrome automation with Puppeteer</li>
                <li>• Custom viewport dimensions</li>
                <li>• Full-page scrolling screenshots</li>
                <li>• Configurable wait strategies for page load</li>
                <li>• Custom file naming and formats</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}