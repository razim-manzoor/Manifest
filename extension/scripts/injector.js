// This runs on localhost:3101
// It checks if there is any pending "clip data" in the extension storage.

chrome.storage.local.get('temp_clip_data', (result) => {
    if (result.temp_clip_data) {
        console.log('Manifest Clipper: Found pending data', result.temp_clip_data);

        // Inject into the page via postMessage
        window.postMessage({
            type: 'MANIFEST_CLIPPER_DATA',
            payload: result.temp_clip_data
        }, '*');

        // Clear it so it doesn't trigger again on reload
        chrome.storage.local.remove('temp_clip_data');
    }
});
