export const formatDateTime = (dateString, timeZone = "America/Los_Angeles") => {
    const date = new Date(dateString + "Z"); // Ensure UTC parsing
    const optionsDate = { weekday: "short", month: "short", day: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short" };

    // Format date
    let formattedDate = date.toLocaleDateString("en-US", optionsDate);
    let day = date.getDate();

    // Add ordinal suffix
    const ordinal = (d) => (d > 3 && d < 21) ? "th" : ["st", "nd", "rd"][(d % 10) - 1] || "th";
    formattedDate += ordinal(day);

    // Format time
    let formattedTime = date.toLocaleTimeString("en-US", optionsTime);

    return `${formattedDate} • ${formattedTime}`;
}
export const formatLocation = (event) => {
    // Convert any non-string values to strings and then check if they're empty
    const address = typeof event.address1 === 'string' ? event.address1 : String(event.address1 || '');
    const city = typeof event.city === 'string' ? event.city : String(event.city || '');
    const state = typeof event.state === 'string' ? event.state : String(event.state || '');
    const zip = typeof event.zipcode === 'string' ? event.zipcode : String(event.zipcode || '');

    const parts = [address, city, state, zip].filter(part => part && part.trim && part.trim() !== '');
    return parts.join(', ');
};

export const formatTimeAgo = (timestamp) => {
    // Convert minutes to "time ago"
    if (timestamp < 60) {
        return `${timestamp} minute${timestamp !== 1 ? 's' : ''} ago`;
    } else if (timestamp < 1440) {
        const hours = Math.floor(timestamp / 60);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (timestamp < 43200) { // 30 days in minutes
        const days = Math.floor(timestamp / 1440);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (timestamp < 525600) { // 365 days in minutes
        const months = Math.floor(timestamp / 43200); // Roughly 30 days/month
        return `${months} month${timestamp !== 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(timestamp / 525600); // 365 days/year
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
}

// Takes the category name from the url and reformats it to be placed in the header
export const formatCategoryName = (categoryName) => {
    return categoryName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
