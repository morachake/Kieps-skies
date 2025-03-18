// Function to play sound
function playSound(key) {
    let sound;
  
    switch (key) {
      case "w":
        sound = new Audio("sounds/crash.mp3");
        break;
        case "a":
            sound = new Audio("sounds/kick-bass.mp3");
        break;
        case "s":
        sound = new Audio("sounds/snare.mp3");
        break;
        case "d":
        sound = new Audio("sounds/tom-1.mp3");
        break;
        case "j":
        sound = new Audio("sounds/tom-2.mp3");
        break;
        case "k":
        sound = new Audio("sounds/tom-3.mp3");
        break;
        case "l":
        sound = new Audio("sounds/tom-4.mp3");
        break;
      // Add cases for other drum sounds here (e.g., 'a', 's', 'd', etc.)
      default:
        return; // Exit if no valid key is pressed
    }
  
    sound.play();
  }
  
  // Function to add animation
  function addAnimation(key) {
    let activeButton = document.querySelector("." + key);
    if (activeButton) {
      activeButton.classList.add("pressed");
      setTimeout(() => {
        activeButton.classList.remove("pressed");
      }, 100);
    }
  }
  
  // Detect button click
  document.querySelectorAll(".drum").forEach(button => {
    button.addEventListener("click", function () {
      let buttonKey = this.innerHTML;
      playSound(buttonKey);
      addAnimation(buttonKey);
    });
  });
  
  // Detect key press
  document.addEventListener("keydown", function (event) {
    playSound(event.key);
    addAnimation(event.key);
  });
  