<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-4">
          Host Your Event
        </h1>
        <p class="text-lg text-gray-400">
          Fill out the form below to list your event on Nearby Happenings
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Event Details Section -->
        <div class="bg-gray-800/50 border border-green-400/20 rounded-xl p-6 shadow-lg shadow-green-500/5">
          <h2 class="text-xl font-bold text-green-400 mb-6 flex items-center">
            <span class="w-4 h-4 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Event Details
          </h2>
          
          <div class="space-y-6">
            <!-- Event Name -->
            <div>
              <label for="eventName" class="block text-sm font-medium text-gray-400 mb-1">Event Name *</label>
              <input 
                v-model="form.eventName" 
                @blur="validateField('eventName')"
                type="text" 
                id="eventName" 
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Sunset Yoga Session"
              >
              <p v-if="errors.eventName" class="mt-1 text-sm text-red-400">{{ errors.eventName }}</p>
            </div>

            <!-- Theme -->
            <div>
              <label for="theme" class="block text-sm font-medium text-gray-400 mb-1">Theme *</label>
              <select 
                v-model="form.theme" 
                @blur="validateField('theme')"
                id="theme" 
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="" disabled selected>Select a theme</option>
                <option v-for="theme in themes" :key="theme" :value="theme">{{ theme }}</option>
              </select>
              <p v-if="errors.theme" class="mt-1 text-sm text-red-400">{{ errors.theme }}</p>
            </div>

            <!-- Date and Time -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="date" class="block text-sm font-medium text-gray-400 mb-1">Date *</label>
                <input 
                  v-model="form.date" 
                  @blur="validateField('date')"
                  type="date" 
                  id="date" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                <p v-if="errors.date" class="mt-1 text-sm text-red-400">{{ errors.date }}</p>
              </div>
              <div>
                <label for="time" class="block text-sm font-medium text-gray-400 mb-1">Time *</label>
                <input 
                  v-model="form.time" 
                  @blur="validateField('time')"
                  type="time" 
                  id="time" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                <p v-if="errors.time" class="mt-1 text-sm text-red-400">{{ errors.time }}</p>
              </div>
            </div>

            <!-- City -->
            <div>
              <label for="city" class="block text-sm font-medium text-gray-400 mb-1">City *</label>
              <input 
                v-model="form.city" 
                @blur="validateField('city')"
                type="text" 
                id="city" 
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., San Francisco"
              >
              <p v-if="errors.city" class="mt-1 text-sm text-red-400">{{ errors.city }}</p>
            </div>

            <!-- Google Maps Location -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Location *</label>
              <div class="relative">
                <input 
                  v-model="form.locationQuery" 
                  @input="searchLocation"
                  type="text" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Search location on Google Maps"
                >
                <div v-if="locationResults.length > 0" class="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <div 
                    v-for="(result, index) in locationResults" 
                    :key="index"
                    @click="selectLocation(result)"
                    class="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  >
                    <p class="text-white">{{ result.description }}</p>
                  </div>
                </div>
              </div>
              <p v-if="errors.location" class="mt-1 text-sm text-red-400">{{ errors.location }}</p>
            </div>

            <!-- Poster Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Event Poster</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
                <div class="space-y-1 text-center">
                  <div class="flex text-sm text-gray-400">
                    <label for="file-upload" class="relative cursor-pointer bg-gray-700 rounded-md font-medium text-green-400 hover:text-green-300 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload">
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                  <p v-if="form.poster" class="text-sm text-green-400 mt-2">{{ form.poster.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Organizer Details Section -->
        <div class="bg-gray-800/50 border border-green-400/20 rounded-xl p-6 shadow-lg shadow-green-500/5">
          <h2 class="text-xl font-bold text-green-400 mb-6 flex items-center">
            <span class="w-4 h-4 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Organizer Details
          </h2>
          
          <div class="space-y-6">
            <!-- Organization Name -->
            <div>
              <label for="orgName" class="block text-sm font-medium text-gray-400 mb-1">Organization Name</label>
              <input 
                v-model="form.orgName" 
                type="text" 
                id="orgName" 
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Yoga With Friends"
              >
            </div>

            <!-- Organization Mobile -->
            <div>
              <label for="orgMobile" class="block text-sm font-medium text-gray-400 mb-1">Contact Number *</label>
              <input 
                v-model="form.orgMobile" 
                @blur="validateField('orgMobile')"
                type="tel" 
                id="orgMobile" 
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., +1 555-123-4567"
              >
              <p v-if="errors.orgMobile" class="mt-1 text-sm text-red-400">{{ errors.orgMobile }}</p>
            </div>

            <!-- Organization Email -->
            <div>
              <label for="orgEmail" class="block text-sm font-medium text-gray-400 mb-1">Contact Email *</label>
              <input 
                v-model="form.orgEmail" 
                @blur="validateField('orgEmail')"
                type="email" 
                id="orgEmail" 
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., contact@example.com"
              >
              <p v-if="errors.orgEmail" class="mt-1 text-sm text-red-400">{{ errors.orgEmail }}</p>
            </div>
          </div>
        </div>

        <!-- Other Details Section -->
        <div class="bg-gray-800/50 border border-green-400/20 rounded-xl p-6 shadow-lg shadow-green-500/5">
          <h2 class="text-xl font-bold text-green-400 mb-6 flex items-center">
            <span class="w-4 h-4 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Additional Information
          </h2>
          
          <div class="space-y-6">
            <!-- Registration Link -->
            <div>
              <label for="regLink" class="block text-sm font-medium text-gray-400 mb-1">Registration Link</label>
              <input 
                v-model="form.regLink" 
                type="url" 
                id="regLink" 
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/register"
              >
            </div>

            <!-- Registration Fee -->
            <div>
              <label for="regFee" class="block text-sm font-medium text-gray-400 mb-1">Registration Fee</label>
              <div class="relative rounded-lg shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-400 sm:text-sm">$</span>
                </div>
                <input 
                  v-model="form.regFee" 
                  type="number" 
                  id="regFee" 
                  min="0"
                  step="0.01"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-7 pr-12 py-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                >
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span class="text-gray-400 sm:text-sm">USD</span>
                </div>
              </div>
            </div>

            <!-- Target Audience -->
            <div>
              <label for="targetAudience" class="block text-sm font-medium text-gray-400 mb-1">Target Audience</label>
              <input 
                v-model="form.targetAudience" 
                type="text" 
                id="targetAudience" 
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Adults 18+, Beginners welcome"
              >
            </div>

            <!-- Capacity -->
            <div>
              <label for="capacity" class="block text-sm font-medium text-gray-400 mb-1">Capacity</label>
              <input 
                v-model="form.capacity" 
                type="number" 
                id="capacity" 
                min="0"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 50"
              >
            </div>

            <!-- Essentials to Carry -->
            <div>
              <label for="essentials" class="block text-sm font-medium text-gray-400 mb-1">Essentials to Carry</label>
              <textarea 
                v-model="form.essentials" 
                id="essentials" 
                rows="3"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Yoga mat, Water bottle, Comfortable clothes"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4">
          <button 
            type="button" 
            @click="resetForm"
            class="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800/50 transition-colors"
          >
            Clear Form
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white font-medium hover:from-green-600 hover:to-teal-700 transition-colors flex items-center disabled:opacity-50"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Submitting...' : 'Submit Event' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Form data
const form = ref({
  eventName: '',
  theme: '',
  date: '',
  time: '',
  city: '',
  location: null,
  locationQuery: '',
  poster: null,
  orgName: '',
  orgMobile: '',
  orgEmail: '',
  regLink: '',
  regFee: '',
  targetAudience: '',
  capacity: '',
  essentials: ''
});

// Validation errors
const errors = ref({
  eventName: '',
  theme: '',
  date: '',
  time: '',
  city: '',
  location: '',
  orgMobile: '',
  orgEmail: ''
});

// UI state
const isSubmitting = ref(false);
const locationResults = ref([]);

// Available themes
const themes = ref([
  'Yoga & Wellness',
  'Art & Culture',
  'Music & Dance',
  'Martial Arts & Fitness',
  'Gardening & Organic Living',
  'First Aid & Health Awareness',
  'Theatre & Literature',
  'Adventure & Rallies',
  'Career & Skill Development',
  'Community Service & Awareness'
]);

// Google Maps location search simulation
const searchLocation = () => {
  if (form.value.locationQuery.length > 2) {
    locationResults.value = [
      { description: `${form.value.locationQuery}, City Center`, place_id: '1' },
      { description: `${form.value.locationQuery} Community Park`, place_id: '2' },
      { description: `${form.value.locationQuery} Convention Center`, place_id: '3' }
    ];
  } else {
    locationResults.value = [];
  }
};

const selectLocation = (location) => {
  form.value.location = location;
  form.value.locationQuery = location.description;
  locationResults.value = [];
};

// File upload handler
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Please upload an image file (JPEG, PNG, GIF)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }
    form.value.poster = file;
  }
};

// Field validation
const validateField = (field) => {
  let isValid = true;
  
  switch (field) {
    case 'eventName':
      if (!form.value.eventName.trim()) {
        errors.value.eventName = 'Event name is required';
        isValid = false;
      } else {
        errors.value.eventName = '';
      }
      break;
      
    case 'theme':
      if (!form.value.theme) {
        errors.value.theme = 'Please select a theme';
        isValid = false;
      } else {
        errors.value.theme = '';
      }
      break;
      
    case 'date':
      if (!form.value.date) {
        errors.value.date = 'Date is required';
        isValid = false;
      } else {
        const selectedDate = new Date(form.value.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          errors.value.date = 'Date must be in the future';
          isValid = false;
        } else {
          errors.value.date = '';
        }
      }
      break;
      
    case 'time':
      if (!form.value.time) {
        errors.value.time = 'Time is required';
        isValid = false;
      } else {
        errors.value.time = '';
      }
      break;
      
    case 'city':
      if (!form.value.city.trim()) {
        errors.value.city = 'City is required';
        isValid = false;
      } else {
        errors.value.city = '';
      }
      break;
      
    case 'location':
      if (!form.value.location) {
        errors.value.location = 'Please select a location from the dropdown';
        isValid = false;
      } else {
        errors.value.location = '';
      }
      break;
      
    case 'orgMobile':
      if (!form.value.orgMobile.trim()) {
        errors.value.orgMobile = 'Contact number is required';
        isValid = false;
      } else if (!/^\+?[\d\s-]{10,}$/.test(form.value.orgMobile)) {
        errors.value.orgMobile = 'Please enter a valid phone number';
        isValid = false;
      } else {
        errors.value.orgMobile = '';
      }
      break;
      
    case 'orgEmail':
      if (!form.value.orgEmail.trim()) {
        errors.value.orgEmail = 'Contact email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.orgEmail)) {
        errors.value.orgEmail = 'Please enter a valid email address';
        isValid = false;
      } else {
        errors.value.orgEmail = '';
      }
      break;
  }
  
  return isValid;
};

// Form validation
const validateForm = () => {
  let isValid = true;
  isValid = validateField('eventName') && isValid;
  isValid = validateField('theme') && isValid;
  isValid = validateField('date') && isValid;
  isValid = validateField('time') && isValid;
  isValid = validateField('city') && isValid;
  isValid = validateField('location') && isValid;
  isValid = validateField('orgMobile') && isValid;
  isValid = validateField('orgEmail') && isValid;
  return isValid;
};

// Form reset
const resetForm = () => {
  form.value = {
    eventName: '',
    theme: '',
    date: '',
    time: '',
    city: '',
    location: null,
    locationQuery: '',
    poster: null,
    orgName: '',
    orgMobile: '',
    orgEmail: '',
    regLink: '',
    regFee: '',
    targetAudience: '',
    capacity: '',
    essentials: ''
  };
  Object.keys(errors.value).forEach(key => {
    errors.value[key] = '';
  });
};

const emit = defineEmits(['add-event', 'switch-tab']);

const submitForm = () => {
  if (!validateForm()) {
    alert('Please fill out all required fields correctly.');
    isSubmitting.value = false;
    return;
  }

  isSubmitting.value = true;

  // Get current date and time in IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTime = new Date(now.getTime() + istOffset);
  
  // Format date as YYYY-MM-DD
  const year = istTime.getUTCFullYear();
  const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istTime.getUTCDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  
  // Format time as HH:MM AM/PM
  let hours = istTime.getUTCHours();
  const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  // Prepare the event data to emit
  const newEvent = {
    name: form.value.eventName,
    date: formattedDate, // Use current date
    time: formattedTime, // Use current time
    theme: form.value.theme,
    city: form.value.city,
    location: form.value.location,
    orgName: form.value.orgName,
    orgMobile: form.value.orgMobile,
    orgEmail: form.value.orgEmail,
    regLink: form.value.regLink,
    regFee: form.value.regFee,
    targetAudience: form.value.targetAudience,
    capacity: form.value.capacity,
    essentials: form.value.essentials,
    poster: form.value.poster ? form.value.poster.name : null,
  };

  emit('add-event', newEvent);
  emit('switch-tab', 'Added');

  setTimeout(() => {
    alert('Event submitted successfully!');
    isSubmitting.value = false;
    resetForm();
  }, 1500);
};
</script>

<style scoped>
.neon-border {
  position: relative;
}
.neon-border::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: inherit;
  background: linear-gradient(45deg, #34d399, #10b981, #34d399);
  background-size: 200% 200%;
  z-index: -1;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}
.neon-border:hover::after {
  opacity: 0.6;
  animation: gradientAnimation 2s ease infinite;
}
@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>