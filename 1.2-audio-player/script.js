document.addEventListener("DOMContentLoaded", function () {
    const audio = document.querySelector(".audio");
    const playButton = document.querySelector(".btn-play");
    const pauseButton = document.querySelector(".btn-pause");
    const backButton = document.querySelector(".btn-back");
    const nextButton = document.querySelector(".btn-next");
    const repeatButton = document.querySelector(".btn-repeat");
    const soundControlBtn = document.querySelector(".btn-sound");
    const pictureContainer = document.querySelector(".pictures");
    const trackGroup = document.querySelector(".group");
    const trackSingle = document.querySelector(".single");
    const progressContainer = document.querySelector(".progress");
    const filledProgress = document.querySelector(".filled-progress");
    const timeCurrent = document.querySelector(".current");
    const timeDuration = document.querySelector(".duration");
    const volumeContainer = document.querySelector(".volume-line");
    const filledVolume = document.querySelector(".filled-volume");
  
    let isPlaying = false;
    let isMuted = false;
    let isRepeatOne = false;
    let prevVolumeLevel = 1;
  
    // Функция форматирования времени в минуты и секунды
    const formatTime = (seconds) => {
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };
  
    // Обработчик события при загрузке метаданных аудио
    audio.addEventListener("loadedmetadata", () => {
      timeDuration.textContent = formatTime(audio.duration);
    });
  
    // Функция для воспроизведения и паузы
    const togglePlayback = () => {
      if (audio.paused) {
        audio.play();
        isPlaying = true;
        playButton.style.display = "none";
        pauseButton.style.display = "block";
      } else {
        audio.pause();
        isPlaying = false;
        playButton.style.display = "block";
        pauseButton.style.display = "none";
      }
    };
  
    // Обработчики событий для кнопок воспроизведения и паузы
    playButton.addEventListener("click", togglePlayback);
    pauseButton.addEventListener("click", togglePlayback);
  
    // Обработчик события для обновления полосы прогресса
    audio.addEventListener("timeupdate", () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      const progressPercentage = (currentTime / duration) * 100 || 0;
      filledProgress.style.width = `${progressPercentage}%`;
      timeCurrent.textContent = formatTime(currentTime);
    });
  
    // Функция для изменения положения полосы прогресса при клике
    const setProgressOnClick = (e) => {
      const progressContainerCoordinates = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - progressContainerCoordinates.left;
      const newWidth = (clickX / progressContainerCoordinates.width) * 100;
      const duration = audio.duration;
      const newTime = (newWidth / 100) * duration;
      filledProgress.style.width = `${newWidth}%`;
      audio.currentTime = newTime;
    };
  
    // Обработчики событий для изменения положения полосы прогресса при клике и перетаскивании
    progressContainer.addEventListener("click", setProgressOnClick);
  
    let isProgressDragging = false;
  
    progressContainer.addEventListener("mousedown", () => {
      isProgressDragging = true;
  
      progressContainer.addEventListener("mousemove", (e) => {
        if (isProgressDragging) {
          setProgressOnClick(e);
        }
      });
  
      progressContainer.addEventListener("mouseup", () => {
        isProgressDragging = false;
      });
    });
  
    document.addEventListener("mouseup", () => {
      isProgressDragging = false;
    });
  
    // Функция для изменения громкости при клике на полосу громкости
    const setVolumeOnClick = (e) => {
      const volumeContainerCoordinates = volumeContainer.getBoundingClientRect();
      const clickX = e.clientX - volumeContainerCoordinates.left;
      const newWidth = (clickX / volumeContainerCoordinates.width) * 100;
      const newVolumeLevel = newWidth / 100;
      filledVolume.style.width = `${newWidth}%`;
      audio.volume = newVolumeLevel;
      prevVolumeLevel = newVolumeLevel;
      isMuted = false;
      soundControlBtn.classList.remove("mute");
    };
  
    // Обработчики событий для изменения громкости при клике и перетаскивании полосы громкости
    volumeContainer.addEventListener("click", setVolumeOnClick);
  
    let isVolumeDragging = false;
  
    volumeContainer.addEventListener("mousedown", () => {
      isVolumeDragging = true;
  
      volumeContainer.addEventListener("mousemove", (e) => {
        if (isVolumeDragging) {
          setVolumeOnClick(e);
        }
      });
  
      volumeContainer.addEventListener("mouseup", () => {
        isVolumeDragging = false;
      });
    });
  
    document.addEventListener("mouseup", () => {
      isVolumeDragging = false;
    });
  
    // Функция для включения и выключения звука
    const toggleMute = () => {
      if (isMuted) {
        audio.volume = prevVolumeLevel;
        filledVolume.style.width = `${prevVolumeLevel * 100}%`;
        isMuted = false;
        soundControlBtn.classList.remove("mute");
      } else {
        prevVolumeLevel = audio.volume;
        audio.volume = 0;
        filledVolume.style.width = "0%";
        isMuted = true;
        soundControlBtn.classList.add("mute");
      }
    };
  
    // Обработчик события для кнопки управления звуком
    soundControlBtn.addEventListener("click", toggleMute);
  
    // Массив с треками
    const tracks = [
        {
            src: "./assets/audio/red-hot-chili-peppers-californication.mp3",
            trackGroup: "Red Hot Chili Peppers",
            trackSingle: "Californication",
            url: "./assets/image/red-hot-chili-peppers.jpg",
          },
        {
          src: "./assets/audio/metallica-nothing-else-matters.mp3",
          trackGroup: "Metallica",
          trackSingle: "Nothing else matters",
          url: "./assets/image/metallica.jpg",
        },
        {
          src: "./assets/audio/nirvana-smells-like-teen-spirit.mp3",
          trackGroup: "Nirvana",
          trackSingle: "Smells like teen spirit",
          url: "./assets/image/nirvana.jpg",
        },
        {
          src: "./assets/audio/the-cranberries-zombie.mp3",
          trackGroup: "The Cranberries",
          trackSingle: "Zombie",
          url: "./assets/image/the-cranberries.jpg",
        },

      ];
      
  
    let currentTrackIndex = 0;
  
    // Функция для загрузки и начала воспроизведения трека
    const loadAndPlayTrack = (trackIndex) => {
      if (trackIndex >= 0 && trackIndex < tracks.length) {
        const track = tracks[trackIndex];
        audio.src = track.src;
        audio.load();
        trackGroup.textContent = track.trackGroup;
        trackSingle.textContent = track.trackSingle;
        pictureContainer.style.backgroundImage = `url(${track.url})`;
        currentTrackIndex = trackIndex;
        audio.play();
        isPlaying = true;
        playButton.style.display = "none";
        pauseButton.style.display = "block";
      }
    };
  
    // Обработчики событий для кнопок переключения треков
    nextButton.addEventListener("click", () => {
      currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
      loadAndPlayTrack(currentTrackIndex);
    });
  
    backButton.addEventListener("click", () => {
      currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      loadAndPlayTrack(currentTrackIndex);
    });
  
    // Обработчик события для кнопки повтора
    repeatButton.addEventListener("click", () => {
      isRepeatOne = !isRepeatOne;
      repeatButton.classList.toggle("repeat-one", isRepeatOne);
    });
  
    // Обработчик события завершения трека
    audio.addEventListener("ended", () => {
      if (isRepeatOne) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextButton.click();
      }
    });
  
    // Загрузка и начало воспроизведения первого трека при загрузке страницы
    loadAndPlayTrack(currentTrackIndex);
  });
  