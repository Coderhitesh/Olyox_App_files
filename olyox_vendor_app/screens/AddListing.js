import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function AddListing() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    offerPrice: '',
    isVeg: true,
    rating: '4.5',
    preparationTime: '',
    stock: '',
    tags: [],
    image: null
  });

  const [currentTag, setCurrentTag] = useState('');

  const addTag = () => {
    if (currentTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="food" size={30} color="#FF6B6B" />
        <Text style={styles.headerText}>Add New Dish</Text>
      </View>

      {/* Image Upload Section */}
      <TouchableOpacity style={styles.imageUpload}>
        <Icon name="camera" size={40} color="#999" />
        <Text style={styles.uploadText}>Upload Dish Image</Text>
      </TouchableOpacity>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Dish Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dish Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter dish name"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your dish"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          />
        </View>

        {/* Price Section */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Price (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Offer Price (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={formData.offerPrice}
              onChangeText={(text) => setFormData(prev => ({ ...prev, offerPrice: text }))}
            />
          </View>
        </View>

        {/* Veg/Non-Veg Toggle */}
        <View style={[styles.row, styles.vegToggle]}>
          <Text style={styles.label}>Vegetarian</Text>
          <Switch
            value={formData.isVeg}
            onValueChange={(value) => setFormData(prev => ({ ...prev, isVeg: value }))}
            trackColor={{ false: '#FF6B6B', true: '#4CAF50' }}
            thumbColor={formData.isVeg ? '#fff' : '#fff'}
          />
        </View>

        {/* Preparation Time & Stock */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Prep Time (mins)</Text>
            <TextInput
              style={styles.input}
              placeholder="30"
              keyboardType="numeric"
              value={formData.preparationTime}
              onChangeText={(text) => setFormData(prev => ({ ...prev, preparationTime: text }))}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={styles.input}
              placeholder="Available portions"
              keyboardType="numeric"
              value={formData.stock}
              onChangeText={(text) => setFormData(prev => ({ ...prev, stock: text }))}
            />
          </View>
        </View>

        {/* Tags */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagInput}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Add tags (e.g., spicy, healthy)"
              value={currentTag}
              onChangeText={setCurrentTag}
              onSubmitEditing={addTag}
            />
            <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
              <Icon name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.tagContainer}>
            {formData.tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tag}
                onPress={() => removeTag(index)}
              >
                <Text style={styles.tagText}>{tag}</Text>
                <Icon name="close" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Add Dish</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  imageUpload: {
    height: 200,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  vegToggle: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  tagInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTagButton: {
    backgroundColor: '#FF6B6B',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tagText: {
    marginRight: 6,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddListing;