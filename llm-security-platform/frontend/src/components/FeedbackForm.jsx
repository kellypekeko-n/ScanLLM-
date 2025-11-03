/**
 * FeedbackForm Component
 * Formulaire pour soumettre des avis après un scan
 */

import React, { useState } from 'react';

const FeedbackForm = ({ scanId, systemName }) => {
  const [feedback, setFeedback] = useState({
    rating: 5,
    name: '',
    role: '',
    company: '',
    comment: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!feedback.name || !feedback.comment) {
      setError('Le nom et le commentaire sont requis');
      return;
    }

    // Sauvegarder le feedback dans localStorage
    const feedbackEntry = {
      ...feedback,
      scanId,
      systemName,
      date: new Date().toISOString(),
    };

    const existingFeedbacks = JSON.parse(localStorage.getItem('userFeedbacks') || '[]');
    existingFeedbacks.unshift(feedbackEntry);

    // Limiter à 100 feedbacks
    if (existingFeedbacks.length > 100) {
      existingFeedbacks.pop();
    }

    localStorage.setItem('userFeedbacks', JSON.stringify(existingFeedbacks));

    setSubmitted(true);
    
    // Réinitialiser après 3 secondes
    setTimeout(() => {
      setSubmitted(false);
      setFeedback({
        rating: 5,
        name: '',
        role: '',
        company: '',
        comment: '',
      });
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-green-900 mb-2">Merci pour votre avis!</h3>
        <p className="text-green-700">Votre feedback a été enregistré avec succès.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Partagez votre expérience
      </h3>
      <p className="text-gray-600 mb-6">
        Votre avis nous aide à améliorer notre plateforme
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFeedback({ ...feedback, rating: star })}
                className="focus:outline-none"
              >
                <svg
                  className={`w-8 h-8 ${
                    star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <input
            type="text"
            id="name"
            value={feedback.name}
            onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Votre nom"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Rôle (optionnel)
          </label>
          <input
            type="text"
            id="role"
            value={feedback.role}
            onChange={(e) => setFeedback({ ...feedback, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Ex: Security Engineer"
          />
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Entreprise (optionnel)
          </label>
          <input
            type="text"
            id="company"
            value={feedback.company}
            onChange={(e) => setFeedback({ ...feedback, company: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Nom de votre entreprise"
          />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire *
          </label>
          <textarea
            id="comment"
            value={feedback.comment}
            onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Partagez votre expérience avec notre plateforme..."
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-semibold transition-colors"
        >
          Soumettre mon avis
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
