'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleRu?: string;
  titleAm?: string;
  summary: string;
  summaryRu?: string;
  summaryAm?: string;
  content: string;
  contentRu?: string;
  contentAm?: string;
  coverImage?: string; // base64 or URL
  tags: string[];
  category: 'care' | 'species' | 'decoration' | 'tips';
  publishedAt: string;
  readTime: number; // minutes
}

interface BlogContextType {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, 'id' | 'slug' | 'publishedAt'>) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  getPost: (slug: string) => BlogPost | undefined;
}

const defaultPosts: BlogPost[] = [
  {
    id: 'post-001',
    slug: 'how-to-care-for-monstera',
    title: 'Monstera Deliciosa: The King of Apartment Plants in Armenia',
    titleRu: 'Монстера Делициоза: Король комнатных растений в Армении',
    titleAm: 'Monstera Deliciosa. Հայաստանի բնակարանային բույսերի թագավորը',
    summary: 'The Monstera is the most beloved indoor plant in Yerevan apartments. Learn how to keep it thriving year-round in Armenia\'s climate.',
    summaryRu: 'Монстера — самое любимое комнатное растение в ереванских квартирах. Узнайте, как сохранить её здоровой круглый год в климате Армении.',
    summaryAm: 'Monstera-ն Երևանի բնակարաններում ամենասիրված սենյակային բույսն է: Իմացեք, թե ինչպես պահել այն ողջ տարին Հայաստանի կլիմայում:',
    content: `## 🌿 Why Armenians Love Monstera\n\nMonstera Deliciosa, known as the "Swiss Cheese Plant", has taken Yerevan apartments by storm. Its dramatic split leaves and fast growth make it the #1 best-selling plant at Masis Garden.\n\n## ☀️ Light Requirements\n\nMonstera thrives in **bright indirect light** — perfect for Yerevan's south-facing windows. Avoid direct midday sun in July–August which can scorch leaves. East-facing windows are ideal.\n\n## 💧 Watering in Armenia's Climate\n\nWater every **1–2 weeks** in spring and summer. During Yerevan's dry winters, reduce to every 3 weeks. Always check the top 3 cm of soil — if dry, it's time to water. Use filtered or room-temperature water.\n\n## 🌡️ Temperature & Seasonal Care\n\nMonstera loves temperatures between **18–28°C**, making it perfect for Armenian apartments year-round. In winter, keep away from cold drafts from windows. Yerevan's dry central heating can stress your plant — use a humidifier or mist weekly.\n\n## 🪴 Repotting Guide\n\nRepot every **1–2 years** in spring (April–May is perfect in Armenia). Choose a pot 3–4 cm larger than the current one. Use well-draining mix: 60% potting soil + 20% perlite + 20% orchid bark.\n\n## 🌱 Propagation Tips\n\nPropagate in spring by cutting a stem with at least one node. Place in water for 2–4 weeks until roots appear, then pot up. This is a popular activity for plant lovers across Yerevan!\n\n## 🐛 Common Problems\n\n- **Yellow leaves**: Overwatering — reduce frequency\n- **Brown tips**: Low humidity — mist more often\n- **Leggy growth**: Move to brighter location`,
    contentRu: `## 🌿 Почему армяне любят монстеру\n\nMonstera Deliciosa, известная как «Швейцарское сырное растение», завоевала квартиры Еревана. Её драматические разрезные листья и быстрый рост сделали её самым продаваемым растением в Masis Garden.\n\n## ☀️ Освещение\n\nМонстера процветает при **ярком рассеянном свете** — идеально для южных окон Еревана. Избегайте прямого полуденного солнца в июле–августе. Восточные окна идеальны.\n\n## 💧 Полив\n\nПоливайте каждые **1–2 недели** весной и летом. Зимой сократите до раза в 3 недели. Всегда проверяйте верхние 3 см почвы — если сухо, пора поливать.\n\n## 🌡️ Температура\n\nМонстера любит температуру **18–28°C**. Держите вдали от сквозняков зимой. Используйте увлажнитель воздуха при центральном отоплении.\n\n## 🪴 Пересадка\n\nПересаживайте каждые **1–2 года** весной (апрель–май идеально). Используйте смесь: 60% грунт + 20% перлит + 20% кора орхидеи.\n\n## 🐛 Распространённые проблемы\n\n- **Жёлтые листья**: Перелив — сократите полив\n- **Коричневые кончики**: Низкая влажность — чаще опрыскивайте\n- **Вытянутость**: Переставьте на более светлое место`,
    contentAm: `## 🌿 Ինչու հայերը սիրում են Monstera-ն\n\nMonstera Deliciosa-ն, հայտնի որպես «Շվեյցարական պանրային բույս», Երևանի բնակարաններ է նվաճել: Նրա դրամատիկ կտրված տերևները և արագ աճը այն դարձրել են Masis Garden-ի ամենավաճառվող բույսը:\n\n## ☀️ Լուսավորություն\n\nMonstera-ն ծաղկում է **պայծառ անուղղակի լույսի** ներքո — կատարյալ է Երևանի հարավ-ուղղված պատուհանների համար:\n\n## 💧 Ջրում\n\nՋրեք **1–2 շաբաթը մեկ** գարնանն ու ամռանը: Ձmers Երևանի չոր ձmers, 3 շաբmers մեկ: Ստուգmers հmers 3 սմ — եmers, ջmers time:\n\n## 🐛 Ընmers Проmers\n\n- **Դmers տermos**: Ջermos — diminish\n- **Коmers ծAYERler**: Diminish humidity\n- **Quickly growth**: Brighterлени`,
    coverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80',
    tags: ['monstera', 'tropical', 'beginners', 'yerevan', 'care'],
    category: 'care',
    publishedAt: '2026-08-01T10:00:00Z',
    readTime: 6,
  },
  {
    id: 'post-002',
    slug: 'snake-plant-apartment-guide',
    title: 'Snake Plant: The Indestructible Armenian Apartment Companion',
    titleRu: 'Сансевиерия: Неубиваемое растение для армянской квартиры',
    titleAm: 'Սանսeveria. Հայկական բնakaran-ի անmers բmers',
    summary: 'Sansevieria (Snake Plant) is perfect for busy Armenians — it survives neglect, low light, and dry central heating. Here\'s everything you need to know.',
    summaryRu: 'Сансевиерия идеальна для занятых армян — она выживает при небрежении, слабом освещении и сухом центральном отоплении.',
    summaryAm: 'Sansevieria-ն կատmers bnakarn-ի bners-i namers — nizmal, lear, kazm khas.',
    content: `## 🐍 Meet the Snake Plant\n\nSansevieria (now reclassified as Dracaena trifasciata) is the ultimate **apartment plant** for Yerevan's lifestyle. Whether you travel for work, forget to water, or have dark rooms — this plant handles it all.\n\n## 🏆 Why It's So Popular in Armenia\n\nArmenian apartments often have central heating that runs from October to April, creating extremely dry air. Snake plants **thrive in low humidity**, making them perfect for Yerevan winters.\n\n## ☀️ Light Tolerance\n\nSnake plants are incredibly adaptable:\n- **Bright light**: Grows faster, more vibrant color\n- **Low light**: Grows slowly but survives\n- **Direct sun**: Can handle morning sun but avoid harsh afternoon rays\n\n## 💧 Watering — The Most Important Rule\n\nThis is where most people go wrong: **less is more**!\n- Summer: Water every 2–3 weeks\n- Winter: Water only once a month (or even less)\n- Always ensure the soil is completely dry before watering again\n- Root rot from overwatering is the #1 killer\n\n## 🌡️ Temperature\n\nSnake plants tolerate temperatures from **10–35°C**. They can even briefly handle near-zero but don't push it. Keep away from cold window drafts in Armenian winters.\n\n## 🌱 Air Purification\n\nNASA studies confirm snake plants remove **formaldehyde, benzene, and trichloroethylene** from indoor air — especially valuable in Yerevan's urban apartments.\n\n## 🪴 Best Varieties for Armenian Homes\n\n- **Laurentii** — gold-edged classic, most popular in Yerevan\n- **Moonshine** — silvery-green, stunning minimal look\n- **Cylindrica** — cylindrical leaves, very modern design`,
    contentRu: `## 🐍 Знакомьтесь: Сансевиерия\n\nСансевиерия — идеальное **комнатное растение** для ереванского образа жизни. Путешествуете, забываете поливать, тёмные комнаты — это растение справится со всем.\n\n## 🏆 Почему она так популярна в Армении\n\nАрмянские квартиры имеют центральное отопление с октября по апрель, создавая крайне сухой воздух. Сансевиерии **процветают при низкой влажности**.\n\n## 💧 Полив — Главное правило\n\n- Лето: раз в 2–3 недели\n- Зима: раз в месяц или реже\n- Почва должна быть полностью сухой перед следующим поливом\n\n## 🌱 Очистка воздуха\n\nИсследования NASA подтверждают, что сансевиерии удаляют **формальдегид, бензол и трихлорэтилен** из воздуха.`,
    contentAm: `## 🐍 Sansevieria-ն\n\nSansevieria-ն կatelier **bnakaranayin bmuys** Yerevan-i kensagetui hamar: Bots, ignore waterings, dark rooms - bmuys handles:\n\n## 💧 Ջers — Main Rule\n\n- Amarn: 2-3 shab mek\n- Dzmer: amis mek\n- Hrkavor hog liol choras`,
    coverImage: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=800&q=80',
    tags: ['sansevieria', 'snake-plant', 'low-light', 'beginners', 'air-purifying'],
    category: 'species',
    publishedAt: '2026-08-05T10:00:00Z',
    readTime: 5,
  },
  {
    id: 'post-003',
    slug: 'pothos-easy-indoor-plant-armenia',
    title: 'Golden Pothos: The Easiest Hanging Plant for Armenian Apartments',
    titleRu: 'Потос: Самое простое ампельное растение для армянских квартир',
    titleAm: 'Pothos. Հmers կakhich bmuys Hayastani bnakarani hamar',
    summary: 'Pothos is the go-to plant for plant lovers across Armenia — fast growing, beautiful trailing vines, and nearly impossible to kill.',
    summaryRu: 'Потос — главное растение для любителей цветов в Армении: быстрорастущие, красивые побеги и практически невозможно убить.',
    summaryAm: 'Pothos-ը bmuysasers-i hamars Hayastanum amenasirelagan bmuysn e.',
    content: `## 🌿 What is Pothos?\n\nEpipremnum aureum (Golden Pothos) is a fast-growing tropical vine native to Southeast Asia. In Yerevan, you'll find it trailing from shelves, hanging baskets, and climbing moss poles in almost every plant lover's home.\n\n## 🌟 Why It's Armenia's Favourite\n\n- Grows incredibly fast — up to 30cm per month in good conditions\n- Tolerates low light better than most plants\n- Cuttings root in water within 2 weeks — perfect for sharing with friends\n- Available in stunning varieties: **Golden**, **Marble Queen**, **Neon**, **N'Joy**\n\n## ☀️ Light Needs\n\nPothos is adaptable but note this:\n- **Bright light**: Keeps variegation vivid and growth fast\n- **Low light**: Loses variegation, turns plain green (but survives!)\n- Avoid direct sun — leaves will burn\n\n## 💧 Watering Schedule\n\nWater when the top **2–3 cm of soil is dry**:\n- Summer: Every 7–10 days\n- Winter: Every 14–21 days\n- Yellow leaves = overwatering; Wilting = underwatering\n\n## 📏 Training Your Pothos\n\nFor the most beautiful display in Armenian apartments:\n1. **Hanging**: Let vines cascade naturally from a high shelf\n2. **Climbing**: Use a moss pole — vines will produce larger leaves\n3. **Trailing**: Let it spread across a mantelpiece or bookshelf\n\n## ✂️ Easy Propagation\n\nCut below a leaf node, place in water. Roots appear in 7–14 days. Pot up in soil and share with neighbours — Pothos cuttings make great gifts!`,
    contentRu: `## 🌿 Что такое Потос?\n\nEpipremnum aureum — быстрорастущая тропическая лиана. В Ереване вы найдёте её свисающей с полок и корзин в домах почти каждого любителя растений.\n\n## 🌟 Почему это фаворит Армении\n\n- Растёт невероятно быстро — до 30 см в месяц\n- Переносит недостаток света лучше большинства растений\n- Черенки укореняются в воде за 2 недели\n- Доступна в сортах: Golden, Marble Queen, Neon, N'Joy\n\n## 💧 График полива\n\nПоливайте когда верхние **2–3 см почвы сухие**:\n- Лето: каждые 7–10 дней\n- Зима: каждые 14–21 день\n\n## ✂️ Черенкование\n\nСрежьте ниже узла листа, поместите в воду. Корни появятся через 7–14 дней. Высадите в почву и угостите соседей черенками!`,
    contentAm: `## 🌿 Inch e Pothos-ը\n\nEpipremnum aureum-ы aragnsharts tropikakan liana e. Yerevanum gteq nakhandznergits, baskets menq bmuysasirox yuraqanur tanil:\n\n## 💧 Jrman grafik\n\n- Amarn: 7-10 or mek\n- Dzmer: 14-21 or mek\n\n## ✂️ Bzhkhavor shton\n\nKtreq leaf node-i tak, dek jur. Arzeruqner 7-14 or verj kertanman.`,
    coverImage: 'https://images.unsplash.com/photo-1598880940371-c756e015faf1?w=800&q=80',
    tags: ['pothos', 'hanging-plants', 'beginners', 'fast-growing', 'trailing'],
    category: 'species',
    publishedAt: '2026-08-07T10:00:00Z',
    readTime: 5,
  },
  {
    id: 'post-004',
    slug: 'succulents-guide-armenia',
    title: 'Growing Succulents in Armenia\'s Climate — Complete Guide',
    titleRu: 'Выращивание суккулентов в климате Армении — Полное руководство',
    titleAm: 'Հmers Hyuteghner Hayastanum. Katar Uzeluits',
    summary: 'A practical guide to choosing and caring for drought-tolerant succulents in Yerevan\'s seasonal climate — perfect for beginners.',
    summaryRu: 'Практическое руководство по выбору и уходу за засухоустойчивыми суккулентами в климате Еревана.',
    summaryAm: 'Gortnakaneren uzekuits Yerevan-i kliamum yerashtutyunneri entrutyun u khnamp hamar.',
    content: `## 🌵 Why Succulents Thrive in Armenia\n\nYerevan's climate is actually **ideal for succulents**: hot dry summers, cold winters, and strong sunlight. Armenia's natural landscape includes wild succulents in the Ararat Valley — so these plants feel right at home!\n\n## 🏆 Best Succulent Varieties for Armenian Apartments\n\n### For Windowsills (Maximum Sun)\n- **Echeveria** — stunning rosette shapes, dozens of color varieties\n- **Sedum** — very hardy, perfect for outdoor pots in summer\n- **Aloe Vera** — medicinal, fast-growing, extremely popular in Yerevan\n\n### For Lower Light Indoors\n- **Haworthia** — perfect for office desks away from windows\n- **Gasteria** — tolerates shade, beautiful spotted leaves\n- **Crassula ovata (Jade Plant)** — the "money plant", beloved in Armenian homes\n\n## 💧 The #1 Rule: Water Sparingly\n\nSucculents store water in their leaves — **overwatering is the most common mistake**:\n- **Spring/Summer**: Water when soil is completely dry (every 10–14 days)\n- **Autumn**: Reduce to every 3 weeks\n- **Winter**: Once a month maximum — sometimes even less!\n- Use the **soak and dry method**: water thoroughly, then let dry completely\n\n## 🌍 Armenia's Winter Challenge\n\nThe main risk is **cold + wet roots**. Keep succulents on south-facing windowsills (not between cold glass and curtain!) and reduce watering dramatically from November to March.\n\n## 🪴 Soil & Pots\n\nSucculents **must** have drainage holes. Use cactus/succulent mix or add 50% perlite to regular potting soil. Terracotta pots are ideal — they allow soil to dry faster.\n\n## 🌸 Getting Them to Flower\n\nMost succulents flower when given a **winter rest period** (cooler temps + less water). Echeverias bloom in spring with stunning coral-red flowers on tall stems.`,
    contentRu: `## 🌵 Почему суккуленты процветают в Армении\n\nКлимат Еревана идеален для суккулентов: жаркое сухое лето, холодная зима и яркий солнечный свет.\n\n## 🏆 Лучшие суккуленты для армянских квартир\n\n- **Эхеверия** — потрясающие розетки, десятки цветовых вариантов\n- **Алоэ Вера** — лечебное, очень популярное в Ереване\n- **Хавортия** — идеальна для низкой освещённости\n- **Толстянка (Jade Plant)** — «денежное дерево», любимое в армянских домах\n\n## 💧 Правило №1: Редкий полив\n\n- Весна/Лето: раз в 10–14 дней\n- Осень: раз в 3 недели\n- Зима: раз в месяц максимум\n\n## 🪴 Почва и горшки\n\nОбязательны дренажные отверстия. Терракотовые горшки идеальны — они быстрее сохнут.`,
    contentAm: `## 🌵 Inch u Hyuteghery Hayastanum\n\nYerevan-i klimat ideal e hyutegheri hamar: shog, char amarn, ser dzmer.\n\n## 💧 Glavniy Kanonn: Kam Jrel\n\n- Garun/Amarn: 10-14 or mek\n- Dzmer: amis mek max`,
    coverImage: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80',
    tags: ['succulents', 'drought-tolerant', 'Armenia', 'beginners', 'echeveria'],
    category: 'species',
    publishedAt: '2026-08-09T10:00:00Z',
    readTime: 7,
  },
  {
    id: 'post-005',
    slug: 'fiddle-leaf-fig-yerevan-care',
    title: 'Fiddle Leaf Fig in Yerevan: A Challenging but Rewarding Plant',
    titleRu: 'Фикус Лировидный в Ереване: Сложное, но вознаграждающее растение',
    titleAm: 'Ficus lyrata Yerevanum. Barkats bmuys',
    summary: 'The Fiddle Leaf Fig is a statement plant that transforms any room. Here\'s how to successfully grow it in Yerevan\'s challenging climate.',
    summaryRu: 'Фикус лировидный — растение-высказывание, которое преображает любую комнату. Вот как успешно выращивать его в ереванском климате.',
    summaryAm: 'Ficus lyrata-n statementayin bmuys e. Seranin usuytsnum enq aynd Yerevanum hnarcavel.',
    content: `## 🎻 What Makes Fiddle Leaf Fig Special\n\nFicus lyrata is known for its enormous, violin-shaped glossy leaves that make a bold statement in any interior. It's become the most-photographed plant in Yerevan interior design accounts on Instagram.\n\n## ⚠️ The Honest Truth About Fiddle Leaf Figs\n\nLet's be honest: **Fiddle Leaf Figs are drama queens**. They hate:\n- Moving to a new spot\n- Drafts from windows or air conditioning\n- Inconsistent watering\n- Low humidity (a big challenge in Yerevan!)\n\nBut get it right, and you'll have the most stunning plant in your apartment.\n\n## ☀️ Light — The Most Critical Factor\n\nFiddle Leaf Figs need **bright, consistent light**:\n- Place near a south or east-facing window\n- At least 6 hours of bright indirect light daily\n- Rotate the pot 90° every month for even growth\n- **Never move it** once you find its happy spot!\n\n## 💧 Watering in Yerevan\n\nConsistency is everything:\n- Water every **7–10 days** in summer, letting top 3cm dry between waterings\n- In winter: every 2–3 weeks\n- Use lukewarm, filtered water — Yerevan tap water is fine but let it sit overnight\n- Yellow leaves = overwatering; brown edges = underwatering OR low humidity\n\n## 💨 Humidity Challenges in Armenian Apartments\n\nYerevan's winters with central heating can drop indoor humidity to 20–30% — way below the 60–70% that Fiddle Leafs prefer. Solutions:\n- Use a **humidifier** nearby\n- Place on a pebble tray with water\n- Group with other plants to create a humidity microclimate\n- Mist leaves weekly with room-temperature water\n\n## 🪴 Repotting Tips\n\nRepot only when **roots are visibly coming out of drainage holes**. Do it in April–May. Don't go more than 5cm larger in pot size or you risk root rot from excess soggy soil.`,
    contentRu: `## 🎻 Что делает фикус лировидный особенным\n\nFicus lyrata известен своими огромными глянцевыми листьями в форме скрипки. Он стал самым фотографируемым растением в аккаунтах интерьерного дизайна Еревана.\n\n## ⚠️ Честная правда\n\nФикус лировидный — **капризное растение**. Он ненавидит:\n- Перестановки\n- Сквозняки\n- Нестабильный полив\n- Низкую влажность (большая проблема в Ереване!)\n\n## ☀️ Освещение\n\nТребует **яркого постоянного освещения**. Поставьте у южного или восточного окна. Поворачивайте горшок на 90° каждый месяц. **Никогда не перемещайте** после нахождения удачного места!\n\n## 💨 Влажность\n\nЗимой с центральным отоплением влажность падает до 20–30%. Решения:\n- Используйте увлажнитель воздуха\n- Поставьте на поддон с галькой и водой\n- Группируйте с другими растениями`,
    contentAm: `## 🎻 Ficus lyrata-n\n\nFicus lyrata-n hanown e shrjanapayi mets, srelagan, kamandin tzev unetsog tererevov:\n\n## ⚠️ Imast Chataru\n\nFicus lyrata-n khndrem bmuys e. Atumey:\n- Teghavorutyun\n- Sarer\n- Anhamanavor jrum\n- Tsazr khonavorutyun\n\n## 💧 Jrum\n\n7-10 or mek amarnyan, 2-3 shabatya mek dzmeran:`,
    coverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80',
    tags: ['fiddle-leaf-fig', 'ficus', 'advanced', 'statement-plant', 'humidity'],
    category: 'care',
    publishedAt: '2026-08-11T10:00:00Z',
    readTime: 8,
  },
  {
    id: 'post-006',
    slug: 'aloe-vera-armenia-benefits',
    title: 'Aloe Vera: The Medicinal Marvel Every Armenian Home Needs',
    titleRu: 'Алоэ Вера: Лечебное чудо, которое нужно каждому армянскому дому',
    titleAm: 'Aloe Vera. Bujhakan Hdramagha Haykakan Tanikneri Hamar',
    summary: 'Aloe Vera has been grown in Armenian homes for generations. Discover why it\'s the most practical houseplant you can own — beautiful, medicinal, and nearly impossible to kill.',
    summaryRu: 'Алоэ вера выращивают в армянских домах на протяжении поколений. Узнайте, почему это самое практичное комнатное растение.',
    summaryAm: 'Aloe vera-n Haykakan taniknerum serundneri kahmov mshakvel e. Imasek inchu ayds amenagortsnakan bnakaranayin bmuysn e.',
    content: `## 🌵 Aloe Vera in Armenian Culture\n\nAloe Vera has been a staple of Armenian households for generations — used for skin care, burns, and hair treatment. In Yerevan's markets and garden centres, it's consistently one of the top-selling plants.\n\n## 🏥 Medicinal Uses\n\nThe thick gel inside Aloe leaves contains:\n- **Vitamins A, C, E** and antioxidants\n- **Aloin** — anti-inflammatory properties\n- **Acemannan** — immune-supporting compound\n\n**Traditional uses in Armenian homes:**\n- Sunburn and minor burns: Apply fresh gel directly\n- Dry skin and face moisturizer\n- Hair mask for shine and growth\n- Digestive health (small amounts of inner gel only)\n\n## ☀️ Light Requirements\n\nAloe loves **direct sunlight** — south-facing windows are ideal in Yerevan. It can tolerate some shade but will grow slowly and may become leggy.\n\n## 💧 Watering — Less Is Always More\n\n- **Summer**: Water deeply every 2–3 weeks\n- **Winter**: Once a month is usually sufficient\n- Allow soil to dry completely between waterings\n- Never let water sit in the base of the pot\n\n## 🌡️ Armenia's Climate Suits Aloe Perfectly\n\nAloe thrives in Armenia's dry climate:\n- Loves the hot, dry Yerevan summers\n- Tolerates the cold but keep above 5°C\n- Perfect for south-facing balconies from May to September\n\n## 🪴 Propagation — Share the Wealth!\n\nAloe produces "pups" (offsets) at its base. Simply:\n1. Remove pup when it's 1/3 the size of the mother plant\n2. Let the cut end dry for 24 hours\n3. Plant in dry cactus soil — don't water for 1 week\n4. Give to friends and family — a wonderful Armenian tradition!`,
    contentRu: `## 🌵 Алоэ вера в армянской культуре\n\nАлоэ вера — неотъемлемая часть армянских домохозяйств на протяжении поколений: для ухода за кожей, при ожогах и лечении волос.\n\n## 🏥 Лечебные свойства\n\n- **Витамины A, C, E** и антиоксиданты\n- Противовоспалительные свойства\n\n**Традиционное применение:**\n- Солнечные ожоги: нанесите свежий гель\n- Увлажнитель кожи\n- Маска для волос\n\n## 💧 Полив\n\n- Лето: каждые 2–3 недели\n- Зима: раз в месяц\n- Давайте почве полностью высыхать\n\n## 🌡️ Климат Армении\n\nАлоэ процветает в сухом климате Армении. Идеально для южных балконов с мая по сентябрь.`,
    contentAm: `## 🌵 Aloe Vera Haykakan Mshakuytum\n\nAloe vera-n serdanyali masin e Haykakan tarnikneri jamanakakitsutyan mej — mashi khnamqi, ayrvatskneri u mazi usuytsam hamar:\n\n## 💧 Jrum\n\n- Amarn: 2-3 shabatya mek\n- Dzmer: amis mek\n\n## 🌡️ Hayastani Klimat\n\nAloe lav e Hayastani char klimatum. Ideal e haravain balkon-neri hamar may-septemberi motnts:`,
    coverImage: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&q=80',
    tags: ['aloe-vera', 'medicinal', 'succulents', 'beginners', 'armenian-culture'],
    category: 'species',
    publishedAt: '2026-08-12T10:00:00Z',
    readTime: 6,
  },
  {
    id: 'post-007',
    slug: 'best-plants-yerevan-apartments-2026',
    title: 'Top 10 Houseplants for Yerevan Apartments in 2026',
    titleRu: 'Топ-10 комнатных растений для ереванских квартир в 2026 году',
    titleAm: '2026-i Top-10 Bnakaranayin Bmuysner Yerevani Bnakaranneri Hamar',
    summary: 'Our definitive guide to the best indoor plants for Yerevan\'s specific climate, apartment sizes, and Armenian lifestyle — curated by Masis Garden experts.',
    summaryRu: 'Наше исчерпывающее руководство по лучшим комнатным растениям для специфического климата Еревана — от экспертов Masis Garden.',
    summaryAm: 'Masis Garden-i maser-mner-i kazmvel uzekuitsn Yerevani bnakaranayni bmuysnerov.',
    content: `## 🌿 Why Plant Selection Matters in Yerevan\n\nYerevan's unique conditions — **hot dry summers, cold winters, dry central heating, and strong sunlight** — mean not every plant thrives here. After years of experience, our Masis Garden team has curated the definitive list.\n\n## 🏆 The Top 10 List\n\n### 1. 🪴 Monstera Deliciosa ⭐ Most Popular\nFast-growing, dramatic leaves, adaptable. Our #1 bestseller year after year.\n\n### 2. 🐍 Sansevieria (Snake Plant) ⭐ Most Forgiving\nPerfect for busy people. Survives neglect, low light, dry air. Purifies air.\n\n### 3. 🌿 Pothos ⭐ Best Value\nFast-growing trailing vines, many varieties, easy propagation. Great for shelves.\n\n### 4. 🌵 Aloe Vera ⭐ Most Useful\nMedicinal gel for burns and skin. Loves Yerevan's sun and dry climate.\n\n### 5. 🌺 Peace Lily ⭐ Best for Low Light\nOne of few flowering plants that tolerates dark Yerevan corridors and north rooms.\n\n### 6. 🌴 Dracaena ⭐ Best Large Statement Plant\nDramatic tropical look, tolerates low humidity, very long-lived. Great for corners.\n\n### 7. 🍃 ZZ Plant (Zamioculcas) ⭐ Most Drought-Tolerant\nExtremely hardy, glossy dark leaves, grows in almost any condition. Slow but reliable.\n\n### 8. 🌸 Anthurium ⭐ Best Flowering Plant\nLong-lasting waxy red blooms all year. The most gifted plant in Yerevan.\n\n### 9. 🌿 Spider Plant ⭐ Best for Kids\nNon-toxic, produces babies you can share, tolerates neglect. Classic Armenian home plant.\n\n### 10. 🌱 Rubber Plant (Ficus elastica) ⭐ Most Stylish\nBold dark burgundy or green leaves, architectural look. Perfect for modern Yerevan interiors.\n\n## 🎯 Which One Is Right for You?\n\n- **Beginners**: Start with Snake Plant or Pothos\n- **Statement piece**: Monstera or Fiddle Leaf Fig\n- **Medicinal use**: Aloe Vera\n- **Flowering color**: Anthurium or Peace Lily\n- **Travel a lot**: ZZ Plant or Snake Plant`,
    contentRu: `## 🌿 Почему выбор растения важен в Ереване\n\nУникальные условия Еревана — **жаркое сухое лето, холодные зимы, сухое центральное отопление** — означают, что не каждое растение здесь процветает.\n\n## 🏆 Топ-10 список\n\n1. 🪴 **Монстера** — Самая популярная, наш хит продаж\n2. 🐍 **Сансевиерия** — Самая неприхотливая, очищает воздух\n3. 🌿 **Потос** — Лучшее соотношение цены и качества\n4. 🌵 **Алоэ Вера** — Самое полезное\n5. 🌺 **Спатифиллум** — Лучшее для слабого освещения\n6. 🌴 **Драцена** — Лучшее крупное акцентное растение\n7. 🍃 **Замиокулькас (ZZ)** — Самое засухоустойчивое\n8. 🌸 **Антуриум** — Лучшее цветущее растение\n9. 🌿 **Хлорофитум** — Лучшее для детей\n10. 🌱 **Фикус Эластика** — Самое стильное`,
    contentAm: `## 🌿 Inch u Bmuys Entrutyunn Karevore Yerevanum\n\nYerevan-i einakaran paymannery — **shog char amarn, cer dzmer, char centrakan tapum** — nshanakaum en vor amen bmuys chi tsaghkanal aystegh:\n\n## 🏆 Top-10 Tzarayk\n\n1. 🪴 **Monstera** — Amenahanramal, mer bestseller\n2. 🐍 **Sansevieria** — Amenanvaz, mor maqrum\n3. 🌿 **Pothos** — Lav arzhek-orakutyun\n4. 🌵 **Aloe Vera** — Amenagortsnakan\n5. 🌺 **Peace Lily** — Lav tsazr lusvavorutyun hamar`,
    coverImage: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800&q=80',
    tags: ['top-plants', 'yerevan', '2026', 'apartment', 'best-sellers', 'guide'],
    category: 'tips',
    publishedAt: '2026-08-14T10:00:00Z',
    readTime: 8,
  },
];

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('masis_blog_posts_v3');
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      setPosts(defaultPosts);
      localStorage.setItem('masis_blog_posts_v3', JSON.stringify(defaultPosts));
    }
  }, []);

  const save = (updated: BlogPost[]) => {
    setPosts(updated);
    localStorage.setItem('masis_blog_posts_v3', JSON.stringify(updated));
  };

  const addPost = (post: Omit<BlogPost, 'id' | 'slug' | 'publishedAt'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `post-${Date.now()}`,
      slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      publishedAt: new Date().toISOString(),
    };
    save([newPost, ...posts]);
  };

  const updatePost = (id: string, updates: Partial<BlogPost>) => {
    save(posts.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePost = (id: string) => {
    save(posts.filter(p => p.id !== id));
  };

  const getPost = (slug: string) => posts.find(p => p.slug === slug);

  return (
    <BlogContext.Provider value={{ posts, addPost, updatePost, deletePost, getPost }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error('useBlog must be used within BlogProvider');
  return ctx;
}
