import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Rating,
  Grid,
  Container,
  Pagination,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField as DialogTextField,
  Chip
} from '@mui/material';
import { Search, Star, FilterAlt, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Layout from './layout';

const testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [showMyReviews, setShowMyReviews] = useState(false);
  const reviewsPerPage = 6;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Dialog states
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const endpoint = showMyReviews ? '/review/userReview' : '/review';
        const response = await axios.get(endpoint);
        setReviews(response.data);
        setFilteredReviews(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [showMyReviews]);

  useEffect(() => {
    let results = reviews;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(review => 
        (review.firstname?.toLowerCase().includes(term)) ||
        (review.lastname?.toLowerCase().includes(term)) ||
        (review.comment?.toLowerCase().includes(term)) ||
        (review.model?.toLowerCase().includes(term)) ||
        (review.brand?.toLowerCase().includes(term))
      );
    }
    
    // Filter by rating
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter);
      results = results.filter(review => review.rating >= minRating);
    }
    
    setFilteredReviews(results);
    setPage(1);
  }, [searchTerm, ratingFilter, reviews]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/review/${selectedReview._id}`);
      setReviews(reviews.filter(review => review._id !== selectedReview._id));
      setOpenDeleteDialog(false);
      setSelectedReview(null);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const updatedReview = await axios.put(`/review/${selectedReview._id}`, {
        comment: editComment,
        rating: editRating
      });
      setReviews(reviews.map(review => 
        review._id === selectedReview._id ? updatedReview.data : review
      ));
      setOpenEditDialog(false);
      setSelectedReview(null);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const openDeleteConfirm = (review) => {
    setSelectedReview(review);
    setOpenDeleteDialog(true);
  };

  const openEditForm = (review) => {
    setSelectedReview(review);
    setEditComment(review.comment);
    setEditRating(review.rating);
    setOpenEditDialog(true);
  };

  // Pagination logic
  const indexOfLastReview = page * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Chargement des avis...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="error">Erreur: {error}</Typography>
      </Container>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
          Témoignages de nos clients
        </Typography>
        
        {/* Toggle Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant={showMyReviews ? "contained" : "outlined"}
            onClick={() => setShowMyReviews(!showMyReviews)}
            sx={{
              borderRadius: 20,
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            {showMyReviews ? "Voir tous les avis" : "Voir mes avis"}
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          mb: 4,
          alignItems: isMobile ? 'stretch' : 'center'
        }}>
          <TextField
            fullWidth={isMobile}
            variant="outlined"
            placeholder="Rechercher des avis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          
          <FormControl sx={{ minWidth: isMobile ? '100%' : 180 }}>
            <InputLabel id="rating-filter-label">Filtrer par note</InputLabel>
            <Select
              labelId="rating-filter-label"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              label="Filtrer par note"
              startAdornment={
                <InputAdornment position="start">
                  <FilterAlt />
                </InputAdornment>
              }
            >
              <MenuItem value="all">Toutes les notes</MenuItem>
              <MenuItem value="5">5 étoiles</MenuItem>
              <MenuItem value="4">4 étoiles et plus</MenuItem>
              <MenuItem value="3">3 étoiles et plus</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <Typography align="center" sx={{ py: 4 }}>
            Aucun avis ne correspond à vos critères de recherche.
          </Typography>
        ) : (
          <>
            <Grid container spacing={4}>
              {currentReviews.map((review) => (
                <Grid item xs={12} sm={6} md={4} key={review._id}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: showMyReviews ? '0 8px 25px rgba(0,0,0,0.15)' : 3
                    },
                    ...(showMyReviews && {
                      border: `2px solid ${theme.palette.primary.main}`,
                      '&::before': {
                        content: '"Mes avis"',
                        position: 'absolute',
                        top: 2,
                        left: 16,
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        padding: '2px 12px',
                        borderRadius: 12,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        zIndex: 1
                      }
                    })
                  }}>
                    {showMyReviews && (
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        display: 'flex',
                        gap: 1,
                        zIndex: 2
                      }}>
                        <IconButton 
                          size="small" 
                          onClick={() => openEditForm(review)}
                          sx={{ 
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: 'primary.main', color: 'white' }
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => openDeleteConfirm(review)}
                          sx={{ 
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: 'error.main', color: 'white' }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                    
                    <CardContent sx={{ flexGrow: 1, pt: showMyReviews ? 4 : 2 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2 
                      }}>
                        <Avatar sx={{ 
                          bgcolor: theme.palette.primary.main,
                          mr: 2,
                          width: 56, 
                          height: 56,
                          fontSize: '1.25rem'
                        }}>
                          {getInitials(review.firstname, review.lastname)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="div">
                            {review.firstname} {review.lastname}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {review.model} • {review.brand}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Rating
                        value={review.rating}
                        readOnly
                        precision={0.5}
                        emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                        sx={{ color: '#ffc107', mb: 1 }}
                      />
                      
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        "{review.comment}"
                      </Typography>
                      
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>
            )}
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer cet avis ?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
            <Button onClick={handleDelete} color="error">Supprimer</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Modifier l'avis</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Typography variant="body2">Note :</Typography>
              <Rating
                value={editRating}
                onChange={(event, newValue) => setEditRating(newValue)}
                precision={0.5}
                sx={{ mb: 2 }}
              />
              <DialogTextField
                multiline
                rows={4}
                label="Commentaire"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Annuler</Button>
            <Button onClick={handleEdit} variant="contained">Enregistrer</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default testimonials;