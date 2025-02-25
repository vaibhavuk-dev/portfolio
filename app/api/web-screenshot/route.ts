// pages/api/screenshot.js
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: any) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { url, viewportWidth, viewportHeight, fullPage, waitStrategy, fileName } = await request.json();

    console.log("Request received:", {
      url,
      viewportWidth,
      viewportHeight,
      fullPage,
      waitStrategy,
      fileName
    });

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true, // Use new headless mode
    });

    // Create a new page
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({
      width: parseInt(viewportWidth),
      height: parseInt(viewportHeight)
    });

    // Open URL in current page
    await page.goto(url, { waitUntil: waitStrategy });

    // Capture screenshot
    const screenshotPath = path.join(uploadsDir, fileName);
    await page.screenshot({
      path: screenshotPath,
      fullPage: fullPage
    });

    // Close the browser instance
    await browser.close();
    return NextResponse.json({
      success: true,
      message: 'Screenshot captured successfully',
      path: `/uploads/${fileName}`
    }, { status: 200 });
  } catch (error: any) {
    console.error('Screenshot error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to capture screenshot',
      error: error.message
    }, { status: 500 });
  }
}