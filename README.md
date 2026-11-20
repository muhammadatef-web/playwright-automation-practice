# Playwright TypeScript End-to-End & API Automation Framework

![Playwright Tests](../../actions/workflows/playwright.yml/badge.svg)

A scalable, parallel UI and API test automation framework built with **Playwright** and **TypeScript**, targeting [Automation Exercise](https://www.automationexercise.com). Designed around idiomatic Playwright patterns—dependency-injected fixtures, `storageState` session reuse, deterministic network interception, and automated GitHub Actions CI/CD.

---

## Tech Stack

* **Test Runner & Automation:** Playwright (`@playwright/test`) with TypeScript
* **API Layer:** Native Playwright `APIRequestContext` for fast test-data seeding and teardown
* **Reporting & Debugging:** Playwright HTML Reporter, Trace Viewer (`on-first-retry`), failure screenshots
* **CI/CD:** GitHub Actions (`ubuntu-latest`) with automated artifact archiving and manual suite dispatch

---

## Project Structure

```text
playwright-automation-practice/
├── .github/workflows/
│   └── playwright.yml          # CI pipeline (push, PR, manual smoke/regression dispatch)
├── fixtures/
│   └── baseFixtures.ts         # Custom test.extend fixtures (ad-blocking page, Page Objects, API user lifecycle)
├── pages/
│   ├── LoginPage.ts            # Authentication page object & web-first assertions
│   └── ProductsPage.ts         # Product catalog & cart page object
├── tests/
│   ├── auth.setup.ts           # Prerequisite setup project generating .auth/user.json storageState
│   ├── login.spec.ts           # @smoke hybrid API + UI authentication tests
│   ├── cart.spec.ts            # @regression authenticated cart flows using storageState
│   ├── network.spec.ts         # @regression page.route() abort, JSON mocking & 500 error simulation
│   └── interactions.spec.ts    # @regression data-driven catalog search & JS dialog handling
├── playwright.config.ts        # Environment, project dependencies, parallelism & trace settings
└── package.json                # npm scripts (test:smoke, test:regression)
```

---

## Key Architectural Highlights

* **Custom Fixtures (`test.extend`):** Replaces `BaseTest` inheritance with lazy-initialized fixtures in `fixtures/baseFixtures.ts`—injecting Page Objects (`loginPage`), overriding `page` to block flaky third-party ad networks globally, and provisioning/deleting unique API users (`testUser`) per test.
* **Instant Authentication (`storageState`):** A dedicated `setup` project (`tests/auth.setup.ts`) authenticates once and persists browser cookies and `localStorage` to `.auth/user.json`, allowing downstream regression suites (`cart.spec.ts`) to launch already logged in.
* **Network Interception (`page.route`):** Exercises frontend resilience without backend side effects by aborting heavy media requests (`route.abort`), mocking API JSON payloads (`route.fulfill`), and simulating `500 Internal Server Error` responses.
* **Tag-Based Suite Filtering:** Organizes execution scopes using `@smoke` and `@regression` tags instead of external XML suite files.

---

## Getting Started & CLI Commands

### Prerequisites
* **Node.js** 20 or higher

### Installation
```bash
npm ci
npx playwright install --with-deps chromium
```

### Running Tests
```bash
# Run smoke suite (headless)
npm run test:smoke

# Run full regression suite (setup + all specs in parallel)
npm run test:regression

# Watch execution in a visible browser window
npx playwright test --headed

# Launch interactive time-travel UI Mode
npx playwright test --ui

# Open the HTML test report
npx playwright show-report
```