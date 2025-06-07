# ♻️ Recyclo

**Recyclo** is an all-in-one waste management web application designed to promote eco-conscious behavior through AI-powered waste classification, creative reuse ideas, thrift exchange, and community cleanup engagement. With a focus on sustainability and gamification, Recyclo empowers users to log their waste impact, participate in cleanup activities, and climb the eco leaderboard.

> 🛠 Built with: **Next.js**, **TypeScript**, **CSS**, **Firebase**, **Google Maps API**, **Gemini API**  
> 📱 Fully responsive and mobile-friendly

---

## 🌟 Key Features

### 🔍 Waste Classification
Use AI to determine whether an item is **organic** or **inorganic** by uploading a photo or using your device's camera.

### 🎨 Waste-to-Art Ideas
Get creative ideas to **reuse or repurpose waste items** by simply uploading a photo.

### 🛒 WasteShop & Thrift Store
- **List reusable items** (like old containers, books, clothes) for community exchange.
- **Browse thrift listings** with product photos, descriptions, and prices.

### 🗺️ Dirty Spot Reporting & Cleanup
- Report dirty public spots using **Google Maps integration**
- View detailed reports and **track clean-up progress** by community volunteers

### 🧾 Waste Logging & Gamified Impact
- Track how much **organic/inorganic waste** you’ve logged
- Earn points to **level up your Eco rank** (e.g., Eco Starter → Eco Contributor)
- View your **rank in the leaderboard**

---

## 🖼️ Screenshots

### Dashboard  
![Dashboard](screenshots/dashboard.png)

### Waste Classification  
![Classification](screenshots/classify.png)

### Dirty Spot Map  
![Map](screenshots/map.png)

### WasteShop Thrift Listing  
![WasteShop](screenshots/wasteshop.png)

---

## 🚀 Getting Started

### 🔧 Prerequisites
- Node.js 
- Gemini API Key
- Google Maps API Key

### 🔐 Environment Setup
Create a `.env.local` file in the root directory and add the following:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
````

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/haitomnsg/recyclo.git
cd recyclo

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 👨‍💻 Developers Team

* **Ashish Gupta**
* **Rubina Dangol Maherjan**

This project was developed as part of an initiative to build impactful, AI-powered, community-driven web applications for environmental sustainability.

---