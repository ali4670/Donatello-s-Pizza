import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Lang = 'en' | 'ar';

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: Record<string, string>;
  dir: 'ltr' | 'rtl';
}

const translations = {
  en: {
    // Navbar
    menu: 'Menu',
    ourStory: 'Our Story',
    locations: 'Locations',
    contact: 'Contact',
    orderNow: 'Order Now',
    yourOrder: 'Your Order',

    // Home
    heroTitle: 'Fresh. Fearless. Pizza.',
    heroDesc: "We craft radical pies with bold flavors that don't just satisfy cravings — they're legendary.",
    heroSub: 'Est. 2014 — Radical Pizza',
    cowabunga: 'COWABUNGA!',
    exploreMenu: 'Explore Menu',

    // Stats
    pizzasServed: 'Pizzas Served',
    starRating: 'Star Rating',
    radicalYears: 'Radical Years',

    // Features
    whyDifferent: "Why We're Different",
    radicalPizza: 'Radical Pizza,',
    radicalProcess: 'Radical Process',
    handcraftedDough: 'Handcrafted Dough',
    handcraftedDoughDesc: 'Every dough is hand-stretched and proofed for 24 hours for the perfect texture.',
    woodFiredOven: 'Wood-Fired Oven',
    woodFiredOvenDesc: 'Cooked at 800°F for that authentic crispy-on-the-outside, tender-on-the-inside bite.',
    freshIngredients: 'Fresh Ingredients',
    freshIngredientsDesc: 'Locally sourced produce, imported Italian cheeses, and house-made sauces.',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'Hot and fresh to your door in 30 minutes or less. Every time.',

    // Featured
    fanFavorites: 'Fan Favorites',
    mostWanted: 'Our Most Wanted',
    addToOrder: 'Add to Order',
    viewFullMenu: 'View Full Menu',

    // Testimonials
    whatFansSay: 'What Our Fans Say',
    radicalReviews: 'Radical Reviews',

    // Info bar
    openDaily: 'Open Daily 11AM — 11PM',
    threeLocations: '3 Locations Across the City',
    freeDeliveryOver: 'Free Delivery Over $25',

    // CTA
    readyForBest: 'Ready for the Best Pizza of Your Life?',
    ctaDesc: 'Order online for pickup or delivery. Your radical pizza experience awaits.',
    findLocation: 'Find a Location',

    // Menu
    handcraftedPies: 'Handcrafted Pies',
    menuDesc: 'Tap any pizza to choose your size, add-ons, and special notes.',
    all: 'All',
    signature: 'Signature',
    classics: 'Classics',
    specialty: 'Specialty',
    customizeAndAdd: 'Customize & Add',

    // Pizza Modal
    chooseSize: 'Choose Size',
    addons: 'Add-ons',
    specialNotes: 'Special Notes',
    notesPlaceholder: 'Extra crispy, light sauce, no onions...',
    addedToOrder: 'Added to Order!',

    // Sizes
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    xl: 'XL',
    base: 'Base',

    // Addons
    extraCheese: 'Extra Cheese',
    pepperoni: 'Pepperoni',
    mushrooms: 'Mushrooms',
    olives: 'Olives',
    jalapenos: 'Jalapeños',
    bacon: 'Bacon',
    pineapple: 'Pineapple',
    truffleOil: 'Truffle Oil',

    // Order page
    review: 'Review',
    backToMenu: 'Back to Menu',
    item: 'item',
    items: 'items',
    cartEmpty: 'Your cart is empty',
    cartEmptyDesc: "Looks like you haven't added any radical slices yet. Head to the menu to get started.",
    browseMenu: 'Browse Menu',
    subtotal: 'Subtotal',
    delivery: 'Delivery',
    free: 'Free',
    total: 'Total',
    checkout: 'Checkout',
    clearAll: 'Clear All',

    // Checkout
    almostThere: 'Almost there',
    contactDetails: 'Contact Details',
    fullName: 'Full Name *',
    phoneNumber: 'Phone Number *',
    altPhone: 'Alternative Phone (optional)',
    deliveryAddress: 'Delivery Address',
    streetAddress: 'Street Address *',
    apartmentFloor: 'Apartment / Floor',
    city: 'City *',
    landmark: 'Nearby Landmark (optional)',
    deliveryTime: 'Delivery Time',
    asap: 'ASAP',
    min30: '30-45 min',
    hour1: '1 Hour',
    min60: '60 min',
    hours2: '2 Hours',
    min120: '120 min',
    later: 'Later',
    pickTime: 'Pick time',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery',
    creditDebit: 'Credit / Debit Card',
    mobilePayment: 'Mobile Payment',
    orderNotes: 'Order Notes',
    orderNotesPlaceholder: 'Any special instructions for delivery? (optional)',
    orderSummary: 'Order Summary',
    placeOrder: 'Place Order',
    nameRequired: 'Name is required',
    phoneRequired: 'Phone number is required',
    invalidPhone: 'Enter a valid phone number',
    addressRequired: 'Delivery address is required',
    cityRequired: 'City is required',

    // Success
    orderPlaced: 'Order Placed!',
    orderPlacedDesc: 'Thanks, {name}! Your radical pizza is on its way.',
    totalPaid: 'Total Paid',
    backToHome: 'Back to Home',
    nothingToCheckout: 'Nothing to Checkout',
    nothingToCheckoutDesc: 'Your cart is empty. Add some items first.',

    // Footer
    tagline: 'Radical pizza crafted with fearless flavors. Every slice is a masterpiece worth savoring.',
    ourMenu: 'Our Menu',
    giftCards: 'Gift Cards',
    aboutUs: 'About Us',
    careers: 'Careers',
    press: 'Press',
    stayRadical: 'Stay Radical',
    newsletterDesc: 'Get exclusive deals and new flavor drops straight to your inbox.',
    join: 'Join',
    copyright: '© 2026 Donatello\'s Pizza. All rights reserved.',
    crafted: 'Crafted with radical love',
    explore: 'Explore',
    company: 'Company',

    // Story
    ourStoryTitle: 'Our Story',
    storyDesc: 'From a small kitchen to the city\'s favorite pizza spot.',
    bornFromPassion: 'Born from Passion,',
    fueledByFlavor: 'Fueled by Flavor',
    storyIntro: 'What started as a late-night pizza experiment in a tiny kitchen has grown into a movement. We believe pizza should be fearless, crafted with intention, and shared with the people you love.',
    theOrigin: 'The Origin',
    kitchenDream: 'A Kitchen, A Dream, A Pizza Revolution',
    storyP1: 'It all started when our founder, armed with a generations-old dough recipe and a rebellious spirit, decided that the world deserved better pizza. Not the bland, mass-produced cardboard that dominated delivery apps — but real, handcrafted, flavor-packed pies that make you close your eyes on the first bite.',
    storyP2: 'The name "Donatello" came from the idea of artistry — just like the Renaissance master, we approach every pizza as a canvas. Bold colors, unexpected combinations, and uncompromising quality.',
    tasteDifference: 'Taste the Difference',
    whatDrivesUs: 'What Drives Us',
    ourValues: 'Our Values',
    boldFlavors: 'Bold Flavors',
    boldFlavorsDesc: 'We don\'t play it safe. Every pie is an explosion of taste that pushes boundaries.',
    madeWithLove: 'Made with Love',
    madeWithLoveDesc: 'Each dough is hand-stretched, each sauce is simmered for hours. Craft matters.',
    communityFirst: 'Community First',
    communityFirstDesc: 'We\'re not just a pizzeria — we\'re your neighborhood gathering spot.',
    freshIngredientsVal: 'Fresh Ingredients',
    freshIngredientsValDesc: 'Locally sourced produce, imported Italian cheeses, and house-made everything.',
    theJourney: 'The Journey',
    howWeGotHere: 'How We Got Here',
    readyToTaste: 'Ready to Taste the Magic?',
    readyToTasteDesc: 'Order online for pickup or delivery. Your radical pizza experience awaits.',

    // Contact
    contactTitle: 'Contact Us',
    contactDesc: 'Got questions? We\'d love to hear from you.',
    getInTouch: 'Get In Touch',
    contactIntro: 'Questions, catering requests, or just want to say hi? We\'d love to hear from you.',
    sendMessage: 'Send a Message',
    name: 'Name',
    yourName: 'Your name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    messagePlaceholder: 'Tell us what\'s on your mind...',
    send: 'Send Message',
    quickContact: 'Quick Contact',
    followUs: 'Follow Us',
    findUs: 'Find Us',

    // Locations
    locationsTitle: 'Our Locations',
    locationsDesc: 'Find the nearest Donatello\'s to you.',
    findYourSlice: 'Find Your Slice',
    locationsIntro: 'Three spots across the city, one mission: the most radical pizza you\'ve ever had.',
    orderFrom: 'Order from',
    dineIn: 'Dine-In',
    takeout: 'Takeout',
    outdoorSeating: 'Outdoor Seating',
    privateEvents: 'Private Events',
  },
  ar: {
    // Navbar
    menu: 'القائمة',
    ourStory: 'قصتنا',
    locations: 'الفروع',
    contact: 'اتصل بنا',
    orderNow: 'اطلب الآن',
    yourOrder: 'طلبك',

    // Home
    heroTitle: 'طازج. شجاع. بيتزا.',
    heroDesc: 'نصنع بيتزا جريئة بنكهات لا تشبع رغباتك فحسب — بل تصنع أسطورة.',
    heroSub: 'تأسست ٢٠١٤ — بيتزا راديكال',
    cowabunga: 'كاوابونغا!',
    exploreMenu: 'استكشف القائمة',

    // Stats
    pizzasServed: 'بيتزا مقدمة',
    starRating: 'تقييم النجوم',
    radicalYears: 'سنة راديكال',

    // Features
    whyDifferent: 'لماذا نحن مختلفون',
    radicalPizza: 'بيتزا راديكال،',
    radicalProcess: 'عملية راديكال',
    handcraftedDough: 'عجينة يدوية',
    handcraftedDoughDesc: 'كل عجينة يتم تمديدها يدوياً وتتخمر لمدة ٢٤ ساعة للحصول على القوام المثالي.',
    woodFiredOven: 'فرن حطب',
    woodFiredOvenDesc: 'تُخبز عند ٨٠٠ درجة فهرنهايت للحصول على القشرة المقرمشة من الخارج والطرية من الداخل.',
    freshIngredients: 'مكونات طازجة',
    freshIngredientsDesc: 'منتجات محلية، أجبان إيطالية مستوردة، وصلصات صنعها طهاتنا.',
    fastDelivery: 'توصيل سريع',
    fastDeliveryDesc: 'ساخنة وطازجة إلى بابك في ٣٠ دقيقة أو أقل. في كل مرة.',

    // Featured
    fanFavorites: 'المفضلة',
    mostWanted: 'الأكثر طلباً',
    addToOrder: 'أضف للطلب',
    viewFullMenu: 'عرض القائمة كاملة',

    // Testimonials
    whatFansSay: 'ماذا يقول معجبونا',
    radicalReviews: 'تقييمات راديكال',

    // Info bar
    openDaily: 'مفتوح يومياً ١١ صباحاً — ١١ مساءً',
    threeLocations: '٣ فروع في المدينة',
    freeDeliveryOver: 'توصيل مجاني فوق ٢٥$',

    // CTA
    readyForBest: 'مستعد لأفضل بيتزا في حياتك؟',
    ctaDesc: 'اطلب أونلاين للاستلام أو التوصيل. تجربة بيتزا راديكال تنتظرك.',
    findLocation: 'اعثر على فرع',

    // Menu
    handcraftedPies: 'بيتزا مصنوعة يدوياً',
    menuDesc: 'اضغط على أي بيتزا لاختيار الحجم والإضافات والملاحظات الخاصة.',
    all: 'الكل',
    signature: 'مميزة',
    classics: 'كلاسيكية',
    specialty: 'خاصة',
    customizeAndAdd: 'خصص وأضف',

    // Pizza Modal
    chooseSize: 'اختر الحجم',
    addons: 'إضافات',
    specialNotes: 'ملاحظات خاصة',
    notesPlaceholder: 'مقرمشة إضافياً، صلصة خفيفة، بدون بصل...',
    addedToOrder: 'تمت الإضافة!',

    // Sizes
    small: 'صغير',
    medium: 'متوسط',
    large: 'كبير',
    xl: 'كبير جداً',
    base: 'الأساس',

    // Addons
    extraCheese: 'جبنة إضافية',
    pepperoni: 'بيبيروني',
    mushrooms: 'فطر',
    olives: 'زيتون',
    jalapenos: 'هالابينو',
    bacon: 'بيكون',
    pineapple: 'أناناس',
    truffleOil: 'زيت الكمأة',

    // Order page
    review: 'مراجعة',
    backToMenu: 'العودة للقائمة',
    item: 'عنصر',
    items: 'عناصر',
    cartEmpty: 'سلتك فارغة',
    cartEmptyDesc: 'يبدو أنك لم تضف أي شرائح بيتزا بعد. اذهب إلى القائمة للبدء.',
    browseMenu: 'تصفح القائمة',
    subtotal: 'المجموع الفرعي',
    delivery: 'التوصيل',
    free: 'مجاني',
    total: 'الإجمالي',
    checkout: 'الدفع',
    clearAll: 'مسح الكل',

    // Checkout
    almostThere: 'تقريباً انتهيت',
    contactDetails: 'بيانات التواصل',
    fullName: 'الاسم الكامل *',
    phoneNumber: 'رقم الهاتف *',
    altPhone: 'هاتف بديل (اختياري)',
    deliveryAddress: 'عنوان التوصيل',
    streetAddress: 'عنوان الشارع *',
    apartmentFloor: 'شقة / طابق',
    city: 'المدينة *',
    landmark: 'معلم قريب (اختياري)',
    deliveryTime: 'وقت التوصيل',
    asap: 'في أسرع وقت',
    min30: '٣٠-٤٥ دقيقة',
    hour1: 'ساعة واحدة',
    min60: '٦٠ دقيقة',
    hours2: 'ساعتان',
    min120: '١٢٠ دقيقة',
    later: 'لاحقاً',
    pickTime: 'اختر وقت',
    paymentMethod: 'طريقة الدفع',
    cashOnDelivery: 'الدفع عند التوصيل',
    creditDebit: 'بطاقة ائتمان / خصم',
    mobilePayment: 'دفع عبر الهاتف',
    orderNotes: 'ملاحظات الطلب',
    orderNotesPlaceholder: 'أي تعليمات خاصة للتوصيل؟ (اختياري)',
    orderSummary: 'ملخص الطلب',
    placeOrder: 'تأكيد الطلب',
    nameRequired: 'الاسم مطلوب',
    phoneRequired: 'رقم الهاتف مطلوب',
    invalidPhone: 'أدخل رقم هاتف صحيح',
    addressRequired: 'عنوان التوصيل مطلوب',
    cityRequired: 'المدينة مطلوبة',

    // Success
    orderPlaced: 'تم الطلب!',
    orderPlacedDesc: 'شكراً {name}! بيتزا راديكال في طريقها إليك.',
    totalPaid: 'المبلغ المدفوع',
    backToHome: 'العودة للرئيسية',
    nothingToCheckout: 'لا شيء للدفع',
    nothingToCheckoutDesc: 'سلتك فارغة. أضف بعض العناصر أولاً.',

    // Footer
    tagline: 'بيتزا راديكال بنكهات شجاعة. كل شريحة تحفة فنية تستحق التذوق.',
    ourMenu: 'قائمتنا',
    giftCards: 'بطاقات هدايا',
    aboutUs: 'من نحن',
    careers: 'وظائف',
    press: 'صحافة',
    stayRadical: 'ابقَ راديكال',
    newsletterDesc: 'احصل على عروض حصرية ونكهات جديدة مباشرة إلى بريدك.',
    join: 'اشترك',
    copyright: '© ٢٠٢٦ بيتزا دوناتيلو. جميع الحقوق محفوظة.',
    crafted: 'صُنع بحب راديكال',
    explore: 'استكشف',
    company: 'الشركة',

    // Story
    ourStoryTitle: 'قصتنا',
    storyDesc: 'من مطبخ صغير إلى أشهر مطعم بيتزا في المدينة.',
    bornFromPassion: 'وُلدت من الشغف،',
    fueledByFlavor: 'مدعومة بالنكهة',
    storyIntro: 'بدأ كل شيء كتجربة بيتزا متأخرة في مطبخ صغير وتحولت إلى حركة. نؤمن أن البيتزا يجب أن تكون شجاعة، مصنوعة بقصد، ومشتركة مع من تحب.',
    theOrigin: 'البداية',
    kitchenDream: 'مطبخ، حلم، ثورة بيتزا',
    storyP1: 'بدأ كل شيء عندما قرر مؤسسنا، المسلح بعجينة وصفة قديمة وروح متمردة، أن العالم يستحق بيتزا أفضل. ليست الكرتون المسطح الذي يهيمن على تطبيقات التوصيل — بل بيتزا حقيقية، مصنوعة يدوياً، مليئة بالنكهات تجعلك تغلق عينيك عند اللقمة الأولى.',
    storyP2: 'جاء اسم "دوناتيلو" من فكرة الفنية — تماماً مثل عصر النهضة، نتعامل مع كل بيتزا كلوحة فنية. ألوان جريئة، تركيبات غير متوقعة، وجودة لا تساوم.',
    tasteDifference: 'ذوق الفرق',
    whatDrivesUs: 'ما يحركنا',
    ourValues: 'قيمنا',
    boldFlavors: 'نكهات جريئة',
    boldFlavorsDesc: 'لا نلعب على الأمان. كل فطيرة انفجار للذوق يدفع الحدود.',
    madeWithLove: 'مصنوعة بحب',
    madeWithLoveDesc: 'كل عجينة يتم تمديدها يدوياً، كل صلصة تُطهى لساعات. الحرفية مهمة.',
    communityFirst: 'المجتمع أولاً',
    communityFirstDesc: 'لسنا مجرد مطعم بيتزا — نحن مكان تجمع الحي.',
    freshIngredientsVal: 'مكونات طازجة',
    freshIngredientsValDesc: 'منتجات محلية، أجبان إيطالية مستوردة، وكل شيء صنعه طهاتنا.',
    theJourney: 'الرحلة',
    howWeGotHere: 'كيف وصلنا إلى هنا',
    readyToTaste: 'مستعد لتذوق السحر؟',
    readyToTasteDesc: 'اطلب أونلاين للاستلام أو التوصيل. تجربة بيتزا راديكال تنتظرك.',

    // Contact
    contactTitle: 'اتصل بنا',
    contactDesc: 'لديك أسئلة؟ نحب أن نسمع منك.',
    getInTouch: 'تواصل معنا',
    contactIntro: 'أسئلة، طلبات تموين، أو تريد فقط أن تقول مرحباً؟ نحب أن نسمع منك.',
    sendMessage: 'أرسل رسالة',
    name: 'الاسم',
    yourName: 'اسمك',
    email: 'البريد الإلكتروني',
    subject: 'الموضوع',
    message: 'الرسالة',
    messagePlaceholder: 'أخبرنا ما يدور في ذهنك...',
    send: 'إرسال الرسالة',
    quickContact: 'تواصل سريع',
    followUs: 'تابعنا',
    findUs: 'اعثر علينا',

    // Locations
    locationsTitle: 'فروعنا',
    locationsDesc: 'اعثر على أقرب فرع لدوناتيلو.',
    findYourSlice: 'اعثر على شريحتك',
    locationsIntro: 'ثلاثة مواقع في المدينة، مهمة واحدة: أكثر بيتزا راديكال تذوقها على الإطلاق.',
    orderFrom: 'اطلب من',
    dineIn: 'تناول في المطعم',
    takeout: 'استلام',
    outdoorSeating: 'جلوس خارجي',
    privateEvents: 'فعاليات خاصة',
  },
};

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LangContext.Provider
      value={{
        lang,
        toggleLang,
        t: translations[lang],
        dir,
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
