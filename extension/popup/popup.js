document.getElementById('clipBtn').addEventListener('click', async () => {
    const status = document.getElementById('status');
    status.textContent = 'Analyzing page...';

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // 1. Send message to Content Script to scrape data
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'SCRAPE_JOB' });

        if (response) {
            status.textContent = 'Saving to bridge...';

            // 2. Save to storage for the Injector to pick up
            await chrome.storage.local.set({
                'temp_clip_data': {
                    title: response.title || tab.title,
                    company: response.company || '',
                    url: tab.url,
                    description: response.description || '',
                    timestamp: Date.now()
                }
            });

            // 3. Open Localhost
            status.textContent = 'Opening Manifest...';
            chrome.tabs.create({ url: 'http://localhost:3101/clipper' });
        } else {
            status.textContent = 'Error: No response from page.';
        }
    } catch (err) {
        console.error(err);
        status.textContent = 'Error: ' + err.message;
        // Fallback: If scraper failed (e.g. restricted page), just clip URL
        status.textContent = 'Scrape failed. Clipping URL only...';
        // Logic to clip just URL could go here
    }
});
