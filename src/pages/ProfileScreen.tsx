import React, { useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { MOVIE_GENRES, FavoriteMovie } from '@/types';

export const ProfileScreen: React.FC<{ userId: string; onBack: () => void }> = ({ userId, onBack }) => {
  const { favorites, loading, addFavorite } = useFavorites(userId);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseYear: '',
    description: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.title.trim()) newErrors.title = 'O título do filme é obrigatório.';
    if (!formData.genre) newErrors.genre = 'O gênero é obrigatório.';

    const year = parseInt(formData.releaseYear);
    const currentYear = new Date().getFullYear();
    if (!formData.releaseYear || isNaN(year) || year < 1888 || year > currentYear) {
      newErrors.releaseYear = `O ano deve ser válido (entre 1888 e ${currentYear}).`;
    }

    if (formData.description && (formData.description.length < 10 || formData.description.length > 500)) {
      newErrors.description = 'A descrição deve ter entre 10 e 500 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await addFavorite({
        title: formData.title,
        genre: formData.genre,
        releaseYear: parseInt(formData.releaseYear),
        description: formData.description
      });
      setFormData({ title: '', genre: '', releaseYear: '', description: '' });
      setSuccessMessage('Filme adicionado aos favoritos com sucesso!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Failed to add favorite:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl overflow-y-auto chat-scroll p-6 space-y-8 animate-fade-in pb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black italic">Meu Perfil</h2>
        <button onClick={onBack} className="text-xs font-black uppercase text-indigo-400 hover:underline">Voltar ao Chat</button>
      </div>

      <div className="glass p-8 rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold mb-6">Adicionar Filme Favorito</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-slate-400">Título do Filme</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full bg-slate-950/50 border ${errors.title ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white`}
                placeholder="Ex: Interestelar"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="genre" className="text-xs font-bold uppercase tracking-widest text-slate-400">Gênero</label>
              <select
                id="genre"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className={`w-full bg-slate-950/50 border ${errors.genre ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-300`}
              >
                <option value="">Selecione um gênero</option>
                {MOVIE_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.genre && <p className="text-red-400 text-xs mt-1">{errors.genre}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="releaseYear" className="text-xs font-bold uppercase tracking-widest text-slate-400">Ano de Lançamento</label>
              <input
                id="releaseYear"
                type="number"
                value={formData.releaseYear}
                onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
                className={`w-full bg-slate-950/50 border ${errors.releaseYear ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white`}
                placeholder="Ex: 2014"
              />
              {errors.releaseYear && <p className="text-red-400 text-xs mt-1">{errors.releaseYear}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-slate-400">Descrição (Opcional)</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full bg-slate-950/50 border ${errors.description ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors min-h-[100px] text-white`}
              placeholder="O que você mais gosta neste filme?"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {successMessage && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-medium">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
          >
            {isSubmitting ? 'Salvando...' : 'Adicionar aos Favoritos'}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold">Meus Favoritos</h3>
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div></div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12 bg-white/2 rounded-3xl border border-white/5">
            <p className="text-slate-500 font-medium">Você ainda não tem filmes favoritos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((movie) => (
              <div key={movie.id} className="glass p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-full font-bold uppercase tracking-wider">{movie.genre}</span>
                  <span className="text-xs text-slate-500 font-bold">{movie.releaseYear}</span>
                </div>
                <h4 className="font-bold text-white text-lg mb-2">{movie.title}</h4>
                {movie.description && <p className="text-sm text-slate-400 line-clamp-3">{movie.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
