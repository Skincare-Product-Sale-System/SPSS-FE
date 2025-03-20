"use client";
import React, { useState, useEffect } from "react";
import request from "@/utlis/axios";
import toast from "react-hot-toast";
import useAuthStore from "@/context/authStore";
import useQueryStore from "@/context/queryStore";
import AddressItem from "@/components/address/AddressItem";
import { useTheme } from "@mui/material/styles";
import { 
  CircularProgress, 
  TextField, 
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Box,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function MyAddress() {
  const theme = useTheme();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { Id } = useAuthStore();
  const { switcher, revalidate } = useQueryStore();
  
  // Form state
  const [formData, setFormData] = useState({
    countryId: "",
    streetNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    ward: "",
    province: "",
    postCode: "",
    isDefault: false
  });

  useEffect(() => {
    if (Id) {
      fetchAddresses();
    }
    fetchCountries();
  }, [Id, switcher]);

  const fetchAddresses = async () => {
    try {
      console.log("Fetching addresses for user ID:", Id);
      const { data } = await request.get(`/addresses/user/${Id}`);
      console.log("Addresses response:", data);
      setAddresses(data.data.items || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      setCountriesLoading(true);
      const { data } = await request.get(`/countries`);
      console.log("Countries response:", data);
      setCountries(data.data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to load countries");
    } finally {
      setCountriesLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`Input changed: ${name} = ${type === 'checkbox' ? checked : value}`);
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSave = async () => {
    // Validate form
    if (!formData.countryId) {
      toast.error("Country is required");
      return;
    }
    if (!formData.streetNumber) {
      toast.error("Street number is required");
      return;
    }
    if (!formData.addressLine1) {
      toast.error("Address Line 1 is required");
      return;
    }
    if (!formData.addressLine2) {
      toast.error("Address Line 2 is required");
      return;
    }
    if (!formData.city) {
      toast.error("City is required");
      return;
    }
    if (!formData.ward) {
      toast.error("Ward is required");
      return;
    }
    if (!formData.province) {
      toast.error("Province is required");
      return;
    }
    if (!formData.postCode) {
      toast.error("Post Code is required");
      return;
    }
    
    setSaving(true);
    try {
      const payload = {
        ...formData,
        userId: Id
      };
      
      console.log("Saving address with data:", payload);
      
      if (isEditing) {
        console.log(`Updating address with ID: ${editingId}`);
        await request.patch(`/addresses/${editingId}`, payload);
        toast.success("Address updated successfully");
      } else {
        console.log("Creating new address");
        await request.post("/address", payload);
        toast.success("Address added successfully");
      }
      
      // Refresh the address list
      revalidate();
      await fetchAddresses();
      
      // Reset form and UI state
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error(
        isEditing ? "Failed to update address" : "Failed to add address"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    console.log("Editing address:", address);
    setIsEditing(true);
    setEditingId(address.id);
    setShowForm(true);
    
    // Set form data from address
    setFormData({
      countryId: address.countryId || "",
      streetNumber: address.streetNumber || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      ward: address.ward || "",
      province: address.province || "",
      postCode: address.postCode || "",
      isDefault: address.isDefault || false
    });
  };

  const resetForm = () => {
    setFormData({
      countryId: "",
      streetNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      ward: "",
      province: "",
      postCode: "",
      isDefault: false
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        console.log(`Deleting address with ID: ${id}`);
        await request.delete(`/addresses/${id}`);
        toast.success("Address deleted successfully");
        await fetchAddresses();
      } catch (err) {
        console.error("Error deleting address:", err);
        toast.error("Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      console.log(`Setting address with ID: ${id} as default`);
      await request.put(`/user-addresses/${id}/set-default`);
      toast.success("Default address updated");
      await fetchAddresses();
    } catch (err) {
      console.error("Error setting default address:", err);
      toast.error("Failed to update default address");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight="600" color={theme.palette.text.primary}>
          My Addresses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            console.log("Add new address button clicked");
            setShowForm(true);
            setIsEditing(false);
            setEditingId(null);
            resetForm();
          }}
          sx={{
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            }
          }}
        >
          Add New Address
        </Button>
      </div>

      {showForm && (
        <Paper elevation={1} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="600" color={theme.palette.primary.main} mb={3}>
            {isEditing ? "Edit Address" : "Add New Address"}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="country-label">Country</InputLabel>
                <Select
                  labelId="country-label"
                  label="Country"
                  name="countryId"
                  value={formData.countryId}
                  onChange={handleInputChange}
                  disabled={countriesLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select a country</em>
                  </MenuItem>
                  {countries && countries.length > 0 ? (
                    countries.map((country) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.countryName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No countries available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Street Number"
                fullWidth
                name="streetNumber"
                value={formData.streetNumber}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Address Line 1"
                fullWidth
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Address Line 2"
                fullWidth
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="City"
                fullWidth
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Ward"
                fullWidth
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Province"
                fullWidth
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Post Code"
                fullWidth
                name="postCode"
                value={formData.postCode}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    sx={{
                      color: theme.palette.primary.main,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label="Set as default address"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => {
                console.log("Cancel button clicked");
                setShowForm(false);
                resetForm();
              }}
              sx={{
                borderColor: theme.palette.grey[300],
                color: theme.palette.text.primary,
                '&:hover': {
                  borderColor: theme.palette.grey[500],
                  backgroundColor: theme.palette.grey[100],
                }
              }}
            >
              Cancel
            </Button>
            
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              {saving ? 'Saving...' : isEditing ? 'Update Address' : 'Add Address'}
            </Button>
          </Box>
        </Paper>
      )}

      <Grid container spacing={3}>
        {addresses && addresses.length > 0 ? (
          addresses.map((address) => (
            <Grid item xs={12} md={6} key={address.id}>
              <AddressItem
                address={address}
                showActions={true}
                onEdit={() => handleEdit(address)}
                onDelete={() => handleDelete(address.id)}
                onSetDefault={() => handleSetDefault(address.id)}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ 
              textAlign: 'center', 
              py: 4, 
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              border: `1px dashed ${theme.palette.divider}`
            }}>
              <Typography variant="body1">
                No addresses found. Add your first address!
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </div>
  );
} 