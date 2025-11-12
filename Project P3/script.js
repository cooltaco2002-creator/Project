        // fish of the day array data
        // array of objects
        const fish = [
            { 
                name: "Clownfish", 
                // image element
                image: "https://images.unsplash.com/photo-1595503240812-7286dafaddc1?q=80&w=2100&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                fact: "Clownfish are all born male, and the dominant male in a group will change into a female when the current female dies. Also I watched a movie where they found one of these hell yeah."
            },
            { 
                name: "Betta Fish", 
                image: "https://images.unsplash.com/photo-1619491202102-088c4afb271c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                fact: "Betta fish can breathe out of water thanks to a labyrinth organ. Shoutout oxygen on god."
            },
            { 
                name: "Goldfish", 
                image: "https://images.unsplash.com/photo-1539236754983-085fe1449ba4?q=80&w=2036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                fact: "Goldfish are mad popular. An estimated 480 million are sold each year. Kinda crazy thats a lot of fish. Also I guess they aren't made of gold what the damn hell."
            },
            { 
                name: "Angelfish", 
                image: "https://images.unsplash.com/photo-1646022103851-022a7544a3b5?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                fact: "Some types of Angel Fish engage in a symbiotic relationship with other fish where they will remove bacteria and what not from them. To signal that they want to do this, they will perform a dance. Another epic swag fish fact lowkey"
            },
            { 
                name: "Koi", 
                image: "https://images.unsplash.com/photo-1671456557525-fc9744617d91?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                fact: "There was a Kohaku Koi fish that was sold for 1.8 millions buckaroos (USD) in 2018. Kinda wacky to drop that much on a single fish but respect"
            },
            { 
                name: "Great Hammerhead Shark", 
                image: "https://images.unsplash.com/photo-1709494335621-f05358303a63?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                fact: "As of October 2nd 2025, this is my brothers favourite fish "
            },
            { 
                name: "Blue Tang", 
                image: "https://images.unsplash.com/photo-1689176759667-c6a9bb8a944f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                fact: "Omg its that fish from that movie where they find that other dude!!11!!11!. Sorry for lame and not epic fish fact'"
            },
            { 
                name: "Discus", 
                image: "https://images.unsplash.com/photo-1548425923-a7d6c37d7f18?q=80&w=2004&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                fact: "Discus fish are usually very chill and can change colour. Quite epic I would say."
            },
            { 
                name: "Guppy", 
                image: "https://images.unsplash.com/photo-1602143221967-ff9a1a490e00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                fact: "Guppies have been used to stop the spread of malaria because they will eat mosquito eggs. Very epic"
            },
            { 
                name: "Neon Tetra", 
                image: "https://images.unsplash.com/photo-1737688670910-084f54254e73?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                fact: "While they are in the same family as pirahnas, they are much more chill and cool and swag."
            },
            {
                name: "Barbour's Seahorse",
                image: "https://images.unsplash.com/photo-1523585895729-a4bb980d5c14?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1970",
                fact: "Seahorses are mad monogamus."
            },
            {
                name: "Black-blotched Porcupinefish",
                image: "https://images.unsplash.com/photo-1520990269335-9271441e202f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2048",
                fact: "Porcupinefish let off a potent neurotoxin called tetrodotoxin similar to their relatives the pufferfish. It can kill predators and humans. On god"
            },
            {
                name: "Grey Reef Shark",
                image: "https://images.unsplash.com/photo-1531959870249-9f9b729efcf4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2042",
                fact: "These dudes are some of the most common types of sharks although they are considered near threatened in terms of population. I am going to be honest I could not find a fact that was epic my fault."
            },
        ];

        window.addEventListener('load', displayFish);

        // Fish of the Day Functions
        function getRandomFishForUser() {
            const today = new Date().toDateString();
            
            const fingerprint = [
                navigator.userAgent,
                navigator.language,
                screen.width,
                screen.height,
                screen.colorDepth,
                new Date().getTimezoneOffset()
            ].join('|');
            
            const seed = today + fingerprint;
            let hash = 0;
            for (let i = 0; i < seed.length; i++) {
                hash = ((hash << 5) - hash) + seed.charCodeAt(i);
                hash = hash & hash;
            }
            
            const fishIndex = Math.abs(hash) % fish.length;
            return fish[fishIndex];
        }

        function displayFish() {
            const today = new Date();
            const dateStr = today.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            document.getElementById('date').textContent = dateStr;
            
            const dailyFish = getRandomFishForUser();
            document.getElementById('fishImage').src = dailyFish.image;
            document.getElementById('fishName').textContent = dailyFish.name;
            // HTML Formating example (<strong>)
                document.getElementById('epicfishfact').innerHTML = `<strong>Epic Fish Fact:</strong> <strong>${dailyFish.fact}</strong>`;
                document.getElementById('fishContent').style.opacity = 1;
                document.getElementById('fishContent').style.transform = 'scale(1) translateY(0)';

                const previewDate = document.getElementById('previewDate');
                if (previewDate) previewDate.textContent = dateStr;

                const previewImg = document.getElementById('previewFishImage');
                if (previewImg) previewImg.src = dailyFish.image;

                const previewName = document.getElementById('previewFishName');
                if (previewName) previewName.textContent = dailyFish.name;

                const previewFact = document.getElementById('previewEpicfishfact');
                if (previewFact) previewFact.innerHTML = `<strong>Epic Fish Fact:</strong> ${dailyFish.fact}`;

                const previewContent = document.getElementById('previewFishContent');
                if (previewContent) {
                    previewContent.style.opacity = 1;
                    previewContent.style.transform = 'scale(1) translateY(0)';
                }
        }

//Form validation script
//On page load the script looks at checkboxes named "contact". Whenever the user checks/unchecks one, it updates a summary element (contactSummary) to show all currently selected options or "None selected" if nothing is checked.
document.addEventListener('DOMContentLoaded', function() {
    const contactCheckboxes = document.querySelectorAll('input[name="contact"]');
    const contactSummary = document.getElementById('contactSummary');

    contactCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const selectedMethods = Array.from(contactCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            contactSummary.textContent = selectedMethods.length > 0 ? selectedMethods.join(', ') : 'None selected';
        });
    });
});
//toggle font button, changes the font of the text on the webpage
 let currentFont = 0;
    const fonts = [
      'Arial, sans-serif',
      'Georgia, serif',
      '"Courier New", monospace'
    ];
    
    function toggleFont() {
      currentFont = (currentFont + 1) % fonts.length;
      document.body.style.fontFamily = fonts[currentFont];
    }
