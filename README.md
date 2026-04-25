# 🥗 CÉRES | The Elite Culinary & Nutrition Intelligence Platform

**Precision Nutrition. Intelligent Analysis. Seamless Tracking.**

CÉRES is a state-of-the-art, full-stack nutritional ecosystem engineered with **Next.js 16**. It empowers health-conscious users, athletes, and culinary enthusiasts to dissect the molecular composition of their meals, track performance goals, and share culinary masterpieces with a global community.

---

## 💎 Premium Features

### 🧪 Advanced Nutrition Intelligence
- **USDA-Powered Analysis**: Integrated with the **USDA FoodData Central API** for medical-grade nutritional accuracy across thousands of ingredients.
- **Dynamic Macro Mapping**: Instant visualization of Calories, Protein, Carbohydrates, and Fats with precise percentage breakdowns.
- **Micro-Nutrient Insights**: Deep dives into fiber, sugar, and essential vitamins to ensure a balanced lifestyle.

### 🏘️ The Community Hub
- **Recipe Marketplace**: Discover, save, and share high-performance recipes curated by the CÉRES community.
- **Social Integration**: Build your culinary profile and showcase your signature dishes with high-quality visual cards.

### 📈 Performance Dashboard
- **Goal Optimization**: Set sophisticated daily caloric targets and macro-nutrient ratios tailored to your fitness journey.
- **Trend Analysis**: Monitor your progress with intuitive charts and historical meal logs that visualize your nutritional evolution.

### 🔐 Enterprise-Grade Security
- **Secure Auth**: Robust session management powered by **Jose (JWT)** and **Bcryptjs** encryption.
- **Privacy First**: Personalized data silos ensuring your metrics and history remain strictly confidential.

---

## 🛠 Tech Stack

### Frontend Architecture
- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) **v16 (App Router)**
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **v19**
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **v4**
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### Backend & Infrastructure
- ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) **Mongoose ODM**
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
- **Lucide React** for premium iconography
- **Resend & Nodemailer** for sophisticated communication flows

---

## 🚀 Deployment & Local Development

### Prerequisites
- **Node.js** (v20+ Recommended)
- **MongoDB** Instance (Local or Atlas)
- **USDA API Key** (Optional for full nutrition search)

### Quick Start
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/abbas/ceres-nutrition.git
    cd ceres-nutrition
    ```

2.  **Configuration**
    Create a `.env` file in the root directory:
    ```env
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    USDA_API_KEY=your_usda_key
    ```

3.  **Launch Platform**
    ```bash
    npm install
    npm run dev
    ```

4.  **Access**
    Visit `http://localhost:3000` to experience the future of nutrition tracking.

---

## 🗺 Roadmap
- [ ] AI-Powered Meal Recognition from Photos
- [ ] Integration with Wearable Health Devices (Apple Health, Fitbit)
- [ ] Smart Shopping List Generation based on Weekly Meal Plans
- [ ] Professional Nutritionist Consultation Portal

---

Designed with ❤️ for a Healthier World.
