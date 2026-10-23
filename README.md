# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

For local enquiry submissions, create a `.env` file with the Supabase browser and server settings plus a Resend API key. Keep the service-role and Resend keys server-side; do not prefix them with `VITE_`.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RESEND_API_KEY=re_your-resend-api-key
ENQUIRY_NOTIFY_EMAIL=you@example.com
# Optional: use a sender address on a domain verified in Resend.
RESEND_FROM_EMAIL="ZEXOVA DIGITAL <website@your-verified-domain.com>"
```

Set `ENQUIRY_NOTIFY_EMAIL` to the inbox that should receive enquiries. The sender defaults to Resend's `onboarding@resend.dev` test sender. Resend restricts that sender to verified recipients; configure `RESEND_FROM_EMAIL` with an address from a domain verified in Resend for general delivery. Restart `npm run dev` after changing `.env`.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
