import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function CustomizeTiffinPlan() {
  const [plan, setPlan] = useState({
    duration: 7,
    meals: {
      breakfast: {
        enabled: true,
        items: [{ name: 'Poha', price: 40 }]
      },
      lunch: {
        enabled: true,
        items: [{ name: 'Dal', price: 60 }, { name: 'Rice', price: 30 }]
      },
      dinner: {
        enabled: false,
        items: []
      }
    },
    preferences: {
      isVeg: true,
      spiceLevel: 'medium',
      includeWeekends: true
    }
  });

  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [activeMeal, setActiveMeal] = useState(null);

  const calculateMealTotal = (mealItems) => {
    return mealItems.reduce((sum, item) => sum + Number(item.price), 0);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    Object.entries(plan.meals).forEach(([meal, data]) => {
      if (data.enabled) {
        total += calculateMealTotal(data.items);
      }
    });
    const days = plan.preferences.includeWeekends ? plan.duration : Math.floor(plan.duration * 5/7);
    return total * days;
  };

  const addItemToMeal = (meal) => {
    if (!newItem.name || !newItem.price) {
      Alert.alert('Invalid Input', 'Please enter both item name and price');
      return;
    }
    
    setPlan(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [meal]: {
          ...prev.meals[meal],
          items: [...prev.meals[meal].items, { ...newItem }]
        }
      }
    }));
    setNewItem({ name: '', price: '' });
  };

  const removeItem = (meal, index) => {
    setPlan(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [meal]: {
          ...prev.meals[meal],
          items: prev.meals[meal].items.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const renderMealCard = (mealType, icon) => {
    const mealData = plan.meals[mealType];
    const isActive = activeMeal === mealType;
    const total = calculateMealTotal(mealData.items);

    return (
      <View style={styles.mealSection}>
        <TouchableOpacity 
          style={[
            styles.mealHeader,
            mealData.enabled && styles.mealHeaderActive
          ]}
          onPress={() => {
            setPlan(prev => ({
              ...prev,
              meals: {
                ...prev.meals,
                [mealType]: {
                  ...prev.meals[mealType],
                  enabled: !prev.meals[mealType].enabled
                }
              }
            }));
          }}
        >
          <View style={styles.mealHeaderLeft}>
            <Icon 
              name={icon} 
              size={24} 
              color={mealData.enabled ? '#fff' : '#666'} 
            />
            <Text style={[
              styles.mealHeaderText,
              mealData.enabled && styles.mealHeaderTextActive
            ]}>
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </Text>
          </View>
          <Text style={[
            styles.mealTotal,
            mealData.enabled && styles.mealTotalActive
          ]}>
            ₹{total}
          </Text>
        </TouchableOpacity>

        {mealData.enabled && (
          <View style={styles.mealContent}>
            {mealData.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemRight}>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                  <TouchableOpacity 
                    onPress={() => removeItem(mealType, index)}
                    style={styles.removeButton}
                  >
                    <Icon name="close" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.addItemSection}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.itemInput}
                  placeholder="Item name"
                  value={newItem.name}
                  onChangeText={text => setNewItem(prev => ({ ...prev, name: text }))}
                />
                <TextInput
                  style={styles.priceInput}
                  placeholder="Price"
                  keyboardType="numeric"
                  value={newItem.price}
                  onChangeText={text => setNewItem(prev => ({ ...prev, price: text }))}
                />
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => addItemToMeal(mealType)}
                >
                  <Icon name="plus" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="food-variant" size={32} color="#FF6B6B" />
        <Text style={styles.headerText}>Customize Your Tiffin Plan</Text>
      </View>

      {/* Duration Selection */}
      <View style={styles.durationCard}>
        <Text style={styles.cardTitle}>Plan Duration</Text>
        <View style={styles.durationButtons}>
          {[7, 15, 30].map(days => (
            <TouchableOpacity
              key={days}
              style={[
                styles.durationButton,
                plan.duration === days && styles.durationButtonActive
              ]}
              onPress={() => setPlan(prev => ({ ...prev, duration: days }))}
            >
              <Text style={[
                styles.durationText,
                plan.duration === days && styles.durationTextActive
              ]}>
                {days} Days
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Meals Section */}
      <View style={styles.mealsCard}>
        <Text style={styles.cardTitle}>Select Meals & Items</Text>
        {renderMealCard('breakfast', 'coffee')}
        {renderMealCard('lunch', 'food')}
        {renderMealCard('dinner', 'food-variant')}
      </View>

      {/* Price Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Price</Text>
          <Text style={styles.summaryPrice}>₹{calculateTotalPrice()}</Text>
        </View>
        <Text style={styles.summaryNote}>
          {plan.duration} days × {Object.values(plan.meals).filter(m => m.enabled).length} meals per day
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Confirm Plan</Text>
        <Icon name="check-circle" size={24} color="#fff" />
      </TouchableOpacity>
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
  durationCard: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  durationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  durationButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  durationText: {
    color: '#666',
    fontWeight: '600',
  },
  durationTextActive: {
    color: '#fff',
  },
  mealsCard: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mealSection: {
    marginBottom: 15,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
  },
  mealHeaderActive: {
    backgroundColor: '#FF6B6B',
  },
  mealHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealHeaderText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  mealHeaderTextActive: {
    color: '#fff',
  },
  mealTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  mealTotalActive: {
    color: '#fff',
  },
  mealContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginRight: 10,
  },
  removeButton: {
    padding: 5,
  },
  addItemSection: {
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInput: {
    flex: 2,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  summaryPrice: {
    fontSize: 24,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  summaryNote: {
    marginTop: 5,
    color: '#666',
    fontSize: 14,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    margin: 15,
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default CustomizeTiffinPlan;