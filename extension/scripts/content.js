chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'SCRAPE_JOB') {
        const url = window.location.href;
        let data = {
            title: document.title,
            company: '',
            description: '',
            url: url
        };

        // Strategy Pattern for different sites
        if (url.includes('linkedin.com')) {
            data = scrapeLinkedIn();
        } else if (url.includes('indeed.com')) {
            data = scrapeIndeed();
        } else {
            data = scrapeGeneric();
        }

        sendResponse(data);
    }
    return true; // Keep channel open
});

function scrapeLinkedIn() {
    // LinkedIn has multiple views (Feed, Jobs Tab, Direct Link)

    // 1. Job Title
    const title =
        document.querySelector('.job-details-jobs-unified-top-card__job-title h1')?.innerText?.trim() ||
        document.querySelector('.jobs-unified-top-card__job-title')?.innerText?.trim() ||
        document.querySelector('h1')?.innerText?.trim() ||
        'Unknown Role';

    // 2. Company Name
    const company =
        document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText?.trim() ||
        document.querySelector('.jobs-unified-top-card__company-name')?.innerText?.trim() ||
        document.querySelector('.job-card-container__primary-description')?.innerText?.trim() ||
        'Unknown Company';

    // 3. Description (The most important part)
    const descriptionBox = document.querySelector('#job-details') || document.querySelector('.jobs-description-content__text');

    // Clean up the description logic could go here
    const description = descriptionBox ? descriptionBox.innerText.trim() : '';

    return {
        title: title,
        company: company,
        description: description,
        url: window.location.href
    };
}

function scrapeIndeed() {
    return {
        title: document.querySelector('.jobsearch-JobInfoHeader-title')?.innerText?.trim() || document.title,
        company: document.querySelector('[data-company-name="true"]')?.innerText?.trim() || '',
        description: document.querySelector('#jobDescriptionText')?.innerText?.trim() || '',
        url: window.location.href
    };
}

function scrapeGeneric() {
    // Fallback: Try to find the biggest H1 and the biggest block of text
    const title = document.querySelector('h1')?.innerText?.trim() || document.title;
    const description = document.querySelector('meta[name="description"]')?.content || '';

    return {
        title: title,
        company: '',
        description: description,
        url: window.location.href
    };
}
