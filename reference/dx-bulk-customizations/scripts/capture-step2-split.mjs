import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/rationale')
mkdirSync(OUT_DIR, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

await page.goto('http://localhost:5199/v2')
await page.waitForLoadState('networkidle')

// Go to Customizations tab
await page.locator('[role="tab"]').nth(2).click()
await page.waitForTimeout(300)
await page.getByRole('button', { name: 'New customization' }).click()
await page.waitForTimeout(400)

// Select a base image to enable Next
const searchInput = page.getByPlaceholder('Search for a base image or chart…')
await searchInput.click()
await searchInput.fill('dhi-node')
await page.waitForTimeout(500)
await page.waitForSelector('[role="listbox"]')
await page.locator('[role="option"]').first().click()
await page.waitForTimeout(400)

// Check one version
const versionCheckbox = page.locator('input[type="checkbox"]').first()
const box = await versionCheckbox.boundingBox()
if (box) await page.mouse.click(box.x + 80, box.y + box.height / 2)
await page.waitForTimeout(200)

// Go to Step 2
await page.getByRole('button', { name: /next/i }).click()
await page.waitForTimeout(400)

// Packages section is open by default — select a couple of packages
const packageRows = page.locator('input[type="checkbox"]')
const pkgBox1 = await packageRows.nth(0).boundingBox()
if (pkgBox1) await page.mouse.click(pkgBox1.x + 80, pkgBox1.y + pkgBox1.height / 2)
await page.waitForTimeout(150)
const pkgBox2 = await packageRows.nth(2).boundingBox()
if (pkgBox2) await page.mouse.click(pkgBox2.x + 80, pkgBox2.y + pkgBox2.height / 2)
await page.waitForTimeout(200)

// Screenshot the packages split layout
const pkgSection = page.locator('text=Packages').first()
const pkgBox = await pkgSection.boundingBox()
await page.screenshot({
  path: join(OUT_DIR, 'step2-split-packages.png'),
  clip: { x: 0, y: (pkgBox?.y ?? 200) - 32, width: 1440, height: 500 },
  animations: 'disabled',
})
console.log('saved step2-split-packages.png')

await browser.close()
