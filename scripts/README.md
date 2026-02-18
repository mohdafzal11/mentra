# Database Scripts

This folder contains utility scripts for managing the database, particularly for seeding and updating persona data.

## Available Scripts

### 1. Seed All Data (Personas + Quests)

Seeds both personas and quests into the database:

```bash
npm run db:seed
```

This runs the main seed script at `prisma/seed/seed.ts` and is automatically run when you do `npm run db:reset`.

### 2. Seed Personas with Images

Seeds only personas with enhanced logging and image support:

```bash
npm run db:seed:personas
```

This script:
- Creates or updates all personas from `src/lib/personas.ts`
- Supports avatar URLs (if provided in persona data)
- Shows detailed progress and summary
- Handles errors gracefully

### 3. Update Persona Images

Updates avatar images for existing personas without re-seeding:

```bash
npm run db:update:images
```

This script:
- Lists all personas and their current image status
- Updates avatar URLs for specified personas
- Shows before/after comparison

**To use this script:**

1. Open `scripts/update-persona-images.ts`
2. Add entries to the `IMAGE_UPDATES` array:

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
];
```

3. Run the script: `npm run db:update:images`

## Adding Images to Personas

There are two ways to add images to personas:

### Option 1: Add to Seed Data (Recommended for new personas)

Edit `src/lib/personas.ts` and add `avatarUrl` to any persona:

```typescript
{
  name: "Raj the Romantic",
  inspirationSource: "...",
  philosophyPrompt: "...",
  // ... other fields
  avatarUrl: "https://your-cdn.com/images/raj.jpg", // Add this line
  depths: [...]
}
```

Then run:
```bash
npm run db:seed
```

### Option 2: Update Existing Personas (Recommended for bulk updates)

Use the image update script for existing personas:

1. Edit `scripts/update-persona-images.ts`
2. Add your image URLs to the `IMAGE_UPDATES` array
3. Run: `npm run db:update:images`

## Persona ID Reference

Persona IDs are generated from persona names (lowercase, spaces replaced with hyphens):

| Persona Name | Persona ID |
|--------------|------------|
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

## Image Best Practices

When adding avatar images:

1. **Use a CDN**: Upload images to a CDN (Cloudflare, AWS S3, Supabase Storage, etc.)
2. **Optimize Images**: 
   - Format: WebP or JPEG
   - Size: 256x256px or 512x512px
   - File size: < 100KB
3. **Use HTTPS**: Always use secure URLs
4. **Consider Fallback**: The UI already shows emoji avatars if no image is provided

## Example Workflow

### Initial Setup
```bash
# 1. Push schema to database
npm run db:push

# 2. Seed all data
npm run db:seed
```

### Adding Images Later
```bash
# 1. Edit scripts/update-persona-images.ts
# 2. Add your image URLs
# 3. Run the update
npm run db:update:images
```

### After Changing Persona Data
```bash
# Re-seed to update all persona data
npm run db:seed
```

### Full Reset
```bash
# Nuclear option - resets DB, runs migrations, and seeds
npm run db:reset
```

## Troubleshooting

### "Persona not found" error
- Check the persona ID matches the generated format
- Run `npm run db:update:images` to see all available persona IDs

### Images not showing in UI
- Verify the URL is accessible (open it in a browser)
- Check browser console for CORS errors
- Ensure URL uses HTTPS

### Script fails to run
- Make sure you've installed dependencies: `npm install`
- Verify your DATABASE_URL is set in `.env`
- Check database connection: `npm run db:studio`
