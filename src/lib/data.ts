export const communityPosts = [
    {
        id: 1,
        author: "Adebayo Kola",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        title: "Best time to plant maize in Southwest Nigeria?",
        content: "I'm planning my farm for the next season and I'm not sure about the optimal planting time for maize in the Ibadan area. The rains seem to be starting late this year. Any advice from experienced farmers here?",
        comments: 12,
        region: "Southwest",
    },
    {
        id: 2,
        author: "Chidinma Nwosu",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        title: "Issue with my cassava leaves, please help!",
        content: "My cassava leaves are showing yellow spots and seem to be wilting. I've attached a picture. Has anyone seen this before? What could be the cause and how can I treat it?",
        comments: 8,
        region: "Southeast",
    },
    {
        id: 3,
        author: "Musa Bello",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        title: "Good market for tomatoes in the North?",
        content: "I have a large harvest of tomatoes coming up near Kaduna. I'm looking for reliable buyers or markets with good prices. Any leads would be greatly appreciated.",
        comments: 21,
        region: "North",
    },
];

export const learningModules = [
    {
        id: 1,
        title: "Introduction to Sustainable Farming",
        description: "Learn the basics of sustainable agriculture and how to apply them to your farm for long-term productivity and environmental health.",
        duration: "45 Mins",
        type: "video",
        thumbnail: "https://placehold.co/600x400.png",
        "data-ai-hint": "sustainable farming",
    },
    {
        id: 2,
        title: "Effective Pest Control without Chemicals",
        description: "Discover organic and integrated pest management (IPM) techniques to protect your crops from pests naturally.",
        duration: "1 Hour",
        type: "video",
        thumbnail: "https://placehold.co/600x400.png",
        "data-ai-hint": "organic pest control",
    },
    {
        id: 3,
        title: "Soil Health and Management",
        description: "A deep dive into soil composition, nutrient management, and techniques to improve soil fertility for better crop yields.",
        duration: "1.5 Hours",
        type: "video",
        thumbnail: "https://placehold.co/600x400.png",
        "data-ai-hint": "soil health",
    },
    {
        id: 4,
        title: "Quiz: Sustainable Farming Basics",
        description: "Test your knowledge on the fundamental principles of sustainable farming.",
        duration: "15 Mins",
        type: "quiz",
        thumbnail: "https://placehold.co/600x400.png",
        "data-ai-hint": "quiz test paper",
    },
];

export const weatherData = {
    location: "Ibadan, Oyo State",
    temperature: "28°C",
    condition: "Partly Cloudy",
    humidity: "75%",
    wind: "12 km/h",
    recommendation: "Good day for planting. Soil moisture is adequate.",
    forecast: [
        { day: "Tomorrow", temp: "29°C", condition: "Sunny" },
        { day: "Wed", temp: "27°C", condition: "Chance of rain" },
        { day: "Thu", temp: "28°C", condition: "Partly Cloudy" },
    ],
};
