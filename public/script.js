async function fetchRecentlyPlayed() {
    try {
        
        const response = await fetch("https://pheldus.xyz/recently-played");

        if (!response.ok) {
            throw new Error("API çağrısı başarısız oldu.");
        }

        const data = await response.json();

        const songList = document.getElementById("song-list");
        songList.innerHTML = "";  

        if (data.items && data.items.length > 0) {
            
            data.items.slice(0, 14).forEach(item => {
                const song = item.track;
                const listItem = document.createElement("li");
                listItem.innerHTML = `<strong>${song.name}</strong> - ${song.artists.map(artist => artist.name).join(", ")}`;
                songList.appendChild(listItem);
            });
        } else {
            songList.innerHTML = "<li>No recently played songs available.</li>";
        }
    } catch (error) {
        console.error("Hata oluştu:", error);
        const songList = document.getElementById("song-list");
        songList.innerHTML = "<li>Error fetching songs.</li>";
    }
}


document.addEventListener("DOMContentLoaded", fetchRecentlyPlayed);
