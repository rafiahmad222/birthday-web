document.addEventListener("DOMContentLoaded", function () {
  // ================= Background Music =================
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");

  // Hint agar user tahu harus tap kalau autoplay diblokir
  const musicHint = document.createElement("div");
  musicHint.className = "music-hint";
  musicHint.innerHTML = '<i class="fas fa-hand-pointer"></i> Sentuh layar untuk memutar lagu';
  document.body.appendChild(musicHint);

  function showMusicHint() {
    musicHint.classList.add("show");
  }

  function hideMusicHint() {
    musicHint.classList.remove("show");
  }

  function setPlayingUI(isPlaying) {
    if (isPlaying) {
      musicToggle.classList.add("playing");
      hideMusicHint();
    } else {
      musicToggle.classList.remove("playing");
    }
  }

  function tryPlayMusic() {
    if (bgMusic.paused) {
      bgMusic.muted = false;
      bgMusic.volume = MUSIC_BASE_VOLUME;
      bgMusic
        .play()
        .then(() => setPlayingUI(true))
        .catch(() => {
          // Autoplay diblokir browser, tunggu interaksi pertama
          setPlayingUI(false);
          showMusicHint();
        });
    }
  }

  // Volume dasar musik latar
  const MUSIC_BASE_VOLUME = 0.7;

  if (bgMusic && musicToggle) {
    bgMusic.volume = MUSIC_BASE_VOLUME;

    // Deteksi jika file lagu gagal dimuat
    bgMusic.addEventListener("error", function () {
      musicHint.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Lagu gagal dimuat';
      showMusicHint();
    });

    // Sinkronkan UI jika musik berhenti sendiri
    bgMusic.addEventListener("play", () => setPlayingUI(true));
    bgMusic.addEventListener("pause", () => setPlayingUI(false));

    // Coba autoplay langsung saat web dibuka
    bgMusic
      .play()
      .then(() => setPlayingUI(true))
      .catch(() => {
        // Autoplay bersuara diblokir browser.
        // Trik: mulai dalam mode muted (diizinkan browser),
        // lalu unmute otomatis pada interaksi pertama.
        bgMusic.muted = true;
        bgMusic
          .play()
          .then(() => {
            setPlayingUI(true);
            showMusicHint();

            const unmuteOnFirstInteraction = function () {
              bgMusic.muted = false;
              bgMusic.volume = MUSIC_BASE_VOLUME;
              // Panggil play() meski sudah berjalan (quirk iOS Safari)
              bgMusic.play().catch(() => setPlayingUI(false));
              hideMusicHint();
              document.removeEventListener("click", unmuteOnFirstInteraction);
              document.removeEventListener("keydown", unmuteOnFirstInteraction);
              document.removeEventListener("touchstart", unmuteOnFirstInteraction);
            };
            document.addEventListener("click", unmuteOnFirstInteraction);
            document.addEventListener("keydown", unmuteOnFirstInteraction);
            document.addEventListener("touchstart", unmuteOnFirstInteraction);
          })
          .catch(() => {
            // Fallback terakhir: mulai pada interaksi pertama
            showMusicHint();
            const startOnFirstInteraction = function () {
              tryPlayMusic();
              hideMusicHint();
              document.removeEventListener("click", startOnFirstInteraction);
              document.removeEventListener("keydown", startOnFirstInteraction);
              document.removeEventListener("touchstart", startOnFirstInteraction);
            };
            document.addEventListener("click", startOnFirstInteraction);
            document.addEventListener("keydown", startOnFirstInteraction);
            document.addEventListener("touchstart", startOnFirstInteraction);
          });
      });

    // Toggle manual - PENTING: selalu unmute saat tombol ditekan
    musicToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      bgMusic.muted = false; // hapus status muted dari trik autoplay
      bgMusic.volume = MUSIC_BASE_VOLUME;
      if (bgMusic.paused) {
        bgMusic
          .play()
          .then(() => setPlayingUI(true))
          .catch(() => setPlayingUI(false));
      } else {
        bgMusic.pause();
        setPlayingUI(false);
      }
    });
  }

  // Slideshow functionality
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");

  function nextSlide() {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  // Change slide every 4 seconds
  setInterval(nextSlide, 4000);

  // Memory Gallery data - Replace with your actual photos and stories
  const memories = [
    {
      img: "images/wafiqduo1.jpg",
      date: "AMU 2K26, Stadion Universitas Jember",
    },
    {
      img: "images/wafiqduo2.jpg",
      date: "Cafe Sorai, Jember",
    },
    {
      img: "images/wafiqduo3.jpg",
      date: "Cafe Sorai, Jember",
    },
    {
      img: "images/wafiqduo4.jpg",
      date: "Cafe Margin Space, Jember",
    },
    {
      img: "images/wafiqduo5.jpg",
      date: "Cafe Margin Space, Jember",
    },
    {
      img: "images/wafiqduo6.jpg",
      date: "Perunggu Date, Jember",
    },
  ];

  // Foto dia sendiri (solo) - Ganti dengan foto asli Rara
  const herPhotos = [
    {
      img: "images/wafiqsolo1.jpg",
      date: "The Queen of My Heart 👑",
    },
    {
      img: "images/wafiqsolo2.jpg",
      date: "Cantiknya Ibu Negara Rav 🥰",
    },
    {
      img: "images/wafiqsolo3.jpg",
      date: "Pretty Girl, Pretty Smile 💖",
    },
    {
      img: "images/wafiqsolo4.jpg",
      date: "My Favorite Person Ever 💕",
    },
    {
      img: "images/wafiqsolo5.jpg",
      date: "Sunshine in Human Form ☀️",
    },
    {
      img: "images/wafiqsolo6.jpg",
      date: "Sekali Seumur Hidup, Sayangnya 🌸",
    },
  ];

  // Create lightbox structure in DOM
  createLightboxStructure();

  // Special button click handler
  const specialButton = document.getElementById("specialButton");
  if (specialButton) {
    specialButton.addEventListener("click", function () {
      // Create floating hearts
      createHeartShower();

      // Show special message after brief delay
      setTimeout(() => {
        showSpecialMessage();
      }, 1500);
    });
  }

  // Handle continue button click
  const continueButton = document.getElementById("continueButton");
  if (continueButton) {
    continueButton.addEventListener("click", function () {
      // Remove bounce animation
      this.classList.remove("bounce");

      // Create gallery elements
      createGallery();

      // Show gallery with fade-in effect
      const memoryGallery = document.getElementById("memoryGallery");
      memoryGallery.style.display = "block";
      memoryGallery.classList.add("fade-in");

      // Scroll to gallery smoothly
      memoryGallery.scrollIntoView({ behavior: "smooth", block: "start" });

      // Tambahkan: Tampilkan tombol video setelah penundaan singkat
      setTimeout(() => {
        const videoButtonContainer = document.getElementById(
          "videoButtonContainer"
        );
        if (videoButtonContainer) {
          videoButtonContainer.style.display = "flex";
          videoButtonContainer.classList.add("fade-in");

          // Optional: Tambahkan animasi perhatian ke tombol video
          const videoButton = document.getElementById("videoButton");
          if (videoButton) {
            videoButton.classList.add("pulse-btn");

            // Hapus animasi pulse setelah beberapa saat
            setTimeout(() => {
              videoButton.classList.remove("pulse-btn");
            }, 5000); // 5 detik
          }
        }
      }, 2000); // Tampilkan tombol video 2 detik setelah galeri muncul
    });
  }

  // Function to create hearts animation
  function createHeartShower() {
    // Create multiple hearts at different positions
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        createHeart();
      }, i * 150);
    }
  }

  // Function to create individual heart
  function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("floating-heart");

    // Set random properties
    const size = Math.random() * 1.5 + 0.7; // Random size
    const left = Math.random() * 100; // Random horizontal position
    const animDuration = Math.random() * 3 + 3; // Random animation duration

    heart.innerHTML = "❤️";
    heart.style.left = `${left}%`;
    heart.style.bottom = "-10%";
    heart.style.transform = `scale(${size})`;
    heart.style.animationDuration = `${animDuration}s`;

    document.body.appendChild(heart);

    // Remove heart element after animation completes
    setTimeout(() => {
      heart.remove();
    }, animDuration * 1000);
  }

  // Function to show the special message modal
  function showSpecialMessage() {
    // Create modal elements
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    modalContent.innerHTML = `
            <div class="modal-header">
                <h2>My Gift To You</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p class="modal-message">Selamat ulang tahun, cintaku. Semoga selalu bahagia, sehat, dan sukses. Terima kasih sudah hadir dan mewarnai hidupku setiap hari💖</p>
                <div class="gift-icon">
                    <i class="fas fa-gift"></i>
                </div>
                <p class="modal-love">I love you more than words can say!</p>
            </div>
            <div class="modal-footer">
                <button class="btn modal-continue">Continue</button>
            </div>
        `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Add styles for the modal
    const style = document.createElement("style");
    style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.5s ease forwards;
            }
            
            .modal-content {
                width: 90%;
                max-width: 500px;
                background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 0 30px rgba(255, 107, 149, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
                animation: scaleIn 0.5s ease forwards;
            }
            
            .modal-header {
                padding: 20px;
                background: linear-gradient(to right, #cc2b5e, #ff6b95);
                position: relative;
                text-align: center;
            }
            
            .modal-header h2 {
                margin: 0;
                color: white;
                font-family: 'Dancing Script', cursive;
                font-size: 2.2rem;
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: transparent;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            
            .modal-close:hover {
                transform: rotate(90deg);
            }
            
            .modal-body {
                padding: 30px;
                text-align: center;
                color: white;
            }
            
            .modal-message {
                font-size: 1.2rem;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            
            .gift-icon {
                font-size: 4rem;
                color: #ff6b95;
                margin: 20px 0;
                animation: pulse 1.5s infinite;
            }
            
            .modal-love {
                font-weight: bold;
                color: #ff6b95;
                font-size: 1.2rem;
                margin-top: 20px;
            }
            
            .modal-footer {
                padding: 15px;
                text-align: center;
                background-color: rgba(0,0,0,0.2);
            }
            
            .modal-continue {
                background: linear-gradient(to right, #cc2b5e, #ff6b95);
                color: white;
                border: none;
                border-radius: 30px;
                padding: 12px 30px;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .modal-continue:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(204, 43, 94, 0.4);
            }
            
            @keyframes scaleIn {
                from {
                    transform: scale(0.8);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `;
    document.head.appendChild(style);

    // Show modal with animation
    setTimeout(() => {
      modalOverlay.style.opacity = 1;
    }, 100);

    // Close button handler
    const closeBtn = modalOverlay.querySelector(".modal-close");
    closeBtn.addEventListener("click", function () {
      closeModal(modalOverlay);
    });

    // Continue button handler
    const continueBtn = modalOverlay.querySelector(".modal-continue");
    continueBtn.addEventListener("click", function () {
      closeModal(modalOverlay);
    });

    // Close modal when clicking outside
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) {
        closeModal(modalOverlay);
      }
    });

    function closeModal(modal) {
      modal.style.opacity = 0;
      setTimeout(() => {
        modal.remove();
        style.remove();

        // Show the continue button
        const continueArea = document.getElementById("continueArea");
        if (continueArea) {
          continueArea.style.display = "flex";

          // Add bounce animation to continue button
          const continueButton = document.getElementById("continueButton");
          if (continueButton) {
            continueButton.classList.add("bounce");
          }
        }
      }, 500);
    }
  }

  // Function to create gallery
  function createGallery() {
    const herContainer = document.getElementById("galleryHer");
    const usContainer = document.getElementById("galleryUs");

    herContainer.innerHTML = "";
    usContainer.innerHTML = "";

    // Isi section foto solo Rara
    herPhotos.forEach((photo, index) => {
      const galleryItem = document.createElement("div");
      galleryItem.className = "gallery-item solo-item";
      galleryItem.dataset.index = index;

      galleryItem.innerHTML = `
                <img src="${photo.img}" alt="Foto Rara ${
        index + 1
      }" class="gallery-img">
                <div class="caption-overlay">
                    <div class="memory-date">${photo.date}</div>
                </div>
            `;

      galleryItem.addEventListener("click", () => openLightbox(index, "her"));
      herContainer.appendChild(galleryItem);
    });

    // Isi section foto bersama
    memories.forEach((memory, index) => {
      const galleryItem = document.createElement("div");
      galleryItem.className = "gallery-item";
      galleryItem.dataset.index = index;

      galleryItem.innerHTML = `
                <img src="${memory.img}" alt="Memory ${
        index + 1
      }" class="gallery-img">
                <div class="caption-overlay">
                    <div class="memory-date">${memory.date}</div>
                </div>
            `;

      galleryItem.addEventListener("click", () => openLightbox(index, "us"));
      usContainer.appendChild(galleryItem);
    });

    // Logika tab switch
    const tabs = document.querySelectorAll(".gallery-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        tabs.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");

        const isHer = this.dataset.tab === "her";
        herContainer.style.display = isHer ? "grid" : "none";
        usContainer.style.display = isHer ? "none" : "grid";
      });
    });
  }

  // Create lightbox structure in DOM
  function createLightboxStructure() {
    // Remove existing lightbox if any
    const existingLightbox = document.querySelector(".lightbox-overlay");
    if (existingLightbox) {
      existingLightbox.remove();
    }

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox-overlay";
    lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="close-lightbox">&times;</button>
                <img src="" alt="Memory" class="lightbox-img">
                <div class="lightbox-caption">
                    <div class="lightbox-date"></div>
                    <div class="lightbox-text"></div>
                </div>
                <div class="nav-buttons">
                    <button class="nav-btn prev-btn"><i class="fas fa-chevron-left"></i></button>
                    <button class="nav-btn next-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;

    document.body.appendChild(lightbox);

    // Add event listeners
    const closeBtn = document.querySelector(".close-lightbox");
    closeBtn.addEventListener("click", closeLightbox);

    const prevBtn = document.querySelector(".prev-btn");
    prevBtn.addEventListener("click", () => navigateLightbox("prev"));

    const nextBtn = document.querySelector(".next-btn");
    nextBtn.addEventListener("click", () => navigateLightbox("next"));

    // Close on click outside content
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!document.querySelector(".lightbox-overlay.active")) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      if (e.key === "ArrowRight") navigateLightbox("next");
    });
  }

  // Lightbox functions
  let currentIndex = 0;
  let currentSet = "her"; // "her" = foto solo, "us" = foto bersama

  function getActivePhotos() {
    return currentSet === "her" ? herPhotos : memories;
  }

  function openLightbox(index, set) {
    currentSet = set || "her";
    currentIndex = index;
    const photos = getActivePhotos();
    const memory = photos[index];

    const lightbox = document.querySelector(".lightbox-overlay");
    const img = lightbox.querySelector(".lightbox-img");
    const date = lightbox.querySelector(".lightbox-date");
    const text = lightbox.querySelector(".lightbox-text");

    img.src = memory.img;
    date.textContent = memory.date;
    text.textContent = memory.caption || "";

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }

  function closeLightbox() {
    const lightbox = document.querySelector(".lightbox-overlay");
    lightbox.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }

  function navigateLightbox(direction) {
    const photos = getActivePhotos();
    if (direction === "prev") {
      currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    } else {
      currentIndex = (currentIndex + 1) % photos.length;
    }

    openLightbox(currentIndex, currentSet);
  }
  // Video dan Password Protection
  const videoButton = document.getElementById("videoButton");
  const passwordModal = document.getElementById("passwordModal");
  const videoModal = document.getElementById("videoModal");
  const closePasswordBtn = document.querySelector(".close-password");
  const closeVideoBtn = document.querySelector(".close-video");
  const submitPasswordBtn = document.getElementById("submitPassword");
  const passwordInput = document.getElementById("passwordInput");
  const passwordError = document.getElementById("passwordError");
  const birthdayVideo = document.getElementById("birthdayVideo");

  // Password yang digunakan untuk membuka video
  // Password: Tanggal lahir Rafli+Wafiq(dd/dd/04/2022) => 202204
  const correctPassword = "202204"; // Ubah ini sesuai tanggal lahir kalian

  // Event listener untuk tombol video
  if (videoButton) {
    videoButton.addEventListener("click", function () {
      openPasswordModal();
    });
  }

  // Event listener untuk tombol close pada modal password
  if (closePasswordBtn) {
    closePasswordBtn.addEventListener("click", function () {
      closePasswordModal();
    });
  }

  // Event listener untuk tombol close pada modal video
  if (closeVideoBtn) {
    closeVideoBtn.addEventListener("click", function () {
      closeVideoModal();
    });
  }

  // Event listener untuk tombol submit password
  if (submitPasswordBtn) {
    submitPasswordBtn.addEventListener("click", function () {
      checkPassword();
    });
  }

  // Event listener untuk input password (submit dengan enter)
  if (passwordInput) {
    passwordInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        checkPassword();
      }
    });

    // Clear error message when typing
    passwordInput.addEventListener("input", function () {
      passwordError.textContent = "";
    });
  }

  // Function untuk menampilkan modal password
  function openPasswordModal() {
    passwordModal.classList.add("active");
    passwordInput.value = "";
    passwordError.textContent = "";

    // Focus input setelah modal muncul
    setTimeout(() => {
      passwordInput.focus();
    }, 300);
  }

  // Function untuk menutup modal password
  function closePasswordModal() {
    passwordModal.classList.remove("active");
  }

  // Function untuk memeriksa password
  function checkPassword() {
    const enteredPassword = passwordInput.value.trim();

    if (enteredPassword === correctPassword) {
      // Password benar, tutup modal password
      closePasswordModal();

      // Buka modal video
      openVideoModal();
    } else {
      // Password salah, tampilkan pesan error
      passwordError.textContent = "Kode tidak sesuai. Coba lagi!";
      passwordInput.focus();

      // Efek shake pada input
      passwordInput.classList.add("shake");
      setTimeout(() => {
        passwordInput.classList.remove("shake");
      }, 500);
    }
  }

  // Helper: fade volume musik secara halus
  function fadeMusicVolume(target, duration) {
    if (!bgMusic) return;
    duration = duration || 800;
    const start = bgMusic.volume;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      bgMusic.volume = start + (target - start) * progress;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // Function untuk menampilkan modal video
  function openVideoModal() {
    videoModal.classList.add("active");

    // Kecilkan musik latar agar suara video lebih didengar
    if (!bgMusic.paused) {
      fadeMusicVolume(0.08, 1000);
    }

    // Set Google Drive video URL dengan ID file Anda
    if (birthdayVideo) {
      // File ID dari link Google Drive Anda
      const fileId = "14iBlPljArSqd-yCgVrMPm4d5VtChHBTA";
      birthdayVideo.src = `https://drive.google.com/file/d/${fileId}/preview`;

      // Tambahkan loading indicator
      const loadingIcon = document.createElement("div");
      loadingIcon.className = "video-loading";
      loadingIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      document.querySelector(".video-container").appendChild(loadingIcon);

      // Hapus loading indicator setelah video dimuat
      birthdayVideo.onload = function () {
        const loadingEl = document.querySelector(".video-loading");
        if (loadingEl) loadingEl.remove();
      };
    }
  }

  // Function untuk menutup modal video
  function closeVideoModal() {
    videoModal.classList.remove("active");

    // Kembalikan volume musik latar seperti semula
    fadeMusicVolume(MUSIC_BASE_VOLUME, 1000);

    // Reset iframe src saat ditutup untuk menghentikan pemutaran
    if (birthdayVideo) {
      birthdayVideo.src = "";
    }
  }

  // Close modals when clicking outside
  window.addEventListener("click", function (e) {
    if (e.target === passwordModal) {
      closePasswordModal();
    }
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });

  // Handle continue button click untuk menampilkan tombol video
  // (Sudah dideklarasikan sebelumnya, tidak perlu deklarasi ulang)
  // Kode ini telah ada di atas, jadi bagian ini bisa dihapus untuk menghindari redeklarasi.
});
