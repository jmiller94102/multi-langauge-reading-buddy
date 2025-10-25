# Lingo.dev Supported Locales

## Overview

Lingo.dev CLI supports **80+ locales** with multiple format options. This document lists the most relevant languages for our Reading Quest application and provides guidance on locale code selection.

---

## Locale Code Formats

Lingo.dev accepts three primary locale code formats:

### 1. ISO 639-1 (Simple 2-letter codes)
```
en, es, fr, de, ja, ko, zh, pt, it, ru
```

**Use when**: You want a single translation for all regions
**Example**: `"targetLocales": ["en", "es", "ko"]`

### 2. BCP 47 (Language + Region)
```
en-US, en-GB, es-ES, es-419, fr-FR, fr-CA, zh-CN, zh-TW, pt-BR, pt-PT
```

**Use when**: You need regional variants with specific terminology
**Example**: `"targetLocales": ["en-US", "es-419", "zh-CN"]`

### 3. Platform-Specific Formats
```
es-rES (Android), zh-Hans (iOS), sr-Cyrl (script variant)
```

**Use when**: Integrating with native mobile apps

---

## Recommended Locales for Reading Quest

Based on our target audience (grades 3-6, educational app), we recommend:

### Priority Tier 1 (Core Languages)

| Locale Code | Language | Region | Notes |
|-------------|----------|--------|-------|
| `en` | English | Universal | Source locale, already implemented |
| `es-419` | Spanish | Latin America | Broader coverage than `es-ES` |
| `ko` | Korean | South Korea | Already supported in learning content |
| `zh-CN` | Chinese | Mainland China (Simplified) | Already supported in learning content |

### Priority Tier 2 (Expansion)

| Locale Code | Language | Region | Notes |
|-------------|----------|--------|-------|
| `fr` | French | Universal | Large user base, educational focus |
| `de` | German | Germany | Strong education market |
| `ja` | Japanese | Japan | Gamification culture alignment |
| `pt-BR` | Portuguese | Brazil | Large Latin American market |

### Priority Tier 3 (Future Growth)

| Locale Code | Language | Region | Notes |
|-------------|----------|--------|-------|
| `it` | Italian | Italy | European market expansion |
| `ru` | Russian | Russia | Large user base |
| `ar` | Arabic | Middle East | Growing education market |
| `hi` | Hindi | India | Massive potential market |
| `vi` | Vietnamese | Vietnam | Growing tech adoption |
| `th` | Thai | Thailand | Southeast Asia expansion |

---

## Complete List of Supported Locales

### European Languages

| Locale | Language | Native Name |
|--------|----------|-------------|
| `en` | English | English |
| `en-US` | English (US) | English (United States) |
| `en-GB` | English (UK) | English (United Kingdom) |
| `es` | Spanish | Español |
| `es-ES` | Spanish (Spain) | Español (España) |
| `es-419` | Spanish (Latin America) | Español (Latinoamérica) |
| `fr` | French | Français |
| `fr-FR` | French (France) | Français (France) |
| `fr-CA` | French (Canada) | Français (Canada) |
| `de` | German | Deutsch |
| `de-DE` | German (Germany) | Deutsch (Deutschland) |
| `it` | Italian | Italiano |
| `it-IT` | Italian (Italy) | Italiano (Italia) |
| `pt` | Portuguese | Português |
| `pt-BR` | Portuguese (Brazil) | Português (Brasil) |
| `pt-PT` | Portuguese (Portugal) | Português (Portugal) |
| `nl` | Dutch | Nederlands |
| `pl` | Polish | Polski |
| `ru` | Russian | Русский |
| `uk` | Ukrainian | Українська |
| `cs` | Czech | Čeština |
| `sk` | Slovak | Slovenčina |
| `hu` | Hungarian | Magyar |
| `ro` | Romanian | Română |
| `bg` | Bulgarian | Български |
| `hr` | Croatian | Hrvatski |
| `sr` | Serbian | Српски |
| `sr-Cyrl` | Serbian (Cyrillic) | Српски (Ћирилица) |
| `sr-Latn` | Serbian (Latin) | Srpski (Latinica) |
| `sl` | Slovenian | Slovenščina |
| `lt` | Lithuanian | Lietuvių |
| `lv` | Latvian | Latviešu |
| `et` | Estonian | Eesti |
| `fi` | Finnish | Suomi |
| `sv` | Swedish | Svenska |
| `no` | Norwegian | Norsk |
| `da` | Danish | Dansk |
| `is` | Icelandic | Íslenska |
| `el` | Greek | Ελληνικά |
| `tr` | Turkish | Türkçe |

### Asian Languages

| Locale | Language | Native Name |
|--------|----------|-------------|
| `zh` | Chinese | 中文 |
| `zh-CN` | Chinese (Simplified) | 中文（简体） |
| `zh-TW` | Chinese (Traditional) | 中文（繁體） |
| `zh-HK` | Chinese (Hong Kong) | 中文（香港） |
| `zh-Hans` | Chinese (Simplified script) | 中文（简体） |
| `zh-Hant` | Chinese (Traditional script) | 中文（繁體） |
| `ja` | Japanese | 日本語 |
| `ko` | Korean | 한국어 |
| `vi` | Vietnamese | Tiếng Việt |
| `th` | Thai | ไทย |
| `id` | Indonesian | Bahasa Indonesia |
| `ms` | Malay | Bahasa Melayu |
| `fil` | Filipino | Filipino |
| `tl` | Tagalog | Tagalog |
| `hi` | Hindi | हिन्दी |
| `bn` | Bengali | বাংলা |
| `ta` | Tamil | தமிழ் |
| `te` | Telugu | తెలుగు |
| `mr` | Marathi | मराठी |
| `gu` | Gujarati | ગુજરાતી |
| `kn` | Kannada | ಕನ್ನಡ |
| `ml` | Malayalam | മലയാളം |
| `pa` | Punjabi | ਪੰਜਾਬੀ |
| `ur` | Urdu | اردو |
| `ne` | Nepali | नेपाली |

### Middle Eastern & African Languages

| Locale | Language | Native Name |
|--------|----------|-------------|
| `ar` | Arabic | العربية |
| `ar-SA` | Arabic (Saudi Arabia) | العربية (السعودية) |
| `ar-AE` | Arabic (UAE) | العربية (الإمارات) |
| `ar-EG` | Arabic (Egypt) | العربية (مصر) |
| `he` | Hebrew | עברית |
| `fa` | Persian | فارسی |
| `sw` | Swahili | Kiswahili |
| `am` | Amharic | አማርኛ |

### Other Languages

| Locale | Language | Native Name |
|--------|----------|-------------|
| `af` | Afrikaans | Afrikaans |
| `sq` | Albanian | Shqip |
| `eu` | Basque | Euskara |
| `ca` | Catalan | Català |
| `gl` | Galician | Galego |
| `cy` | Welsh | Cymraeg |
| `ga` | Irish | Gaeilge |
| `mt` | Maltese | Malti |

---

## Regional Variant Considerations

### Spanish: `es` vs `es-ES` vs `es-419`

**Recommendation**: Use `es-419` for broader Latin American coverage

**Differences**:
- `es`: Universal Spanish (defaults to Spain)
- `es-ES`: Spain Spanish (uses "vosotros", European vocabulary)
- `es-419`: Latin American Spanish (uses "ustedes", broader terminology)

**Example differences**:
| English | es-ES (Spain) | es-419 (Latin America) |
|---------|---------------|------------------------|
| Computer | Ordenador | Computadora |
| Cell phone | Móvil | Celular |
| To drive | Conducir | Manejar |

### Chinese: `zh-CN` vs `zh-TW` vs `zh-Hans` vs `zh-Hant`

**Recommendation**: Use `zh-CN` for Mainland China, `zh-TW` for Taiwan

**Differences**:
- `zh`: Universal Chinese (ambiguous)
- `zh-CN`: Simplified Chinese (Mainland China)
- `zh-TW`: Traditional Chinese (Taiwan)
- `zh-HK`: Traditional Chinese (Hong Kong, includes Cantonese terms)
- `zh-Hans`: Simplified script (iOS format)
- `zh-Hant`: Traditional script (iOS format)

**Character differences**:
| English | Simplified (zh-CN) | Traditional (zh-TW) |
|---------|-------------------|---------------------|
| Learn | 学习 | 學習 |
| Reading | 阅读 | 閱讀 |
| Story | 故事 | 故事 (same) |

### Portuguese: `pt` vs `pt-BR` vs `pt-PT`

**Recommendation**: Use `pt-BR` for larger market

**Differences**:
- `pt`: Universal Portuguese (defaults to Portugal)
- `pt-BR`: Brazilian Portuguese (180M speakers)
- `pt-PT`: European Portuguese (10M speakers)

**Example differences**:
| English | pt-BR (Brazil) | pt-PT (Portugal) |
|---------|----------------|------------------|
| Train | Trem | Comboio |
| Bus | Ônibus | Autocarro |
| Cell phone | Celular | Telemóvel |

### French: `fr` vs `fr-FR` vs `fr-CA`

**Recommendation**: Use `fr` for universal coverage

**Differences**:
- `fr`: Universal French (defaults to France)
- `fr-FR`: France French (60M speakers)
- `fr-CA`: Canadian French (Quebec, 7M speakers)

**Minor differences** (mostly terminology and pronunciation, not vocabulary)

### English: `en` vs `en-US` vs `en-GB`

**Recommendation**: Use `en` (our source locale)

**Differences**:
- `en`: Universal English (our current implementation)
- `en-US`: American English (color, center, analyze)
- `en-GB`: British English (colour, centre, analyse)

---

## Checking Available Locales

To see the complete, up-to-date list of supported locales:

```bash
# Source locales (languages you can translate FROM)
npx lingo.dev@latest show locale sources

# Target locales (languages you can translate TO)
npx lingo.dev@latest show locale targets
```

---

## Configuration Examples

### Minimal Configuration (3 languages)

```json
{
  "sourceLocale": "en",
  "targetLocales": ["es-419", "ko", "zh-CN"]
}
```

### Recommended Configuration (6 languages)

```json
{
  "sourceLocale": "en",
  "targetLocales": [
    "es-419",    // Latin American Spanish
    "ko",        // Korean
    "zh-CN",     // Simplified Chinese
    "fr",        // French
    "de",        // German
    "ja"         // Japanese
  ]
}
```

### Comprehensive Configuration (12 languages)

```json
{
  "sourceLocale": "en",
  "targetLocales": [
    "es-419",    // Latin American Spanish
    "ko",        // Korean
    "zh-CN",     // Simplified Chinese
    "fr",        // French
    "de",        // German
    "ja",        // Japanese
    "pt-BR",     // Brazilian Portuguese
    "it",        // Italian
    "ru",        // Russian
    "ar",        // Arabic
    "hi",        // Hindi
    "vi"         // Vietnamese
  ]
}
```

---

## Locale Selection Guidelines

### Question 1: Who is your target audience?

**Answer this first** - it drives locale selection.

**For Reading Quest**:
- **Primary**: English-speaking families (en - already done)
- **Secondary**: Spanish, Korean, Chinese-speaking families
- **Tertiary**: French, German, Japanese education markets

### Question 2: Regional vs. Universal?

**Use regional variants** (`es-419`, `pt-BR`, `zh-CN`) when:
- You need culturally-specific terminology
- You're targeting a specific geographic market
- There are significant vocabulary differences

**Use universal codes** (`fr`, `de`, `ja`) when:
- Differences are minimal (spelling, pronunciation)
- You want broad coverage without maintaining multiple variants
- Budget is limited (fewer locales = lower cost)

### Question 3: What's your budget?

**Free tier**: 10,000 words/month
- Start with 2-3 target languages
- Example: `["es-419", "ko", "zh-CN"]`

**Paid tier** ($30/month): 50,000 words/month
- Support 5-7 target languages
- Example: `["es-419", "ko", "zh-CN", "fr", "de", "ja", "pt-BR"]`

**Enterprise**: Unlimited
- Support 10+ languages
- Full regional variant coverage

### Question 4: Maintenance capacity?

Each additional language requires:
- QA testing (visual review, layout checks)
- Content updates (when adding new features)
- Customer support (if you offer localized help)

**Recommendation**: Start small (3-5 languages), expand gradually

---

## Adding New Locales

### Step 1: Update i18n.json

```json
{
  "targetLocales": [
    "es-419",
    "ko",
    "zh-CN",
    "vi"  // Added Vietnamese
  ]
}
```

### Step 2: Run Lingo.dev

```bash
npx lingo.dev@latest run
```

### Step 3: Verify Output

```bash
ls src/locales/
# Should now include vi.json
```

### Step 4: Update Language Switcher

```typescript
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es-419', name: 'Español' },
  { code: 'ko', name: '한국어' },
  { code: 'zh-CN', name: '中文' },
  { code: 'vi', name: 'Tiếng Việt' },  // Added
];
```

---

## Removing Locales

### Step 1: Update i18n.json

Remove the locale from `targetLocales` array.

### Step 2: Delete Translation File

```bash
rm src/locales/vi.json
```

### Step 3: Update i18n.lock

```bash
npx lingo.dev@latest run  # Regenerates lock file
```

### Step 4: Update Language Switcher

Remove the language option from your UI.

---

## Best Practices

### 1. Start Small
Begin with 3-5 languages based on user analytics and market research.

### 2. Prioritize Market Size
Focus on languages with the most potential users first.

### 3. Consider Cultural Fit
Choose languages where your app's gamification and pet mechanics resonate culturally.

### 4. Monitor Usage
Track which languages are actually used by users (analytics).

### 5. Budget for QA
Each language needs visual QA, especially for:
- Button text overflow
- Multi-line labels
- Right-to-left languages (Arabic, Hebrew)
- Character encoding (Japanese, Korean, Chinese)

---

## Special Considerations

### Right-to-Left (RTL) Languages

**Languages**: Arabic (`ar`), Hebrew (`he`), Persian (`fa`)

**Challenges**:
- Entire UI layout flips (left becomes right)
- Requires CSS updates: `dir="rtl"`
- Text alignment, icons, navigation all flip

**Recommendation**: Implement RTL support as a separate phase (not in MVP)

### Character Encoding

**Languages**: Japanese (`ja`), Korean (`ko`), Chinese (`zh-*`), Arabic (`ar`)

**Challenges**:
- Longer character height (vertical space)
- Font selection (web fonts needed)
- Character overflow in fixed-width containers

**Solution**: Use flexible layouts with `min-width` instead of fixed `width`

### Pluralization Rules

Different languages have different pluralization rules:

| Language | Plural Forms | Example |
|----------|--------------|---------|
| English | 2 (one, other) | 1 item, 2 items |
| French | 2 (one, other) | 1 élément, 2 éléments |
| Polish | 3 (one, few, many) | 1 element, 2 elementy, 5 elementów |
| Arabic | 6 (zero, one, two, few, many, other) | Complex rules |

**i18next handles this automatically** - just follow the format:

```json
{
  "items_one": "{{count}} item",
  "items_other": "{{count}} items"
}
```

---

## Summary

### Recommended Starting Configuration

For Reading Quest MVP:

```json
{
  "sourceLocale": "en",
  "targetLocales": ["es-419", "ko", "zh-CN"]
}
```

**Rationale**:
1. **es-419**: Large Spanish-speaking market in Latin America
2. **ko**: Already supported in educational content
3. **zh-CN**: Already supported in educational content

**Next expansion** (Phase 2):
```json
{
  "targetLocales": ["es-419", "ko", "zh-CN", "fr", "de", "ja"]
}
```

---

## Resources

- **Full locale list**: Run `npx lingo.dev@latest show locale targets`
- **ISO 639-1 codes**: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
- **BCP 47 standard**: https://tools.ietf.org/html/bcp47
- **i18next pluralization**: https://www.i18next.com/translation-function/plurals

---

## Next Steps

1. Review [implementation-guide.md](./implementation-guide.md) for setup instructions
2. Select your target locales based on this guide
3. Configure `i18n.json` with your chosen locales
4. Implement the PRP in `/PRPs/fullstack/lingo-implementation.md`
