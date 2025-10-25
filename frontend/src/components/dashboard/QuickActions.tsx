import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/common/Button';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="card py-2 px-3 space-y-2">
      {/* Start Reading CTA - Prominent but compact */}
      <Button
        variant="primary"
        size="medium"
        onClick={() => navigate('/reading')}
        className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 py-3"
        aria-label={t('dashboard.startReadingLabel')}
      >
        <span className="text-child-base font-bold flex items-center justify-center gap-2">
          <span aria-hidden="true">▶</span>
          {t('dashboard.startReading')}
        </span>
      </Button>

      {/* Secondary Actions - Compact */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="small"
          onClick={() => navigate('/shop')}
          className="flex-col h-auto py-2"
          aria-label={t('dashboard.visitShop')}
        >
          <span className="text-xl mb-0.5" aria-hidden="true">🏪</span>
          <span className="text-[10px] font-semibold">{t('shop.title')}</span>
        </Button>
        <Button
          variant="outline"
          size="small"
          onClick={() => navigate('/achievements')}
          className="flex-col h-auto py-2"
          aria-label={t('dashboard.viewAchievements')}
        >
          <span className="text-xl mb-0.5" aria-hidden="true">🏆</span>
          <span className="text-[10px] font-semibold">{t('dashboard.badges')}</span>
        </Button>
        <Button
          variant="outline"
          size="small"
          onClick={() => navigate('/progress')}
          className="flex-col h-auto py-2"
          aria-label={t('dashboard.checkProgress')}
        >
          <span className="text-xl mb-0.5" aria-hidden="true">📊</span>
          <span className="text-[10px] font-semibold">{t('common.stats')}</span>
        </Button>
      </div>
    </section>
  );
};
