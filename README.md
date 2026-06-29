# PosterAI

A full-stack AI poster generator built with Next.js 14, Tailwind CSS, Google Gemini, and html2canvas.

## Local setup

Create `.env.local` (this file is intentionally gitignored so your Gemini API key is not committed):

```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
```

A `.env.example` file is included as a safe template; copy it to `.env.local` and replace the placeholder with your real key. Keep real API keys in `.env.local` only.

Install and run:

```bash
npm install
npm run dev
```

## Deploy to Vercel for free

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New → Project** and import this repository.
3. Keep the detected framework as **Next.js**. Vercel will use `npm run build` automatically.
4. Add an Environment Variable named `GEMINI_API_KEY` with your Gemini API key for Production, Preview, and Development.
5. Click **Deploy**. After the build finishes, Vercel will provide a free `*.vercel.app` URL.

You can also deploy with the Vercel CLI after logging in:

```bash
npm i -g vercel
vercel env add GEMINI_API_KEY
vercel --prod
```
