import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const TimeAgo = ({ timestamp }) => {
    let timeAgo = 'Unknown time';

    try {
        const date = new Date(timestamp);
        if (!isNaN(date)) {
            timeAgo = formatDistanceToNow(date, { addSuffix: true });
        } else {
            console.error(`Invalid date: ${timestamp}`);
        }
    } catch (error) {
        console.error(`Error parsing date: ${timestamp}`, error);
    }

    return <span>{timeAgo}</span>;
};

export default TimeAgo;
