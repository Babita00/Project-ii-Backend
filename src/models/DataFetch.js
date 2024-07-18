import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constants.js";
import Property from "../models/Property.models.js";
dotenv.config({
  path: "./.env",
});

const DataCollection = async () => {
  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

  // Manually defined data
  const Property = [
    {
      title: "Luxury Flat in Kalanki",
      description:
        "A beautiful and spacious luxury flat with 24 hr water supply, free WiFi, and a personal washroom.",
      location: "Kalanki",
      productImage: [
        "http://example.com/image1.jpg",
        "http://example.com/image2.jpg",
      ],
      amount: "2600",
      categories: "3BHK",
    },
    {
      title: "Cozy Room in Kirtipur",
      description:
        "A small and cozy room with free WiFi, 24 hr water supply, and a shared washroom.",
      location: "Kirtipur",
      productImage: [
        "http://example.com/image3.jpg",
        "http://example.com/image4.jpg",
      ],
      amount: "1300",
      categories: "1BHK",
    },
    {
      title: "Spacious 2BHK Flat in Baneshwor",
      description:
        "A spacious 2BHK flat with 24 hr water supply, free WiFi, and a personal washroom.",
      location: "Baneshwor",
      productImage: [
        "http://example.com/image5.jpg",
        "http://example.com/image6.jpg",
      ],
      amount: "1800",
      categories: "2BHK",
    },
    {
      title: "Modern Flat in Koteshwor",
      description:
        "A modern 2BHK flat with 24 hr water supply, free WiFi, and a personal washroom.",
      location: "Koteshwor",
      productImage: [
        "http://example.com/image7.jpg",
        "http://example.com/image8.jpg",
      ],
      amount: "1900",
      categories: "2BHK",
    },
    {
      title: "Affordable Room in Sinamangal",
      description:
        "An affordable and cozy room with 24 hr water supply and a shared washroom.",
      location: "Sinamangal",
      productImage: [
        "http://example.com/image9.jpg",
        "http://example.com/image10.jpg",
      ],
      amount: "1200",
      categories: "1BHK",
    },
    {
      title: "Elegant 3BHK Flat in Kupondol",
      description:
        "An elegant 3BHK flat with 24 hr water supply, free WiFi, and personal washrooms.",
      location: "Kupondol",
      productImage: [
        "http://example.com/image11.jpg",
        "http://example.com/image12.jpg",
      ],
      amount: "2800",
      categories: "3BHK",
    },
    {
      title: "Compact 2BHK Flat in Sitapaila",
      description:
        "A compact 2BHK flat with 24 hr water supply and a personal washroom.",
      location: "Sitapaila",
      productImage: [
        "http://example.com/image13.jpg",
        "http://example.com/image14.jpg",
      ],
      amount: "1700",
      categories: "2BHK",
    },
    {
      title: "Luxury Room in Maharajgunj",
      description:
        "A luxury room with free WiFi, 24 hr water supply, and a personal washroom.",
      location: "Maharajgunj",
      productImage: [
        "http://example.com/image15.jpg",
        "http://example.com/image16.jpg",
      ],
      amount: "1500",
      categories: "1BHK",
    },
    {
      title: "Spacious 2BHK Flat in Baluwatar",
      description:
        "A spacious 2BHK flat with 24 hr water supply, free WiFi, and a personal washroom.",
      location: "Baluwatar",
      productImage: [
        "http://example.com/image17.jpg",
        "http://example.com/image18.jpg",
      ],
      amount: "1900",
      categories: "2BHK",
    },
    {
      title: "Modern 3BHK Flat in Lazimpat",
      description:
        "A modern and spacious 3BHK flat with 24 hr water supply, free WiFi, and personal washrooms.",
      location: "Lazimpat",
      productImage: [
        "http://example.com/image19.jpg",
        "http://example.com/image20.jpg",
      ],
      amount: "2700",
      categories: "3BHK",
    },
    {
      title: "Charming 2BHK Flat in Patan",
      description:
        "A charming 2BHK flat in Patan with 24 hr water supply, free WiFi, and a private balcony.",
      location: "Patan",
      productImage: [
        "http://example.com/image21.jpg",
        "http://example.com/image22.jpg",
      ],
      amount: "2000",
      categories: "2BHK",
    },
    {
      title: "Cozy 1BHK in Thamel",
      description:
        "A cozy 1BHK apartment in Thamel with easy access to restaurants and shops, featuring 24 hr water supply and free WiFi.",
      location: "Thamel",
      productImage: [
        "http://example.com/image23.jpg",
        "http://example.com/image24.jpg",
      ],
      amount: "1500",
      categories: "1BHK",
    },
    {
      title: "Spacious 3BHK House in Jawalakhel",
      description:
        "A spacious 3BHK house in Jawalakhel with a large garden, 24 hr water supply, and parking space.",
      location: "Jawalakhel",
      productImage: [
        "http://example.com/image25.jpg",
        "http://example.com/image26.jpg",
      ],
      amount: "3000",
      categories: "3BHK",
    },
    {
      title: "Modern Studio in Sanepa",
      description:
        "A modern studio apartment in Sanepa with stylish interiors, 24 hr water supply, and high-speed internet.",
      location: "Sanepa",
      productImage: [
        "http://example.com/image27.jpg",
        "http://example.com/image28.jpg",
      ],
      amount: "1400",
      categories: "Studio",
    },
    {
      title: "Luxurious 4BHK Villa in Bhaisepati",
      description:
        "A luxurious 4BHK villa in Bhaisepati with a private swimming pool, 24 hr water supply, and high-end amenities.",
      location: "Bhaisepati",
      productImage: [
        "http://example.com/image29.jpg",
        "http://example.com/image30.jpg",
      ],
      amount: "5000",
      categories: "4BHK",
    },
    {
      title: "Elegant 2BHK Flat in Balkot",
      description:
        "An elegant 2BHK flat in Balkot with modern furnishings, 24 hr water supply, and free WiFi.",
      location: "Balkot",
      productImage: [
        "http://example.com/image31.jpg",
        "http://example.com/image32.jpg",
      ],
      amount: "1800",
      categories: "2BHK",
    },
    {
      title: "Affordable 1BHK in Bhaktapur",
      description:
        "An affordable 1BHK apartment in Bhaktapur with 24 hr water supply and a shared washroom.",
      location: "Bhaktapur",
      productImage: [
        "http://example.com/image33.jpg",
        "http://example.com/image34.jpg",
      ],
      amount: "1200",
      categories: "1BHK",
    },
    {
      title: "Spacious 2BHK Flat in Chabahil",
      description:
        "A spacious 2BHK flat in Chabahil with 24 hr water supply, free WiFi, and a personal washroom.",
      location: "Chabahil",
      productImage: [
        "http://example.com/image35.jpg",
        "http://example.com/image36.jpg",
      ],
      amount: "1900",
      categories: "2BHK",
    },
    {
      title: "Modern 3BHK Apartment in Budhanilkantha",
      description:
        "A modern 3BHK apartment in Budhanilkantha with scenic views, 24 hr water supply, and free WiFi.",
      location: "Budhanilkantha",
      productImage: [
        "http://example.com/image37.jpg",
        "http://example.com/image38.jpg",
      ],
      amount: "2800",
      categories: "3BHK",
    },
    {
      title: "Luxury Room in Dhapasi",
      description:
        "A luxury room in Dhapasi with 24 hr water supply, free WiFi, and a personal washroom.",
      location: "Dhapasi",
      productImage: [
        "http://example.com/image39.jpg",
        "http://example.com/image40.jpg",
      ],
      amount: "1500",
      categories: "1BHK",
    },
  ];

  // Save manual data to the database
  await Property.insertMany(Property);

  console.log("Data added successfully");

  mongoose.disconnect();
};

DataCollection().catch((err) => {
  console.error("Error adding data:", err);
});
