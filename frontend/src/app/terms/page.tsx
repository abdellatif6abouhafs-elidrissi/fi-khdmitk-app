import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Conditions d'Utilisation</h1>
          <p className="text-emerald-100">Dernière mise à jour : Décembre 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptation des Conditions</h2>
            <p className="text-gray-600 leading-relaxed">
              En accédant et en utilisant la plateforme Fi-Khidmatik, vous acceptez d'être lié par ces conditions d'utilisation.
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description du Service</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Fi-Khidmatik est une plateforme en ligne qui met en relation des particuliers avec des artisans et prestataires de services à domicile au Maroc.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Notre rôle se limite à la mise en relation. Nous ne sommes pas partie aux contrats conclus entre les utilisateurs et les artisans.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Inscription et Compte</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
              <li>Les informations fournies doivent être exactes et à jour</li>
              <li>Vous êtes responsable de la confidentialité de votre mot de passe</li>
              <li>Un seul compte par personne est autorisé</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Utilisation de la Plateforme</h2>
            <p className="text-gray-600 leading-relaxed mb-4">En utilisant Fi-Khidmatik, vous vous engagez à :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Ne pas publier de contenu illégal, offensant ou trompeur</li>
              <li>Respecter les autres utilisateurs et les artisans</li>
              <li>Ne pas utiliser la plateforme à des fins commerciales non autorisées</li>
              <li>Ne pas tenter de contourner les mesures de sécurité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Responsabilité des Artisans</h2>
            <p className="text-gray-600 leading-relaxed">
              Les artisans inscrits sur Fi-Khidmatik sont des professionnels indépendants. Ils sont seuls responsables de la qualité de leurs services,
              du respect des délais et de la conformité avec les réglementations en vigueur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Avis et Évaluations</h2>
            <p className="text-gray-600 leading-relaxed">
              Les utilisateurs peuvent laisser des avis après une prestation. Ces avis doivent être honnêtes, respectueux et basés sur une expérience réelle.
              Fi-Khidmatik se réserve le droit de supprimer les avis qui ne respectent pas ces critères.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation de Responsabilité</h2>
            <p className="text-gray-600 leading-relaxed">
              Fi-Khidmatik ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de la plateforme
              ou des services fournis par les artisans.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modification des Conditions</h2>
            <p className="text-gray-600 leading-relaxed">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des modifications importantes.
              L'utilisation continue de la plateforme après modification vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Pour toute question concernant ces conditions, contactez-nous à :
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
