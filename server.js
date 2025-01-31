import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";  

dotenv.config();  

const app = express();
app.use(cors());  
app.use(express.json());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

let accessToken = "";

async function refreshAccessToken() {
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: process.env.REFRESH_TOKEN,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET
            })
        });

        if (!response.ok) {
            throw new Error("Access token refresh failed.");
        }

        const data = await response.json();
        console.log(data); 

        
        accessToken = data.access_token;
        console.log("New access token:", accessToken);

    } catch (error) {
        console.error("Error refreshing access token:", error);
    }
}

refreshAccessToken();


refreshAccessToken();
setInterval(refreshAccessToken, 3600 * 1000); 

app.get("/recently-played", async (req, res) => {
    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error("API çağrısı başarısız oldu.");
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Hata oluştu:", error);
        res.status(500).json({ error: "Şarkılar alınamadı." });
    }
});

app.listen(3000, () => console.log("Server 3000 portunda çalışıyor"));
