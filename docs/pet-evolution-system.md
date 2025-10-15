# Multi-Track Pet Evolution System

## Overview

This document specifies the complete multi-track evolution system for the Reading App V2's virtual pet companion. The pet evolves through **7 stages** across **3 distinct tracks** (Knowledge, Coolness, Culture), with each track offering unique visual designs, personality traits, and gameplay bonuses.

**Version**: 1.0
**Last Updated**: 2025-10-11
**Status**: ✅ Complete

---

## Table of Contents

1. [Evolution System Overview](#evolution-system-overview)
2. [Track Specifications](#track-specifications)
3. [Evolution Requirements](#evolution-requirements)
4. [Visual Design & Art Generation](#visual-design--art-generation)
5. [Pet Stats & Bonuses](#pet-stats--bonuses)
6. [Food Preferences](#food-preferences)
7. [Accessory System](#accessory-system)
8. [Evolution Ceremonies](#evolution-ceremonies)
9. [Track Switching Mechanics](#track-switching-mechanics)
10. [Implementation Strategy](#implementation-strategy)

---

## Evolution System Overview

### Core Concept

The pet companion evolves alongside the user's learning journey, with **3 parallel evolution tracks** representing different paths:

1. **Knowledge Track**: Academic/scholarly path (Pre-K → PhD Scholar)
2. **Coolness Track**: Pop culture/style path (Plain → Pop Star)
3. **Culture Track**: Cultural exploration path (Homebody → Universal Spirit)

Each track has **7 evolution stages** unlocked by reaching specific user levels.

---

### Evolution Stage Summary

| Stage | User Level Required | Knowledge Track | Coolness Track | Culture Track |
|-------|---------------------|-----------------|----------------|---------------|
| **0** | Level 1 | Newbie | Plain Egg | Homebody |
| **1** | Level 4 | Kindergartener | Street Style | Town Explorer |
| **2** | Level 8 | Elementary | Cool Kid | Regional Traveler |
| **3** | Level 12 | Middle Schooler | Trendsetter | National Wanderer |
| **4** | Level 16 | High Schooler | Style Icon | Continental Voyager |
| **5** | Level 20 | College Graduate | Influencer | World Citizen |
| **6** | Level 25 | PhD Scholar | Pop Star | Universal Spirit |

**Total Evolution Stages**: 7 stages × 3 tracks = **21 unique pet forms**

---

## Track Specifications

### 1. Knowledge Track

**Theme**: Academic achievement and intellectual growth

**Personality Traits**:
- Loves reading and learning
- Excited by quiz completions
- Prefers educational rewards
- Encourages study habits

**Visual Aesthetic**:
- Bookish accessories (glasses, graduation caps, books)
- Scholar robes, academic attire
- Colors: Navy blue, gold, white
- Background: Libraries, classrooms, study spaces

---

#### Stage 0: Newbie
**Description**: A curious egg with question marks

**User Level**: 1
**Visual**: Small egg with "?" symbols, sparkles of curiosity

**Personality**: Wide-eyed, eager to learn everything

**Special Trait**: Asks questions about new words

**Art Prompt** (FLUX-1.1-pro):
```
A cute cartoon egg character with large curious eyes, question mark symbols floating around it, sparkles and stars, soft pastel colors, friendly and inviting, children's book illustration style, white background
```

---

#### Stage 1: Kindergartener
**Description**: Young learner with basic school supplies

**User Level**: 4
**Visual**: Small creature holding a crayon, wearing a backpack

**Personality**: Excited about colors and shapes

**Special Trait**: +5% XP bonus for completing first quiz of the day

**Art Prompt**:
```
A cute cartoon creature resembling a fluffy round animal, holding a colorful crayon, wearing a small backpack, bright and cheerful colors, kindergarten classroom background with alphabet posters, children's book illustration style, white background
```

---

#### Stage 2: Elementary
**Description**: Elementary student with notebook and pencil

**User Level**: 8
**Visual**: Slightly larger, carrying books, wearing a school uniform

**Personality**: Loves spelling and simple stories

**Special Trait**: +10% XP bonus for reading passages at grade level

**Art Prompt**:
```
A cute cartoon creature resembling a friendly animal, holding a notebook and pencil, wearing a simple school uniform with a tie, surrounded by colorful textbooks, elementary school setting, warm and encouraging atmosphere, children's book illustration style, white background
```

---

#### Stage 3: Middle Schooler
**Description**: Pre-teen scholar with more advanced materials

**User Level**: 12
**Visual**: Wearing casual school attire, carrying a laptop, glasses optional

**Personality**: Curious about science and history

**Special Trait**: +15% XP bonus, unlocks advanced vocabulary challenges

**Art Prompt**:
```
A cute cartoon creature resembling a smart young animal, wearing casual school clothes and optional round glasses, holding a tablet or laptop, surrounded by science books and a globe, middle school setting with lockers, intelligent and friendly expression, children's book illustration style, white background
```

---

#### Stage 4: High Schooler
**Description**: Teen scholar with subject specializations

**User Level**: 16
**Visual**: More mature appearance, carrying textbooks and a calculator, stylish glasses

**Personality**: Focused on goals, loves challenging content

**Special Trait**: +20% XP bonus, unlocks bonus quizzes with extra rewards

**Art Prompt**:
```
A cute cartoon creature resembling a teenage animal, wearing stylish glasses and a school letterman jacket, carrying advanced textbooks and a calculator, surrounded by math equations and literary quotes, high school setting with trophy case, confident and studious expression, children's book illustration style, white background
```

---

#### Stage 5: College Graduate
**Description**: Fresh graduate ready for the world

**User Level**: 20
**Visual**: Wearing a graduation cap and gown, holding a diploma

**Personality**: Proud and accomplished, inspires others

**Special Trait**: +25% XP bonus, unlocks mentor mode (can review past quizzes for bonus XP)

**Art Prompt**:
```
A cute cartoon creature resembling a young adult animal, wearing a graduation cap and gown, holding a diploma proudly, surrounded by balloons and confetti, university campus background with columns and trees, joyful and accomplished expression, children's book illustration style, white background
```

---

#### Stage 6: PhD Scholar
**Description**: Ultimate academic achievement, lifelong learner

**User Level**: 25
**Visual**: Wearing professor attire, surrounded by books and research papers, prestigious appearance

**Personality**: Wise, supportive, celebrates every learning milestone

**Special Trait**: +30% XP bonus, daily wisdom quotes, unlocks "perfect passage" challenges

**Art Prompt**:
```
A distinguished cute cartoon creature resembling a wise animal professor, wearing academic robes and a doctoral cap with tassel, round spectacles, holding ancient books and scrolls, surrounded by floating magical symbols and glowing knowledge orbs, grand library with towering bookshelves, wise and warm expression, children's book illustration style, white background
```

---

### 2. Coolness Track

**Theme**: Style, trends, and pop culture

**Personality Traits**:
- Loves fashion and music
- Excited by creative story prompts
- Prefers trendy rewards
- Encourages self-expression

**Visual Aesthetic**:
- Fashionable clothing, accessories
- Vibrant colors, neon accents
- Modern backgrounds (city, stage, studio)

---

#### Stage 0: Plain Egg
**Description**: An unassuming egg waiting to discover its style

**User Level**: 1
**Visual**: Simple smooth egg with subtle shine

**Personality**: Shy but observant

**Special Trait**: Watches user's choices to develop personality

**Art Prompt**:
```
A simple smooth egg shape with a subtle sheen, neutral soft gray and white colors, minimalist design, clean background with soft shadows, potential for transformation, children's book illustration style, white background
```

---

#### Stage 1: Street Style
**Description**: Urban explorer with basic street fashion

**User Level**: 4
**Visual**: Wearing a baseball cap and sneakers

**Personality**: Curious about the world, loves adventure stories

**Special Trait**: +5 coins bonus for creative story prompts

**Art Prompt**:
```
A cute cartoon creature resembling a hip young animal, wearing a colorful baseball cap backwards and trendy sneakers, casual streetwear style, urban city background with graffiti art, energetic and playful expression, children's book illustration style, white background
```

---

#### Stage 2: Cool Kid
**Description**: Developing sense of style and confidence

**User Level**: 8
**Visual**: Wearing sunglasses, hoodie, and skateboard

**Personality**: Fun-loving, enjoys humor in stories

**Special Trait**: +10 coins bonus for stories with humor level 3

**Art Prompt**:
```
A cute cartoon creature resembling a cool animal kid, wearing stylish sunglasses and a colorful hoodie, holding a skateboard with stickers, standing in front of a skate park, confident and friendly expression, vibrant colors, children's book illustration style, white background
```

---

#### Stage 3: Trendsetter
**Description**: Fashion-forward leader with unique style

**User Level**: 12
**Visual**: Designer outfit, multiple accessories, stylish hairstyle

**Personality**: Creative, loves unique story themes

**Special Trait**: +15 coins bonus, unlocks exclusive cosmetics in shop

**Art Prompt**:
```
A cute cartoon creature resembling a fashionable animal, wearing a trendy designer outfit with colorful patterns, stylish hair with highlights, multiple cool accessories like bracelets and a scarf, surrounded by fashion magazines and style icons, urban boutique background, confident and creative expression, children's book illustration style, white background
```

---

#### Stage 4: Style Icon
**Description**: Recognized for impeccable taste and originality

**User Level**: 16
**Visual**: High-fashion ensemble, signature look, spotlight-ready

**Personality**: Charismatic, inspires creativity

**Special Trait**: +20 coins bonus, pet's outfit changes daily automatically

**Art Prompt**:
```
A cute cartoon creature resembling a stylish animal celebrity, wearing a high-fashion ensemble with geometric patterns and bold colors, signature sunglasses, holding a designer bag, surrounded by paparazzi camera flashes and fashion show runway, charismatic and inspiring expression, children's book illustration style, white background
```

---

#### Stage 5: Influencer
**Description**: Social media sensation with global following

**User Level**: 20
**Visual**: Holding a phone for selfies, trendy outfit, viral accessories

**Personality**: Outgoing, celebrates achievements publicly

**Special Trait**: +25 coins bonus, achievements shared with "followers" (visual effect)

**Art Prompt**:
```
A cute cartoon creature resembling an animal influencer, holding a smartphone taking a selfie, wearing ultra-trendy clothes with brand logos, surrounded by likes and heart emojis floating in the air, ring light and camera equipment, social media studio background, outgoing and confident expression, children's book illustration style, white background
```

---

#### Stage 6: Pop Star
**Description**: Ultimate coolness achieved, musical icon

**User Level**: 25
**Visual**: Stage outfit with sparkles, microphone, star accessories

**Personality**: Larger-than-life, celebrates every win with flair

**Special Trait**: +30 coins bonus, daily concert animation, unlocks "encore" mode for bonus XP

**Art Prompt**:
```
A dazzling cute cartoon creature resembling an animal pop star, wearing a glittering stage costume with star patterns, holding a golden microphone, surrounded by spotlights and cheering crowd silhouettes, concert stage with pyrotechnics and confetti, superstar aura with musical notes floating, energetic and joyful expression, children's book illustration style, white background
```

---

### 3. Culture Track

**Theme**: Cultural exploration and global awareness

**Personality Traits**:
- Loves diverse stories and languages
- Excited by cultural foods
- Encourages language learning
- Celebrates diversity

**Visual Aesthetic**:
- Cultural accessories (flags, traditional items)
- Earthy tones, global motifs
- International backgrounds (landmarks, festivals)

---

#### Stage 0: Homebody
**Description**: Content at home, not yet adventurous

**User Level**: 1
**Visual**: Cozy creature in a small nest or home

**Personality**: Comfortable, cautious about new things

**Special Trait**: Prefers familiar foods

**Art Prompt**:
```
A cute cartoon creature resembling a cozy animal, curled up in a comfortable nest made of soft blankets and pillows, warm home environment with a small window showing outside world, content and peaceful expression, soft warm colors, children's book illustration style, white background
```

---

#### Stage 1: Town Explorer
**Description**: Venturing beyond home to nearby areas

**User Level**: 4
**Visual**: Wearing a small backpack, holding a map

**Personality**: Curious about local culture

**Special Trait**: +5% bonus XP for trying new language words

**Art Prompt**:
```
A cute cartoon creature resembling an adventurous animal, wearing a small explorer's backpack and holding a colorful map, walking through a friendly town with local shops and cafes, curious and excited expression, bright and welcoming atmosphere, children's book illustration style, white background
```

---

#### Stage 2: Regional Traveler
**Description**: Exploring surrounding regions and traditions

**User Level**: 8
**Visual**: Camera around neck, wearing regional accessories

**Personality**: Interested in local foods and customs

**Special Trait**: +10% bonus XP, loves Korean and Chinese cultural foods

**Art Prompt**:
```
A cute cartoon creature resembling a traveling animal, wearing a camera around its neck and a hat with regional pins, holding a travel guidebook, surrounded by landmarks like pagodas and temples, enthusiastic and open-minded expression, diverse cultural elements, children's book illustration style, white background
```

---

#### Stage 3: National Wanderer
**Description**: Exploring the entire country, embracing diversity

**User Level**: 12
**Visual**: Collection of souvenirs, multiple cultural accessories

**Personality**: Celebrates national holidays and traditions

**Special Trait**: +15% bonus XP, unlocks cultural trivia quizzes

**Art Prompt**:
```
A cute cartoon creature resembling a well-traveled animal, wearing a vest with patches from different regions, carrying souvenirs and cultural artifacts, surrounded by national landmarks and festive decorations, knowledgeable and friendly expression, rich cultural details, children's book illustration style, white background
```

---

#### Stage 4: Continental Voyager
**Description**: Crossing borders, exploring entire continents

**User Level**: 16
**Visual**: Passport, multilingual phrase book, continental attire

**Personality**: Fluent in multiple greetings, loves language blending

**Special Trait**: +20% bonus XP for high blend level reading (7-10)

**Art Prompt**:
```
A cute cartoon creature resembling a worldly animal, holding a passport with stamps, wearing travel attire with accessories from multiple countries, surrounded by famous continental landmarks like the Eiffel Tower and Great Wall, multilingual word bubbles floating around, sophisticated and adventurous expression, children's book illustration style, white background
```

---

#### Stage 5: World Citizen
**Description**: Global perspective, respects all cultures

**User Level**: 20
**Visual**: Globe in hand, United Nations style appearance

**Personality**: Wise about world cultures, promotes understanding

**Special Trait**: +25% bonus XP, daily cultural fact, bonus for diverse vocabulary

**Art Prompt**:
```
A cute cartoon creature resembling a wise animal diplomat, holding a small globe, wearing an outfit that blends elements from cultures worldwide, surrounded by floating flags and cultural symbols, international landmarks in background, wise and compassionate expression, harmonious color palette, children's book illustration style, white background
```

---

#### Stage 6: Universal Spirit
**Description**: Transcendent cultural understanding, unity embodied

**User Level**: 25
**Visual**: Ethereal appearance, glowing with cultural symbols, cosmic background

**Personality**: Enlightened, celebrates all learning as cultural exchange

**Special Trait**: +30% bonus XP, perfect understanding of all languages, unlocks "universal stories" with maximum cultural content

**Art Prompt**:
```
A majestic cute cartoon creature resembling an enlightened animal sage, glowing with soft ethereal light, surrounded by floating cultural symbols from around the world (yin-yang, lotus, peace dove, etc.), wearing flowing robes that shimmer with patterns from global traditions, cosmic starry background with Earth visible, serene and transcendent expression, magical and unifying aura, children's book illustration style, white background
```

---

## Evolution Requirements

### Level-Based Evolution

**Primary Requirement**: User must reach specific level to unlock evolution

| Evolution Stage | Required User Level | XP Needed (Cumulative) |
|-----------------|---------------------|------------------------|
| Stage 0 → 1 | Level 4 | ~600 XP |
| Stage 1 → 2 | Level 8 | ~2,400 XP |
| Stage 2 → 3 | Level 12 | ~5,800 XP |
| Stage 3 → 4 | Level 16 | ~11,000 XP |
| Stage 4 → 5 | Level 20 | ~18,500 XP |
| Stage 5 → 6 | Level 25 | ~32,000 XP |

**Formula**: XP required = 100 * level^1.5

---

### Evolution Trigger

**Automatic Evolution**:
When user levels up to required level, pet evolution is **automatically triggered** with a celebration animation.

**Manual Evolution** (Alternative Design):
User can choose when to evolve pet after reaching required level, allowing them to enjoy current form longer.

**Recommendation**: Use automatic evolution for MVP, add manual option later.

---

### Evolution Ceremony Flow

```
User reaches Level 4
   ↓
Level up animation completes
   ↓
Modal: "Your pet is ready to evolve!"
   ↓
User clicks "Evolve Now" button
   ↓
Pet glows and spins (2 seconds)
   ↓
Bright flash of light
   ↓
New evolution form revealed
   ↓
Confetti animation
   ↓
Evolution completion message:
"Flutterpuff evolved to Kindergartener!"
   ↓
New abilities unlocked notification
```

---

## Visual Design & Art Generation

### Art Style Guidelines

**General Aesthetic**:
- Child-friendly, non-threatening
- Expressive faces with large eyes
- Rounded shapes, soft edges
- Vibrant but not overwhelming colors
- Clear silhouettes (recognizable at small sizes)

**Consistency Requirements**:
- Same base creature shape across all evolutions within a track
- Gradual size increase with each stage
- Preserve key identifying features (e.g., color, body shape)

---

### FLUX-1.1-pro Generation Strategy

**Batch Generation**:
Generate all 21 pet forms (7 stages × 3 tracks) during development phase

**Image Specifications**:
- **Resolution**: 512x512px (sufficient for MVP)
- **Format**: PNG with transparency
- **Style**: "children's book illustration style, white background"
- **Consistency**: Use same seed and base prompt structure

**Base Prompt Template**:
```
A cute cartoon [animal type] creature, [stage-specific description], [accessories and clothing], [background elements], [personality expression], children's book illustration style, soft colors, friendly and inviting, white background, high quality digital art
```

---

### Emotion Variants

Each pet evolution form needs **7 emotion variants**:

1. **Happy**: Big smile, sparkles around eyes
2. **Sad**: Droopy ears/eyes, small tears
3. **Angry**: Furrowed brow, steam puffs
4. **Hungry**: Empty stomach, drooling, food thought bubble
5. **Excited**: Jumping, motion lines, stars
6. **Bored**: Half-closed eyes, yawn, slouching
7. **Love**: Hearts around head, blushing cheeks

**Total Images**: 21 forms × 7 emotions = **147 images**

---

### Generation Workflow

**Step 1**: Generate base neutral form for each stage
**Step 2**: Generate 7 emotion variants per stage (use base form as reference)
**Step 3**: Organize images in directory structure:

```
public/images/pets/
├── knowledge/
│   ├── stage-0/
│   │   ├── neutral.png
│   │   ├── happy.png
│   │   ├── sad.png
│   │   ├── angry.png
│   │   ├── hungry.png
│   │   ├── excited.png
│   │   ├── bored.png
│   │   └── love.png
│   ├── stage-1/
│   │   └── [same 8 variants]
│   └── ... (stages 2-6)
├── coolness/
│   └── [same structure]
└── culture/
    └── [same structure]
```

---

## Pet Stats & Bonuses

### Base Stats (All Pets)

- **Happiness**: 0-100 (affects emotion, bonus generation)
- **Hunger**: 0-100 (increases +1%/hour, affects emotion)
- **Energy**: 0-100 (affects playfulness)

**Stat Ranges for Emotions**:
- **Happy**: Happiness 70-100, Hunger 0-30
- **Excited**: Happiness 90-100, just fed or played
- **Love**: Happiness 95-100, favorite food given
- **Sad**: Happiness 0-30
- **Angry**: Hunger 80-100 (very hungry)
- **Bored**: No interaction for 24+ hours
- **Hungry**: Hunger 50-100

---

### Track-Specific Bonuses

**Knowledge Track**:
- **XP Multiplier**: +5% per stage (max +30% at PhD Scholar)
- **Special Ability**: Unlock bonus quiz questions for extra XP
- **Daily Perk**: Morning study tip with XP boost hint

**Coolness Track**:
- **Coin Multiplier**: +5 coins per stage (max +30 coins at Pop Star)
- **Special Ability**: Daily outfit change (cosmetic)
- **Daily Perk**: Style tip with creative story prompt suggestion

**Culture Track**:
- **Language XP Bonus**: +5% per stage when using high blend level (7-10)
- **Special Ability**: Unlock cultural trivia mini-games
- **Daily Perk**: Cultural fact with language learning tip

---

### Evolution Stage Bonuses Summary

| Stage | Knowledge | Coolness | Culture |
|-------|-----------|----------|---------|
| 0 | Base XP | Base coins | Base language XP |
| 1 | +5% XP | +5 coins | +5% language XP |
| 2 | +10% XP | +10 coins | +10% language XP |
| 3 | +15% XP | +15 coins | +15% language XP |
| 4 | +20% XP | +20 coins | +20% language XP |
| 5 | +25% XP | +25 coins | +25% language XP |
| 6 | +30% XP | +30 coins | +30% language XP |

---

## Food Preferences

### Track-Based Food Preferences

**Knowledge Track Favorites**:
- Korean: Bibimbap (balanced meal for brain power)
- Chinese: Peking Duck (celebratory food)
- Effect: +10 happiness, -30 hunger, bonus XP for next quiz

**Coolness Track Favorites**:
- Korean: Tteokbokki (trendy street food)
- Chinese: Fried Rice (quick and tasty)
- Effect: +15 happiness, -25 hunger, bonus coins for next story

**Culture Track Favorites**:
- Korean: Kimchi (traditional, cultural significance)
- Chinese: Dumplings (symbolic of togetherness)
- Effect: +10 happiness, -35 hunger, bonus language learning XP

---

### Food Reaction System

**Favorite Food** (matches track):
- **Emotion**: Love
- **Message**: "[Pet Name] LOVES [food]! ❤️"
- **Bonus**: Track-specific bonus activated

**Liked Food** (any cultural food):
- **Emotion**: Happy
- **Message**: "[Pet Name] enjoyed the [food]! 😊"
- **Bonus**: Standard hunger reduction

**Neutral Food** (generic/non-cultural):
- **Emotion**: Neutral
- **Message**: "[Pet Name] ate the [food]."
- **Bonus**: Basic hunger reduction only

**Disliked Food** (wrong track preference):
- **Emotion**: Sad
- **Message**: "[Pet Name] wasn't excited about this food... 😕"
- **Bonus**: Minimal hunger reduction, no happiness gain

---

## Accessory System

### Track-Specific Accessories

**Knowledge Track Cosmetics**:
- Graduation Cap (various colors)
- Round Glasses (various frames)
- Scholarly Robe
- Book Stack (held accessory)
- Laptop Bag
- Research Notes
- Lab Coat (for science theme)

**Coolness Track Cosmetics**:
- Sunglasses (various styles)
- Baseball Caps (backwards, forwards, sideways)
- Hoodies (various colors/patterns)
- Sneakers (high-tops, low-tops)
- Headphones
- Skateboard
- Microphone

**Culture Track Cosmetics**:
- Explorer Hat
- Camera
- Passport
- Travel Backpack
- Cultural Scarves
- Traditional Hats (Korean hanbok hat, Chinese rice hat)
- Globe

---

### Accessory Slots

**Slots Available**:
1. **Head**: Hats, glasses, headphones
2. **Body**: Clothing, robes, jackets
3. **Hands**: Held items (books, microphone, globe)
4. **Feet**: Shoes, boots

**Equipped Limit**: 1 per slot (max 4 accessories at once)

---

### Accessory Purchase

**Shop Availability**:
- Unlocked as user progresses
- Track-specific accessories more affordable for that track
- Cross-track accessories available but more expensive

**Example Pricing**:
- Track-matched accessory: 200 coins
- Cross-track accessory: 350 coins
- Premium/rare accessory: 500 coins or 5 gems

---

## Evolution Ceremonies

### Animation Sequence

**Duration**: 5-7 seconds total

**Sequence**:
1. **Pre-Evolution** (1s): Pet jumps excitedly
2. **Glow Effect** (1s): Pet begins to glow with track-specific color
3. **Spin** (2s): Pet spins rapidly while glowing brighter
4. **Flash** (0.5s): Bright white flash fills screen
5. **Reveal** (1s): New evolution form appears with spotlight
6. **Celebration** (1.5s): Confetti, sparkles, pet performs signature animation

**Track-Specific Colors**:
- **Knowledge**: Blue → Gold glow
- **Coolness**: Pink → Purple glow
- **Culture**: Green → Rainbow glow

---

### Audio & Effects

**Sound Effects**:
- Magical chime (evolving)
- Triumphant fanfare (reveal)
- Confetti pop (celebration)
- Pet vocalization (new form greeting)

**Visual Effects**:
- Particles swirling around pet
- Light rays emanating outward
- Confetti explosion
- Star sparkles

---

### Post-Evolution Modal

**Content**:
```
┌─────────────────────────────────────┐
│   🎉 Evolution Complete! 🎉         │
│                                     │
│   [New Pet Image - Large]           │
│                                     │
│   Flutterpuff evolved to            │
│   Kindergartener!                   │
│                                     │
│   New Abilities Unlocked:           │
│   • +5% XP Bonus                    │
│   • First Quiz of Day Bonus         │
│                                     │
│   [Continue Button]                 │
└─────────────────────────────────────┘
```

---

## Track Switching Mechanics

### Can Users Switch Tracks?

**Option A**: Locked Track (Simpler for MVP)
- User chooses track at pet creation
- Cannot switch later
- Encourages creating multiple accounts (different children)

**Option B**: Switchable Track (More Complex)
- User can switch tracks for a cost (e.g., 500 gems)
- Pet resets to equivalent stage in new track
- Evolution history preserved

**Option C**: Multi-Pet System (Future Enhancement)
- User can have multiple pets (one per track)
- Switch between active pets
- Each pet progresses independently

---

### Recommended Approach

**MVP**: Option A (locked track)
- Simpler implementation
- Clear progression path
- Encourages commitment to choice

**Post-MVP**: Add Option B (track switching)
- Allow experimentation
- More flexible for user preferences

**Future**: Option C (multi-pet system)
- Ultimate flexibility
- Increased engagement
- More complex state management

---

## Implementation Strategy

### Phase 1: Foundation (Week 1-2)

**Tasks**:
1. Generate all 21 base pet forms with FLUX-1.1-pro
2. Generate 7 emotion variants for Stage 0 of each track (testing)
3. Implement `PetState` data structure
4. Create `PetImage` component with dynamic image loading
5. Implement emotion logic (happiness, hunger, energy → emotion)

**Deliverable**: Static pet display with emotion changes based on stats

---

### Phase 2: Evolution System (Week 3-4)

**Tasks**:
1. Implement evolution requirement checking (user level)
2. Create evolution animation component
3. Build evolution modal and celebration effects
4. Generate remaining emotion variants (stages 1-6)
5. Test evolution flow end-to-end

**Deliverable**: Complete evolution system from Stage 0 to Stage 6

---

### Phase 3: Track-Specific Features (Week 5-6)

**Tasks**:
1. Implement XP/coin bonuses per track
2. Create food preference system
3. Build accessory system (equip/unequip)
4. Add daily perks per track
5. Test all bonuses and rewards

**Deliverable**: Fully functional track-specific gameplay

---

### Phase 4: Polish & Testing (Week 7-8)

**Tasks**:
1. Refine animations and transitions
2. Add sound effects for pet interactions
3. Optimize image loading (lazy loading, caching)
4. User testing with children
5. Balance adjustments (bonus values, food effects)

**Deliverable**: Polished, tested pet system ready for integration

---

## Data Schema

### PetState Interface

```typescript
interface PetState {
  name: string;
  evolutionTrack: 'knowledge' | 'coolness' | 'culture';
  evolutionStage: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  happiness: number; // 0-100
  hunger: number; // 0-100
  energy: number; // 0-100
  emotion: 'happy' | 'sad' | 'angry' | 'hungry' | 'excited' | 'bored' | 'love';
  lastFed: number; // timestamp
  lastPlayed: number; // timestamp
  lastInteraction: number; // timestamp
  ownedAccessories: string[]; // accessory IDs
  equippedAccessories: string[]; // accessory IDs (max 4)
  favoriteFood: string | null; // food ID
  foodsTriedHistory: string[]; // food IDs
  evolutionHistory: EvolutionHistoryEntry[];
}

interface EvolutionHistoryEntry {
  stage: number;
  stageName: string;
  evolvedAt: number; // timestamp
  userLevel: number;
}
```

---

### Pet Image Path Helper

```typescript
function getPetImagePath(
  track: 'knowledge' | 'coolness' | 'culture',
  stage: number,
  emotion: string
): string {
  return `/images/pets/${track}/stage-${stage}/${emotion}.png`;
}

// Usage
const imagePath = getPetImagePath('knowledge', 2, 'happy');
// Returns: "/images/pets/knowledge/stage-2/happy.png"
```

---

## Testing Strategy

### Unit Tests

**Test Pet Emotion Logic**:
```typescript
describe('Pet Emotion System', () => {
  it('shows happy emotion when stats are good', () => {
    const pet = { happiness: 80, hunger: 20, energy: 70 };
    expect(calculateEmotion(pet)).toBe('happy');
  });

  it('shows hungry emotion when hunger is high', () => {
    const pet = { happiness: 60, hunger: 85, energy: 50 };
    expect(calculateEmotion(pet)).toBe('hungry');
  });

  it('shows love emotion when favorite food is given', () => {
    const pet = { happiness: 95, hunger: 10, energy: 80 };
    expect(calculateEmotion(pet, { justFedFavorite: true })).toBe('love');
  });
});
```

---

### Integration Tests

**Test Evolution Flow**:
```typescript
it('evolves pet when user reaches required level', async () => {
  const { user, pet } = setupTestUser({ level: 3, petStage: 0 });

  // User levels up to 4
  await addXP(user, 200); // Triggers level 4

  // Verify evolution triggered
  expect(pet.evolutionStage).toBe(1);
  expect(pet.evolutionHistory).toHaveLength(2); // Stage 0 + Stage 1
});
```

---

### User Testing

**Test with Children (Target Audience)**:
1. Do children understand the evolution concept?
2. Which track do they prefer? (Knowledge, Coolness, Culture)
3. Do they interact with the pet regularly?
4. Are the emotions clear and recognizable?
5. Do they care about keeping pet happy/fed?

---

## Next Steps

1. ✅ **Pet Evolution System Complete** - This document
2. ⏸️ **Art Generation Phase** - Generate all 147 pet images with FLUX-1.1-pro
3. ⏸️ **Component Implementation** - Build VirtualPet, PetModal, EvolutionAnimation components
4. ⏸️ **Bonus System Implementation** - Integrate XP/coin multipliers
5. ⏸️ **User Testing** - Test with target age group (3rd-6th grade)

---

**Document Status**: ✅ Complete
**Total Pet Forms**: 21 (7 stages × 3 tracks)
**Total Images Needed**: 147 (21 forms × 7 emotions)
**Implementation Time**: 8 weeks (estimated)
