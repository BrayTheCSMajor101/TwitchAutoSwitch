console.log("Twitch Auto Switch loaded...");

let hasReloadedAfterStreamEnd = false; // Prevent infinite reloads

function redirectToFollowedChannel() {
    const followed = Array.from(document.querySelectorAll('a[data-test-selector="ChannelLink"]'))
        .filter(a => {
            const parent = a.closest('[data-test-selector="SideNavItem"]');
            return parent && parent.querySelector('div[aria-label*="live"]');
        });

    if (followed.length > 0) {
        const random = followed[Math.floor(Math.random() * followed.length)];
        console.log("Redirecting to followed stream:", random.href);
        window.location.href = random.href;
        return true;
    }
    return false;
}

function redirectToRecommendedStream() {
    const recs = document.querySelectorAll('a[data-a-target="preview-card-image-link"]');
    if (recs.length > 0) {
        const random = recs[Math.floor(Math.random() * recs.length)];
        console.log("Redirecting to recommended stream:", random.href);
        window.location.href = random.href;
        return true;
    }
    return false;
}

function checkIfStreamEnded() {
    const path = window.location.pathname;
    const isChannelPage = /^\/[^\/]+$/.test(path); // like /KaiCenat

    if (isChannelPage) {
        const textContent = document.body.innerText.toLowerCase();

        const mostRecentVideoPanel = textContent.includes("most recent video");
        const offlineBanner = textContent.includes("check out this") && textContent.includes("stream from");

        if (mostRecentVideoPanel || offlineBanner) {
            console.log("Stream ended – Detected end-screen panel or offline banner");

            if (!redirectToFollowedChannel()) {
                console.log("No followed channels live. Redirecting to homepage...");
                window.location.href = "/";
            }
        }
    } else if (window.location.pathname === "/") {
        console.log("On homepage, checking recommended streams...");
        redirectToRecommendedStream();
    }
}


// Start check loop
setInterval(checkIfStreamEnded, 30 * 1000);
