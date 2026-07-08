/**
 * Playwright screenshot capture for rationale drawer.
 * Run: node scripts/capture-rationale-screenshots.mjs
 * Requires dev server running on :5199
 */

import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/rationale')
const BASE = 'http://localhost:5199'

mkdirSync(OUT_DIR, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

async function shot(name, clip) {
  const path = join(OUT_DIR, `${name}.png`)
  await page.screenshot({ path, clip, animations: 'disabled' })
  console.log(`  saved ${name}.png`)
}

async function goToWizard() {
  await page.goto(`${BASE}/v2`)
  await page.waitForLoadState('networkidle')
  // Navigate to Customizations tab (tab index 2)
  await page.locator('[role="tab"]').nth(2).click()
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: 'New customization' }).click()
  await page.waitForTimeout(500)
}

async function selectFromAutocomplete(searchText) {
  const input = page.getByPlaceholder('Search for a base image or chart…')
  await input.click()
  await input.fill(searchText)
  await page.waitForTimeout(600)
  // Wait for listbox to appear
  await page.waitForSelector('[role="listbox"]', { timeout: 5000 })
  const option = page.locator('[role="option"]').first()
  await option.click()
  await page.waitForTimeout(500)
}

// ─── 1. stepper — full wizard header + 4 step labels ─────────────────────────

console.log('1/5 stepper')
await goToWizard()

// The wizard title + stepper bar — capture from top-of-page to just past stepper
await page.waitForSelector('.MuiStepper-root', { timeout: 5000 })
const stepperEl = page.locator('.MuiStepper-root').first()
const stepperBox = await stepperEl.boundingBox()
await shot('stepper', {
  x: 0,
  y: 0,
  width: 1440,
  height: (stepperBox?.y ?? 0) + (stepperBox?.height ?? 80) + 60,
})

// ─── 2. autocomplete — search field with dropdown showing results ─────────────

console.log('2/5 autocomplete')
const searchInput = page.getByPlaceholder('Search for a base image or chart…')
await searchInput.click()
await searchInput.fill('dhi-n')
await page.waitForTimeout(600)
await page.waitForSelector('[role="listbox"]', { timeout: 5000 })

// Capture the input field + its dropdown
const inputBox = await searchInput.boundingBox()
const listbox = page.locator('[role="listbox"]')
const listboxBox = await listbox.boundingBox()

const acX = Math.max(0, (inputBox?.x ?? 0) - 24)
const acY = Math.max(0, (inputBox?.y ?? 0) - 72)
const acW = Math.min(860, 1440 - acX)
const acH = (listboxBox?.y ?? 0) + (listboxBox?.height ?? 200) + 24 - acY

await shot('autocomplete', { x: acX, y: acY, width: acW, height: acH })

// ─── 3. version-checklist — select dhi-node, show version list with compliance ─

console.log('3/5 version-checklist')
const firstOption = page.locator('[role="option"]').first()
await firstOption.click()
await page.waitForTimeout(500)

// Wait for version rows to appear (they contain compliance chip text)
await page.waitForSelector('text=Select base image or chart', { timeout: 5000 })

// The left panel contains the version checklist
// Find the dashed-border container on the left
const leftPanel = page.locator('[class*="MuiBox"]').filter({ hasText: /latest|debian|alpine/ }).first()
const leftPanelBox = await leftPanel.boundingBox().catch(() => null)

// Capture just the left 60% of the step content showing the checklist
const acInputBox = await searchInput.boundingBox()
const snapTop = (acInputBox?.y ?? 180) - 80
await shot('version-checklist', {
  x: 0,
  y: snapTop,
  width: Math.round(1440 * 0.6),
  height: 460,
})

// ─── 4. split-layout — check some versions + add a second image ───────────────

console.log('4/5 split-layout')

// Click version rows directly (the outer Box is the clickable target)
// Version rows contain a checkbox input — click via the input
const versionInputs = page.locator('input[type="checkbox"]')
const vCount = await versionInputs.count()
for (let i = 0; i < Math.min(3, vCount); i++) {
  // Click the parent row Box, not the input itself (input has stopPropagation)
  // Force-click the label/row area next to the checkbox
  const inputBox2 = await versionInputs.nth(i).boundingBox()
  if (inputBox2) {
    // Click to the right of the checkbox (on the version text)
    await page.mouse.click(inputBox2.x + 80, inputBox2.y + inputBox2.height / 2)
    await page.waitForTimeout(200)
  }
}

// Now add a second image
await searchInput.clear()
await selectFromAutocomplete('dhi-vault')

// Check one version of vault
const vaultInputs = page.locator('input[type="checkbox"]')
const vaultInputBox = await vaultInputs.first().boundingBox()
if (vaultInputBox) {
  await page.mouse.click(vaultInputBox.x + 80, vaultInputBox.y + vaultInputBox.height / 2)
  await page.waitForTimeout(300)
}

// Screenshot the full 60/40 split layout
const stepHeading = page.locator('text=Select base image or chart').first()
const stepHeadingBox = await stepHeading.boundingBox().catch(() => null)
const splitTop = (stepHeadingBox?.y ?? 200) - 24
await shot('split-layout', {
  x: 0,
  y: splitTop,
  width: 1440,
  height: 560,
})

// ─── 5. step2-section-cards — advance to Step 2, capture section cards ─────────

console.log('5/5 step2-section-cards')
await page.getByRole('button', { name: /next/i }).click()
await page.waitForTimeout(500)

// Wait for Step 2 to render
await page.waitForSelector('text=Add packages', { timeout: 5000 })

const step2Heading = page.locator('text=Add packages').first()
const step2Box = await step2Heading.boundingBox()
await shot('step2-section-cards', {
  x: 0,
  y: (step2Box?.y ?? 200) - 24,
  width: 800,
  height: 480,
})

// ─── Done ─────────────────────────────────────────────────────────────────────

await browser.close()
console.log('\nAll screenshots saved to public/rationale/')
