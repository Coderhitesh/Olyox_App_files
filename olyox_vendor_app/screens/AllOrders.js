import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AllOrders = () => {
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Demo data for orders
    const orders = [
        {
            id: 'ORD001',
            time: '10:30 AM',
            date: '2024-01-15',
            customerName: 'John Doe',
            address: '123 Green Park, Near City Mall, Delhi',
            items: [
                { name: 'Veg Thali', quantity: 2, price: 150 },
                { name: 'Roti', quantity: 4, price: 40 }
            ],
            status: 'Pending',
            totalAmount: 340
        },
        {
            id: 'ORD002',
            time: '11:45 AM',
            date: '2024-01-15',
            customerName: 'Sarah Smith',
            address: '456 Rohini Sector 7, Near Metro Station, Delhi',
            items: [
                { name: 'Special Thali', quantity: 1, price: 200 },
                { name: 'Sweet Lassi', quantity: 2, price: 60 }
            ],
            status: 'Delivered',
            totalAmount: 320
        },
        {
            id: 'ORD003',
            time: '12:15 PM',
            date: '2024-01-15',
            customerName: 'Raj Kumar',
            address: '789 Dwarka Sector 12, Delhi',
            items: [
                { name: 'Non-Veg Thali', quantity: 2, price: 180 },
                { name: 'Butter Naan', quantity: 3, price: 90 }
            ],
            status: 'In Progress',
            totalAmount: 450
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#f59e0b';
            case 'In Progress': return '#6366f1';
            case 'Delivered': return '#10b981';
            default: return '#6b7280';
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Icon name="clipboard-list" size={32} color="#FF6B6B" />
                <Text style={styles.title}>All Orders</Text>
            </View>

            {orders.map((order, index) => (
                <TouchableOpacity
                    key={order.id}
                    style={styles.orderCard}
                    onPress={() => setExpandedOrder(expandedOrder === index ? null : index)}
                    activeOpacity={0.7}
                >
                    <View style={styles.orderHeader}>
                        <View style={styles.orderIdContainer}>
                            <Icon name="shopping" size={20} color="#6366f1" />
                            <Text style={styles.orderId}>{order.id}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                                {order.status}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.timeContainer}>
                        <Icon name="clock-outline" size={16} color="#6b7280" />
                        <Text style={styles.timeText}>{order.time} - {order.date}</Text>
                    </View>

                    <View style={styles.customerInfo}>
                        <Text style={styles.customerName}>{order.customerName}</Text>
                        <View style={styles.addressContainer}>
                            <Icon name="map-marker-outline" size={16} color="#6b7280" />
                            <Text style={styles.address}>{order.address}</Text>
                        </View>
                    </View>

                    {expandedOrder === index && (
                        <View style={styles.orderDetails}>
                            <Text style={styles.detailsTitle}>Order Details</Text>
                            {order.items.map((item, idx) => (
                                <View key={idx} style={styles.itemRow}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                    <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                                </View>
                            ))}
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Total Amount</Text>
                                <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.expandButton}>
                        <Icon 
                            name={expandedOrder === index ? "chevron-up" : "chevron-down"} 
                            size={24} 
                            color="#6b7280" 
                        />
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginLeft: 12,
    },
    orderCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        margin: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginLeft: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    timeText: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 6,
    },
    customerInfo: {
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 12,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    address: {
        flex: 1,
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 6,
    },
    orderDetails: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 16,
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemName: {
        flex: 1,
        fontSize: 14,
        color: '#4b5563',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#6b7280',
        marginHorizontal: 12,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6366f1',
    },
    expandButton: {
        alignItems: 'center',
        marginTop: 8,
    },
});

export default AllOrders;