# PosterAI

A full-stack AI poster generator built with Next.js 14, Tailwind CSS, Google Gemini, and html2canvas.

## Local setup

Create `.env.local` (this file is intentionally gitignored so your Gemini API key is not committed):

```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
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
4. Add Environment Variables for `GEMINI_API_KEY`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` for Production, Preview, and Development.
5. Click **Deploy**. After the build finishes, Vercel will provide a free `*.vercel.app` URL.

You can also deploy with the Vercel CLI after logging in:

```bash
npm i -g vercel
vercel env add GEMINI_API_KEY
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel --prod
```
