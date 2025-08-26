

import { useState } from 'react'


const ForgetPass = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

// Implémentons la fonction de soumission du formulaire avec une simulation d'appel API.
// Nous utiliserons async/await pour une meilleure gestion des promesses.

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setIsLoading(true)
    setIsSuccess(false)

    try {
      // Simulation d'appel API - À remplacer par votre véritable endpoint
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSuccess(true)
      setEmail('')
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error)
    } finally {
      setIsLoading(false)
    }
  }

// Créons le rendu conditionnel pour afficher soit le formulaire, soit le message de succès.
// Utilisons des caractères Unicode pour les icônes (✉️ pour l'email, ⌛ pour le chargement)
// et appliquons les styles CSS personnalisés fournis.

  return (
    <div className="max-w-md mx-auto p-6">
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button 
            type="submit" 
            className="bouton-rose"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                Envoi en cours... ⌛
              </>
            ) : (
              <>
                Envoyer le lien de réinitialisation ✉️
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="mx-auto text-4xl text-green-500">✉️</div>
          <p className="text-green-600 font-medium">
            Un email vous a été envoyé pour réinitialiser votre mot de passe.
          </p>
        </div>
      )}
    </div>
  )
}

export default ForgetPass