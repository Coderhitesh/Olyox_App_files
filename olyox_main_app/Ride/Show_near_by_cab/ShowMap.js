import { useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Map from "../Map/Map"


export default function ShowMap({ data }) {
  try {
    const [loading, setLoading] = useState(true)
    const [selectedRide, setSelectedRide] = useState(null)

    const navigation = useNavigation()


    const data_found = data || {}
    const { dropoff, pickup } = data_found || {}

    const origin =
      pickup?.latitude && pickup?.longitude
        ? { latitude: pickup.latitude, longitude: pickup.longitude }
        : { latitude: 28.7161663, longitude: 77.1240672 }

    const destination =
      dropoff?.latitude && dropoff?.longitude
        ? { latitude: dropoff.latitude, longitude: dropoff.longitude }
        : { latitude: 28.70406, longitude: 77.102493 }

    useEffect(() => {
      setTimeout(() => setLoading(false), 2000) 
    }, [])

    const rides = [
      {
        id: 1,
        name: "SUV",
        type: "car",
        description: "Prime and Luxey Car",
        time: "5 min",
        priceRange: "Rs 25 /km",
        coins: 1,
      },
      {
        id: 2,
        name: "SEDAN",
        type: "car",
        description: "Comfy, economical cars",
        time: "1 min",
        priceRange: "Rs 14 /km",
      },
      {
        id: 3,
        name: "PRIME",
        type: "car",
        description: "Comfy, economical cars",
        time: "1 min",
        priceRange: "Rs 19 /km",
      },
      {
        id: 4,
        name: "MINI",
        type: "car",
        description: "Comfy, economical cars",
        time: "1 min",
        priceRange: "Rs 19 /km",
      },
    ]

    const handleBookNow = () => {
      if (!selectedRide) {
        alert("Please select a ride option.")
        return
      }
      navigation.navigate("confirm_screen", {
        origin,
        destination,
        selectedRide,
        dropoff,
        pickup,
      })
    }

    const Header = () => (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OLYOX RIDES</Text>
        <TouchableOpacity>
          <Text style={styles.expandButton}>🔔</Text>
        </TouchableOpacity>
      </View>
    )

    const RewardBanner = () => (
      <View style={styles.rewardBanner}>
        <Text style={styles.rewardText}>🪙 Get up to 8 OlaCoins with this booking</Text>
      </View>
    )

    const LocationSection = () => (
      <View style={styles.locationContainer}>
        <View style={styles.locationItem}>
          <View style={styles.greenDot} />
          <Text style={styles.locationText}>{pickup?.description.substring(0, 29) + "...." || "no"}</Text>
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>Now</Text>
          </View>
        </View>
        <View style={styles.locationItem}>
          <View style={styles.redDot} />
          <Text style={styles.locationText}>{dropoff?.description || "no"}</Text>
        </View>
      </View>
    )

    const RideOption = ({ ride }) => (
      <TouchableOpacity
        style={[styles.rideOption, selectedRide?.id === ride.id && styles.selectedRide]}
        onPress={() => setSelectedRide(ride)}
      >
        <View style={styles.rideLeft}>
          <Text style={styles.rideTime}>{ride.time}</Text>
          <Text style={styles.rideIcon}>{ride.type === "car" ? "🚗" : "🏍️"}</Text>
          <View style={styles.rideInfo}>
            <Text style={styles.rideName}>{ride.name}</Text>
            <Text style={styles.rideDescription}>{ride.description}</Text>
            {ride.coins && <Text style={styles.coinText}>Redeem {ride.coins} 🪙</Text>}
          </View>
        </View>
        <Text style={styles.ridePrice}>₹{ride.priceRange || ride.price}</Text>
      </TouchableOpacity>
    )

    const PaymentOptions = () => (
      <View style={styles.paymentOptions}>
        <TouchableOpacity style={styles.paymentOption}>
          <Text>💵 Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption}>
          <Text>🏷️ Coupon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption}>
          <Text>👤 Myself</Text>
        </TouchableOpacity>
      </View>
    )

    return (
      <SafeAreaView style={styles.container}>
        <Header />
        {!loading ? (
          <>
            <Map origin={origin} destination={destination} />
            <ScrollView style={styles.contentContainer}>
              <RewardBanner />
              <LocationSection />
              <Text style={styles.sectionTitle}>Recommended for you</Text>
              {rides.map((ride) => (
                <RideOption key={ride.id} ride={ride} />
              ))}
              <PaymentOptions />
              <TouchableOpacity onPress={handleBookNow} style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Any</Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        )}
      </SafeAreaView>
    )
  } catch (error) {
   
    return (
      <SafeAreaView style={styles.container}>
        <Text>An error occurred. Please restart the app and try again.</Text>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    fontSize: 24,
  },
  expandButton: {
    fontSize: 24,
  },
  mapContainer: {
    height: 400,
    backgroundColor: "#f0f0f0",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
  },
  rewardBanner: {
    backgroundColor: "#FFF9E6",
    padding: 12,
    alignItems: "center",
  },
  rewardText: {
    color: "#8B4513",
  },
  locationContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  greenDot: {
    width: 10,
    height: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    marginRight: 12,
  },
  redDot: {
    width: 10,
    height: 10,
    backgroundColor: "#F44336",
    borderRadius: 5,
    marginRight: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
  },
  timeBox: {
    backgroundColor: "#f0f0f0",
    padding: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  timeText: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
  },
  rideOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedRide: {
    backgroundColor: "#E0F7FA",
    borderWidth: 2,
    borderColor: "#00BCD4",
  },
  rideLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rideTime: {
    marginRight: 12,
    color: "#666",
  },
  rideIcon: {
    marginRight: 12,
    fontSize: 24,
  },
  rideInfo: {
    // flex: 1,
  },
  rideName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rideDescription: {
    color: "#666",
    fontSize: 14,
  },
  coinText: {
    color: "#8B4513",
    marginTop: 4,
  },
  ridePrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  donationBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#E8F5E9",
  },
  donationText: {
    color: "#2E7D32",
  },
  arrowRight: {
    color: "#2E7D32",
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  paymentOption: {
    padding: 8,
  },
  bookButton: {
    backgroundColor: "#000",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

