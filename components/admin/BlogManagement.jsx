"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Typography, Box, Button, Paper, Grid, 
  TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, IconButton, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, CircularProgress, Snackbar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { useThemeColors } from "@/context/ThemeContext";
import request from "@/utils/axios";
import toast from "react-hot-toast";

export default function BlogManagement() {
  const theme = useThemeColors();
  
  // State
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    sections: []
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingSectionImage, setUploadingSectionImage] = useState(false);
  const thumbnailInputRef = useRef(null);
  const sectionImageInputRefs = useRef([]);
  
  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await request.get(`/blogs?pageNumber=${page + 1}&pageSize=${rowsPerPage}`);
        if (data.success && data.data) {
          setBlogs(data.data.items || []);
          setTotalCount(data.data.totalCount || 0);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setAlert({
          open: true,
          message: 'Failed to load blogs',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [page, rowsPerPage]);
  
  // Handle add new blog
  const handleAddBlog = () => {
    setCurrentBlog(null);
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      sections: [{ contentType: 'text', subtitle: '', content: '', order: 1 }]
    });
    setOpenDialog(true);
  };
  
  // Handle edit blog
  const handleEditBlog = async (blogId) => {
    try {
      setLoading(true);
      const { data } = await request.get(`/blogs/${blogId}`);
      if (data.success && data.data) {
        const blogDetails = data.data;
        setCurrentBlog(blogDetails);
        
        // Get sections from API and prepare for form
        const formattedSections = blogDetails.sections?.length > 0 
          ? blogDetails.sections.map(section => ({
              id: section.id,
              contentType: section.contentType || 'text',
              subtitle: section.subtitle || '',
              content: section.content || '',
              order: section.order || 0
            }))
          : [{ contentType: 'text', subtitle: '', content: '', order: 1 }];
        
        setFormData({
          title: blogDetails.title || '',
          description: blogDetails.description || '',
          thumbnail: blogDetails.thumbnail || '',
          sections: formattedSections
        });
        setOpenDialog(true);
      }
    } catch (error) {
      console.error('Error fetching blog details:', error);
      setAlert({
        open: true,
        message: 'Failed to load blog details',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete blog
  const handleDeleteBlog = (blog) => {
    setBlogToDelete(blog);
    setConfirmDelete(true);
  };
  
  // Confirm delete blog
  const confirmDeleteBlog = async () => {
    try {
      setLoading(true);
      const { data } = await request.delete(`/blogs/${blogToDelete.id}`);
      if (data.success) {
        setAlert({
          open: true,
          message: 'Blog deleted successfully',
          severity: 'success'
        });
        // Refresh blogs list
        const { data: refreshedData } = await request.get(`/blogs?pageNumber=${page + 1}&pageSize=${rowsPerPage}`);
        if (refreshedData.success) {
          setBlogs(refreshedData.data.items || []);
          setTotalCount(refreshedData.data.totalCount || 0);
        }
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      setAlert({
        open: true,
        message: 'Failed to delete blog',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setConfirmDelete(false);
      setBlogToDelete(null);
    }
  };
  
  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle section change
  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    setFormData({
      ...formData,
      sections: updatedSections
    });
  };
  
  // Add new section
  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          id: null,
          contentType: 'text',
          subtitle: '',
          content: '',
          order: formData.sections.length + 1
        }
      ]
    });
  };
  
  // Remove section
  const removeSection = (index) => {
    const updatedSections = formData.sections.filter((_, i) => i !== index);
    // Update order numbers
    const reorderedSections = updatedSections.map((section, i) => ({
      ...section,
      order: i + 1
    }));
    setFormData({
      ...formData,
      sections: reorderedSections
    });
  };
  
  // Handle thumbnail upload
  const handleThumbnailUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingThumbnail(true);
    
    try {
      const formData = new FormData();
      formData.append('files', files[0]);
      
      const response = await request.post('/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success && response.data.data) {
        setFormData(prevState => ({
          ...prevState,
          thumbnail: response.data.data[0]
        }));
        toast.success("Thumbnail uploaded successfully");
      } else {
        toast.error("Failed to upload thumbnail");
      }
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      toast.error("Error uploading thumbnail");
    } finally {
      setUploadingThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    }
  };
  
  // Handle section image upload
  const handleSectionImageUpload = async (index, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingSectionImage(true);
    
    try {
      const formData = new FormData();
      formData.append('files', files[0]);
      
      const response = await request.post('/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success && response.data.data) {
        handleSectionChange(index, 'content', response.data.data[0]);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    } finally {
      setUploadingSectionImage(false);
      if (sectionImageInputRefs.current[index]) sectionImageInputRefs.current[index].value = '';
    }
  };
  
  // Remove image
  const handleRemoveImage = async (imageUrl, field, sectionIndex = null) => {
    try {
      if (imageUrl && imageUrl.startsWith('http')) {
        await request.delete(`/images?imageUrl=${encodeURIComponent(imageUrl)}`);
      }
      
      if (sectionIndex !== null) {
        handleSectionChange(sectionIndex, field, '');
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: ''
        }));
      }
      
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Error removing image");
    }
  };
  
  // Handle save blog
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Validate form data
      if (!formData.title.trim()) {
        toast.error("Title is required");
        setLoading(false);
        return;
      }
      
      // Prepare sections data for API
      const formattedSections = formData.sections.map(section => ({
        id: section.id || null,
        contentType: section.contentType,
        subtitle: section.subtitle || '',
        content: section.content || '',
        order: section.order
      }));
      
      const payload = {
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail,
        sections: formattedSections
      };
      
      let response;
      if (currentBlog) {
        // Update existing blog
        response = await request.patch(`/blogs/${currentBlog.id}`, payload);
      } else {
        // Create new blog
        response = await request.post('/blogs', payload);
      }
      
      if (response.data.success) {
        setAlert({
          open: true,
          message: currentBlog ? 'Blog updated successfully' : 'Blog created successfully',
          severity: 'success'
        });
        setOpenDialog(false);
        
        // Refresh blogs list
        const { data } = await request.get(`/blogs?pageNumber=${page + 1}&pageSize=${rowsPerPage}`);
        if (data.success) {
          setBlogs(data.data.items || []);
          setTotalCount(data.data.totalCount || 0);
        }
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      setAlert({
        open: true,
        message: 'Failed to save blog',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Container maxWidth="xl" sx={{ my: 1, minHeight: 'calc(100vh - 200px)' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddBlog}
          sx={{ 
            bgcolor: theme.primary,
            '&:hover': { bgcolor: theme.secondary }
          }}
        >
          Add New Blog
        </Button>
      </Box>
      
      {loading && !openDialog ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Thumbnail</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blogs.length > 0 ? blogs.map((blog) => (
                  <TableRow key={blog.id} hover>
                    <TableCell>
                      <Box
                        component="img"
                        sx={{
                          height: 60,
                          width: 100,
                          objectFit: 'cover',
                          borderRadius: 1
                        }}
                        src={blog.thumbnail || '/images/blog/blog-placeholder.jpg'}
                        alt={blog.title}
                        onError={(e) => {
                          e.target.src = '/images/blog/blog-placeholder.jpg';
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>{blog.title}</TableCell>
                    <TableCell>
                      {blog.description?.length > 100
                        ? `${blog.description.substring(0, 100)}...`
                        : blog.description}
                    </TableCell>
                    <TableCell>{formatDate(blog.lastUpdatedTime)}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditBlog(blog.id)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteBlog(blog)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body1" py={3}>
                        No blogs found. Click "Add New Blog" to create one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      
      {/* Add/Edit Blog Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {currentBlog ? 'Edit Blog' : 'Create New Blog'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            
            {/* Thumbnail upload */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Thumbnail Image
              </Typography>
              
              {formData.thumbnail ? (
                <Box sx={{ position: 'relative', width: 'fit-content', mb: 2 }}>
                  <Box
                    component="img"
                    sx={{
                      height: 150,
                      maxWidth: '100%',
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid rgba(0,0,0,0.12)'
                    }}
                    src={formData.thumbnail}
                    alt="Blog thumbnail"
                  />
                  <IconButton 
                    sx={{ 
                      position: 'absolute', 
                      top: 5, 
                      right: 5, 
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.7)',
                      }
                    }}
                    size="small"
                    onClick={() => handleRemoveImage(formData.thumbnail, 'thumbnail')}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    mb: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: theme.primary,
                      bgcolor: 'rgba(78, 205, 196, 0.04)'
                    }
                  }}
                  onClick={() => thumbnailInputRef.current?.click()}
                >
                  {uploadingThumbnail ? (
                    <CircularProgress size={30} />
                  ) : (
                    <>
                      <ImageIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                      <Typography>Click to upload thumbnail image</Typography>
                    </>
                  )}
                </Box>
              )}
              
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={thumbnailInputRef}
                onChange={handleThumbnailUpload}
                disabled={uploadingThumbnail}
              />
            </Box>
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Blog Sections
            </Typography>
            
            {formData.sections.map((section, index) => (
              <Box 
                key={index} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Section {index + 1}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    onClick={() => removeSection(index)}
                  >
                    Remove
                  </Button>
                </Box>
                
                <TextField
                  select
                  margin="normal"
                  fullWidth
                  label="Content Type"
                  value={section.contentType}
                  onChange={(e) => handleSectionChange(index, 'contentType', e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                </TextField>
                
                <TextField
                  margin="normal"
                  fullWidth
                  label="Subtitle"
                  value={section.subtitle || ''}
                  onChange={(e) => handleSectionChange(index, 'subtitle', e.target.value)}
                />
                
                {section.contentType === 'text' ? (
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Content"
                    value={section.content || ''}
                    onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                    multiline
                    rows={4}
                  />
                ) : (
                  <>
                    {section.content ? (
                      <Box sx={{ position: 'relative', width: 'fit-content', my: 2 }}>
                        <Box
                          component="img"
                          sx={{
                            height: 150,
                            maxWidth: '100%',
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid rgba(0,0,0,0.12)'
                          }}
                          src={section.content}
                          alt={`Section ${index + 1} image`}
                        />
                        <IconButton 
                          sx={{ 
                            position: 'absolute', 
                            top: 5, 
                            right: 5, 
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'rgba(0,0,0,0.7)',
                            }
                          }}
                          size="small"
                          onClick={() => handleRemoveImage(section.content, 'content', index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          border: '2px dashed',
                          borderColor: 'divider',
                          borderRadius: 1,
                          p: 3,
                          textAlign: 'center',
                          my: 2,
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: theme.primary,
                            bgcolor: 'rgba(78, 205, 196, 0.04)'
                          }
                        }}
                        onClick={() => sectionImageInputRefs.current[index]?.click()}
                      >
                        {uploadingSectionImage ? (
                          <CircularProgress size={30} />
                        ) : (
                          <>
                            <ImageIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                            <Typography>Click to upload section image</Typography>
                          </>
                        )}
                      </Box>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      ref={(el) => (sectionImageInputRefs.current[index] = el)}
                      onChange={(e) => handleSectionImageUpload(index, e)}
                      disabled={uploadingSectionImage}
                    />
                  </>
                )}
              </Box>
            ))}
            
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />} 
              onClick={addSection}
              sx={{ mt: 1 }}
            >
              Add Section
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSave}
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the blog "{blogToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button 
            onClick={confirmDeleteBlog}
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert 
          onClose={() => setAlert({ ...alert, open: false })} 
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 