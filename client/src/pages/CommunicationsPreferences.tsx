import { motion } from "framer-motion";
import { Mail, Calendar, Microscope, HeartHandshake, Stethoscope, BookOpen, Bell, MailX, Settings2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const CONTACT_EMAIL = "cas@amyloid.ca";

export default function CommunicationsPreferences() {
  const { language } = useLanguage();
  const fr = language === "fr";

  const casTopics = fr
    ? [
        {
          icon: Mail,
          title: "Infolettre et nouvelles de la société",
          freq: "Mensuelle",
          desc: "Nouvelles de la SCA, mises à jour cliniques canadiennes, profils de membres et annonces.",
        },
        {
          icon: Calendar,
          title: "Invitations aux événements",
          freq: "5 à 8 par année",
          desc: "Sommet canadien sur l'amyloïdose, Club de lecture, assemblées publiques (town halls) et événements communautaires.",
        },
        {
          icon: Microscope,
          title: "Possibilités de recherche et sondages",
          freq: "Occasionnelle (4 à 6 par année)",
          desc: "Études de recherche, essais cliniques en recrutement et sondages pour aider à façonner les priorités de la communauté.",
        },
        {
          icon: HeartHandshake,
          title: "Collectes de fonds et campagnes de sensibilisation",
          freq: "3 à 5 par année",
          desc: "Campagnes pour financer notre travail — toujours optionnelles, jamais agressives.",
        },
      ]
    : [
        {
          icon: Mail,
          title: "Newsletter and society updates",
          freq: "Monthly",
          desc: "CAS news, Canadian clinical updates, member spotlights, and announcements.",
        },
        {
          icon: Calendar,
          title: "Event invitations",
          freq: "5–8 per year",
          desc: "Canadian Amyloidosis Summit, Journal Club, town halls and community events.",
        },
        {
          icon: Microscope,
          title: "Research opportunities and surveys",
          freq: "Occasional (4–6 per year)",
          desc: "Research studies, clinical trials currently recruiting, and surveys that help shape community priorities.",
        },
        {
          icon: HeartHandshake,
          title: "Fundraising and awareness campaigns",
          freq: "3–5 per year",
          desc: "Campaigns to fund our work — always optional, never pushy.",
        },
      ];

  const cannTopics = fr
    ? [
        {
          icon: BookOpen,
          title: "Infolettre RCIA et série éducative",
          freq: "6 à 10 par année",
          desc: "Mises à jour cliniques pour les infirmières en amyloïdose, modules éducatifs et résumés de la pratique.",
        },
        {
          icon: Stethoscope,
          title: "Invitations aux événements du RCIA",
          freq: "3 à 5 par année",
          desc: "Ateliers, événements de réseautage et formations spécifiques au RCIA.",
        },
      ]
    : [
        {
          icon: BookOpen,
          title: "CANN newsletter and educational series",
          freq: "6–10 per year",
          desc: "Clinical updates for amyloidosis nurses, educational modules and practice digests.",
        },
        {
          icon: Stethoscope,
          title: "CANN event invitations",
          freq: "3–5 per year",
          desc: "CANN-specific workshops, networking events and training sessions.",
        },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium mb-4">
              <Bell className="w-3.5 h-3.5" />
              {fr ? "Préférences de communication" : "Communication preferences"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight">
              {fr ? "Ce que vous recevrez de nous" : "What you'll receive from us"}
            </h1>
            <p className="mt-3 text-white/90 text-sm sm:text-base max-w-2xl">
              {fr
                ? "Détail clair de chaque type de communication, à quelle fréquence elle arrive et comment vous désabonner à tout moment."
                : "A plain-language breakdown of every kind of message we send, how often it arrives, and how to unsubscribe at any time."}
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Intro */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              {fr
                ? `Quand vous acceptez de recevoir nos communications sur le formulaire d'adhésion, voici exactement ce que cela couvre. Vous gardez le contrôle complet — vous pouvez vous désabonner à tout moment en utilisant le lien dans n'importe quel courriel, ou en écrivant à `
                : `When you opt in to communications on the membership form, here's exactly what that covers. You stay in full control — you can unsubscribe at any time using the link in any email, or by emailing `}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00AFE6] hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </CardContent>
        </Card>

        {/* CAS topics */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 rounded-full bg-[#00AFE6]" />
            <h2 className="text-xl font-serif font-medium text-slate-800 dark:text-slate-100">
              {fr ? "De la SCA — Société canadienne de l'amyloïdose" : "From CAS — Canadian Amyloidosis Society"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {casTopics.map((t) => (
              <TopicCard key={t.title} {...t} accent="cas" />
            ))}
          </div>
        </section>

        {/* CANN topics */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 rounded-full bg-pink-500" />
            <h2 className="text-xl font-serif font-medium text-slate-800 dark:text-slate-100">
              {fr ? "Du RCIA — Réseau canadien des infirmières en amyloïdose" : "From CANN — Canadian Amyloidosis Nursing Network"}
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {fr
              ? "Réservé aux membres du RCIA. La SCA envoie ces messages au nom du RCIA — nous le précisons toujours clairement dans le pied de page de chaque courriel."
              : "Reserved for CANN members. CAS sends these messages on CANN's behalf — we always make this clear in the footer of every email."}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {cannTopics.map((t) => (
              <TopicCard key={t.title} {...t} accent="cann" />
            ))}
          </div>
        </section>

        {/* Unsubscribe */}
        <Card className="border-[#00AFE6]/30 bg-[#00AFE6]/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium text-slate-800 dark:text-slate-100">
              <MailX className="w-5 h-5 text-[#00AFE6]" />
              {fr ? "Comment vous désabonner" : "How to unsubscribe"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 dark:text-slate-200 space-y-3">
            <p>
              {fr
                ? "Trois façons, toutes gratuites, toutes traitées dans un délai de 10 jours ouvrables (la LCAP nous accorde un maximum de 10 jours) :"
                : "Three ways, all free, all honoured within 10 business days (CASL gives us a maximum of 10):"}
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li>
                {fr
                  ? "Cliquez sur le lien « Se désabonner » au bas de n'importe quel courriel que nous vous envoyons."
                  : 'Click the "Unsubscribe" link at the bottom of any email we send.'}
              </li>
              <li>
                {fr ? "Écrivez à " : "Email "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00AFE6] hover:underline">
                  {CONTACT_EMAIL}
                </a>
                {fr
                  ? " — indiquez « Désabonnement » dans l'objet et précisez si vous souhaitez vous retirer de tout ou d'un sujet précis."
                  : ' — put "Unsubscribe" in the subject line, tell us whether you want out of everything or just one topic.'}
              </li>
              <li>
                {fr
                  ? "Connectez-vous à votre profil de membre et ouvrez la page Préférences de courriel (à venir prochainement)."
                  : "Sign in to your member profile and open the Email Preferences page (coming soon)."}
              </li>
            </ol>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <Clock className="w-3.5 h-3.5" />
              {fr
                ? "Les retraits sont effectifs immédiatement dans notre CRM ; un courrier déjà mis en file d'attente peut tout de même arriver dans les 24 heures suivantes."
                : "Withdrawals take effect immediately in our CRM; one already-queued email may still arrive within 24 hours."}
            </div>
          </CardContent>
        </Card>

        {/* What you'll never receive */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium text-slate-800 dark:text-slate-100">
              <Settings2 className="w-5 h-5 text-slate-500" />
              {fr ? "Ce que vous ne recevrez jamais" : "What you'll never receive"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
            <p>
              {fr
                ? "Nous ne vendons ni ne louons jamais votre adresse courriel. Vous ne recevrez jamais de :"
                : "We never sell or rent your email address. You will never receive:"}
            </p>
            <ul className="list-disc list-inside space-y-1">
              {(fr
                ? [
                    "publicités de tiers ou de sociétés pharmaceutiques",
                    "messages quotidiens ou « pourriels »",
                    "communications après votre désabonnement",
                  ]
                : [
                    "third-party or pharma advertising",
                    "daily messages or spam",
                    "communications after you've unsubscribed",
                  ]
              ).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Back to form / privacy link */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link href="/join-cas">
            <Button className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0 hover:brightness-105">
              {fr ? "Retour au formulaire d'adhésion" : "Back to the membership form"}
            </Button>
          </Link>
          <Link href="/privacy-policy">
            <Button variant="outline" className="border-slate-300 dark:border-slate-700">
              {fr ? "Voir la Politique de confidentialité" : "View the Privacy Policy"} →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

function TopicCard({
  icon: Icon,
  title,
  freq,
  desc,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  freq: string;
  desc: string;
  accent: "cas" | "cann";
}) {
  const accentColor = accent === "cas" ? "text-[#00AFE6]" : "text-pink-500";
  const accentBg = accent === "cas" ? "bg-[#00AFE6]/10" : "bg-pink-500/10";
  return (
    <Card className="border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg ${accentBg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${accentColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-slate-800 dark:text-slate-100 text-sm leading-snug">
              {title}
            </div>
            <Badge variant="secondary" className="mt-1 text-[10px] font-medium">
              {freq}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}
