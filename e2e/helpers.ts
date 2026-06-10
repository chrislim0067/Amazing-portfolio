import type { Page } from '@playwright/test';

export async function waitForExperienceReady(page: Page): Promise<void> {
  await page.waitForSelector('#webgl', { state: 'attached', timeout: 90_000 });

  await page.waitForFunction(
    () => {
      const loader = document.querySelector('#loader');
      if (loader) {
        const style = getComputedStyle(loader);
        if (style.opacity !== '0' && style.display !== 'none') {
          return false;
        }
      }
      return !!document.querySelector('#webgl');
    },
    undefined,
    { timeout: 90_000 },
  );

  // Allow scene shaders and textures to settle.
  await page.waitForTimeout(2500);
}
