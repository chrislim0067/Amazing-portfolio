import { test, expect } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { waitForExperienceReady } from './helpers';

const REFERENCE_URL = 'http://127.0.0.1:34568';
const REBUILT_URL = 'http://127.0.0.1:34567';

function decodePng(buffer: Buffer): PNG {
  return PNG.sync.read(buffer);
}

test.describe('Igloo experience parity', () => {
  test('reference build loads without failed asset requests', async ({ page }) => {
    const failed: string[] = [];
    page.on('requestfailed', (request) => {
      failed.push(request.url());
    });

    await page.goto(REFERENCE_URL);
    await waitForExperienceReady(page);

    expect(failed, `Failed requests: ${failed.join('\n')}`).toEqual([]);
    await expect(page.locator('#webgl')).toBeVisible();
  });

  test('rebuilt app loads without failed asset requests', async ({ page }) => {
    const failed: string[] = [];
    page.on('requestfailed', (request) => {
      failed.push(request.url());
    });

    await page.goto(REBUILT_URL);
    await waitForExperienceReady(page);

    expect(failed, `Failed requests: ${failed.join('\n')}`).toEqual([]);
    await expect(page.locator('#webgl')).toBeVisible();
  });

  test('rebuilt app visually matches reference build', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });

    const referencePage = await context.newPage();
    await referencePage.goto(REFERENCE_URL);
    await waitForExperienceReady(referencePage);
    const referenceShot = await referencePage.screenshot({ fullPage: false });

    const rebuiltPage = await context.newPage();
    await rebuiltPage.goto(REBUILT_URL);
    await waitForExperienceReady(rebuiltPage);
    const rebuiltShot = await rebuiltPage.screenshot({ fullPage: false });

    await context.close();

    const referencePng = decodePng(referenceShot);
    const rebuiltPng = decodePng(rebuiltShot);

    expect(referencePng.width).toBe(rebuiltPng.width);
    expect(referencePng.height).toBe(rebuiltPng.height);

    const diff = new PNG({ width: referencePng.width, height: referencePng.height });
    const diffPixels = pixelmatch(
      referencePng.data,
      rebuiltPng.data,
      diff.data,
      referencePng.width,
      referencePng.height,
      { threshold: 0.15 },
    );

    const totalPixels = referencePng.width * referencePng.height;
    const diffRatio = diffPixels / totalPixels;

    expect(diffRatio).toBeLessThan(0.02);
  });
});
