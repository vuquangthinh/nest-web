import puppeteer from 'puppeteer';

const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

describe('Login', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle2' });
    await page.evaluate(() => window.localStorage.setItem('authority', 'guest'));
  });

  afterEach(() => page.close());

  it('should login with failure', async () => {
    await page.waitForSelector('#username', {
      timeout: 2000,
    });
    await page.type('#username', 'mockuser');
    await page.type('#password', 'wrong_password');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.ant-alert-error'); // should display error
  });

  it('should login successfully', async () => {
    await page.waitForSelector('#username', {
      timeout: 2000,
    });
    await page.type('#username', 'publisher');
    await page.type('#password', '123456');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.ant-layout-sider h1'); // should display error
    const text = await page.evaluate(() => document.body.innerHTML);
    expect(text).toContain('<h1>eStoryc</h1>');
  });

  afterAll(() => browser.close());
});
