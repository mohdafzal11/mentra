# Persona Database & Image Setup - Complete! ✅

## What Was Done

I've created a complete system for seeding personas into your database with full image support for Mentra. Here's everything that was set up:

### 1. ✅ Updated Type Definitions

**File**: `src/lib/personas.ts`
- Added `avatarUrl?: string` field to `PersonaSeed` interface
- Now supports optional image URLs for each persona

### 2. ✅ Enhanced Seed Script

**File**: `prisma/seed/seed.ts`
- Updated to use `avatarUrl` from persona data
- Automatically syncs images when seeding

### 3. ✅ Created Standalone Scripts

#### a) Persona Seeding Script
**File**: `scripts/seed-personas-with-images.ts`
- Seeds all personas with enhanced logging
- Shows image status during seeding
- Handles errors gracefully
- **Run with**: `npm run db:seed:personas`

#### b) Image Update Script
**File**: `scripts/update-persona-images.ts`
- Updates images for existing personas without re-seeding
- Lists all personas before updating
- Shows before/after comparison
- **Run with**: `npm run db:update:images`

### 4. ✅ Updated UI Component

**File**: `src/components/persona/PersonaCard.tsx`
- Now displays avatar image when available
- Falls back to emoji if no image provided
- Responsive design (12x12 rounded image)
- Maintains all existing functionality

### 5. ✅ Added NPM Scripts

**File**: `package.json`
- `npm run db:seed:personas` - Seed personas with image support
- `npm run db:update:images` - Update persona images

### 6. ✅ Created Documentation

- **`scripts/README.md`** - Detailed script usage guide
- **`PERSONA_IMAGES_GUIDE.md`** - Quick start guide for adding images

## How to Use

### Quick Start (3 Steps)

1. **Seed the database**
   ```bash
   npm run db:seed
   ```

2. **Add image URLs** (edit `scripts/update-persona-images.ts`)
   ```typescript
   const IMAGE_UPDATES = [
     {
       personaId: "raj-the-romantic",
       avatarUrl: "https://your-cdn.com/raj.jpg",
     },
   ];
   ```

3. **Update images**
   ```bash
   npm run db:update:images
   ```

### Alternative: Add to Source Code

Edit `src/lib/personas.ts`:
```typescript
{
  name: "Raj the Romantic",
  // ... other fields
  avatarUrl: "https://your-cdn.com/raj.jpg", // Add this
  depths: [...]
}
```

Then run:
```bash
npm run db:seed
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:seed` | Seed all data (personas + quests) |
| `npm run db:seed:personas` | Seed only personas with images |
| `npm run db:update:images` | Update persona images |
| `npm run db:studio` | Open Prisma Studio (view DB) |
| `npm run db:reset` | Reset DB and re-seed |

## Persona IDs (for image updates)

```
raj-the-romantic
munna-bhai
geet-the-free-spirit
professor-virus
rani-the-queen
don-bhai
babuji
cricket-chacha
captain-cool
hitman
king-kohli
startup-sharma
reels-rani
gym-bro-raju
desi-mom
```

## Image Requirements

- **Format**: WebP, JPEG, or PNG
- **Size**: 256x256px or 512x512px (square)
- **File Size**: < 100KB recommended
- **URL**: HTTPS, publicly accessible

## Testing

1. **Run the persona seed**:
   ```bash
   npm run db:seed:personas
   ```

2. **Check in Prisma Studio**:
   ```bash
   npm run db:studio
   ```
   - Navigate to `personas` table
   - Verify `avatarUrl` column

3. **View in app**:
   ```bash
   npm run dev
   ```
   - Go to persona selection
   - Personas with images will show the image instead of emoji

## File Structure

```
mentra/
├── src/
│   ├── lib/
│   │   └── personas.ts              (✅ Updated: avatarUrl support)
│   └── components/
│       └── persona/
│           └── PersonaCard.tsx       (✅ Updated: displays images)
├── prisma/
│   ├── schema.prisma                 (✅ Already had avatarUrl field)
│   └── seed/
│       └── seed.ts                   (✅ Updated: uses avatarUrl)
├── scripts/
│   ├── seed-personas-with-images.ts  (✅ New: standalone seeding)
│   ├── update-persona-images.ts      (✅ New: bulk image updates)
│   └── README.md                     (✅ New: script documentation)
├── PERSONA_IMAGES_GUIDE.md           (✅ New: quick start guide)
└── package.json                      (✅ Updated: new scripts)
```

## Next Steps

1. ✅ **Database setup** (if not done):
   ```bash
   npm run db:push
   npm run db:seed
   ```

2. 📸 **Upload images** to your CDN
   - Supabase Storage (recommended if using Supabase)
   - Cloudflare Images
   - AWS S3
   - Any public CDN

3. 🔧 **Add image URLs**:
   - Edit `scripts/update-persona-images.ts`
   - Or edit `src/lib/personas.ts`

4. 🚀 **Update database**:
   ```bash
   npm run db:update:images
   ```

5. ✅ **Verify**:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Images not showing?
- Check URL is accessible (open in browser)
- Verify HTTPS protocol
- Check browser console for CORS errors
- Clear cache: `rm -rf .next && npm run dev`

### Script errors?
- Ensure `.env` has correct `DATABASE_URL`
- Run `npm install` to install dependencies
- Check database connection: `npm run db:studio`

### Need help?
- Read `scripts/README.md` for detailed info
- Read `PERSONA_IMAGES_GUIDE.md` for step-by-step guide
- Check Prisma logs in terminal

## What's Supported

✅ Custom avatar images for each persona  
✅ Fallback to emoji if no image  
✅ Bulk image updates  
✅ Re-seeding without losing images  
✅ Image preview in UI  
✅ Proper error handling  
✅ Detailed logging  

## Example Usage

```bash
# Initial setup
npm run db:push
npm run db:seed

# Later, add images
# Edit scripts/update-persona-images.ts, then:
npm run db:update:images

# Or update one persona directly using Prisma Studio
npm run db:studio
# Navigate to personas, find your persona, edit avatarUrl field

# Verify changes
npm run dev
# Open localhost:3000 and check persona cards
```

## Support

All scripts include:
- ✅ Error handling
- ✅ Progress logging
- ✅ Success/failure counts
- ✅ Detailed error messages

Check the console output for any issues!

---

**That's it! Your persona system is now ready with full image support! 🎉**
