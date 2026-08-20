'use client';

import styles from './StoriesBar.module.css';

interface StoriesBarProps {
  lang: string;
}

export default function StoriesBar({ lang }: StoriesBarProps) {
  const stories = [
    {
      id: 'indoor',
      emoji: '🪴',
      title: { en: 'Indoor', am: 'Սենյակային', ru: 'Комнатные' }[lang as 'en' | 'am' | 'ru'] || 'Indoor',
      tag: 'indoor',
      badge: 'HOT',
    },
    {
      id: 'rare',
      emoji: '✨',
      title: { en: 'Rare Plants', am: 'Հազվագյուտ', ru: 'Редкие' }[lang as 'en' | 'am' | 'ru'] || 'Rare',
      tag: 'rare',
      badge: 'VIP',
    },
    {
      id: 'pet',
      emoji: '🐾',
      title: { en: 'Pet Safe', am: 'Անվտանգ', ru: 'Для животных' }[lang as 'en' | 'am' | 'ru'] || 'Pet Safe',
      tag: 'pet',
    },
    {
      id: 'pots',
      emoji: '🏺',
      title: { en: 'Pots & Soil', am: 'Թաղարներ', ru: 'Горшки' }[lang as 'en' | 'am' | 'ru'] || 'Pots',
      tag: 'pots',
    },
    {
      id: 'easy',
      emoji: '🌱',
      title: { en: 'Low Care', am: 'Հեշտ խնամք', ru: 'Неприхотливые' }[lang as 'en' | 'am' | 'ru'] || 'Low Care',
      tag: 'easy',
    },
    {
      id: 'care',
      emoji: '📖',
      title: { en: 'Care Guide', am: 'Խնամք', ru: 'Гайд по уходу' }[lang as 'en' | 'am' | 'ru'] || 'Care Guide',
      href: `/${lang}/blog`,
    },
  ];

  const handleStoryClick = (story: typeof stories[0]) => {
    if (story.href) {
      window.location.href = story.href;
      return;
    }

    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.storiesContainer} aria-label="Stories & Highlights">
      {stories.map((story) => (
        <button
          key={story.id}
          className={styles.storyItem}
          onClick={() => handleStoryClick(story)}
          title={story.title}
        >
          <div className={`${styles.ringWrapper} ${story.badge ? styles.ringActive : ''}`}>
            <div className={styles.avatar}>
              <span className={styles.avatarEmoji}>{story.emoji}</span>
              {story.badge && <span className={styles.badgeHot}>{story.badge}</span>}
            </div>
          </div>
          <span className={styles.storyTitle}>{story.title}</span>
        </button>
      ))}
    </div>
  );
}
