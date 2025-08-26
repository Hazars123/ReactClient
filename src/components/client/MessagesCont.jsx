import React, { useState, useEffect } from 'react';
import './MessagesCont.css';

// Composant MessageCard séparé pour une meilleure modularité
const MessageCard = React.memo(({ message, onDelete, onReply, onMarkAsRead }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleExpand = () => {
    if (!isExpanded && !message.read) {
      onMarkAsRead(message.email);
    }
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  return (
    <div className={`message-card ${isExpanded ? 'expanded' : ''} ${!message.read ? 'unread' : ''} ${isAnimating ? 'animating' : ''}`}>
      <div className="message-header">
        <div className="sender-info">
          <div className="message-avatar">
            {message.firstname.charAt(0)}{message.lastname.charAt(0)}
          </div>
          <div className="sender-details">
            <h3 className="sender-name">
              {message.firstname} {message.lastname}
              {!message.read && <span className="unread-badge">Nouveau</span>}
            </h3>
            <div className="sender-meta">
              <span className="sender-email">{message.email}</span>
              <span className="message-date">
                {new Date(message.date).toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="message-actions">
          <button
            onClick={toggleExpand}
            className="action-btn expand-btn"
            aria-label={isExpanded ? 'Réduire le message' : 'Voir les détails'}
          >
            {isExpanded ? (
              <i className="fas fa-chevron-up"></i>
            ) : (
              <i className="fas fa-chevron-down"></i>
            )}
          </button>
          <button
            onClick={() => onReply(message)}
            className="action-btn reply-btn"
            aria-label="Répondre"
          >
            <i className="fas fa-reply"></i>
          </button>
          <button
            onClick={() => onDelete(message.email)}
            className="action-btn delete-btn"
            aria-label="Supprimer"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      
      <div className={`message-content ${isExpanded ? 'visible' : ''}`}>
        <div className="message-text">
          <p>{message.message}</p>
        </div>
        
        {message.reply && (
          <div className="message-reply">
            <div className="reply-header">
              <i className="fas fa-share"></i>
              <h4>Votre réponse</h4>
            </div>
            <div className="reply-text">
              <p>{message.reply}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Composant ReplyModal séparé
const ReplyModal = ({ message, onClose, onSend }) => {
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await onSend(message.email, replyText);
      onClose();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
          <i className="fas fa-times"></i>
        </button>
        
        <h2 className="modal-title">
          <i className="fas fa-reply"></i> Répondre à {message.firstname} {message.lastname}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Message original</label>
            <div className="original-message">
              <p>{message.message}</p>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="replyText" className="form-label">Votre réponse</label>
            <textarea
              id="replyText"
              className="form-textarea"
              rows="6"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
              placeholder="Écrivez votre réponse ici..."
            />
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSending}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSending || !replyText.trim()}
            >
              {isSending ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Envoi...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Envoyer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant principal
const MessagesCont = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      message: 'Bonjour, je souhaite obtenir plus d\'informations sur votre produit. Pouvez-vous me dire quelles sont les spécifications techniques et les options disponibles ?',
      date: '2023-05-15T10:30:00Z',
      read: false
    },
    {
      id: 2,
      firstname: 'Marie',
      lastname: 'Martin',
      email: 'marie.martin@example.com',
      message: 'Je voudrais faire une réservation pour demain. Est-ce que vous avez encore de la disponibilité pour 2 personnes vers 20h ?',
      date: '2023-05-16T14:45:00Z',
      reply: 'Nous avons bien reçu votre demande de réservation. Une table pour 2 personnes a été réservée pour demain à 20h. Vous recevrez un email de confirmation sous peu.',
      read: true
    },
    {
      id: 3,
      firstname: 'Pierre',
      lastname: 'Lefevre',
      email: 'pierre.lefevre@example.com',
      message: 'J\'ai un problème avec ma commande passée la semaine dernière. Le produit reçu ne correspond pas à ce que j\'ai commandé.',
      date: '2023-05-17T09:15:00Z',
      read: false
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 5;

  // Simuler un chargement
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredMessages = messages.filter(msg => 
    `${msg.firstname} ${msg.lastname} ${msg.email} ${msg.message}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedMessages = [...filteredMessages].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMessages = sortedMessages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);

  const handleDelete = (email) => {
    setMessages(messages.filter(message => message.email !== email));
    if (paginatedMessages.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  const handleMarkAsRead = (email) => {
    setMessages(messages.map(msg => 
      msg.email === email ? { ...msg, read: true } : msg
    ));
  };

  const handleSendReply = async (email, replyText) => {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessages(messages.map(msg => 
      msg.email === email ? { ...msg, reply: replyText, read: true } : msg
    ));
  };

  return (
    <div className="messages-container">
      <header className="messages-header">
        <h1 className="messages-title">
          <i className="fas fa-envelope"></i> Boîte de réception
        </h1>
        <p className="messages-subtitle">Gérez les messages de vos clients</p>
      </header>
      
      <div className="search-container">
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Rechercher des messages..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Effacer la recherche"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      <div className="messages-controls">
        <div className="messages-stats">
          <span className="total-messages">
            {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
          </span>
          <span className="unread-count">
            {messages.filter(m => !m.read).length} non lu{messages.filter(m => !m.read).length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {filteredMessages.length > ITEMS_PER_PAGE && (
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn prev-btn"
            >
              <i className="fas fa-chevron-left"></i> Précédent
            </button>
            
            <div className="page-indicator">
              Page {currentPage} sur {totalPages}
            </div>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn next-btn"
            >
              Suivant <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement des messages...</p>
        </div>
      ) : paginatedMessages.length > 0 ? (
        <div className="messages-list">
          {paginatedMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onDelete={handleDelete}
              onReply={handleReply}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="fas fa-inbox"></i>
          </div>
          <h3 className="empty-state-title">Aucun message trouvé</h3>
          <p className="empty-state-description">
            {searchTerm 
              ? "Aucun message ne correspond à votre recherche."
              : "Votre boîte de réception est vide pour le moment."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="empty-state-action"
            >
              Réinitialiser la recherche
            </button>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`pagination-page ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {replyingTo && (
        <ReplyModal
          message={replyingTo}
          onClose={() => setReplyingTo(null)}
          onSend={handleSendReply}
        />
      )}
    </div>
  );
};

export default MessagesCont;