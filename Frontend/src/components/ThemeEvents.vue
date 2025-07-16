<template>
  <div class="bg-black text-gray-300 min-h-screen py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300 capitalize">
        {{ formattedThemeName }} Events
      </h1>

      <div v-if="filteredEvents.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden neon-border cursor-pointer"
          @click="goToEvent(event)"
        >
          <div class="relative h-48">
            <img :src="event.image" :alt="event.name" class="w-full h-full object-cover" />
            
            <div class="absolute bottom-0 left-0 w-full bg-black/60 text-white text-lg font-bold px-3 py-2">
              <h3>{{ event.name }}</h3>
            </div>
          </div>
          <div class="p-4 space-y-1">
            <p class="flex items-center text-sm">
              <span class="material-icons text-teal-400 text-base mr-1">calendar_today</span>
              {{ event.date }} &nbsp;|&nbsp;
              <span class="material-icons text-teal-400 text-base mr-1">schedule</span>
              {{ event.time }}
            </p>
            <p class="flex items-center text-sm">
              <span class="material-icons text-teal-400 text-base mr-1">near_me</span>
              {{ event.distance }}
            </p>
            <p class="flex items-center text-sm">
              <span class="material-icons text-teal-400 text-base mr-1">location_on</span>
              {{ event.location }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <h2 class="text-2xl font-bold">No events found</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const allEvents = [
  {
    id: 1,
    theme: "yoga-wellness",
    name: "Morning Beach Yoga",
    image: "https://images.unsplash.com/photo-1508780709619-79562169bc64",
    alt: "People practicing yoga at sunrise on the beach",
    date: "July 20, 2025",
    time: "6:00 AM",
    distance: "2 km away",
    location: "RK Beach",
    city: "Vizag",
    description: "Start your day with a rejuvenating yoga session on the beach with calming waves and fresh air.",
    price: "Free",
    organizer: "Vizag Yoga Community",
    capacity: 50,
    availableSpots: 15,
    registrationLink: "https://example.com/register/beach-yoga",
    contactEmail: "info@vizagyoga.com",
    featured: true,
    ageGroup: "All ages",
    tags: ["Yoga"]
  },
  {
    id: 2,
    name: 'Sunrise Yoga Class',
    date: 'Oct 15, 2023',
    time: '7:00 AM',
    distance: '0.5 miles',
    location: 'Kailasagiri Park',
    theme: 'yoga-wellness',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Group of people doing yoga outdoors at sunrise with city skyline in background'
  },
  {
    id: 3,
    theme: "art-culture",
    name: "Local Art Fair",
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
    alt: 'Colorful outdoor art festival with tents displaying paintings and sculptures',
    date: "August 5, 2025",
    time: "10:00 AM",
    distance: "3 km away",
    location: "MVP Colony Grounds"
  },
   {
    id: 4,
    name: 'Sunrise Yoga Class',
    date: 'Oct 15, 2023',
    time: '7:00 AM',
    distance: '0.5 miles',
    location: 'Riverside Park',
    theme: 'health',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Group of people doing yoga outdoors at sunrise with city skyline in background'
  },
  {
    id: 5,
    name: 'Local Art Festival',
    date: 'Oct 18, 2023',
    time: '10:00 AM',
    distance: '1.2 miles',
    location: 'Downtown Square',
    theme: 'art-culture',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
    alt: 'Colorful outdoor art festival with tents displaying paintings and sculptures'
  },
  {
    id: 6,
    name: 'Local Art Festival',
    date: 'Oct 18, 2023',
    time: '10:00 AM',
    distance: '1.2 miles',
    location: 'Downtown Square',
    theme: 'art',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
    alt: 'Colorful outdoor art festival with tents displaying paintings and sculptures'
  },
  {
    id: 7,
    name: 'Indie Music Night',
    date: 'Oct 20, 2023',
    time: '8:00 PM',
    distance: '0.8 miles',
    location: 'The Blue Note',
    theme: 'music-dance',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Live band performing on stage with neon lights in a small intimate venue'
  },
  {
    id: 8,
    name: 'Farmers Market',
    date: 'Oct 22, 2023',
    time: '9:00 AM',
    distance: '1.5 miles',
    location: 'Central Park West',
    theme: 'gardening-organic-living',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Outdoor farmers market with fresh produce, flowers and local vendors'
  },
  {
    id: 9,
    name: 'Jazz in the Garden',
    date: 'Oct 16, 2023',
    time: '6:30 PM',
    distance: '1.8 miles',
    location: 'Botanical Gardens',
    theme: 'music-dance',
    image: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Jazz quartet performing in a lush garden setting with string lights'
  },
  {
    id: 10,
    name: 'Tech Meetup',
    date: 'Oct 19, 2023',
    time: '7:00 PM',
    distance: '2.1 miles',
    location: 'Innovation Center',
    theme: 'community-service-awareness',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
    alt: 'Group of professionals networking at a modern tech meetup with laptops and presentations'
  },
  {
    id: 11,
    name: 'Brewery Tour',
    date: 'Oct 21, 2023',
    time: '3:00 PM',
    distance: '1.3 miles',
    location: 'Local Craft Brewery',
    theme: 'gardening-organic-living',
    image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    alt: 'Brewery equipment with shiny copper tanks and people sampling craft beer'
  },
  {
    id: 12,
    name: 'Book Reading',
    date: 'Oct 23, 2023',
    time: '5:30 PM',
    distance: '0.7 miles',
    location: 'Books & Beans',
    theme: 'community-service-awareness',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80',
    alt: 'Author reading a book to an attentive audience in a cozy bookstore cafe'
  },
  {
  id: 13,
  name: 'Beginner Martial Arts Workshop',
  date: 'Aug 10, 2025',
  time: '7:00 AM',
  distance: '1.2 km',
  location: 'Beachfront Dojo',
  theme: 'martial-arts-fitness',
  image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Martial artists practicing in a dojo with sunrise backdrop'
},
{
  id: 14,
  name: 'Evening Kickboxing Session',
  date: 'Aug 12, 2025',
  time: '6:30 PM',
  distance: '3 km',
  location: 'Downtown Gym',
  theme: 'martial-arts-fitness',
  image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Kickboxing class with energetic group training'
},
{
  id: 15,
  name: 'Judo Grappling Clinic',
  date: 'Aug 15, 2025',
  time: '9:00 AM',
  distance: '5 km',
  location: 'City Sports Center',
  theme: 'martial-arts-fitness',
  image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Judo athletes practicing throws on mats'
},
{
  id: 16,
  name: 'Karate Kata Workshop',
  date: 'Aug 18, 2025',
  time: '5:00 PM',
  distance: '2.5 km',
  location: 'Zen Martial Studio',
  theme: 'martial-arts-fitness',
  image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Karate master demonstrating kata movements'
},
{
  id: 17,
  name: 'Strength & Conditioning Bootcamp',
  date: 'Aug 20, 2025',
  time: '7:30 AM',
  distance: '4 km',
  location: 'Open Air Park',
  theme: 'martial-arts-fitness',
  image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Outdoor bootcamp group training session'
},
{
  id: 18,
  name: 'Early Morning Run Club',
  date: 'Aug 22, 2025',
  time: '5:45 AM',
  distance: '1 km',
  location: 'Beach Promenade',
  theme: 'martial-arts-fitness',
  image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Group of runners jogging along the beach at sunrise'
},
{
  id: 19,
  name: 'Functional Fitness Challenge',
  date: 'Aug 25, 2025',
  time: '6:00 PM',
  distance: '3.5 km',
  location: 'City Fitness Hub',
  theme: 'martial-arts-fitness',
  image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Athletes performing strength drills in a gym environment'
},
{
  id: 20,
  name: 'Park Calisthenics Meet-Up',
  date: 'Aug 28, 2025',
  time: '8:00 AM',
  distance: '2 km',
  location: 'Urban Fitness Park',
  theme: 'martial-arts-fitness',
  image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Fitness enthusiasts training outdoors on bars'
},
{
  id: 21,
  name: 'Mixed Martial Arts Exhibition',
  date: 'Aug 30, 2025',
  time: '7:00 PM',
  distance: '6 km',
  location: 'Arena Dome',
  theme: 'martial-arts-fitness',
  image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'MMA fighters preparing backstage for an event'
},
{
  id: 22,
  name: 'Flexibility & Mobility Workshop',
  date: 'Sep 2, 2025',
  time: '9:30 AM',
  distance: '4.2 km',
  location: 'Balance Studio',
  theme: 'martial-arts-fitness',
  image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Athlete practicing deep stretching in a bright studio'
},
{
  id: 23,
  name: 'Farmers Market',
  date: 'Sep 22, 2025',
  time: '9:00 AM',
  distance: '1.5 km',
  location: 'Central Park West',
  theme: 'gardening-organic-living',
  image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Outdoor farmers market with fresh produce, flowers and local vendors'
},
{
  id: 24,
  name: 'Farmers Market',
  date: 'Sep 22, 2025',
  time: '9:00 AM',
  distance: '1.5 km',
  location: 'Central Park West',
  theme: 'gardening-organic-living',
  image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Outdoor farmers market with fresh produce, flowers and local vendors'
},
{
  id: 25,
  name: 'Farmers Market',
  date: 'Sep 22, 2025',
  time: '9:00 AM',
  distance: '1.5 km',
  location: 'Central Park West',
  theme: 'gardening-organic-living',
  image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Outdoor farmers market with fresh produce, flowers and local vendors'
},
{
  id: 26,
  name: 'Farmers Market',
  date: 'Sep 22, 2025',
  time: '9:00 AM',
  distance: '1.5 km',
  location: 'Central Park West',
  theme: 'gardening-organic-living',
  image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Outdoor farmers market with fresh produce, flowers and local vendors'
},
{
  id: 27,
  name: 'Farmers Market',
  date: 'Sep 22, 2025',
  time: '9:00 AM',
  distance: '1.5 km',
  location: 'Central Park West',
  theme: 'gardening-organic-living',
  image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Outdoor farmers market with fresh produce, flowers and local vendors'
},
{
  id: 28,
  name: 'Farmers Market',
  date: 'Sep 22, 2025',
  time: '9:00 AM',
  distance: '1.5 km',
  location: 'Central Park West',
  theme: 'gardening-organic-living',
  image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Outdoor farmers market with fresh produce, flowers and local vendors'
},
{
  id: 29,
  name: 'Farmers Market',
  date: 'Sep 22, 2025',
  time: '9:00 AM',
  distance: '1.5 km',
  location: 'Central Park West',
  theme: 'gardening-organic-living',
  image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Outdoor farmers market with fresh produce, flowers and local vendors'
},
{
  id: 30,
  name: 'Farmers Market',
  date: 'Sep 22, 2025',
  time: '9:00 AM',
  distance: '1.5 km',
  location: 'Central Park West',
  theme: 'gardening-organic-living',
  image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Outdoor farmers market with fresh produce, flowers and local vendors'
},
{
  id: 31,
  name: 'Nutrition & Wellness Talk',
  date: 'Sep 14, 2025',
  time: '5:00 PM',
  distance: '3.5 km',
  location: 'Wellness Center Hall',
  theme: 'first-aid-health-awareness',
  image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Speaker presenting healthy lifestyle tips to a group of attendees'
},
{
  id: 32,
  name: 'Nutrition & Wellness Talk',
  date: 'Sep 14, 2025',
  time: '5:00 PM',
  distance: '3.5 km',
  location: 'Wellness Center Hall',
  theme: 'first-aid-health-awareness',
  image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Speaker presenting healthy lifestyle tips to a group of attendees'
},
{
  id: 33,
  name: 'Nutrition & Wellness Talk',
  date: 'Sep 14, 2025',
  time: '5:00 PM',
  distance: '3.5 km',
  location: 'Wellness Center Hall',
  theme: 'first-aid-health-awareness',
  image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Speaker presenting healthy lifestyle tips to a group of attendees'
},
{
  id: 34,
  name: 'Nutrition & Wellness Talk',
  date: 'Sep 14, 2025',
  time: '5:00 PM',
  distance: '3.5 km',
  location: 'Wellness Center Hall',
  theme: 'first-aid-health-awareness',
  image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Speaker presenting healthy lifestyle tips to a group of attendees'
},
{
  id: 35,
  name: 'Nutrition & Wellness Talk',
  date: 'Sep 14, 2025',
  time: '5:00 PM',
  distance: '3.5 km',
  location: 'Wellness Center Hall',
  theme: 'first-aid-health-awareness',
  image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Speaker presenting healthy lifestyle tips to a group of attendees'
},
{
  id: 36,
  name: 'Nutrition & Wellness Talk',
  date: 'Sep 14, 2025',
  time: '5:00 PM',
  distance: '3.5 km',
  location: 'Wellness Center Hall',
  theme: 'first-aid-health-awareness',
  image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Speaker presenting healthy lifestyle tips to a group of attendees'
},
{
  id: 37,
  name: 'Nutrition & Wellness Talk',
  date: 'Sep 14, 2025',
  time: '5:00 PM',
  distance: '3.5 km',
  location: 'Wellness Center Hall',
  theme: 'first-aid-health-awareness',
  image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Speaker presenting healthy lifestyle tips to a group of attendees'
},
{
  id: 38,
  name: 'Nutrition & Wellness Talk',
  date: 'Sep 14, 2025',
  time: '5:00 PM',
  distance: '3.5 km',
  location: 'Wellness Center Hall',
  theme: 'first-aid-health-awareness',
  image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Speaker presenting healthy lifestyle tips to a group of attendees'
},
{
  id: 39,
  name: 'Nutrition & Wellness Talk',
  date: 'Sep 14, 2025',
  time: '5:00 PM',
  distance: '3.5 km',
  location: 'Wellness Center Hall',
  theme: 'first-aid-health-awareness',
  image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Speaker presenting healthy lifestyle tips to a group of attendees'
},

{
  id: 40,
  name: 'Nutrition & Wellness Talk',
  date: 'Sep 14, 2025',
  time: '5:00 PM',
  distance: '3.5 km',
  location: 'Wellness Center Hall',
  theme: 'first-aid-health-awareness',
  image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Speaker presenting healthy lifestyle tips to a group of attendees'
},

{
  id: 41,
  name: 'Book Club Gathering',
  date: 'Oct 10, 2025',
  time: '5:00 PM',
  distance: '1 km',
  location: 'Library Reading Room',
  theme: 'theatre-literature',
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Group of readers discussing a novel in a comfortable library setting'
},
{
  id: 42,
  name: 'Book Club Gathering',
  date: 'Oct 10, 2025',
  time: '5:00 PM',
  distance: '1 km',
  location: 'Library Reading Room',
  theme: 'theatre-literature',
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Group of readers discussing a novel in a comfortable library setting'
},
{
  id: 43,
  name: 'Book Club Gathering',
  date: 'Oct 10, 2025',
  time: '5:00 PM',
  distance: '1 km',
  location: 'Library Reading Room',
  theme: 'theatre-literature',
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Group of readers discussing a novel in a comfortable library setting'
},
{
  id: 44,
  name: 'Book Club Gathering',
  date: 'Oct 10, 2025',
  time: '5:00 PM',
  distance: '1 km',
  location: 'Library Reading Room',
  theme: 'theatre-literature',
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Group of readers discussing a novel in a comfortable library setting'
},
{
  id: 45,
  name: 'Book Club Gathering',
  date: 'Oct 10, 2025',
  time: '5:00 PM',
  distance: '1 km',
  location: 'Library Reading Room',
  theme: 'theatre-literature',
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Group of readers discussing a novel in a comfortable library setting'
},
{
  id: 46,
  name: 'Book Club Gathering',
  date: 'Oct 10, 2025',
  time: '5:00 PM',
  distance: '1 km',
  location: 'Library Reading Room',
  theme: 'theatre-literature',
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Group of readers discussing a novel in a comfortable library setting'
},
{
  id: 47,
  name: 'Book Club Gathering',
  date: 'Oct 10, 2025',
  time: '5:00 PM',
  distance: '1 km',
  location: 'Library Reading Room',
  theme: 'theatre-literature',
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Group of readers discussing a novel in a comfortable library setting'
},
{
  id: 48,
  name: 'Book Club Gathering',
  date: 'Oct 10, 2025',
  time: '5:00 PM',
  distance: '1 km',
  location: 'Library Reading Room',
  theme: 'theatre-literature',
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Group of readers discussing a novel in a comfortable library setting'
},
{
  id: 49,
  name: 'Book Club Gathering',
  date: 'Oct 10, 2025',
  time: '5:00 PM',
  distance: '1 km',
  location: 'Library Reading Room',
  theme: 'theatre-literature',
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Group of readers discussing a novel in a comfortable library setting'
},
{
  id: 50,
  name: 'Book Club Gathering',
  date: 'Oct 10, 2025',
  time: '5:00 PM',
  distance: '1 km',
  location: 'Library Reading Room',
  theme: 'theatre-literature',
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Group of readers discussing a novel in a comfortable library setting'
},
{
  id: 51,
  name: 'Mountain Biking Challenge',
  date: 'Sep 5, 2025',
  time: '7:00 AM',
  distance: '12 km',
  location: 'Eastern Ghats Trail',
  theme: 'adventure-rallies',
  image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Mountain biker speeding through a forest trail'
},
{
  id: 52,
  name: 'Mountain Biking Challenge',
  date: 'Sep 5, 2025',
  time: '7:00 AM',
  distance: '12 km',
  location: 'Eastern Ghats Trail',
  theme: 'adventure-rallies',
  image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Mountain biker speeding through a forest trail'
},
{
  id: 53,
  name: 'Mountain Biking Challenge',
  date: 'Sep 5, 2025',
  time: '7:00 AM',
  distance: '12 km',
  location: 'Eastern Ghats Trail',
  theme: 'adventure-rallies',
  image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Mountain biker speeding through a forest trail'
},
{
  id: 54,
  name: 'Mountain Biking Challenge',
  date: 'Sep 5, 2025',
  time: '7:00 AM',
  distance: '12 km',
  location: 'Eastern Ghats Trail',
  theme: 'adventure-rallies',
  image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Mountain biker speeding through a forest trail'
},
{
  id: 55,
  name: 'Mountain Biking Challenge',
  date: 'Sep 5, 2025',
  time: '7:00 AM',
  distance: '12 km',
  location: 'Eastern Ghats Trail',
  theme: 'adventure-rallies',
  image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Mountain biker speeding through a forest trail'
},
{
  id: 56,
  name: 'Mountain Biking Challenge',
  date: 'Sep 5, 2025',
  time: '7:00 AM',
  distance: '12 km',
  location: 'Eastern Ghats Trail',
  theme: 'adventure-rallies',
  image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Mountain biker speeding through a forest trail'
},
{
  id: 57,
  name: 'Mountain Biking Challenge',
  date: 'Sep 5, 2025',
  time: '7:00 AM',
  distance: '12 km',
  location: 'Eastern Ghats Trail',
  theme: 'adventure-rallies',
  image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Mountain biker speeding through a forest trail'
},
{
  id: 58,
  name: 'Mountain Biking Challenge',
  date: 'Sep 5, 2025',
  time: '7:00 AM',
  distance: '12 km',
  location: 'Eastern Ghats Trail',
  theme: 'adventure-rallies',
  image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Mountain biker speeding through a forest trail'
},
{
  id: 59,
  name: 'Mountain Biking Challenge',
  date: 'Sep 5, 2025',
  time: '7:00 AM',
  distance: '12 km',
  location: 'Eastern Ghats Trail',
  theme: 'adventure-rallies',
  image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Mountain biker speeding through a forest trail'
},
{
  id: 60,
  name: 'Mountain Biking Challenge',
  date: 'Sep 5, 2025',
  time: '7:00 AM',
  distance: '12 km',
  location: 'Eastern Ghats Trail',
  theme: 'adventure-rallies',
  image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Mountain biker speeding through a forest trail'
},
{
  id: 61,
  name: 'AI & Future Skills Talk',
  date: 'Oct 20, 2025',
  time: '5:00 PM',
  distance: '4 km',
  location: 'Innovation Summit Hall',
  theme: 'career-skill-development',
  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Keynote speaker discussing AI and future technology on stage'
},
{
  id: 62,
  name: 'AI & Future Skills Talk',
  date: 'Oct 20, 2025',
  time: '5:00 PM',
  distance: '4 km',
  location: 'Innovation Summit Hall',
  theme: 'career-skill-development',
  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Keynote speaker discussing AI and future technology on stage'
},
{
  id: 63,
  name: 'AI & Future Skills Talk',
  date: 'Oct 20, 2025',
  time: '5:00 PM',
  distance: '4 km',
  location: 'Innovation Summit Hall',
  theme: 'career-skill-development',
  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Keynote speaker discussing AI and future technology on stage'
},
{
  id: 64,
  name: 'AI & Future Skills Talk',
  date: 'Oct 20, 2025',
  time: '5:00 PM',
  distance: '4 km',
  location: 'Innovation Summit Hall',
  theme: 'career-skill-development',
  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Keynote speaker discussing AI and future technology on stage'
},
{
  id: 65,
  name: 'AI & Future Skills Talk',
  date: 'Oct 20, 2025',
  time: '5:00 PM',
  distance: '4 km',
  location: 'Innovation Summit Hall',
  theme: 'career-skill-development',
  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Keynote speaker discussing AI and future technology on stage'
},
{
  id: 66,
  name: 'AI & Future Skills Talk',
  date: 'Oct 20, 2025',
  time: '5:00 PM',
  distance: '4 km',
  location: 'Innovation Summit Hall',
  theme: 'career-skill-development',
  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Keynote speaker discussing AI and future technology on stage'
},
{
  id: 67,
  name: 'AI & Future Skills Talk',
  date: 'Oct 20, 2025',
  time: '5:00 PM',
  distance: '4 km',
  location: 'Innovation Summit Hall',
  theme: 'career-skill-development',
  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Keynote speaker discussing AI and future technology on stage'
},
{
  id: 68,
  name: 'AI & Future Skills Talk',
  date: 'Oct 20, 2025',
  time: '5:00 PM',
  distance: '4 km',
  location: 'Innovation Summit Hall',
  theme: 'career-skill-development',
  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Keynote speaker discussing AI and future technology on stage'
},
{
  id: 69,
  name: 'AI & Future Skills Talk',
  date: 'Oct 20, 2025',
  time: '5:00 PM',
  distance: '4 km',
  location: 'Innovation Summit Hall',
  theme: 'career-skill-development',
  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Keynote speaker discussing AI and future technology on stage'
},
{
  id: 70,
  name: 'AI & Future Skills Talk',
  date: 'Oct 20, 2025',
  time: '5:00 PM',
  distance: '4 km',
  location: 'Innovation Summit Hall',
  theme: 'career-skill-development',
  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
  alt: 'Keynote speaker discussing AI and future technology on stage'
},
]


const formattedThemeName = computed(() => route.params.theme.replace(/-/g, ' '))

const filteredEvents = computed(() => {
  return allEvents.filter(event => event.theme === route.params.theme)
})

const goToEvent = (event) => {
  router.push({ 
    name: 'event-details', 
    params: { theme: event.theme, id: event.id },
    state: { event } // pass full event object using history state
  })
}
</script>

<style scoped>
.pulse-animation {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.neon-border {
  position: relative;
  overflow: hidden;
  transition: transform 0.4s ease, box-shadow 0.3s ease;
}
.neon-border:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}
.neon-border::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  background: linear-gradient(45deg, #42b883, #35495e) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  pointer-events: none;
}
</style>