import { motion, MotionConfig } from "framer-motion";
import { Shield, Mail, FileText, Lock, UserCheck, Globe, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const LAST_UPDATED = "May 19, 2026";

const CONTACT = {
  org: "Canadian Amyloidosis Society (CAS) / Société canadienne de l'amyloïdose (SCA)",
  address: "[CAS mailing address — to be confirmed]",
  email: "cas@amyloid.ca",
  privacyOfficerName: "[Privacy Officer name — to be confirmed]",
  privacyOfficerEmail: "[Privacy Officer email — to be confirmed]",
  cannEmail: "cann@amyloid.ca",
};

const SECTION_IDS = [
  "who-we-are",
  "info-collected",
  "how-we-use",
  "legal-basis",
  "sharing",
  "security",
  "retention",
  "your-rights",
  "cookies",
  "cross-border",
  "changes",
  "privacy-officer",
];

export default function PrivacyPolicy() {
  const { language } = useLanguage();
  const fr = language === "fr";

  return (
    <MotionConfig reducedMotion="user">
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
              <Shield className="w-3.5 h-3.5" />
              {fr ? "Confidentialité et conformité" : "Privacy & Compliance"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight">
              {fr ? "Politique de confidentialité" : "Privacy Policy"}
            </h1>
            <p className="mt-3 text-white/90 text-sm sm:text-base max-w-2xl">
              {fr
                ? "Comment la Société canadienne de l'amyloïdose (SCA) recueille, utilise, protège et partage vos renseignements personnels — en conformité avec la LPRPDE, la LCAP et la Loi 25 du Québec."
                : "How the Canadian Amyloidosis Society (CAS) collects, uses, protects and shares your personal information — in compliance with PIPEDA, CASL and Quebec's Law 25."}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/80">
              <Clock className="w-3.5 h-3.5" />
              {fr ? `Dernière mise à jour : ${LAST_UPDATED}` : `Last updated: ${LAST_UPDATED}`}
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {/* TOC */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-medium text-slate-700 dark:text-slate-200">
              {fr ? "Sur cette page" : "On this page"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside">
              {(fr
                ? [
                    "Qui nous sommes",
                    "Renseignements que nous recueillons",
                    "Comment nous utilisons vos renseignements",
                    "Base légale et consentement (LCAP, LPRPDE, Loi 25)",
                    "Avec qui nous partageons (CAS et RCIA)",
                    "Comment nous protégeons vos renseignements",
                    "Conservation et suppression",
                    "Vos droits",
                    "Cookies et analytique",
                    "Traitement hors du Canada",
                    "Modifications de cette politique",
                    "Coordonnées du responsable de la protection",
                  ]
                : [
                    "Who we are",
                    "Information we collect",
                    "How we use your information",
                    "Legal basis & consent (CASL, PIPEDA, Law 25)",
                    "Who we share with (CAS and CANN)",
                    "How we protect your information",
                    "Retention & deletion",
                    "Your rights",
                    "Cookies & analytics",
                    "Cross-border processing",
                    "Changes to this policy",
                    "Contacting our Privacy Officer",
                  ]
              ).map((s, i) => (
                <li key={s}>
                  <a href={`#${SECTION_IDS[i]}`} className="hover:text-[#00AFE6] hover:underline">
                    {s}
                  </a>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* 1. Who we are */}
        <Section id="who-we-are" icon={<UserCheck className="w-5 h-5 text-[#00AFE6]" />} title={fr ? "1. Qui nous sommes" : "1. Who we are"}>
          <p>
            {fr
              ? `La Société canadienne de l'amyloïdose (SCA) est un organisme à but non lucratif canadien qui soutient les patients, les soignants et les professionnels de la santé concernés par l'amyloïdose. Le Réseau canadien des infirmières en amyloïdose (RCIA) est un sous-groupe professionnel de la SCA. La SCA est la seule organisation responsable du traitement de vos renseignements personnels — y compris lorsque nous communiquons en votre nom au RCIA.`
              : `The Canadian Amyloidosis Society (CAS) is a Canadian not-for-profit that supports patients, caregivers, and healthcare professionals affected by amyloidosis. The Canadian Amyloidosis Nursing Network (CANN) is a professional sub-group of CAS. CAS is the sole organization responsible for handling your personal information — including when we communicate on CANN's behalf.`}
          </p>
        </Section>

        {/* 2. Information we collect */}
        <Section id="info-collected" icon={<FileText className="w-5 h-5 text-[#00AFE6]" />} title={fr ? "2. Renseignements que nous recueillons" : "2. Information we collect"}>
          <p className="mb-3">
            {fr
              ? "Nous ne recueillons que ce qui est nécessaire à la finalité indiquée. Les catégories typiques sont :"
              : "We only collect what's necessary for the purpose stated. Typical categories are:"}
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
            {(fr
              ? [
                  "Identité — prénom, nom de famille, désignation professionnelle",
                  "Coordonnées — adresse courriel, téléphone, adresse postale (uniquement si vous demandez à figurer sur la carte des services)",
                  "Affiliation professionnelle — établissement, sous-spécialité, type d'amyloïdose traitée",
                  "Préférences de communication — votre consentement et les sujets que vous souhaitez recevoir",
                  "Renseignements techniques limités — adresse IP, type de navigateur (voir Cookies)",
                ]
              : [
                  "Identity — first name, last name, professional designation",
                  "Contact — email address, phone, mailing address (only if you ask to be listed on the services map)",
                  "Professional affiliation — institution, sub-specialty, type of amyloidosis you treat",
                  "Communication preferences — your consent answer and the topics you want to receive",
                  "Limited technical info — IP address, browser type (see Cookies)",
                ]
            ).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {fr
              ? "Nous ne recueillons pas de renseignements médicaux sur les patients via ce site."
              : "We do not collect patient medical information through this website."}
          </p>
        </Section>

        {/* 3. How we use */}
        <Section id="how-we-use" icon={<Mail className="w-5 h-5 text-[#00AFE6]" />} title={fr ? "3. Comment nous utilisons vos renseignements" : "3. How we use your information"}>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
            {(fr
              ? [
                  "Traiter votre adhésion à la SCA ou au RCIA",
                  "Vous envoyer les communications que vous avez acceptées (infolettre, événements, recherche, collectes de fonds)",
                  "Vous inscrire au répertoire des services aux patients (si vous l'avez demandé)",
                  "Répondre à vos demandes et questions",
                  "Respecter nos obligations légales et statutaires",
                ]
              : [
                  "Process your CAS or CANN membership",
                  "Send you the communications you opted in to (newsletter, events, research, fundraising)",
                  "List you on the patient services directory (only if you asked)",
                  "Respond to your inquiries",
                  "Meet legal and statutory obligations",
                ]
            ).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>

        {/* 4. Legal basis */}
        <Section id="legal-basis" icon={<Shield className="w-5 h-5 text-[#00AFE6]" />} title={fr ? "4. Base légale et consentement (LCAP, LPRPDE, Loi 25)" : "4. Legal basis & consent (CASL, PIPEDA, Law 25)"}>
          <p className="mb-3">
            {fr
              ? "Notre traitement repose sur trois cadres juridiques canadiens :"
              : "Our handling rests on three Canadian frameworks:"}
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
            {(fr
              ? [
                  "LCAP — Loi canadienne anti-pourriel : nous n'envoyons des communications électroniques commerciales qu'avec votre consentement exprès. Nous conservons un journal d'audit (horodatage, libellé exact présenté, version du formulaire, locale) pour chaque consentement.",
                  "LPRPDE — Loi sur la protection des renseignements personnels et les documents électroniques : nous nous limitons aux finalités indiquées, nous obtenons votre consentement et nous vous accordons des droits d'accès et de correction.",
                  "Loi 25 (Québec) — pour les résidents du Québec, nous appliquons des règles supplémentaires : analyse d'impact pour les renseignements sensibles, paramètres par défaut respectueux de la vie privée, notification des incidents et droit à la portabilité des données.",
                ]
              : [
                  "CASL — Canada's Anti-Spam Legislation: we only send commercial electronic messages with your express consent. We keep an audit log (timestamp, exact wording shown, form version, locale) of every consent.",
                  "PIPEDA — Personal Information Protection and Electronic Documents Act: we limit ourselves to the purposes stated, we obtain your consent, and we grant you access and correction rights.",
                  "Quebec Law 25 — for Quebec residents, additional rules apply: impact assessments for sensitive info, privacy-by-default settings, incident notification, and the right to data portability.",
                ]
            ).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>

        {/* 5. Sharing */}
        <Section id="sharing" icon={<Globe className="w-5 h-5 text-[#00AFE6]" />} title={fr ? "5. Avec qui nous partageons (CAS et RCIA)" : "5. Who we share with (CAS and CANN)"}>
          <p>
            {fr
              ? `Nous ne vendons jamais vos renseignements. Nous partageons uniquement avec : (a) notre fournisseur de CRM (Zoho) qui stocke et synchronise vos données d'adhésion ; (b) notre fournisseur d'envoi de courriels lorsque vous avez accepté les communications ; (c) les autorités si la loi l'exige. Le RCIA est un sous-groupe interne de la SCA — il n'est pas un tiers.`
              : `We never sell your information. We only share with: (a) our CRM provider (Zoho) which stores and syncs your membership data; (b) our email-sending provider when you opted in to communications; (c) authorities when required by law. CANN is an internal sub-group of CAS — not a third party.`}
          </p>
        </Section>

        {/* 6. Security */}
        <Section id="security" icon={<Lock className="w-5 h-5 text-[#00AFE6]" />} title={fr ? "6. Comment nous protégeons vos renseignements" : "6. How we protect your information"}>
          <p>
            {fr
              ? "Toutes les données sont transmises sur HTTPS (TLS) et stockées chez des fournisseurs canadiens et nord-américains réputés qui appliquent un chiffrement au repos au niveau de l'infrastructure. L'accès administratif interne est restreint par mot de passe et limité au personnel ayant un besoin de savoir. Nous révisons nos pratiques de sécurité régulièrement et nous suivons les meilleures pratiques de l'industrie pour les organismes à but non lucratif canadiens. Aucun système n'est parfaitement sûr ; en cas d'incident affectant vos renseignements, nous vous aviserons conformément à la Loi 25 et à la LPRPDE."
              : "All data is transmitted over HTTPS (TLS) and stored with reputable Canadian and North American providers that apply infrastructure-level encryption at rest. Internal administrative access is password-restricted and limited to staff on a need-to-know basis. We review our security practices regularly and follow industry best practices for Canadian non-profits. No system is perfectly secure; in the event of an incident affecting your information, we will notify you in line with Law 25 and PIPEDA requirements."}
          </p>
        </Section>

        {/* 7. Retention */}
        <Section id="retention" icon={<Clock className="w-5 h-5 text-[#00AFE6]" />} title={fr ? "7. Conservation et suppression" : "7. Retention & deletion"}>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
            {(fr
              ? [
                  "Dossiers d'adhésion : conservés tant que vous êtes membre, puis 7 ans pour des raisons statutaires.",
                  "Journaux de consentement (LCAP) : conservés pendant au moins 3 ans après le retrait du consentement, comme preuve.",
                  "Demandes de contact : conservées 24 mois.",
                  "Vous pouvez demander la suppression à tout moment (voir Vos droits).",
                ]
              : [
                  "Membership records: kept while you're a member, then 7 years for statutory reasons.",
                  "Consent logs (CASL): kept at least 3 years after withdrawal of consent, as proof.",
                  "Contact inquiries: kept for 24 months.",
                  "You can request deletion at any time (see Your rights).",
                ]
            ).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>

        {/* 8. Your rights */}
        <Section id="your-rights" icon={<UserCheck className="w-5 h-5 text-[#00AFE6]" />} title={fr ? "8. Vos droits" : "8. Your rights"}>
          <p className="mb-3">
            {fr
              ? "En tant que personne concernée au Canada, vous avez le droit de :"
              : "As a data subject in Canada you have the right to:"}
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
            {(fr
              ? [
                  "Accéder à une copie des renseignements personnels que nous détenons à votre sujet",
                  "Demander une correction si quelque chose est inexact",
                  "Retirer votre consentement à recevoir des communications à tout moment",
                  "Demander la suppression de votre compte et de vos renseignements",
                  "Demander la portabilité de vos données (résidents du Québec — Loi 25)",
                  "Déposer une plainte auprès du Commissariat à la protection de la vie privée du Canada ou de la Commission d'accès à l'information du Québec",
                ]
              : [
                  "Access a copy of the personal information we hold about you",
                  "Request a correction if anything is inaccurate",
                  "Withdraw your communications consent at any time",
                  "Request deletion of your account and information",
                  "Request data portability (Quebec residents — Law 25)",
                  "File a complaint with the Office of the Privacy Commissioner of Canada or the Commission d'accès à l'information du Québec",
                ]
            ).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mt-3">
            {fr ? "Pour exercer un droit, écrivez à " : "To exercise a right, email "}
            <a href={`mailto:${CONTACT.email}`} className="text-[#00AFE6] hover:underline font-medium">
              {CONTACT.email}
            </a>
            {fr ? ". Nous répondons dans les 30 jours." : ". We respond within 30 days."}
          </p>
        </Section>

        {/* 9. Cookies */}
        <Section id="cookies" icon={<Globe className="w-5 h-5 text-[#00AFE6]" />} title={fr ? "9. Cookies et analytique" : "9. Cookies & analytics"}>
          <p>
            {fr
              ? "Nous n'utilisons que des cookies strictement nécessaires (session de connexion, sécurité, préférences de langue et de thème). Nous n'utilisons pas de cookies de publicité ni de pistage de tiers. Si nous ajoutons un jour des cookies d'analytique, nous mettrons à jour cette page et demanderons votre consentement au préalable."
              : "We only use strictly-necessary cookies (login session, security, language and theme preferences). We do not use advertising or third-party tracking cookies. If we ever add analytics cookies, we will update this page and ask for your consent first."}
          </p>
        </Section>

        {/* 9b. Cross-border processing */}
        <Section id="cross-border" icon={<Globe className="w-5 h-5 text-[#00AFE6]" />} title={fr ? "9b. Traitement hors du Canada" : "9b. Cross-border processing"}>
          <p>
            {fr
              ? "Certains de nos fournisseurs de services (notamment notre CRM Zoho et notre hébergement) peuvent traiter ou stocker vos renseignements aux États-Unis ou dans d'autres pays. Cela signifie que ces renseignements peuvent être soumis aux lois locales de ces pays, y compris à des demandes d'accès des autorités. Nous nous assurons par contrat que nos fournisseurs offrent un niveau de protection conforme aux normes canadiennes. Les résidents du Québec peuvent demander plus de détails à notre responsable de la protection des renseignements."
              : "Some of our service providers (notably our Zoho CRM and our hosting provider) may process or store your information in the United States or other countries. This means that information may be subject to those countries' local laws, including potential government access requests. We require by contract that our providers maintain protection levels consistent with Canadian standards. Quebec residents can request additional detail from our Privacy Officer."}
          </p>
        </Section>

        {/* 10. Changes */}
        <Section id="changes" icon={<AlertTriangle className="w-5 h-5 text-[#00AFE6]" />} title={fr ? "10. Modifications de cette politique" : "10. Changes to this policy"}>
          <p>
            {fr
              ? `Nous pouvons mettre à jour cette politique. La date de "Dernière mise à jour" en haut de cette page reflète la version actuelle. Les changements importants seront annoncés par courriel aux membres et sur la page d'accueil pendant au moins 30 jours.`
              : `We may update this policy. The "Last updated" date at the top of this page reflects the current version. Material changes will be announced by email to members and on the homepage for at least 30 days.`}
          </p>
        </Section>

        {/* 11. Contact / Privacy Officer */}
        <Card id="privacy-officer" className="border-[#00AFE6]/30 bg-[#00AFE6]/5 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium text-slate-800 dark:text-slate-100">
              <Mail className="w-5 h-5 text-[#00AFE6]" />
              {fr ? "11. Responsable de la protection des renseignements" : "11. Privacy Officer"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 dark:text-slate-200 space-y-2">
            <p>
              {fr
                ? "Pour toute question, demande d'accès, correction ou plainte concernant vos renseignements personnels, contactez :"
                : "For any question, access request, correction or complaint about your personal information, contact:"}
            </p>
            <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 space-y-1.5 text-sm">
              <div>
                <span className="font-medium">{CONTACT.privacyOfficerName}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {fr ? "Responsable" : "Officer"}
                </Badge>
              </div>
              <div>{CONTACT.org}</div>
              <div>{CONTACT.address}</div>
              <div className="text-slate-500 dark:text-slate-400">
                {CONTACT.privacyOfficerEmail}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </MotionConfig>
  );
}

function Section({ id, icon, title, children }: { id?: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3 }}
      className="scroll-mt-24"
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-lg font-serif font-medium text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{children}</div>
    </motion.section>
  );
}
