import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Politique de Confidentialité</h1>
          <p className="text-emerald-100">Dernière mise à jour : Décembre 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Chez Fi-Khidmatik, nous prenons la protection de vos données personnelles très au sérieux.
              Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Données Collectées</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Nous collectons les données suivantes :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Informations d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
              <li><strong>Informations de localisation :</strong> ville, adresse (pour les services à domicile)</li>
              <li><strong>Données de navigation :</strong> pages visitées, durée des visites, appareil utilisé</li>
              <li><strong>Données de transaction :</strong> historique des réservations et des avis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation des Données</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Fournir et améliorer nos services</li>
              <li>Vous mettre en relation avec les artisans</li>
              <li>Vous envoyer des notifications importantes</li>
              <li>Personnaliser votre expérience</li>
              <li>Assurer la sécurité de la plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Partage des Données</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Nous partageons vos données uniquement avec :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Les artisans que vous contactez (nom, téléphone, adresse pour le service)</li>
              <li>Nos prestataires techniques (hébergement, analyse)</li>
              <li>Les autorités compétentes si requis par la loi</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Nous ne vendons jamais vos données personnelles à des tiers.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sécurité des Données</h2>
            <p className="text-gray-600 leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li>Chiffrement des données sensibles (SSL/TLS)</li>
              <li>Stockage sécurisé des mots de passe (hachage)</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Surveillance régulière des systèmes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Vos Droits</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Conformément à la loi marocaine, vous avez le droit de :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier des informations inexactes</li>
              <li>Demander la suppression de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Retirer votre consentement à tout moment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Nous utilisons des cookies pour améliorer votre expérience. Ces cookies nous permettent de :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li>Maintenir votre session connectée</li>
              <li>Mémoriser vos préférences</li>
              <li>Analyser l'utilisation de la plateforme</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Conservation des Données</h2>
            <p className="text-gray-600 leading-relaxed">
              Nous conservons vos données personnelles pendant la durée de votre utilisation du service,
              puis pendant une période de 3 ans après la fermeture de votre compte pour des raisons légales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Pour toute question concernant vos données personnelles, contactez-nous :
            </p>
            <ul className="text-gray-600 mt-2">
              <li>Email : <a href="mailto:alleabdo301@gmail.com" className="text-emerald-600 hover:underline">alleabdo301@gmail.com</a></li>
              <li>Téléphone : <a href="tel:+212625034547" className="text-emerald-600 hover:underline">+212 625 034 547</a></li>
            </ul>
          </section>

        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
