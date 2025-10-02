import nlp from 'compromise';
import {
  SupportedLanguagePair,
  SUPPORTED_LANGUAGES,
  LanguageConfig
} from '../types/language';

interface NounTranslation {
  primary: string;
  secondary: string;
  frequency: number;
}

interface EnhancedStoryPair {
  primaryStory: string;
  secondaryStory: string;
  extractedNouns: NounTranslation[];
  sentences: {
    primary: string[];
    secondary: string[];
  };
}

interface BlendingOptions {
  level: number; // 0-10
  theme: string;
  languagePair: SupportedLanguagePair;
}

/**
 * Universal Language Blender - supports any language pair configuration
 * Dynamically loads translation dictionaries and applies systematic blending
 */
class UniversalLanguageBlender {
  private languageConfig: LanguageConfig;
  private translationDictionaries: Map<SupportedLanguagePair, Record<string, string>>;

  constructor() {
    this.translationDictionaries = new Map();
    this.initializeTranslationDictionaries();
  }

  /**
   * Initialize translation dictionaries for supported language pairs
   */
  private initializeTranslationDictionaries(): void {
    // Korean translations (original dataset)
    this.translationDictionaries.set('en-ko', {
      // Family & People
      'family': '가족', 'mother': '어머니', 'father': '아버지',
      'sister': '자매', 'brother': '형제', 'friend': '친구',
      'teacher': '선생님', 'student': '학생', 'child': '아이',
      'children': '아이들', 'boy': '소년', 'girl': '소녀', 'baby': '아기',

      // Animals
      'dog': '개', 'cat': '고양이', 'bird': '새', 'fish': '물고기',
      'rabbit': '토끼', 'bear': '곰', 'elephant': '코끼리',
      'lion': '사자', 'tiger': '호랑이', 'horse': '말',
      'cow': '소', 'pig': '돼지',

      // Nature & Places
      'tree': '나무', 'flower': '꽃', 'mountain': '산', 'river': '강',
      'ocean': '바다', 'forest': '숲', 'park': '공원', 'garden': '정원',
      'beach': '해변', 'sky': '하늘', 'sun': '태양', 'moon': '달',
      'star': '별', 'cloud': '구름',

      // Food
      'food': '음식', 'rice': '밥', 'bread': '빵', 'water': '물',
      'milk': '우유', 'apple': '사과', 'banana': '바나나',
      'cake': '케이크', 'cookie': '쿠키', 'candy': '사탕',
      'chocolate': '초콜릿',

      // Colors
      'red': '빨간색', 'blue': '파란색', 'green': '초록색',
      'yellow': '노란색', 'purple': '보라색', 'orange': '주황색',
      'pink': '분홍색', 'black': '검은색', 'white': '흰색',
      'brown': '갈색',

      // Time
      'morning': '아침', 'afternoon': '오후', 'evening': '저녁',
      'night': '밤', 'day': '낮', 'today': '오늘',
      'tomorrow': '내일', 'yesterday': '어제'
    });

    // Spanish translations
    this.translationDictionaries.set('en-es', {
      // Family & People
      'family': 'familia', 'mother': 'madre', 'father': 'padre',
      'sister': 'hermana', 'brother': 'hermano', 'friend': 'amigo',
      'teacher': 'maestro', 'student': 'estudiante', 'child': 'niño',
      'children': 'niños', 'boy': 'niño', 'girl': 'niña', 'baby': 'bebé',

      // Animals
      'dog': 'perro', 'cat': 'gato', 'bird': 'pájaro', 'fish': 'pez',
      'rabbit': 'conejo', 'bear': 'oso', 'elephant': 'elefante',
      'lion': 'león', 'tiger': 'tigre', 'horse': 'caballo',
      'cow': 'vaca', 'pig': 'cerdo',

      // Nature & Places
      'tree': 'árbol', 'flower': 'flor', 'mountain': 'montaña', 'river': 'río',
      'ocean': 'océano', 'forest': 'bosque', 'park': 'parque', 'garden': 'jardín',
      'beach': 'playa', 'sky': 'cielo', 'sun': 'sol', 'moon': 'luna',
      'star': 'estrella', 'cloud': 'nube',

      // Food
      'food': 'comida', 'rice': 'arroz', 'bread': 'pan', 'water': 'agua',
      'milk': 'leche', 'apple': 'manzana', 'banana': 'plátano',
      'cake': 'pastel', 'cookie': 'galleta', 'candy': 'dulce',
      'chocolate': 'chocolate',

      // Colors
      'red': 'rojo', 'blue': 'azul', 'green': 'verde',
      'yellow': 'amarillo', 'purple': 'morado', 'orange': 'naranja',
      'pink': 'rosa', 'black': 'negro', 'white': 'blanco',
      'brown': 'marrón',

      // Time
      'morning': 'mañana', 'afternoon': 'tarde', 'evening': 'tarde',
      'night': 'noche', 'day': 'día', 'today': 'hoy',
      'tomorrow': 'mañana', 'yesterday': 'ayer'
    });

    // Chinese translations (simplified)
    this.translationDictionaries.set('en-zh', {
      // Family & People
      'family': '家庭', 'mother': '妈妈', 'father': '爸爸',
      'sister': '姐妹', 'brother': '兄弟', 'friend': '朋友',
      'teacher': '老师', 'student': '学生', 'child': '孩子',
      'children': '孩子们', 'boy': '男孩', 'girl': '女孩', 'baby': '宝宝',
      'person': '人', 'people': '人们',

      // Animals
      'dog': '狗', 'cat': '猫', 'bird': '鸟', 'fish': '鱼',
      'rabbit': '兔子', 'bear': '熊', 'elephant': '大象',
      'lion': '狮子', 'tiger': '老虎', 'horse': '马',
      'cow': '牛', 'pig': '猪', 'fox': '狐狸', 'deer': '鹿',
      'turtle': '乌龟', 'butterfly': '蝴蝶', 'bee': '蜜蜂',

      // Nature & Places
      'tree': '树', 'flower': '花', 'mountain': '山', 'river': '河',
      'ocean': '海洋', 'forest': '森林', 'park': '公园', 'garden': '花园',
      'beach': '海滩', 'sky': '天空', 'sun': '太阳', 'moon': '月亮',
      'star': '星星', 'cloud': '云', 'lake': '湖', 'island': '岛',
      'field': '田野', 'rain': '雨', 'snow': '雪', 'wind': '风',

      // Food
      'food': '食物', 'rice': '米饭', 'bread': '面包', 'water': '水',
      'milk': '牛奶', 'apple': '苹果', 'banana': '香蕉',
      'cake': '蛋糕', 'cookie': '饼干', 'candy': '糖果',
      'chocolate': '巧克力', 'meat': '肉', 'cheese': '奶酪',
      'vegetable': '蔬菜', 'fruit': '水果', 'tea': '茶', 'coffee': '咖啡',

      // Colors
      'red': '红色', 'blue': '蓝色', 'green': '绿色',
      'yellow': '黄色', 'purple': '紫色', 'orange': '橙色',
      'pink': '粉色', 'black': '黑色', 'white': '白色',
      'brown': '棕色', 'gray': '灰色',

      // Time
      'morning': '早上', 'afternoon': '下午', 'evening': '晚上',
      'night': '夜晚', 'day': '白天', 'today': '今天',
      'tomorrow': '明天', 'yesterday': '昨天', 'week': '星期',
      'month': '月', 'year': '年', 'season': '季节',

      // Places & Buildings
      'house': '房子', 'school': '学校', 'store': '商店',
      'library': '图书馆', 'hospital': '医院', 'restaurant': '餐厅',
      'station': '车站', 'airport': '机场', 'city': '城市',
      'village': '村庄', 'country': '国家',

      // Objects & Things
      'book': '书', 'pen': '笔', 'paper': '纸',
      'bag': '包', 'car': '车', 'bicycle': '自行车',
      'train': '火车', 'bus': '公共汽车', 'boat': '船',
      'airplane': '飞机', 'door': '门', 'window': '窗户',
      'chair': '椅子', 'table': '桌子', 'bed': '床',

      // Actions & Verbs
      'go': '去', 'come': '来', 'see': '看见',
      'look': '看', 'eat': '吃', 'drink': '喝',
      'sleep': '睡觉', 'walk': '走', 'run': '跑',
      'play': '玩', 'read': '读', 'write': '写',
      'speak': '说', 'listen': '听', 'think': '想',
      'make': '做', 'give': '给', 'take': '拿',

      // Adjectives & Descriptions
      'big': '大', 'small': '小', 'good': '好',
      'bad': '坏', 'new': '新', 'old': '旧',
      'happy': '高兴', 'sad': '悲伤', 'beautiful': '美丽',
      'fun': '有趣', 'interesting': '有意思', 'easy': '容易',
      'difficult': '困难', 'hot': '热', 'cold': '冷',
      'warm': '暖和', 'cool': '凉爽', 'fast': '快',
      'slow': '慢', 'strong': '强', 'weak': '弱'
    });

    // Japanese translations (Hiragana/Katakana/Kanji mix)
    this.translationDictionaries.set('en-ja', {
      // Family & People
      'family': '家族', 'mother': 'お母さん', 'father': 'お父さん',
      'sister': '姉妹', 'brother': '兄弟', 'friend': '友達',
      'teacher': '先生', 'student': '学生', 'child': '子供',
      'children': '子供たち', 'boy': '男の子', 'girl': '女の子', 'baby': '赤ちゃん',
      'person': '人', 'people': '人々',

      // Animals
      'dog': '犬', 'cat': '猫', 'bird': '鳥', 'fish': '魚',
      'rabbit': 'うさぎ', 'bear': '熊', 'elephant': '象',
      'lion': 'ライオン', 'tiger': '虎', 'horse': '馬',
      'cow': '牛', 'pig': '豚', 'fox': '狐', 'deer': '鹿',
      'turtle': '亀', 'butterfly': '蝶', 'bee': '蜂',

      // Nature & Places
      'tree': '木', 'flower': '花', 'mountain': '山', 'river': '川',
      'ocean': '海', 'forest': '森', 'park': '公園', 'garden': '庭',
      'beach': '海辺', 'sky': '空', 'sun': '太陽', 'moon': '月',
      'star': '星', 'cloud': '雲', 'lake': '湖', 'island': '島',
      'field': '野原', 'rain': '雨', 'snow': '雪', 'wind': '風',

      // Food
      'food': '食べ物', 'rice': 'ご飯', 'bread': 'パン', 'water': '水',
      'milk': '牛乳', 'apple': 'りんご', 'banana': 'バナナ',
      'cake': 'ケーキ', 'cookie': 'クッキー', 'candy': '飴',
      'chocolate': 'チョコレート', 'fish': '魚', 'meat': '肉',
      'vegetable': '野菜', 'fruit': '果物', 'tea': 'お茶',

      // Colors
      'red': '赤', 'blue': '青', 'green': '緑',
      'yellow': '黄色', 'purple': '紫', 'orange': 'オレンジ',
      'pink': 'ピンク', 'black': '黒', 'white': '白',
      'brown': '茶色', 'gray': '灰色',

      // Time
      'morning': '朝', 'afternoon': '午後', 'evening': '夕方',
      'night': '夜', 'day': '日', 'today': '今日',
      'tomorrow': '明日', 'yesterday': '昨日', 'week': '週',
      'month': '月', 'year': '年', 'season': '季節',

      // Places & Buildings
      'house': '家', 'school': '学校', 'store': '店',
      'library': '図書館', 'hospital': '病院', 'restaurant': 'レストラン',
      'station': '駅', 'airport': '空港', 'city': '都市',
      'village': '村', 'country': '国',

      // Objects & Things
      'book': '本', 'pen': 'ペン', 'paper': '紙',
      'bag': 'かばん', 'car': '車', 'bicycle': '自転車',
      'train': '電車', 'bus': 'バス', 'boat': '船',
      'airplane': '飛行機', 'door': 'ドア', 'window': '窓',
      'chair': '椅子', 'table': 'テーブル', 'bed': 'ベッド',

      // Actions & Verbs
      'go': '行く', 'come': '来る', 'see': '見る',
      'look': '見る', 'eat': '食べる', 'drink': '飲む',
      'sleep': '寝る', 'walk': '歩く', 'run': '走る',
      'play': '遊ぶ', 'read': '読む', 'write': '書く',
      'speak': '話す', 'listen': '聞く', 'think': '考える',
      'make': '作る', 'give': 'あげる', 'take': '取る',

      // Adjectives & Descriptions
      'big': '大きい', 'small': '小さい', 'good': '良い',
      'bad': '悪い', 'new': '新しい', 'old': '古い',
      'happy': '嬉しい', 'sad': '悲しい', 'beautiful': '美しい',
      'fun': '楽しい', 'interesting': '面白い', 'easy': '簡単',
      'difficult': '難しい', 'hot': '暑い', 'cold': '寒い',
      'warm': '暖かい', 'cool': '涼しい', 'fast': '速い',
      'slow': '遅い', 'strong': '強い', 'weak': '弱い'
    });

    // Italian translations
    this.translationDictionaries.set('en-it', {
      // Family & People
      'family': 'famiglia', 'mother': 'mamma', 'father': 'papà',
      'sister': 'sorella', 'brother': 'fratello', 'friend': 'amico',
      'teacher': 'insegnante', 'student': 'studente', 'child': 'bambino',
      'children': 'bambini', 'boy': 'ragazzo', 'girl': 'ragazza', 'baby': 'neonato',
      'person': 'persona', 'people': 'persone',

      // Animals
      'dog': 'cane', 'cat': 'gatto', 'bird': 'uccello', 'fish': 'pesce',
      'rabbit': 'coniglio', 'bear': 'orso', 'elephant': 'elefante',
      'lion': 'leone', 'tiger': 'tigre', 'horse': 'cavallo',
      'cow': 'mucca', 'pig': 'maiale', 'fox': 'volpe', 'deer': 'cervo',
      'turtle': 'tartaruga', 'butterfly': 'farfalla', 'bee': 'ape',

      // Nature & Places
      'tree': 'albero', 'flower': 'fiore', 'mountain': 'montagna', 'river': 'fiume',
      'ocean': 'oceano', 'forest': 'foresta', 'park': 'parco', 'garden': 'giardino',
      'beach': 'spiaggia', 'sky': 'cielo', 'sun': 'sole', 'moon': 'luna',
      'star': 'stella', 'cloud': 'nuvola', 'lake': 'lago', 'island': 'isola',
      'field': 'campo', 'rain': 'pioggia', 'snow': 'neve', 'wind': 'vento',

      // Food
      'food': 'cibo', 'rice': 'riso', 'bread': 'pane', 'water': 'acqua',
      'milk': 'latte', 'apple': 'mela', 'banana': 'banana',
      'cake': 'torta', 'cookie': 'biscotto', 'candy': 'caramella',
      'chocolate': 'cioccolato', 'meat': 'carne', 'cheese': 'formaggio',
      'vegetable': 'verdura', 'fruit': 'frutta', 'tea': 'tè', 'coffee': 'caffè',

      // Colors
      'red': 'rosso', 'blue': 'blu', 'green': 'verde',
      'yellow': 'giallo', 'purple': 'viola', 'orange': 'arancione',
      'pink': 'rosa', 'black': 'nero', 'white': 'bianco',
      'brown': 'marrone', 'gray': 'grigio',

      // Time
      'morning': 'mattina', 'afternoon': 'pomeriggio', 'evening': 'sera',
      'night': 'notte', 'day': 'giorno', 'today': 'oggi',
      'tomorrow': 'domani', 'yesterday': 'ieri', 'week': 'settimana',
      'month': 'mese', 'year': 'anno', 'season': 'stagione',

      // Places & Buildings
      'house': 'casa', 'school': 'scuola', 'store': 'negozio',
      'library': 'biblioteca', 'hospital': 'ospedale', 'restaurant': 'ristorante',
      'station': 'stazione', 'airport': 'aeroporto', 'city': 'città',
      'village': 'villaggio', 'country': 'paese',

      // Objects & Things
      'book': 'libro', 'pen': 'penna', 'paper': 'carta',
      'bag': 'borsa', 'car': 'macchina', 'bicycle': 'bicicletta',
      'train': 'treno', 'bus': 'autobus', 'boat': 'barca',
      'airplane': 'aereo', 'door': 'porta', 'window': 'finestra',
      'chair': 'sedia', 'table': 'tavolo', 'bed': 'letto',

      // Actions & Verbs
      'go': 'andare', 'come': 'venire', 'see': 'vedere',
      'look': 'guardare', 'eat': 'mangiare', 'drink': 'bere',
      'sleep': 'dormire', 'walk': 'camminare', 'run': 'correre',
      'play': 'giocare', 'read': 'leggere', 'write': 'scrivere',
      'speak': 'parlare', 'listen': 'ascoltare', 'think': 'pensare',
      'make': 'fare', 'give': 'dare', 'take': 'prendere',

      // Adjectives & Descriptions
      'big': 'grande', 'small': 'piccolo', 'good': 'buono',
      'bad': 'cattivo', 'new': 'nuovo', 'old': 'vecchio',
      'happy': 'felice', 'sad': 'triste', 'beautiful': 'bello',
      'fun': 'divertente', 'interesting': 'interessante', 'easy': 'facile',
      'difficult': 'difficile', 'hot': 'caldo', 'cold': 'freddo',
      'warm': 'caldo', 'cool': 'fresco', 'fast': 'veloce',
      'slow': 'lento', 'strong': 'forte', 'weak': 'debole'
    });

    // Arabic translations
    this.translationDictionaries.set('en-ar', {
      // Family & People
      'family': 'عائلة', 'mother': 'أم', 'father': 'أب',
      'sister': 'أخت', 'brother': 'أخ', 'friend': 'صديق',
      'teacher': 'معلم', 'student': 'طالب', 'child': 'طفل',
      'children': 'أطفال', 'boy': 'ولد', 'girl': 'بنت', 'baby': 'طفل رضيع',

      // Animals
      'dog': 'كلب', 'cat': 'قطة', 'bird': 'طائر', 'fish': 'سمك',
      'rabbit': 'أرنب', 'bear': 'دب', 'elephant': 'فيل',
      'lion': 'أسد', 'tiger': 'نمر', 'horse': 'حصان',
      'cow': 'بقرة', 'pig': 'خنزير',

      // Nature & Places
      'tree': 'شجرة', 'flower': 'زهرة', 'mountain': 'جبل', 'river': 'نهر',
      'ocean': 'محيط', 'forest': 'غابة', 'park': 'حديقة', 'garden': 'بستان',
      'beach': 'شاطئ', 'sky': 'سماء', 'sun': 'شمس', 'moon': 'قمر',
      'star': 'نجمة', 'cloud': 'سحابة',

      // Food
      'food': 'طعام', 'rice': 'أرز', 'bread': 'خبز', 'water': 'ماء',
      'milk': 'حليب', 'apple': 'تفاحة', 'banana': 'موز',
      'cake': 'كعكة', 'cookie': 'بسكويت', 'candy': 'حلوى',
      'chocolate': 'شوكولاتة',

      // Colors
      'red': 'أحمر', 'blue': 'أزرق', 'green': 'أخضر',
      'yellow': 'أصفر', 'purple': 'بنفسجي', 'orange': 'برتقالي',
      'pink': 'وردي', 'black': 'أسود', 'white': 'أبيض',
      'brown': 'بني',

      // Time
      'morning': 'صباح', 'afternoon': 'بعد الظهر', 'evening': 'مساء',
      'night': 'ليل', 'day': 'يوم', 'today': 'اليوم',
      'tomorrow': 'غدا', 'yesterday': 'أمس'
    });
  }

  /**
   * Set the current language configuration
   */
  setLanguagePair(languagePair: SupportedLanguagePair): void {
    this.languageConfig = SUPPORTED_LANGUAGES[languagePair];
  }

  /**
   * Extract nouns from text using Compromise.js
   */
  extractNouns(text: string, languagePair: SupportedLanguagePair): NounTranslation[] {
    const doc = nlp(text);
    const nouns = doc.nouns().out('array');
    const translations = this.translationDictionaries.get(languagePair) || {};

    // Count frequency and get translations
    const nounFrequency: Record<string, number> = {};
    nouns.forEach(noun => {
      const normalized = noun.toLowerCase().replace(/[^a-z]/g, '');
      if (normalized.length > 2) {
        nounFrequency[normalized] = (nounFrequency[normalized] || 0) + 1;
      }
    });

    // Convert to NounTranslation array
    return Object.entries(nounFrequency)
      .map(([primary, frequency]) => {
        const secondary = translations[primary] || this.generateSecondaryTranslation(primary, languagePair);
        return { primary, secondary, frequency };
      })
      .filter(noun => noun.secondary !== noun.primary)
      .sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Fallback translation generation
   */
  private generateSecondaryTranslation(primary: string, languagePair: SupportedLanguagePair): string {
    // For now, return the primary word if no translation exists
    // In a real implementation, this could call a translation API
    return primary;
  }

  /**
   * Split text into sentences
   */
  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0);
  }

  /**
   * Apply noun translations to text with proper hint formatting
   * Returns text with hint patterns that will be formatted by LanguageHintFormatter
   */
  private applyNounTranslations(
    text: string,
    nouns: NounTranslation[],
    percentage: number,
    languagePair: SupportedLanguagePair
  ): string {
    let result = text;
    const nounsToUse = nouns.slice(0, Math.ceil(nouns.length * (percentage / 100)));
    const languageConfig = SUPPORTED_LANGUAGES[languagePair];

    nounsToUse.forEach(noun => {
      const regex = new RegExp(`\\b${noun.primary}\\b`, 'gi');

      // Apply systematic hint formatting - creates patterns for LanguageHintFormatter
      const hintText = languageConfig.secondary.hasRomanization
        ? `${noun.secondary}` // Could add romanization here if available
        : noun.secondary;

      // Use consistent pattern that LanguageHintFormatter expects
      result = result.replace(regex, `${noun.primary} (${hintText})`);
    });

    return result;
  }

  /**
   * Generate enhanced story pair with proper language support
   */
  async generateEnhancedStoryPair(
    primaryStory: string,
    languagePair: SupportedLanguagePair
  ): Promise<EnhancedStoryPair> {
    this.setLanguagePair(languagePair);

    // Extract nouns from primary story
    const extractedNouns = this.extractNouns(primaryStory, languagePair);

    // Split into sentences
    const primarySentences = this.splitIntoSentences(primaryStory);

    // Generate secondary language version
    const secondarySentences = await this.translateSentences(primarySentences, languagePair);

    return {
      primaryStory,
      secondaryStory: secondarySentences.join(' '),
      extractedNouns,
      sentences: {
        primary: primarySentences,
        secondary: secondarySentences
      }
    };
  }

  /**
   * Mock translation service (replace with real translation API)
   */
  private async translateSentences(
    primarySentences: string[],
    languagePair: SupportedLanguagePair
  ): Promise<string[]> {
    const translations = this.translationDictionaries.get(languagePair) || {};

    return primarySentences.map(sentence => {
      let translated = sentence;
      Object.entries(translations).forEach(([primary, secondary]) => {
        const regex = new RegExp(`\\b${primary}\\b`, 'gi');
        translated = translated.replace(regex, secondary);
      });
      return translated;
    });
  }

  /**
   * Apply universal 10-level blending system
   */
  applyUniversalBlending(
    storyPair: EnhancedStoryPair,
    level: number,
    languagePair: SupportedLanguagePair
  ): string {
    const { sentences, extractedNouns } = storyPair;
    const languageConfig = SUPPORTED_LANGUAGES[languagePair];

    switch (level) {
      case 0: // 100% Primary
        return sentences.primary.join(' ');

      case 1: // Primary + 10% hints
        return this.blendSentences(sentences.primary, sentences.secondary, {
          primaryPercentage: 100,
          secondaryPercentage: 0,
          hintPercentage: 10,
          nouns: extractedNouns,
          languagePair
        });

      case 2: // Primary + 25% hints
        return this.blendSentences(sentences.primary, sentences.secondary, {
          primaryPercentage: 100,
          secondaryPercentage: 0,
          hintPercentage: 25,
          nouns: extractedNouns,
          languagePair
        });

      case 3: // Primary + 50% hints
        return this.blendSentences(sentences.primary, sentences.secondary, {
          primaryPercentage: 100,
          secondaryPercentage: 0,
          hintPercentage: 50,
          nouns: extractedNouns,
          languagePair
        });

      case 4: // Primary + 75% hints + some sentence mixing
        return this.blendSentences(sentences.primary, sentences.secondary, {
          primaryPercentage: 85,
          secondaryPercentage: 15,
          hintPercentage: 75,
          nouns: extractedNouns,
          languagePair,
          alternateEvery: 4
        });

      case 5: // 50/50 sentence alternation
        return this.blendSentences(sentences.primary, sentences.secondary, {
          primaryPercentage: 50,
          secondaryPercentage: 50,
          hintPercentage: 60,
          nouns: extractedNouns,
          languagePair,
          alternateEvery: 2
        });

      case 6: // Secondary dominant + primary hints
        return this.blendSentences(sentences.primary, sentences.secondary, {
          primaryPercentage: 15,
          secondaryPercentage: 85,
          hintPercentage: 75,
          nouns: extractedNouns,
          languagePair,
          alternateEvery: 4,
          reverseHints: true
        });

      case 7: // Secondary + 50% primary hints
        return this.blendSentences(sentences.primary, sentences.secondary, {
          primaryPercentage: 0,
          secondaryPercentage: 100,
          hintPercentage: 50,
          nouns: extractedNouns,
          languagePair,
          reverseHints: true
        });

      case 8: // Secondary + 25% primary hints
        return this.blendSentences(sentences.primary, sentences.secondary, {
          primaryPercentage: 0,
          secondaryPercentage: 100,
          hintPercentage: 25,
          nouns: extractedNouns,
          languagePair,
          reverseHints: true
        });

      case 9: // Secondary + 10% primary hints
        return this.blendSentences(sentences.primary, sentences.secondary, {
          primaryPercentage: 0,
          secondaryPercentage: 100,
          hintPercentage: 10,
          nouns: extractedNouns,
          languagePair,
          reverseHints: true
        });

      case 10: // 100% Secondary
        return sentences.secondary.join(' ');

      default:
        return sentences.primary.join(' ');
    }
  }

  /**
   * Advanced sentence blending logic
   */
  private blendSentences(
    primarySentences: string[],
    secondarySentences: string[],
    options: {
      primaryPercentage: number;
      secondaryPercentage: number;
      hintPercentage?: number;
      nouns: NounTranslation[];
      languagePair: SupportedLanguagePair;
      alternateEvery?: number;
      reverseHints?: boolean;
    }
  ): string {
    const result: string[] = [];

    for (let i = 0; i < primarySentences.length; i++) {
      let sentence: string;

      // Determine if this sentence should be secondary or primary
      if (options.alternateEvery) {
        const useSecondary = (i % options.alternateEvery) < (options.alternateEvery * (options.secondaryPercentage / 100));
        sentence = useSecondary ? secondarySentences[i] : primarySentences[i];

        // Add hints to the chosen sentence
        if (options.hintPercentage) {
          if (options.reverseHints) {
            // Add primary hints to secondary sentences or secondary hints to primary sentences
            sentence = useSecondary
              ? this.applyReverseHints(sentence, options.nouns, options.hintPercentage)
              : this.applyNounTranslations(sentence, options.nouns, options.hintPercentage, options.languagePair);
          } else {
            // Normal hints (secondary language hints in primary text)
            if (!useSecondary) {
              sentence = this.applyNounTranslations(sentence, options.nouns, options.hintPercentage, options.languagePair);
            }
          }
        }
      } else {
        // Use percentage-based selection
        const useSecondary = Math.random() < (options.secondaryPercentage / 100);
        sentence = useSecondary ? secondarySentences[i] : primarySentences[i];

        if (options.hintPercentage && !useSecondary) {
          sentence = this.applyNounTranslations(sentence, options.nouns, options.hintPercentage, options.languagePair);
        }
      }

      result.push(sentence);
    }

    return result.join(' ');
  }

  /**
   * Apply reverse hints (primary language hints in secondary text)
   * Returns text with hint patterns that will be formatted by LanguageHintFormatter
   */
  private applyReverseHints(secondaryText: string, nouns: NounTranslation[], percentage: number): string {
    let result = secondaryText;
    const nounsToUse = nouns.slice(0, Math.ceil(nouns.length * (percentage / 100)));

    nounsToUse.forEach(noun => {
      const regex = new RegExp(`\\b${noun.secondary}\\b`, 'gi');
      // Use consistent pattern that LanguageHintFormatter expects
      result = result.replace(regex, `${noun.secondary} (${noun.primary})`);
    });

    return result;
  }

  /**
   * Get level description for any language pair
   */
  getLevelDescription(level: number, languagePair: SupportedLanguagePair): string {
    const config = SUPPORTED_LANGUAGES[languagePair];
    const primaryName = config.primary.name;
    const secondaryName = config.secondary.name;

    const descriptions = [
      `Pure ${primaryName} (100% ${primaryName})`,
      `${primaryName} + ${secondaryName} vocabulary hints (10% words)`,
      `${primaryName} + ${secondaryName} vocabulary hints (25% words)`,
      `${primaryName} + ${secondaryName} vocabulary hints (50% words)`,
      `${primaryName} + ${secondaryName} vocabulary hints (75% words) + some sentence mixing`,
      `Alternating sentences (50/50) + vocabulary support`,
      `${secondaryName} dominant + ${primaryName} vocabulary hints (75% words)`,
      `${secondaryName} + ${primaryName} vocabulary hints (50% words)`,
      `${secondaryName} + ${primaryName} vocabulary hints (25% words)`,
      `${secondaryName} + ${primaryName} vocabulary hints (10% words)`,
      `Pure ${secondaryName} (100% ${secondaryName})`
    ];

    return descriptions[level] || descriptions[0];
  }
}

export const universalLanguageBlender = new UniversalLanguageBlender();
export type { EnhancedStoryPair, NounTranslation, BlendingOptions };