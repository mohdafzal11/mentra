# Persona Images - Quick Start Guide

This guide explains how to add profile images to personas in your Mentra application.

## Overview

The persona system now supports custom avatar images. When an image URL is provided, it will display instead of the emoji avatar. This makes personas more visually appealing and professional.

## Quick Setup

### 1. Seed the Database

First, make sure your personas are in the database:

```bash
npm run db:seed
```

Or seed just personas:

```bash
npm run db:seed:personas
```

### 2. Add Images to Personas

You have **two options**:

#### Option A: Add to Source Code (Best for new projects)

Edit `src/lib/personas.ts` and add `avatarUrl` to any persona:

```typescript
{
  name: "Raj the Romantic",
  inspirationSource: "The charm, passion, and filmy philosophy...",
  philosophyPrompt: `You are Raj the Romantic...`,
  tone: "Charming, witty, dramatic, filmy, warm-hearted",
  unlockLevel: 1,
  category: "bollywood",
  teaserLine: "Bade bade deshon mein... you know the rest 😉",
  avatarEmoji: "🎬",
  avatarUrl: "https://example.com/raj-avatar.jpg", // 👈 Add this
  depths: [...]
}
```

Then re-seed:
```bash
npm run db:seed
```

#### Option B: Bulk Update Existing Personas (Best for production)

1. Open `scripts/update-persona-images.ts`
2. Add your image URLs:

```typescript
const IMAGE_UPDATES = [
  {
    personaId: "raj-the-romantic",
    avatarUrl: "https://your-cdn.com/images/raj.jpg",
  },
  {
    personaId: "munna-bhai",
    avatarUrl: "https://your-cdn.com/images/munna.jpg",
  },
  {
    personaId: "cricket-chacha",
    avatarUrl: "https://your-cdn.com/images/cricket.jpg",
  },
];
```

3. Run the update script:
```bash
npm run db:update:images
```

This will show you all personas, their current status, and update the specified ones.

## Image Requirements

### Recommended Specifications

- **Format**: WebP (best) or JPEG/PNG
- **Dimensions**: 256x256px or 512x512px (square)
- **File Size**: < 100KB
- **Type**: Profile-style images, avatars, or illustrations
- **URL**: Must be publicly accessible HTTPS URL

### Where to Host Images

Choose one of these options:

1. **Supabase Storage** (if using Supabase)
   - Create a public bucket
   - Upload images
   - Use the public URL

2. **Cloudflare Images** / **Cloudinary**
   - Free tier available
   - Automatic optimization
   - CDN delivery

3. **AWS S3** / **Google Cloud Storage**
   - Set bucket to public
   - Use the public URL

4. **GitHub** (for testing only)
   - Upload to your repo
   - Use raw.githubusercontent.com URL

## Example Workflow

### For Development/Testing

```bash
# 1. Upload test images to any CDN or public storage
# 2. Edit scripts/update-persona-images.ts
const IMAGE_UPDATES = [
  {
    personaId: "raj-the-romantic",
    avatarUrl: "https://i.imgur.com/example.jpg",
  },
];

# 3. Run the update
npm run db:update:images

# 4. Check in browser or Prisma Studio
npm run db:studio
```

### For Production

```bash
# 1. Upload optimized images to your CDN
# 2. Update source code (src/lib/personas.ts) with avatarUrl
# 3. Deploy and run migration
npm run db:push
npm run db:seed
```

## Persona ID Reference

| Name | ID |
|------|-----|
| Raj the Romantic | `raj-the-romantic` |
| Munna Bhai | `munna-bhai` |
| Geet the Free Spirit | `geet-the-free-spirit` |
| Professor Virus | `professor-virus` |
| Rani the Queen | `rani-the-queen` |
| Don Bhai | `don-bhai` |
| Babuji | `babuji` |
| Cricket Chacha | `cricket-chacha` |
| Captain Cool | `captain-cool` |
| Hitman | `hitman` |
| King Kohli | `king-kohli` |
| Startup Sharma | `startup-sharma` |
| Reels Rani | `reels-rani` |
| Gym Bro Raju | `gym-bro-raju` |
| Desi Mom | `desi-mom` |

## Viewing Results

### In the App

Start your dev server and navigate to the persona selection:

```bash
npm run dev
```

Personas with images will show the image instead of the emoji.

### In Prisma Studio

Open Prisma Studio to see the database:

```bash
npm run db:studio
```

Navigate to the `personas` table and check the `avatarUrl` column.

## Troubleshooting

### Images Not Showing

1. **Check URL is accessible**
   - Open the URL in a browser
   - Make sure it's HTTPS

2. **Check CORS settings**
   - Your CDN must allow cross-origin requests
   - Check browser console for errors

3. **Verify database**
   ```bash
   npm run db:studio
   ```
   - Open personas table
   - Check avatarUrl is saved

4. **Clear cache**
   - Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
   - Clear Next.js cache: `rm -rf .next`

### Script Errors

**"Persona not found"**
- Double-check the persona ID
- Run `npm run db:update:images` to see all available IDs

**"Permission denied"**
- Make sure your DATABASE_URL is set in `.env`
- Check database connection

**TypeScript errors**
- Run `npm install` to ensure all dependencies are installed
- Make sure `tsx` is installed

## Advanced: Image Optimization

For better performance, optimize images before uploading:

### Using Sharp (Node.js)

```bash
npm install -g sharp-cli
sharp input.jpg -o output.webp --webp
```

### Using ImageOptim (Mac)

1. Download ImageOptim
2. Drag images to optimize
3. Upload optimized versions

### Using Online Tools

- [Squoosh.app](https://squoosh.app) - Google's image optimizer
- [TinyPNG](https://tinypng.com) - PNG/JPEG compression

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Setup database: `npm run db:push`
3. ✅ Seed personas: `npm run db:seed`
4. 📸 Upload persona images to CDN
5. 🔧 Update image URLs using script
6. 🚀 Deploy and enjoy!

## Need Help?

Check `scripts/README.md` for more detailed information about the scripts and workflows.
