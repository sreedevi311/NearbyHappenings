import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useCommunityStore = defineStore('communities', {
  state: () => ({
    suggested: [],
    joined: [],
    activeCommunity: null,
  }),
  actions: {
    async fetchSuggested(userCity, interests, nearbyCities) {
      const res = await api.post('/communities/suggest', { userCity, interests, nearbyCities })
      this.suggested = res.data
    },
    async joinCommunity(id) {
      await api.post(`/communities/join/${id}`)
      this.joined.push(id)
    },
    async leaveCommunity(id) {
      try {
        const { data } = await api.post(`/communities/leave/${id}`)
        this.joined = this.joined.filter(cid => cid !== id)
        this.activeCommunity = null
      } catch (err) {
        console.error("❌ Failed to leave community:", err)
      }
    },
    async loadCommunity(id) {
      const res = await api.get(`/communities/${id}`)
      console.log(res.data)
      this.activeCommunity = res.data
    },
    async postMessage(communityId, text, imageUrl = null) {
      const res = await api.post(`/communities/${communityId}/posts`, { text, imageUrl })
      const newPost = res.data.post
      this.activeCommunity.posts.push(newPost)
      return newPost
    },
    async deletePost(postId) {
      try {
        await api.delete(`/communities/posts/delete/${postId}`);
        // Remove post from local list
        this.activeCommunity.posts = this.activeCommunity.posts.filter(p => p._id !== postId);
      } catch (err) {
        console.error('❌ Failed to delete post:', err);
      }
    },
    async fetchJoinedCommunities(userId) {
    try {
      const { data } = await api.get(`/communities/joined/${userId}`)
      this.joined= data.joinedCommunities
    } catch (err) {
      console.error('❌ Failed to fetch joined communities:', err)
    }
  }
  }
})
