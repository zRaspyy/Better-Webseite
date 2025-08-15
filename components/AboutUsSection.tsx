'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BorderBeam } from './ui/border-beam';
import { CardHoverEffect } from './ui/pulse-card';
import { Globe, Users, Heart, Lightbulb, Sparkles, Rocket, Target } from 'lucide-react';
import BackgroundGlow from './BackgroundGlow';

const iconComponents = {
  Users,
  Heart,
  Lightbulb,
  Globe,
  Sparkles,
  Rocket,
  Target,
};

const defaultValues = [
  {
    title: 'Innovation',
    description: 'Wir entwickeln ständig neue Audio-Features und Technologien, um Warzone-Spielern einen echten Vorteil zu verschaffen. Unsere Algorithmen und Presets sind speziell für Shooter optimiert.',
    icon: 'Lightbulb',
  },
  {
    title: 'Community',
    description: 'Unsere Nutzer stehen im Mittelpunkt. Wir integrieren Community-Voting für die besten Einstellungen, bieten exklusiven Discord-Support und entwickeln die App gemeinsam mit euch weiter.',
    icon: 'Users',
  },
  {
    title: 'Qualität',
    description: 'Wir setzen auf höchste Audio-Qualität, Stabilität und Performance. Jede Funktion wird intensiv getestet, damit du im Spiel immer das beste Sound-Erlebnis hast.',
    icon: 'Sparkles',
  },
  {
    title: 'Leidenschaft',
    description: 'Unser Team besteht aus echten Gamern und Audio-Profis. Wir leben Warzone und wissen, worauf es ankommt – für dich und deine Squad.',
    icon: 'Heart',
  },
];

export default function AboutUsSection() {
  const aboutData = {
    title: 'Über Better Warzone Audio',
    subtitle: 'Die App für besseren Sound, mehr Performance und echte Vorteile in Warzone.',
    mission: 'Unsere Mission ist es, Warzone-Spielern mit smarter Audio-Technologie, exklusiven Presets und Community-Features das beste Spielerlebnis zu bieten. Egal ob Casual oder Pro – mit Better Warzone Audio hörst du mehr, reagierst schneller und gewinnst öfter.',
    vision: 'Wir wollen die führende Plattform für Gaming-Audio werden und eine starke Community aufbauen, die gemeinsam das Spielerlebnis in Warzone und anderen Shootern revolutioniert.',
    values: defaultValues,
    className: 'relative overflow-hidden py-20',
  };
  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });

  return (
    <section className="relative w-full overflow-hidden pt-20">
      <BackgroundGlow />
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h1 className="bg-gradient-to-r from-[#ff3c3c] via-[#ff7b7b] to-[#ff3c3c] bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl md:text-6xl drop-shadow-lg">
            {aboutData.title}
          </h1>
          <p className="mt-6 text-xl text-gray-300 font-semibold">
            {aboutData.subtitle}
          </p>
        </motion.div>
        {/* Mission & Vision Section */}
        <div ref={missionRef} className="relative mx-auto mb-24 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative z-10 grid gap-12 md:grid-cols-2"
          >
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(255,60,60,0.18)' }}
              className="group border-[#ff3c3c]/40 relative block overflow-hidden rounded-2xl border bg-gradient-to-br from-[#23232a] to-[#18181b] p-10 backdrop-blur-3xl"
            >
              <BorderBeam
                duration={8}
                size={300}
                className="via-[#ff3c3c]/40 from-transparent to-transparent"
              />
              <div className="from-[#ff3c3c]/20 to-[#ff3c3c]/5 mb-6 inline-flex aspect-square h-16 w-16 flex-1 items-center justify-center rounded-2xl bg-gradient-to-br backdrop-blur-sm">
                <Rocket className="text-[#ff3c3c] h-8 w-8" />
              </div>
              <div className="space-y-4">
                <h2 className="from-[#ff3c3c]/90 to-[#ff7b7b]/70 mb-4 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
                  Unsere Mission
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {aboutData.mission}
                </p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(60,120,255,0.18)' }}
              className="group border-[#ff3c3c]/40 relative block overflow-hidden rounded-2xl border bg-gradient-to-br from-[#23232a] to-[#18181b] p-10 backdrop-blur-3xl"
            >
              <BorderBeam
                duration={8}
                size={300}
                className="from-transparent via-blue-500/40 to-transparent"
                reverse
              />
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-sm">
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="mb-4 bg-gradient-to-r from-blue-500/90 to-blue-500/70 bg-clip-text text-3xl font-bold text-transparent">
                Unsere Vision
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {aboutData.vision}
              </p>
            </motion.div>
          </motion.div>
        </div>
        <div ref={valuesRef} className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-12 text-center"
          >
            <h2 className="bg-gradient-to-r from-[#ff3c3c] via-[#ff7b7b] to-[#ff3c3c] bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl drop-shadow-lg">
              Unsere Werte
            </h2>
            <p className="text-gray-400 mx-auto mt-4 max-w-2xl text-lg font-semibold">
              Die Prinzipien, die Better Warzone Audio und unser Team antreiben.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {aboutData.values?.map((value, index) => {
              const IconComponent = iconComponents[value.icon];
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1 + 0.2,
                    ease: 'easeOut',
                  }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-[#23232a] border border-[#ff3c3c] rounded-2xl p-6 shadow-lg flex flex-col gap-2 items-start"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className="h-6 w-6 text-[#ff3c3c]" />
                    <span className="text-lg font-bold text-[#ff3c3c]">{value.title}</span>
                  </div>
                  <div className="text-base text-gray-200">{value.description}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
