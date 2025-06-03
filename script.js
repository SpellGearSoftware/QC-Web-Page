// Store review URLs
const images = [];
const videoUrls = [];

// Make image Carousel for reviews
// let currentIndex = 0;
// const carouselImage = document.getElementById('carousel-image');

// function showImage(index) {
//     carouselImage.classList.add('opacity-0');
//     setTimeout(() => {
//     carouselImage.src = images[index];
//     carouselImage.onload = () => {
//         carouselImage.classList.remove('opacity-0');
//     };
//     }, 250);
// }

// function nextImage() {
//     currentIndex = (currentIndex + 1) % images.length;
//     showImage(currentIndex);
// }

// function prevImage() {
//     currentIndex = (currentIndex - 1 + images.length) % images.length;
//     showImage(currentIndex);
// }

// // Auto transition every 10 seconds
// setInterval(nextImage, 10000);

// Carousel for Video

  let currentVideoIndex = 0;
  let vimeoPlayer = null;

  const carouselVideo = document.getElementById("carousel-video");
  const overlay = document.getElementById("iframe-overlay");

  function setupVimeoPlayer() {
    if (vimeoPlayer) {
      vimeoPlayer.unload().then(() => {
        loadCurrentVideo();
      });
    } else {
      loadCurrentVideo();
    }
  }

  function loadCurrentVideo() {
    // Fade out current video
    overlay.style.pointerEvents = "auto";
    carouselVideo.classList.add("opacity-0");

    setTimeout(() => {
      carouselVideo.src = videoUrls[currentVideoIndex];

      // Create a new Vimeo player
      vimeoPlayer = new Vimeo.Player(carouselVideo);

      // Add the 'ended' event listener
      vimeoPlayer.on('ended', () => {
        nextVideo();
      });

      // Fade in after load
      setTimeout(() => {
        carouselVideo.classList.remove("opacity-0");
        setTimeout(() => {
          overlay.style.pointerEvents = "none";
        }, 500);
      }, 300);
    }, 250);
  }

  function nextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videoUrls.length;
    setupVimeoPlayer();
  }

  function prevVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + videoUrls.length) % videoUrls.length;
    setupVimeoPlayer();
  }

// Laptop Section Coursel
let currentLaptopIndex = 0;
let laptopContainer = document.getElementById('laptop-list');

function updateCardWidth() {
    const card = laptopContainer.querySelector('div');
    return card?.offsetWidth || 300;
}

document.getElementById('prevBtn').addEventListener('click', () => {
    const cardWidth = updateCardWidth();
    const totalCards = laptopContainer.children.length;
    const visibleCards = Math.floor(window.innerWidth / cardWidth);

    currentLaptopIndex--;
    if (currentLaptopIndex < 0) {
        currentLaptopIndex = totalCards - visibleCards;
    }

    laptopContainer.style.transform = `translateX(-${cardWidth * currentLaptopIndex}px)`;
});

document.getElementById('nextBtn').addEventListener('click', () => {
    const cardWidth = updateCardWidth();
    const totalCards = laptopContainer.children.length;
    const visibleCards = Math.floor(window.innerWidth / cardWidth);

    currentLaptopIndex++;
    if (currentLaptopIndex > totalCards - visibleCards) {
        currentLaptopIndex = 0;
    }

    laptopContainer.style.transform = `translateX(-${cardWidth * currentLaptopIndex}px)`;
});

// Load the carousels with data
window.onload = async function () {
try {

    // Get the video and image URLs for review section from google sheeets
    const url1 = 'https://docs.google.com/spreadsheets/d/1IpsAaBerGju_XdY83AGurxDnw4gCNYLFoFFv44v6uSs/gviz/tq?tqx=out:json';

    const response1 = await fetch(url1);
    const data1 = await response1.text();

    const json1 = JSON.parse(
        data1
        .replace("/*O_o*/", "")
        .replace("google.visualization.Query.setResponse(", "")
        .slice(0, -2)
    );

    const rows1 = json1.table.rows;

    rows1.slice(1).forEach(row => {
        const cells = row.c || [];
        const imageUrl = cells[0]?.v || '';
        const videoUrl = cells[1]?.v || '';

        if (imageUrl) images.push(extractDriveImageUrl(imageUrl));
        if (videoUrl) videoUrls.push(convertToDrivePreviewLink(videoUrl));
    });

    // console.log('Images:', images);
    // console.log('Videos:', videoUrls);

    // Initial review image display
    // showImage(currentIndex);
    
    // Initial review video load
    setupVimeoPlayer();

    // Fetch information from google sheets about laptops
    const url = 'https://docs.google.com/spreadsheets/d/1Ih63Qx1ykKp3BGSQWMd6UjJC1j06xLLGDlPcEjINJUM/gviz/tq?tqx=out:json';

    const response = await fetch(url);
    const data = await response.text();
    //const raw = data.contents;

    // Clean the Google Sheets wrapper
    const json = JSON.parse(
        data
        .replace("/*O_o*/", "")
        .replace("google.visualization.Query.setResponse(", "")
        .slice(0, -2)
    );

    const rows = json.table.rows;
    const container = document.getElementById('laptop-list');

    rows.slice(1).forEach(row => {
    const cells = row.c || [];
    const image = cells[0]?.v || '';
    const rawSpecs = cells[1]?.v || '';
    const price = cells[2]?.v || '';
    const tagText = cells[3]?.v || '';
    const tagColor = cells[4]?.v || '';

    const lines = rawSpecs.trim().split('\n').map(line => line.trim()).filter(Boolean);
    const title = lines.shift(); // First line = title
    const specsListItems = lines.map(item => `<li class="text-sm text-gray-600">${item}</li>`).join('');

    const encodedMessage = encodeURIComponent(
        `Hi, I saw a laptop priced ${price} with those specs:\n${rawSpecs}.\nCan you tell me more about it ?`
    );

    const card = document.createElement('div');
    card.className = 'w-full sm:min-w-[50%] md:min-w-[33.3333%] px-2 box-border';

    card.innerHTML = `
        <div class="relative border p-4 rounded flex flex-col items-center text-center bg-white h-full">
            ${tagText ? `
            <div class="absolute top-2 right-2 px-4 py-2 text-sm font-extrabold text-white rounded-full border-2"
                style="
                background-color: ${tagColor};
                font-family: 'Poppins', sans-serif;
                text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
                border-color: #fff;
                letter-spacing: 1px;
                box-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
                ">
                ${tagText}
            </div>` : ''}

            <div class="flex flex-col items-center gap-4 w-full">
                <a href="${extractDriveFullImageUrl(image)}" target="_blank" title="Click to View Full Image">
                  <img src="${extractDriveImageUrl(image)}" class="w-52 h-48 object-cover rounded-xl shadow-lg border border-gray-200 hover:opacity-90 hover:scale-105 transition duration-300" alt="Laptop" />
                </a>
                
                <div class="text-left w-full px-2">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${title}</h3>
                    <span class="font-bold text-gray-800">Specs:</span>
                    <ul class="list-none pl-5 space-y-1 mb-3">
                        ${specsListItems}
                    </ul>
                    <p class="text-lg font-semibold text-green-700"><span class="font-bold text-gray-800">Price:</span> ${price}</p>
                </div>
            </div>

            <a href="https://wa.me/96103694058?text=${encodedMessage}" class="btn-primary mt-4 inline-block">Ask About This One</a>
        </div>
    `;

    container.appendChild(card);
    });
    } catch (err) {
    console.error('Failed to load laptops:', err);
    }

}

document.getElementById('finderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const budget = document.getElementById('budget').value;
    const useFor = document.getElementById('useFor').value;
    const text = `Hi, my budget is $${budget}, I'll use it for ${useFor}. Can you help?`;
    window.open(`https://wa.me/96103694058?text=${encodeURIComponent(text)}`, '_blank');
});

const extractDriveImageUrl = (originalUrl) => {
  const match = originalUrl.match(/\/d\/(.*?)\//);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}`;
  }
  return originalUrl; // fallback image or empty
};

const extractDriveFullImageUrl = (originalUrl) => {
  const match = originalUrl.match(/\/d\/(.*?)\//);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return originalUrl; // fallback image or empty
};

function convertToDrivePreviewLink(driveLink) {
  const match = driveLink.match(/\/file\/d\/([^/]+)\//);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return driveLink; // return null if no valid file ID found
}


window.addEventListener('resize', () => {
    const cardWidth = updateCardWidth();
    laptopContainer.style.transform = `translateX(-${cardWidth * currentLaptopIndex}px)`;
});
