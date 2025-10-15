# Profile Page Wireframe

## Layout Overview

The Profile page allows users to manage settings, customize their pet, view account info, and adjust app preferences.

---

## Desktop Layout (>1024px)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Header                                                                                │
│  ┌──────────────────┬─────────────────────────────────────────┬─────────────────────┐ │
│  │ 🎓 LearnKorean   │                                         │  🪙 1,250   💎 15   │ │
│  │ ← Back to Home   │                                         │  🔥 7 Days          │ │
│  └──────────────────┴─────────────────────────────────────────┴─────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Page Header                                                                           │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │  👤 Profile & Settings                                                            │ │
│  │  Customize your learning experience                                              │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────┬─────────────────────────────────────────┐
│  Left Column (60%)                           │  Right Column (40%)                     │
│                                              │                                         │
│  ┌────────────────────────────────────────┐ │  ┌────────────────────────────────────┐ │
│  │  👤 User Profile                       │ │  │  🐾 Pet Customization              │ │
│  │  ═══════════════════════════════════   │ │  │  ═══════════════════════════════   │ │
│  │                                        │ │  │                                    │ │
│  │  ┌──────────┐                          │ │  │  ┌──────────────────────────────┐ │ │
│  │  │   🎓     │                          │ │  │  │                              │ │ │
│  │  │  Avatar  │  Renzo                   │ │  │  │   [Pet Preview]              │ │ │
│  │  │          │                          │ │  │  │   Flutterpuff                │ │ │
│  │  └──────────┘  [Change]                │ │  │  │                              │ │ │
│  │                                        │ │  │  │   Knowledge Track            │ │ │
│  │  Username: Renzo                       │ │  │  │   Level 12                   │ │ │
│  │  [Edit]                                │ │  │  └──────────────────────────────┘ │ │
│  │                                        │ │  │                                    │ │
│  │  Grade Level: 4th Grade [Edit ▼]      │ │  │  Evolution Track:                  │ │
│  │                                        │ │  │  ● Knowledge 🎓                    │ │
│  │  Joined: 20 days ago                   │ │  │  ⚪ Coolness 😎                    │ │
│  │  Total Sessions: 45                    │ │  │  ⚪ Culture 🌍                     │ │
│  └────────────────────────────────────────┘ │  │                                    │ │
│                                              │  │  Pet Name: [Flutterpuff     ]      │ │
│  ┌────────────────────────────────────────┐ │  │  [Save Name]                       │ │
│  │  🌍 Language Preferences               │ │  │                                    │ │
│  │  ═══════════════════════════════════   │ │  │  Owned Accessories (3):            │ │
│  │                                        │ │  │  ┌──────┬──────┬──────┐           │ │
│  │  Primary Language:                     │ │  │  │ 🎓   │ 👓   │ 🎒   │           │ │
│  │  ● English                             │ │  │  │[Wear]│[Wear]│[Wear]│           │ │
│  │                                        │ │  │  └──────┴──────┴──────┘           │ │
│  │  Secondary Languages:                  │ │  │                                    │ │
│  │  ☑ Korean 🇰🇷                         │ │  │  [Visit Shop] →                    │ │
│  │  ☑ Mandarin 🇨🇳                       │ │  └────────────────────────────────────┘ │
│  │  ☐ Japanese 🇯🇵                       │ │                                         │
│  │  ☐ Italian 🇮🇹                        │ │  ┌────────────────────────────────────┐ │
│  │  ☐ Spanish 🇪🇸                        │ │  │  🎨 Theme & Appearance             │ │
│  │  ☐ Arabic 🇸🇦                         │ │  │  ═══════════════════════════════   │ │
│  │                                        │ │  │                                    │ │
│  │  Default Blend Level: [4]              │ │  │  Visual Theme:                     │ │
│  │  ├───●────────────────┤               │ │  │  ⚪ Space 🚀                       │ │
│  │  0%        50%       100%             │ │  │  ⚪ Jungle 🌴                      │ │
│  │                                        │ │  │  ● Deep Sea 🌊                     │ │
│  │  Display Options:                      │ │  │  ⚪ Minecraft ⛏️                   │ │
│  │  ☑ Show translation hints             │ │  │  ⚪ Tron 💠                        │ │
│  │  ☑ Show romanization                  │ │  │                                    │ │
│  │  ☑ Audio support                      │ │  │  Color Mode:                       │ │
│  │  ☐ Auto-play audio                    │ │  │  ● Auto (System)                   │ │
│  └────────────────────────────────────────┘ │  │  ⚪ Light                          │ │
│                                              │  │  ⚪ Dark                           │ │
│  ┌────────────────────────────────────────┐ │  │                                    │ │
│  │  🎯 Learning Settings                  │ │  │  Font Size:                        │ │
│  │  ═══════════════════════════════════   │ │  │  ⚪ Small  ● Medium  ⚪ Large      │ │
│  │                                        │ │  │                                    │ │
│  │  Default Passage Length: 500 words     │ │  │  Animations:                       │ │
│  │  ├────────●──────────┤                 │ │  │  ☑ Enable animations               │ │
│  │  250        1000     2000               │ │  │  ☑ Confetti effects                │ │
│  │                                        │ │  │  ☑ Pet reactions                   │ │
│  │  Humor Level:                          │ │  └────────────────────────────────────┘ │
│  │  ☐ None  ☐ Light  ● Moderate  ☐ Heavy │ │                                         │
│  │                                        │ │  ┌────────────────────────────────────┐ │
│  │  Quiz Settings:                        │ │  │  🔔 Notifications                  │ │
│  │  Difficulty: [Intermediate ▼]          │ │  │  ═══════════════════════════════   │ │
│  │  Questions per Quiz: 5                 │ │  │                                    │ │
│  │  (3 MC, 2 Fill-in)                     │ │  │  ☑ Daily streak reminders          │ │
│  │                                        │ │  │  ☑ Quest completion alerts         │ │
│  │  Auto-Save Progress:                   │ │  │  ☑ Achievement unlocks             │ │
│  │  ☑ Save every 30 seconds               │ │  │  ☑ Pet needs attention             │ │
│  └────────────────────────────────────────┘ │  │  ☐ Weekly progress reports         │ │
│                                              │  │  ☐ Friend activity                 │ │
│  ┌────────────────────────────────────────┐ │  │                                    │ │
│  │  🔊 Sound & Audio                      │ │  │  Notification Time:                │ │
│  │  ═══════════════════════════════════   │ │  │  Daily: 10:00 AM [Edit]            │ │
│  │                                        │ │  │  Weekly: Monday 9:00 AM [Edit]     │ │
│  │  Master Volume: [75%]                  │ │  └────────────────────────────────────┘ │
│  │  ████████████████░░░░ 75%              │ │                                         │
│  │                                        │ │  ┌────────────────────────────────────┐ │
│  │  Sound Effects:                        │ │  │  📊 Data & Privacy                 │ │
│  │  ☑ Enable sound effects                │ │  │  ═══════════════════════════════   │ │
│  │  ☑ Coin/gem collection sounds          │ │  │                                    │ │
│  │  ☑ Achievement unlocks                 │ │  │  ☑ Save progress locally           │ │
│  │  ☑ Pet reactions                       │ │  │  ☐ Sync with cloud (requires auth) │ │
│  │                                        │ │  │                                    │ │
│  │  Voice:                                │ │  │  Data Usage:                       │ │
│  │  Text-to-Speech: [Female ▼]           │ │  │  • Local storage: 2.5 MB           │ │
│  │  Speed: [1.0x ▼]                       │ │  │  • Images cached: 8.2 MB           │ │
│  │  ☑ Highlight words while reading      │ │  │                                    │ │
│  └────────────────────────────────────────┘ │  │  [Clear Cache]                     │ │
│                                              │  │  [Export All Data]                 │ │
│  ┌────────────────────────────────────────┐ │  │  [Delete Account]                  │ │
│  │  ⚙️ Advanced                           │ │  └────────────────────────────────────┘ │
│  │  ═══════════════════════════════════   │ │                                         │
│  │                                        │ │                                         │
│  │  ☐ Developer Mode (show debug info)    │ │                                         │
│  │  ☐ Beta Features                       │ │                                         │
│  │  ☐ Analytics (help improve app)        │ │                                         │
│  │                                        │ │                                         │
│  │  App Version: 2.0.0                    │ │                                         │
│  │  [Check for Updates]                   │ │                                         │
│  │                                        │ │                                         │
│  │  [Reset All Settings]                  │ │                                         │
│  │  [Restore Defaults]                    │ │                                         │
│  └────────────────────────────────────────┘ │                                         │
└──────────────────────────────────────────────┴─────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Actions                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │  [Save All Changes]  [Discard Changes]  [Reset to Defaults]                      │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Bottom Navigation                                                                     │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┐                                          │
│  │ 🏠   │ 📖   │ 🏆   │ 🏪   │ 📊   │ 👤   │                                          │
│  │ Home │ Read │ Achv │ Shop │Stats │ Prof │                                          │
│  │      │      │      │      │      │  ●   │                                          │
│  └──────┴──────┴──────┴──────┴──────┴──────┘                                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Mobile Layout (<768px)

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│  ┌───────────────────────────────────────┐ │
│  │ ← 🎓 Profile                          │ │
│  │                                       │ │
│  │ 🪙 1,250   💎 15   🔥 7 Days          │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  👤 User Profile                            │
│  ═══════════════════════════════            │
│                                             │
│  ┌────────┐                                 │
│  │  🎓    │  Renzo                          │
│  │ Avatar │  4th Grade                      │
│  └────────┘  [Edit Profile]                 │
│                                             │
│  Joined: 20 days ago                        │
│  Sessions: 45                               │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🐾 Pet Customization                       │
│  ═══════════════════════════════            │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │   [Pet Image]                         │ │
│  │   Flutterpuff • Level 12              │ │
│  │   Knowledge Track 🎓                  │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Switch Track:                              │
│  ● Knowledge  ⚪ Coolness  ⚪ Culture        │
│                                             │
│  Pet Name: [Flutterpuff     ]               │
│  [Save]                                     │
│                                             │
│  Accessories: 3 owned                       │
│  [Manage] →                                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🌍 Language (Collapsible) [▼]              │
│  ═══════════════════════════════            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🎯 Learning Settings (Collapsible) [▼]     │
│  ═══════════════════════════════            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🎨 Theme & Appearance (Collapsible) [▼]    │
│  ═══════════════════════════════            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🔊 Sound & Audio (Collapsible) [▼]         │
│  ═══════════════════════════════            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🔔 Notifications (Collapsible) [▼]         │
│  ═══════════════════════════════            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📊 Data & Privacy (Collapsible) [▼]        │
│  ═══════════════════════════════            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ⚙️ Advanced (Collapsible) [▼]              │
│  ═══════════════════════════════            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Actions                                    │
│  [Save All]  [Discard]  [Reset]             │
└─────────────────────────────────────────────┘

[BOTTOM PADDING: 80px for nav]
```

---

## Component Breakdown

### **User Profile Section**
- Avatar with change button
- Username edit
- Grade level dropdown
- Account stats (joined date, sessions)

### **Pet Customization**
- Pet preview with current accessories
- Evolution track selector (radio buttons)
- Pet name input
- Accessory management
- Link to shop

### **Language Preferences**
- Primary language (locked to English for MVP)
- Secondary language checkboxes (Korean, Mandarin, etc.)
- Default blend level slider
- Display options (hints, romanization, audio)

### **Learning Settings**
- Default passage length
- Humor level
- Quiz difficulty and question mix
- Auto-save toggle

### **Theme & Appearance**
- Visual theme selector (5 themes)
- Color mode (auto/light/dark)
- Font size
- Animation toggles

### **Sound & Audio**
- Master volume slider
- Sound effect toggles
- TTS voice and speed
- Word highlighting toggle

### **Notifications**
- Individual notification toggles
- Notification time settings

### **Data & Privacy**
- Local storage toggle
- Cloud sync (requires auth - disabled for MVP)
- Storage usage display
- Cache management
- Export/delete account

### **Advanced Settings**
- Developer mode
- Beta features
- Analytics opt-in
- Version info
- Reset options

---

## Interactions

### **Change Avatar**
```
[Click Change Avatar]
┌─────────────────────────────────────┐
│  Select Avatar                      │
│                                     │
│  ┌───┬───┬───┬───┬───┬───┬───┐    │
│  │🎓 │📚 │🎒 │✏️ │🌟 │🏆 │🔥 │    │
│  └───┴───┴───┴───┴───┴───┴───┘    │
│  ┌───┬───┬───┬───┬───┬───┬───┐    │
│  │👑 │💎 │🚀 │🌊 │🌴 │⛏️ │💠 │    │
│  └───┴───┴───┴───┴───┴───┴───┘    │
│                                     │
│  [Upload Custom Image] (Premium)    │
│                                     │
│  [Cancel] [Select]                  │
└─────────────────────────────────────┘
```

### **Change Pet Name**
```
[Type new name]
[Character limit: 15]
[Real-time validation]

✓ Name available
✗ Name too long
✗ Name contains invalid characters
```

### **Switch Evolution Track**
```
[Select new track]
┌─────────────────────────────────────┐
│  ⚠️ Change Evolution Track?         │
│                                     │
│  Current: Knowledge 🎓              │
│  New: Coolness 😎                   │
│                                     │
│  Your pet will evolve into a new    │
│  form at the next level.            │
│                                     │
│  This action is permanent.          │
│                                     │
│  [Cancel] [Confirm Change]          │
└─────────────────────────────────────┘
```

### **Manage Accessories**
```
[Opens accessory modal]
┌─────────────────────────────────────┐
│  Pet Accessories                    │
│                                     │
│  Owned (3):                         │
│  ┌──────┬──────┬──────┐            │
│  │ 🎓   │ 👓   │ 🎒   │            │
│  │Grad  │Glass │Pack  │            │
│  │[Wear]│[Wear]│[Wear]│            │
│  └──────┴──────┴──────┘            │
│                                     │
│  Currently Wearing:                 │
│  ┌──────┐                           │
│  │ 🎓   │                           │
│  │Grad  │                           │
│  │[Remove]                          │
│  └──────┘                           │
│                                     │
│  [Visit Shop] [Close]               │
└─────────────────────────────────────┘
```

### **Test Audio Settings**
```
[After changing TTS voice/speed]
┌─────────────────────────────────────┐
│  [Play Test] 🔊                     │
│                                     │
│  "Hello! This is how the reading    │
│   will sound with your settings."   │
│                                     │
│  [Pause] [Replay]                   │
└─────────────────────────────────────┘
```

### **Clear Cache**
```
[Click Clear Cache]
┌─────────────────────────────────────┐
│  ⚠️ Clear Cache?                    │
│                                     │
│  This will remove 8.2 MB of cached  │
│  images and audio files.            │
│                                     │
│  Your progress will NOT be deleted. │
│                                     │
│  Images will re-download as needed. │
│                                     │
│  [Cancel] [Clear Cache]             │
└─────────────────────────────────────┘

[After clearing]
✓ Cache cleared! 8.2 MB freed.
```

### **Delete Account**
```
[Click Delete Account]
┌─────────────────────────────────────┐
│  ⚠️ Delete Account?                 │
│                                     │
│  This action CANNOT be undone!      │
│                                     │
│  All your progress will be          │
│  permanently deleted:               │
│  • XP and Level                     │
│  • Achievements                     │
│  • Pet and cosmetics                │
│  • Reading history                  │
│                                     │
│  Type "DELETE" to confirm:          │
│  [____________]                     │
│                                     │
│  [Cancel] [Delete Forever]          │
└─────────────────────────────────────┘
```

### **Save Changes**
```
[Click Save All Changes]
[Show loading indicator]
[Validate all fields]
[Save to localStorage]

✓ Settings saved successfully!
[Toast notification]
```

### **Unsaved Changes Warning**
```
[Try to navigate away with unsaved changes]
┌─────────────────────────────────────┐
│  ⚠️ Unsaved Changes                 │
│                                     │
│  You have unsaved changes.          │
│  Do you want to save them?          │
│                                     │
│  [Discard] [Cancel] [Save & Exit]   │
└─────────────────────────────────────┘
```

---

## States & Animations

### **Loading Profile**
```
┌─────────────────────────────┐
│  Loading your profile...    │
│  [Spinner]                  │
└─────────────────────────────┘
```

### **Save Success**
```
[Green checkmark animation]
✓ Settings saved!
[Auto-dismiss after 2 seconds]
```

### **Validation Error**
```
[Red highlight on invalid field]
✗ Pet name must be 3-15 characters
[Shake animation]
```

### **Preview Theme Change**
```
[Real-time preview as user selects theme]
[Background colors change instantly]
[No save required for preview]
```

---

## Accessibility

- **Keyboard Navigation**: Tab through all inputs, Enter to save
- **Screen Reader**: Announce all settings with current values
- **High Contrast**: Theme options distinguishable
- **Focus Indicators**: Clear outline on focused elements
- **Labels**: All inputs properly labeled

---

## Performance

- **Lazy Load Sections**: Only render visible settings
- **Debounce Save**: Wait 500ms after last change before enabling save
- **Optimize Previews**: Use CSS for theme previews, not re-render
- **Cache Validation**: Only validate changed fields

---

## Notes

- Profile page should be **comprehensive but not overwhelming**
- Settings organized by **category** for easy navigation
- Pet customization is **prominent** (right column on desktop)
- Language settings reflect **MVP priorities** (Korean, Mandarin first)
- Audio settings prepare for **BONUS feature** (TTS)
- Privacy controls are **transparent** (show data usage)
- Advanced settings are **collapsed** to avoid confusion
- Save/discard actions are **always visible**
- Unsaved changes warning prevents **accidental loss**
