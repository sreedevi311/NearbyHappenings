<template>
  <div class=" py-12 px-4 sm:px-6 lg:px-8">
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
import { onMounted, ref } from 'vue';
import { api } from '../services/api';
import { useRoute } from 'vue-router';

const route = useRoute();
const isAdmin = route.name === 'admin-add-event';

const props = defineProps({
  isEdit: Boolean,
  eventId: String
});

const emit = defineEmits(['add-event', 'switch-tab', 'updated']);

const form = ref({
  eventName: '',
  theme: '',
  date: '',
  time: '',
  city: '',
  location: null,
  locationQuery: '',
  poster: null,
  tag: '',
  description: '',
  orgName: '',
  orgEmail: '',
  orgMobile: '',
  regLink: '',
  regFee: '',
  targetAudience: '',
  capacity: '',
  essentials: '',
  createdBy: isAdmin ? 'admin' : 'host',
  status: isAdmin ? 'accepted' : 'pending',
  updatedByAdmin: false
});

const errors = ref({});
const isSubmitting = ref(false);
const locationResults = ref([]);

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

const selectLocation = (loc) => {
  form.value.location = loc;
  form.value.locationQuery = loc.description;
  locationResults.value = [];
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Please upload a valid image (JPEG, PNG, GIF)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File exceeds 5MB limit');
      return;
    }
    form.value.poster = file;
  }
};

const validateForm = () => {
  let valid = true;
  const requiredFields = ['eventName', 'theme', 'date', 'time', 'city', 'location', 'orgEmail', 'orgMobile'];
  errors.value = {};
  requiredFields.forEach(field => {
    if (!form.value[field] || (typeof form.value[field] === 'string' && !form.value[field].trim())) {
      errors.value[field] = 'This field is required';
      valid = false;
    }
  });
  return valid;
};

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
    tag: '',
    description: '',
    orgName: '',
    orgEmail: '',
    orgMobile: '',
    regLink: '',
    regFee: '',
    targetAudience: '',
    capacity: '',
    essentials: '',
    createdBy: isAdmin ? 'admin' : 'host',
    status: isAdmin ? 'accepted' : 'pending',
    updatedByAdmin: false
  };
};

const submitForm = async () => {
  if (!validateForm()) {
    alert('Please correct the highlighted errors');
    return;
  }

  const payload = {
    eventName: form.value.eventName,
    theme: form.value.theme,
    date: form.value.date,
    time: form.value.time,
    city: form.value.city,
    location: form.value.location,
    posterUrl: form.value.poster?.name || form.value.poster || null,
    tag: form.value.tag,
    description: form.value.description,
    organizer: {
      name: form.value.orgName,
      email: form.value.orgEmail,
      mobile: form.value.orgMobile
    },
    others: {
      registrationLink: form.value.regLink,
      registrationFee: form.value.regFee,
      targetAudience: form.value.targetAudience,
      capacity: form.value.capacity,
      essentialsToCarry: form.value.essentials
    },
    createdBy: form.value.createdBy,
    status: form.value.status,
    updatedByAdmin: props.isEdit || isAdmin
  };

  isSubmitting.value = true;
  try {
    if (props.isEdit) {
      await api.put(`/events/admin-updated-event-info/${props.eventId}`, payload);
      emit('updated');
    } else {
      await api.post('/events/save-form-event', payload);
      emit('add-event', payload);
      emit('switch-tab', 'Added');
    }
    alert('Event submitted successfully!');
    resetForm();
  } catch (err) {
    console.error('Submission failed:', err);
    alert('Failed to submit event');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  if (props.isEdit && props.eventId) {
    try {
      const { data } = await api.get(`/events/${props.eventId}`);
      form.value = {
        eventName: data.eventName,
        theme: data.theme,
        date: data.date?.slice(0, 10),
        time: data.time,
        city: data.city,
        location: data.location,
        locationQuery: '',
        poster: data.posterUrl || null,
        tag: data.tag || '',
        description: data.description || '',
        orgName: data.organizer?.name || '',
        orgEmail: data.organizer?.email || '',
        orgMobile: data.organizer?.mobile || '',
        regLink: data.others?.registrationLink || '',
        regFee: data.others?.registrationFee || '',
        targetAudience: data.others?.targetAudience || '',
        capacity: data.others?.capacity || '',
        essentials: data.others?.essentialsToCarry || '',
        createdBy: data.createdBy || (isAdmin ? 'admin' : 'host'),
        status: data.status || (isAdmin ? 'accepted' : 'pending'),
        updatedByAdmin: true
      };
    } catch (err) {
      console.error('Failed to load event for editing:', err);
    }
  }
});
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